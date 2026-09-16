const express = require("express");
const router = express.Router();

const multer = require("multer");
const path = require("path");
const fs = require("fs");

const {
    getProfile,
    updateProfile,
    changePassword,
    forgotPassword,
    verifyResetCode,
    resetPassword
} = require("../controllers/profileController");

const jwt = require("jsonwebtoken");


// ==========================================
// Authentication middleware
// ==========================================

const authenticate = (req, res, next) => {

    const authHeader =
        req.headers.authorization;

    if (!authHeader) {

        return res.status(401).json({
            success: false,
            message: "Authentication required"
        });

    }


    const token =
        authHeader.startsWith("Bearer ")
            ? authHeader.split(" ")[1]
            : null;


    if (!token) {

        return res.status(401).json({
            success: false,
            message: "Invalid authentication token"
        });

    }


    try {

        const decoded =
            jwt.verify(
                token,
                process.env.JWT_SECRET
            );

        req.user = decoded;

        next();

    } catch (error) {

        return res.status(401).json({
            success: false,
            message: "Invalid or expired token"
        });

    }

};


// ==========================================
// Profile image upload
// ==========================================

const uploadDirectory =
    path.join(
        __dirname,
        "../uploads/profiles"
    );


if (!fs.existsSync(uploadDirectory)) {

    fs.mkdirSync(
        uploadDirectory,
        {
            recursive: true
        }
    );

}


const storage =
    multer.diskStorage({

        destination: (
            req,
            file,
            cb
        ) => {

            cb(
                null,
                uploadDirectory
            );

        },

        filename: (
            req,
            file,
            cb
        ) => {

            const extension =
                path.extname(
                    file.originalname
                );

            const filename =
                `profile-${req.user.user_id}-${Date.now()}${extension}`;

            cb(
                null,
                filename
            );

        }

    });


const fileFilter =
    (
        req,
        file,
        cb
    ) => {

        const allowedTypes = [
            "image/jpeg",
            "image/png",
            "image/webp",
            "image/jpg"
        ];


        if (
            allowedTypes.includes(
                file.mimetype
            )
        ) {

            cb(null, true);

        } else {

            cb(
                new Error(
                    "Only JPG, JPEG, PNG and WEBP images are allowed"
                )
            );

        }

    };


const upload =
    multer({
        storage,
        fileFilter,
        limits: {
            fileSize: 5 * 1024 * 1024
        }
    });


// ==========================================
// PROFILE
// ==========================================

router.get(
    "/",
    authenticate,
    getProfile
);


// ==========================================
// UPDATE PROFILE
// ==========================================

router.put(
    "/",
    authenticate,
    upload.single("profile_picture"),
    updateProfile
);


// ==========================================
// CHANGE PASSWORD
// ==========================================

router.put(
    "/change-password",
    authenticate,
    changePassword
);


// ==========================================
// FORGOT PASSWORD
// ==========================================

router.post(
    "/forgot-password",
    forgotPassword
);


// ==========================================
// VERIFY OTP
// ==========================================

router.post(
    "/verify-reset-code",
    verifyResetCode
);


// ==========================================
// RESET PASSWORD
// ==========================================

router.post(
    "/reset-password",
    resetPassword
);


module.exports = router;