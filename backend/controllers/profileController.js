const User = require("../models/User");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

const {
    sendPasswordResetCode
} = require("../services/emailService");


// ==========================================
// Get Profile
// ==========================================

const getProfile = (req, res) => {

    const userId = req.user.user_id;

    User.findById(
        userId,
        (err, results) => {

            if (err) {

                console.error(err);

                return res.status(500).json({
                    success: false,
                    message: "Database error"
                });

            }

            if (results.length === 0) {

                return res.status(404).json({
                    success: false,
                    message: "User not found"
                });

            }

            const user = results[0];

            res.json({
                success: true,

                user: {
                    user_id: user.user_id,
                    name: user.name,
                    email: user.email,
                    mobile_number: user.mobile_number,
                    profile_picture: user.profile_picture,
                    role: user.role,

                    is_premium:
                        Number(user.is_premium) === 1,

                    premium_expires_at:
                        user.premium_expires_at,

                    created_at:
                        user.created_at
                }
            });

        }
    );
};


// ==========================================
// Update Profile
// ==========================================

const updateProfile = (req, res) => {

    const userId = req.user.user_id;

    const {
        name
    } = req.body;

    if (!name || !name.trim()) {

        return res.status(400).json({
            success: false,
            message: "Name is required"
        });

    }

    const profilePicture =
        req.file
            ? `/uploads/profiles/${req.file.filename}`
            : null;


    // If no new picture is uploaded,
    // update only the name.

    if (!req.file) {

        User.updateName(
            userId,
            name.trim(),
            (err) => {

                if (err) {

                    console.error(err);

                    return res.status(500).json({
                        success: false,
                        message: "Failed to update profile"
                    });

                }

                return res.json({
                    success: true,
                    message: "Profile updated successfully"
                });

            }
        );

        return;
    }


    User.updateProfile(
        userId,
        name.trim(),
        profilePicture,
        (err) => {

            if (err) {

                console.error(err);

                return res.status(500).json({
                    success: false,
                    message: "Failed to update profile"
                });

            }

            res.json({
                success: true,
                message: "Profile updated successfully",
                profile_picture: profilePicture
            });

        }
    );
};


// ==========================================
// Change Password
// ==========================================

const changePassword = (req, res) => {

    const userId = req.user.user_id;

    const {
        oldPassword,
        newPassword
    } = req.body;


    if (!oldPassword || !newPassword) {

        return res.status(400).json({
            success: false,
            message: "Old password and new password are required"
        });

    }


    if (newPassword.length < 6) {

        return res.status(400).json({
            success: false,
            message: "New password must contain at least 6 characters"
        });

    }


    User.findByIdWithPassword(
        userId,
        async (err, results) => {

            if (err) {

                console.error(err);

                return res.status(500).json({
                    success: false,
                    message: "Database error"
                });

            }


            if (results.length === 0) {

                return res.status(404).json({
                    success: false,
                    message: "User not found"
                });

            }


            const user = results[0];


            const isMatch =
                await bcrypt.compare(
                    oldPassword,
                    user.password
                );


            if (!isMatch) {

                return res.status(401).json({
                    success: false,
                    message: "Old password is incorrect"
                });

            }


            const hashedPassword =
                await bcrypt.hash(
                    newPassword,
                    10
                );


            User.updatePassword(
                userId,
                hashedPassword,
                (updateErr) => {

                    if (updateErr) {

                        console.error(updateErr);

                        return res.status(500).json({
                            success: false,
                            message: "Failed to change password"
                        });

                    }


                    res.json({
                        success: true,
                        message: "Password changed successfully"
                    });

                }
            );

        }
    );
};


// ==========================================
// Forgot Password - Send OTP
// ==========================================

const forgotPassword = (req, res) => {

    const {
        email
    } = req.body;


    if (!email) {

        return res.status(400).json({
            success: false,
            message: "Email is required"
        });

    }


    User.findByEmail(
        email,
        async (err, results) => {

            if (err) {

                console.error(err);

                return res.status(500).json({
                    success: false,
                    message: "Database error"
                });

            }


            if (results.length === 0) {

                return res.status(404).json({
                    success: false,
                    message: "No account found with this email"
                });

            }


            const user = results[0];


            // Generate 6 digit OTP

            const code =
                Math.floor(
                    100000 +
                    Math.random() * 900000
                ).toString();


            // Hash OTP

            const codeHash =
                crypto
                    .createHash("sha256")
                    .update(code)
                    .digest("hex");


            // Generate reset token

            const resetToken =
                crypto.randomBytes(32).toString("hex");


            const resetTokenHash =
                crypto
                    .createHash("sha256")
                    .update(resetToken)
                    .digest("hex");


            // Expire after 10 minutes

            const expiresAt =
                new Date(
                    Date.now() + 10 * 60 * 1000
                );


            const db =
                require("../config/db");


            // Remove previous codes

            db.query(
                `
                DELETE FROM password_reset_codes
                WHERE user_id = ?
                `,
                [user.user_id],
                (deleteErr) => {

                    if (deleteErr) {

                        console.error(deleteErr);

                        return res.status(500).json({
                            success: false,
                            message: "Failed to create reset request"
                        });

                    }


                    db.query(
                        `
                        INSERT INTO password_reset_codes
                        (
                            user_id,
                            email,
                            code_hash,
                            reset_token_hash,
                            expires_at,
                            verified
                        )
                        VALUES (?, ?, ?, ?, ?, 0)
                        `,
                        [
                            user.user_id,
                            user.email,
                            codeHash,
                            resetTokenHash,
                            expiresAt
                        ],
                        async (insertErr) => {

                            if (insertErr) {

                                console.error(insertErr);

                                return res.status(500).json({
                                    success: false,
                                    message: "Failed to create reset code"
                                });

                            }


                            try {

                                await sendPasswordResetCode(
                                    user.email,
                                    code
                                );


                                res.json({
                                    success: true,
                                    message: "Verification code sent to your email"
                                });


                            } catch (emailError) {

                                console.error(
                                    "EMAIL ERROR:",
                                    emailError
                                );


                                return res.status(500).json({
                                    success: false,
                                    message: "Failed to send verification email"
                                });

                            }

                        }
                    );

                }
            );

        }
    );
};


