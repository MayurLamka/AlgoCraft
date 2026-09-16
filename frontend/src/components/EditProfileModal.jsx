import React, { useEffect, useState } from "react";
import api from "../services/api";

function EditProfileModal({
    user,
    onClose,
    onUpdated,
    onChangePassword
}) {

    const [name, setName] = useState(
        user?.name || ""
    );

    const [preview, setPreview] = useState(
        user?.profile_picture
            ? `http://localhost:5000${user.profile_picture}`
            : ""
    );

    const [image, setImage] = useState(null);

    const [loading, setLoading] = useState(false);

    const [error, setError] = useState("");

    const [success, setSuccess] = useState("");


    useEffect(() => {

        setName(user?.name || "");

        setPreview(
            user?.profile_picture
                ? `http://localhost:5000${user.profile_picture}`
                : ""
        );

    }, [user]);


    const handleImageChange = (event) => {

        const file =
            event.target.files?.[0];

        if (!file) {
            return;
        }


        const allowedTypes = [
            "image/jpeg",
            "image/png",
            "image/webp",
            "image/jpg"
        ];


        if (
            !allowedTypes.includes(
                file.type
            )
        ) {

            setError(
                "Only JPG, PNG and WEBP images are allowed."
            );

            return;

        }


        if (file.size > 5 * 1024 * 1024) {

            setError(
                "Profile picture must be smaller than 5MB."
            );

            return;

        }


        setError("");

        setImage(file);

        setPreview(
            URL.createObjectURL(file)
        );

    };


    const handleSave = async (event) => {

        event.preventDefault();

        setError("");
        setSuccess("");


        if (!name.trim()) {

            setError(
                "Name cannot be empty."
            );

            return;

        }


        try {

            setLoading(true);


            const formData =
                new FormData();

            formData.append(
                "name",
                name.trim()
            );


            if (image) {

                formData.append(
                    "profile_picture",
                    image
                );

            }


            const response =
                await api.put(
                    "/profile",
                    formData
                );


            if (
                response.data.success
            ) {

                setSuccess(
                    "Profile updated successfully."
                );


                const profileResponse =
                    await api.get(
                        "/profile"
                    );


                if (
                    profileResponse.data.success
                ) {

                    onUpdated(
                        profileResponse.data.user
                    );

                }

            }

        } catch (err) {

            console.error(err);

            setError(
                err.response?.data?.message ||
                "Failed to update profile."
            );

        } finally {

            setLoading(false);

        }

    };


    return (

        <div className="modal-overlay">

            <div className="edit-profile-modal">

                <div className="edit-profile-header">

                    <div>
                        <span className="modal-kicker">
                            ACCOUNT
                        </span>

                        <h2>
                            Edit Profile
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


                <form onSubmit={handleSave}>

                    {/* PROFILE PICTURE */}

                    <div className="edit-avatar-section">

                        <label
                            className="edit-avatar"
                        >

                            {preview ? (

                                <img
                                    src={preview}
                                    alt="Profile preview"
                                />

                            ) : (

                                <span>
                                    {name
                                        ?.charAt(0)
                                        ?.toUpperCase() || "U"}
                                </span>

                            )}


                            <div className="avatar-camera">
                                ✎
                            </div>


                            <input
                                type="file"
                                accept="image/png,image/jpeg,image/webp"
                                onChange={handleImageChange}
                                hidden
                            />

                        </label>


                        <p>
                            Click the edit icon to change
                            your profile picture.
                        </p>

                    </div>


                    {/* NAME */}

                    <label className="modal-field">

                        <span>
                            Name
                        </span>

                        <input
                            type="text"
                            value={name}
                            onChange={(event) =>
                                setName(
                                    event.target.value
                                )
                            }
                            placeholder="Your name"
                        />

                    </label>


                    {/* EMAIL */}

                    <label className="modal-field">

                        <span>
                            Email
                        </span>

                        <input
                            type="email"
                            value={user?.email || ""}
                            disabled
                        />

                        <small>
                            Email cannot be changed here.
                        </small>

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


                    {/* PASSWORD */}

                    <button
                        type="button"
                        className="change-password-button"
                        onClick={onChangePassword}
                    >

                        <span>
                            Change Password
                        </span>

                        <span>
                            →
                        </span>

                    </button>


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
                                ? "Saving..."
                                : "Save Changes"}

                        </button>

                    </div>

                </form>

            </div>

        </div>

    );
}

export default EditProfileModal;