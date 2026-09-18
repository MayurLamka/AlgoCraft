import React, { useEffect, useRef } from "react";

function ProfilePopup({
    user,
    onClose,
    onEdit,
    onLogout,
    onCreateAccount
}) {

    const popupRef = useRef(null);


    // ==========================================
    // Close when clicking outside
    // ==========================================

    useEffect(() => {

        const handleClickOutside = (event) => {

            if (
                popupRef.current &&
                !popupRef.current.contains(event.target)
            ) {
                onClose();
            }

        };


        document.addEventListener(
            "mousedown",
            handleClickOutside
        );


        return () => {

            document.removeEventListener(
                "mousedown",
                handleClickOutside
            );

        };

    }, [onClose]);


    const profileImage =
        user?.profile_picture
            ? `http://localhost:5000${user.profile_picture}`
            : null;


    return (

        <div
            className="profile-popup"
            ref={popupRef}
        >

            {/* USER */}

            <div className="profile-popup-user">

                <div
                    className="profile-popup-avatar"
                    onClick={onEdit}
                >

                    {profileImage ? (

                        <img
                            src={profileImage}
                            alt="Profile"
                        />

                    ) : (

                        <span>
                            {user?.name
                                ?.charAt(0)
                                ?.toUpperCase() || "U"}
                        </span>

                    )}


                    <button
                        type="button"
                        className="profile-edit-small"
                        onClick={(event) => {

                            event.stopPropagation();

                            onEdit();

                        }}
                    >

                        ✎

                    </button>

                </div>


                <div className="profile-popup-info">

                    <h3>
                        {user?.name || "User"}
                    </h3>

                    <p>
                        {user?.email || ""}
                    </p>

                    {Number(user?.is_premium) === 1 && (
                        <div className="profile-premium-badge">
                            <span>✦</span>
                            PREMIUM MEMBER
                        </div>
                    )}

                </div>


                <button
                    type="button"
                    className="profile-popup-close"
                    onClick={onClose}
                >
                    ×
                </button>

            </div>


            {/* CREATE ACCOUNT */}

            <button
                type="button"
                className="profile-popup-action"
                onClick={onCreateAccount}
            >

                <span className="profile-action-icon">
                    +
                </span>

                <span>
                    Add another account
                </span>

            </button>


            {/* LOGOUT */}

            <button
                type="button"
                className="profile-popup-action logout-action"
                onClick={onLogout}
            >

                <span className="profile-action-icon">
                    ↪
                </span>

                <span>
                    Logout
                </span>

            </button>

        </div>

    );
}

export default ProfilePopup;