// ==========================================
// Verify OTP
// ==========================================

const verifyResetCode = (req, res) => {

    const {
        email,
        code
    } = req.body;


    if (!email || !code) {

        return res.status(400).json({
            success: false,
            message: "Email and verification code are required"
        });

    }


    const codeHash =
        crypto
            .createHash("sha256")
            .update(code)
            .digest("hex");


    const db =
        require("../config/db");


    db.query(
        `
        SELECT *
        FROM password_reset_codes
        WHERE email = ?
        ORDER BY id DESC
        LIMIT 1
        `,
        [email],
        (err, results) => {

            if (err) {

                console.error(err);

                return res.status(500).json({
                    success: false,
                    message: "Database error"
                });

            }


            if (results.length === 0) {

                return res.status(400).json({
                    success: false,
                    message: "Invalid verification request"
                });

            }


            const reset = results[0];


            // Check expiry

            if (
                new Date(reset.expires_at) <
                new Date()
            ) {

                return res.status(400).json({
                    success: false,
                    message: "Verification code has expired"
                });

            }


            // Check OTP

            if (reset.code_hash !== codeHash) {

                return res.status(400).json({
                    success: false,
                    message: "Incorrect verification code"
                });

            }


            // Mark verified

            db.query(
                `
                UPDATE password_reset_codes
                SET verified = 1
                WHERE id = ?
                `,
                [reset.id],
                (updateErr) => {

                    if (updateErr) {

                        console.error(updateErr);

                        return res.status(500).json({
                            success: false,
                            message: "Verification failed"
                        });

                    }


                    // We need to return the reset token.
                    // The raw token was generated when the
                    // reset request was created.
                    //
                    // Therefore we generate a new short-lived
                    // token for the verified request.

                    const resetToken =
                        crypto
                            .randomBytes(32)
                            .toString("hex");


                    const resetTokenHash =
                        crypto
                            .createHash("sha256")
                            .update(resetToken)
                            .digest("hex");


                    db.query(
                        `
                        UPDATE password_reset_codes
                        SET reset_token_hash = ?
                        WHERE id = ?
                        `,
                        [
                            resetTokenHash,
                            reset.id
                        ],
                        (tokenErr) => {

                            if (tokenErr) {

                                console.error(tokenErr);

                                return res.status(500).json({
                                    success: false,
                                    message: "Failed to create reset session"
                                });

                            }


                            res.json({
                                success: true,
                                message: "Code verified successfully",
                                resetToken
                            });

                        }
                    );

                }
            );

        }
    );
};


// ==========================================
// Reset Password
// ==========================================

const resetPassword = async (req, res) => {

    const {
        email,
        resetToken,
        newPassword
    } = req.body;


    if (
        !email ||
        !resetToken ||
        !newPassword
    ) {

        return res.status(400).json({
            success: false,
            message: "All fields are required"
        });

    }


    if (newPassword.length < 6) {

        return res.status(400).json({
            success: false,
            message: "Password must contain at least 6 characters"
        });

    }


    const resetTokenHash =
        crypto
            .createHash("sha256")
            .update(resetToken)
            .digest("hex");


    const db =
        require("../config/db");


    db.query(
        `
        SELECT *
        FROM password_reset_codes
        WHERE
            email = ?
            AND reset_token_hash = ?
            AND verified = 1
        ORDER BY id DESC
        LIMIT 1
        `,
        [
            email,
            resetTokenHash
        ],
        async (err, results) => {

            if (err) {

                console.error(err);

                return res.status(500).json({
                    success: false,
                    message: "Database error"
                });

            }


            if (results.length === 0) {

                return res.status(400).json({
                    success: false,
                    message: "Invalid or expired reset session"
                });

            }


            const reset = results[0];


            if (
                new Date(reset.expires_at) <
                new Date()
            ) {

                return res.status(400).json({
                    success: false,
                    message: "Reset session has expired"
                });

            }


            const hashedPassword =
                await bcrypt.hash(
                    newPassword,
                    10
                );


            User.updatePassword(
                reset.user_id,
                hashedPassword,
                (updateErr) => {

                    if (updateErr) {

                        console.error(updateErr);

                        return res.status(500).json({
                            success: false,
                            message: "Failed to reset password"
                        });

                    }


                    // Invalidate reset code

                    db.query(
                        `
                        DELETE FROM password_reset_codes
                        WHERE id = ?
                        `,
                        [reset.id],
                        (deleteErr) => {

                            if (deleteErr) {

                                console.error(deleteErr);

                            }


                            res.json({
                                success: true,
                                message: "Password reset successfully"
                            });

                        }
                    );

                }
            );

        }
    );
};


module.exports = {
    getProfile,
    updateProfile,
    changePassword,
    forgotPassword,
    verifyResetCode,
    resetPassword
};