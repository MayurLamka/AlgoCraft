import React, { useState } from "react";
import api from "../services/api";

function ChangePasswordModal({
    onClose,
    onForgotPassword
}) {

    const [oldPassword, setOldPassword] =
        useState("");

    const [newPassword, setNewPassword] =
        useState("");

    const [confirmPassword, setConfirmPassword] =
        useState("");

    const [error, setError] =
        useState("");

    const [success, setSuccess] =
        useState("");

    const [loading, setLoading] =
        useState(false);


    const handleSubmit = async (event) => {

        event.preventDefault();

        setError("");
        setSuccess("");


        if (
            !oldPassword ||
            !newPassword ||
            !confirmPassword
        ) {

            setError(
                "Please fill all fields."
            );

            return;

        }


        if (
            newPassword.length < 6
        ) {

            setError(
                "New password must contain at least 6 characters."
            );

            return;

        }


        if (
            newPassword !==
            confirmPassword
        ) {

            setError(
                "New passwords do not match."
            );

            return;

        }


        try {

            setLoading(true);


            const response =
                await api.put(
                    "/profile/change-password",
                    {
                        oldPassword,
                        newPassword
                    }
                );


            if (
                response.data.success
            ) {

                setSuccess(
                    "Password changed successfully."
                );

                setOldPassword("");
                setNewPassword("");
                setConfirmPassword("");

            }

        } catch (err) {

            console.error(err);

            setError(
                err.response?.data?.message ||
                "Failed to change password."
            );

        } finally {

            setLoading(false);

        }

    };


    return (

        <div className="modal-overlay">

            <div className="password-modal">

                <div className="edit-profile-header">

                    <div>

                        <span className="modal-kicker">
                            SECURITY
                        </span>

                        <h2>
                            Change Password
                        </h2>

                    </div>


                    <button
                        type="button"
                        className="modal-close"
                        onClick={onClose}
                    >
                        ×
                    </button>

                </div>


                <form
                    onSubmit={handleSubmit}
                >

                    <label className="modal-field">

                        <span>
                            Old Password
                        </span>

                        <input
                            type="password"
                            value={oldPassword}
                            onChange={(event) =>
                                setOldPassword(
                                    event.target.value
                                )
                            }
                            placeholder="Enter old password"
                        />

                    </label>


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
                        />

                    </label>


                    <label className="modal-field">

                        <span>
                            Confirm New Password
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
                        />

                    </label>


                    <button
                        type="button"
                        className="forgot-password-link"
                        onClick={onForgotPassword}
                    >
                        Forgot password?
                    </button>


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


                    <div className="modal-footer">

                        <button
                            type="button"
                            className="modal-cancel"
                            onClick={onClose}
                        >
                            Cancel
                        </button>


                        <button
                            type="submit"
                            className="modal-save"
                            disabled={loading}
                        >

                            {loading
                                ? "Changing..."
                                : "Change Password"}

                        </button>

                    </div>

                </form>

            </div>

        </div>

    );
}

export default ChangePasswordModal;