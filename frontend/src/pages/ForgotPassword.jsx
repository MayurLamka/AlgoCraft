import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import PublicNavbar from "../components/PublicNavbar";

function ForgotPassword() {

    const navigate = useNavigate();


    const [step, setStep] =
        useState(1);

    const [email, setEmail] =
        useState("");

    const [code, setCode] =
        useState("");

    const [resetToken, setResetToken] =
        useState("");


    const [newPassword, setNewPassword] =
        useState("");

    const [confirmPassword, setConfirmPassword] =
        useState("");


    const [loading, setLoading] =
        useState(false);

    const [error, setError] =
        useState("");

    const [success, setSuccess] =
        useState("");


    // ==========================================
    // STEP 1
    // Send OTP
    // ==========================================

    const handleSendCode = async (
        event
    ) => {

        event.preventDefault();

        setError("");
        setSuccess("");


        if (!email) {

            setError(
                "Please enter your email."
            );

            return;

        }


        try {

            setLoading(true);


            const response =
                await api.post(
                    "/profile/forgot-password",
                    {
                        email
                    }
                );


            if (
                response.data.success
            ) {

                setSuccess(
                    "Verification code sent to your email."
                );

                setStep(2);

            }

        } catch (err) {

            setError(
                err.response?.data?.message ||
                "Failed to send verification code."
            );

        } finally {

            setLoading(false);

        }

    };


    // ==========================================
    // STEP 2
    // Verify OTP
    // ==========================================

    const handleVerifyCode = async (
        event
    ) => {

        event.preventDefault();

        setError("");
        setSuccess("");


        if (
            code.length !== 6
        ) {

            setError(
                "Enter the 6-digit verification code."
            );

            return;

        }


        try {

            setLoading(true);


            const response =
                await api.post(
                    "/profile/verify-reset-code",
                    {
                        email,
                        code
                    }
                );


            if (
                response.data.success
            ) {

                setResetToken(
                    response.data.resetToken
                );

                setSuccess(
                    "Code verified successfully."
                );

                setStep(3);

            }

        } catch (err) {

            setError(
                err.response?.data?.message ||
                "Invalid verification code."
            );

        } finally {

            setLoading(false);

        }

    };


    // ==========================================
    // STEP 3
    // Reset Password
    // ==========================================

    const handleResetPassword =
        async (event) => {

            event.preventDefault();

            setError("");
            setSuccess("");


            if (
                newPassword.length < 6
            ) {

                setError(
                    "Password must contain at least 6 characters."
                );

                return;

            }


            if (
                newPassword !==
                confirmPassword
            ) {

                setError(
                    "Passwords do not match."
                );

                return;

            }


            try {

                setLoading(true);


                const response =
                    await api.post(
                        "/profile/reset-password",
                        {
                            email,
                            resetToken,
                            newPassword
                        }
                    );


                if (
                    response.data.success
                ) {

                    setSuccess(
                        "Password reset successfully."
                    );


                    setTimeout(() => {

                        navigate(
                            "/login",
                            {
                                replace: true
                            }
                        );

                    }, 1500);

                }

            } catch (err) {

                setError(
                    err.response?.data?.message ||
                    "Failed to reset password."
                );

            } finally {

                setLoading(false);

            }

        };


    return (

        <div className="public-page">

            <PublicNavbar />


            <main className="forgot-page">

                <div className="forgot-card">

                    <div className="forgot-brand">
                        ALGOCRAFT
                        <span>
                            / PASSWORD RESET
                        </span>
                    </div>


                    {/* ==================================
                        STEP 1
                    ================================== */}

                    {step === 1 && (

                        <>

                            <span className="section-kicker">
                                ACCOUNT RECOVERY
                            </span>

                            <h1>
                                Forgot your password?
                            </h1>

                            <p>
                                Enter your email address and
                                we'll send you a verification code.
                            </p>


                            <form
                                onSubmit={
                                    handleSendCode
                                }
                            >

                                <label className="modal-field">

                                    <span>
                                        Email
                                    </span>

                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(event) =>
                                            setEmail(
                                                event.target.value
                                            )
                                        }
                                        placeholder="you@example.com"
                                        required
                                    />

                                </label>


                                {error && (
                                    <div className="modal-error">
                                        {error}
                                    </div>
                                )}


                                {success && (
                                    <div className="modal-success">
                                        {success}
                                    </div>
                                )}


                                <button
                                    className="forgot-submit"
                                    type="submit"
                                    disabled={loading}
                                >

                                    {loading
                                        ? "Sending..."
                                        : "Send Verification Code"}

                                </button>

                            </form>

                        </>

                    )}


                    {/* ==================================
                        STEP 2
                    ================================== */}

                    {step === 2 && (

                        <>

                            <span className="section-kicker">
                                VERIFY EMAIL
                            </span>

                            <h1>
                                Enter verification code
                            </h1>

                            <p>
                                We sent a 6-digit code to:
                                <br />
                                <strong>
                                    {email}
                                </strong>
                            </p>


                            <form
                                onSubmit={
                                    handleVerifyCode
                                }
                            >

                                <label className="modal-field">

                                    <span>
                                        Verification Code
                                    </span>

                                    <input
                                        className="otp-input"
                                        type="text"
                                        inputMode="numeric"
                                        maxLength="6"
                                        value={code}
                                        onChange={(event) =>
                                            setCode(
                                                event.target.value
                                                    .replace(
                                                        /\D/g,
                                                        ""
                                                    )
                                            )
                                        }
                                        placeholder="000000"
                                        required
                                    />

                                </label>


                                {error && (
                                    <div className="modal-error">
                                        {error}
                                    </div>
                                )}


                                {success && (
                                    <div className="modal-success">
                                        {success}
                                    </div>
                                )}


                                <button
                                    className="forgot-submit"
                                    type="submit"
                                    disabled={loading}
                                >

                                    {loading
                                        ? "Verifying..."
                                        : "Verify Code"}

                                </button>


                                <button
                                    type="button"
                                    className="back-link"
                                    onClick={() => {

                                        setStep(1);
                                        setCode("");
                                        setError("");
                                        setSuccess("");

                                    }}
                                >
                                    ← Change email
                                </button>

                            </form>

                        </>

                    )}


                    {/* ==================================
                        STEP 3
                    ================================== */}

                    {step === 3 && (

                        <>

                            <span className="section-kicker">
                                NEW PASSWORD
                            </span>

                            <h1>
                                Create a new password
                            </h1>

                            <p>
                                Your email has been verified.
                                Set your new password below.
                            </p>


                            <form
                                onSubmit={
                                    handleResetPassword
                                }
                            >

                                <label className="modal-field">

                                    <span>
                                        New Password
                                    </span>

                                    <input
                                        type="password"
                                        value={newPassword}
                                        onChange={(event) =>
                                            setNewPassword(
                                                event.target.value
                                            )
                                        }
                                        placeholder="Enter new password"
                                        required
                                    />

                                </label>


                                <label className="modal-field">

                                    <span>
                                        Confirm Password
                                    </span>

                                    <input
                                        type="password"
                                        value={confirmPassword}
                                        onChange={(event) =>
                                            setConfirmPassword(
                                                event.target.value
                                            )
                                        }
                                        placeholder="Confirm new password"
                                        required
                                    />

                                </label>


                                {error && (
                                    <div className="modal-error">
                                        {error}
                                    </div>
                                )}


                                {success && (
                                    <div className="modal-success">
                                        {success}
                                    </div>
                                )}


                                <button
                                    className="forgot-submit"
                                    type="submit"
                                    disabled={loading}
                                >

                                    {loading
                                        ? "Resetting..."
                                        : "Reset Password"}

                                </button>

                            </form>

                        </>

                    )}

                </div>

            </main>

        </div>

    );
}

export default ForgotPassword;