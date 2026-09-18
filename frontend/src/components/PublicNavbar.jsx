import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import algoCraftLogo from "../assets/algocraft-logo.svg";

import api from "../services/api";

import ProfilePopup from "./ProfilePopup";
import EditProfileModal from "./EditProfileModal";
import ChangePasswordModal from "./ChangePasswordModal";
import PremiumModal from "./PremiumModal";

function PublicNavbar() {

    const navigate = useNavigate();
    const location = useLocation();


    const authenticated =
        Boolean(
            localStorage.getItem("token")
        );


    const [profileOpen, setProfileOpen] =
        useState(false);

    const [editProfileOpen, setEditProfileOpen] =
        useState(false);

    const [changePasswordOpen, setChangePasswordOpen] =
        useState(false);

    const [premiumOpen, setPremiumOpen] =
        useState(false);


    const [user, setUser] =
        useState(() => {

            try {

                return JSON.parse(
                    localStorage.getItem("user")
                );

            } catch {

                return null;

            }

        });


    // ==========================================
    // Load profile
    // ==========================================

    useEffect(() => {

        if (!authenticated) {
            return;
        }


        const loadProfile =
            async () => {

                try {

                    const response =
                        await api.get(
                            "/profile"
                        );


                    if (
                        response.data.success
                    ) {

                        setUser(
                            response.data.user
                        );


                        localStorage.setItem(
                            "user",
                            JSON.stringify(
                                response.data.user
                            )
                        );

                    }

                } catch (error) {

                    console.error(
                        "Failed to load profile:",
                        error
                    );

                }

            };


        loadProfile();

    }, [authenticated]);

useEffect(() => {

    const refreshPremiumUser = async () => {

        try {

            const response =
                await api.get("/profile");

            if (
                response.data.success
            ) {

                const updatedUser =
                    response.data.user;

                setUser(updatedUser);

                localStorage.setItem(
                    "user",
                    JSON.stringify(updatedUser)
                );

            }

        } catch (error) {

            console.error(
                "Failed to refresh premium status:",
                error
            );

        }

    };


    window.addEventListener(
        "premium-updated",
        refreshPremiumUser
    );


    return () => {

        window.removeEventListener(
            "premium-updated",
            refreshPremiumUser
        );

    };

}, []);
    // ==========================================
    // Home
    // ==========================================

    const goHome = () => {

        navigate(
            authenticated
                ? "/dashboard"
                : "/"
        );

    };


    // ==========================================
    // Logout
    // ==========================================

    const handleLogout = () => {

        localStorage.removeItem("token");
        localStorage.removeItem("user");

        setUser(null);
        setProfileOpen(false);

        navigate(
            "/login",
            {
                replace: true
            }
        );

        window.location.reload();

    };


    // ==========================================
    // Edit profile
    // ==========================================

    const handleEditProfile = () => {

        setProfileOpen(false);

        setEditProfileOpen(true);

    };


    // ==========================================
    // Profile updated
    // ==========================================

    const handleProfileUpdated = (
        updatedUser
    ) => {

        setUser(
            updatedUser
        );


        localStorage.setItem(
            "user",
            JSON.stringify(
                updatedUser
            )
        );

    };

    const refreshProfile = async () => {

    try {

        const response =
            await api.get("/profile");

        if (
            response.data.success
        ) {

            const updatedUser =
                response.data.user;

            setUser(
                updatedUser
            );

            localStorage.setItem(
                "user",
                JSON.stringify(
                    updatedUser
                )
            );

        }

    } catch (error) {

        console.error(
            "Failed to refresh premium status:",
            error
        );

    }

};


    // ==========================================
    // Change password
    // ==========================================

    const handleChangePassword = () => {

        setEditProfileOpen(false);

        setChangePasswordOpen(true);

    };


    return (

        <>

            <header className="public-navbar">

                {/* LOGO */}

                <button
                    className="public-brand"
                    onClick={goHome}
                    aria-label="AlgoCraft home"
                >

                    <img
                        src={algoCraftLogo}
                        alt="AlgoCraft"
                    />

                </button>


                {/* NAVIGATION */}

                <nav
                    className="public-nav-links"
                    aria-label="Main navigation"
                >

                    <button
                        className={
                            location.pathname === "/" ||
                                location.pathname === "/dashboard"
                                ? "active"
                                : ""
                        }
                        onClick={goHome}
                    >
                        Home
                    </button>


                    <button
                        className={
                            location.pathname === "/about"
                                ? "active"
                                : ""
                        }
                        onClick={() =>
                            navigate("/about")
                        }
                    >
                        About
                    </button>


                    <button
                        className={
                            location.pathname === "/contact"
                                ? "active"
                                : ""
                        }
                        onClick={() =>
                            navigate("/contact")
                        }
                    >
                        Contact
                    </button>

                </nav>


                {/* RIGHT SIDE */}

                <div className="public-auth-actions">

                    {authenticated ? (

                        <>

                            {/* PREMIUM */}

                            <button
                                type="button"
                                className="public-premium"
                                onClick={(event) => {
                                    event.preventDefault();
                                    event.stopPropagation();
                                    setPremiumOpen(true);
                                }}
                            >

                                <svg
                                    width="18"
                                    height="18"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                >

                                    <path
                                        d="M3 6L6 18H18L21 6L16 11L12 4L8 11L3 6Z"
                                        stroke="currentColor"
                                        strokeWidth="1.8"
                                        strokeLinejoin="round"
                                    />

                                </svg>

                                <span>
                                    Premium
                                </span>

                            </button>


                            {/* PROFILE */}

                            <button
                                type="button"
                                className="public-profile"
                                onClick={() =>
                                    setProfileOpen(
                                        !profileOpen
                                    )
                                }
                            >

                                <div className="navbar-profile-avatar">

                                    {user?.profile_picture ? (

                                        <img
                                            src={`http://localhost:5000${user.profile_picture}`}
                                            alt="Profile"
                                        />

                                    ) : (

                                        <span>
                                            {user?.name
                                                ?.charAt(0)
                                                ?.toUpperCase() || "U"}
                                        </span>

                                    )}

                                </div>


                                <span>
                                    Profile
                                </span>


                                <span className="profile-arrow">
                                    {profileOpen
                                        ? "▲"
                                        : "▼"}
                                </span>

                            </button>


                            {profileOpen && (

                                <ProfilePopup

                                    user={user}

                                    onClose={() =>
                                        setProfileOpen(
                                            false
                                        )
                                    }

                                    onEdit={
                                        handleEditProfile
                                    }

                                    onLogout={
                                        handleLogout
                                    }

                                    onCreateAccount={() => {

                                        setProfileOpen(
                                            false
                                        );

                                        navigate(
                                            "/register"
                                        );

                                    }}

                                />

                            )}

                        </>

                    ) : (

                        <>

                            <button
                                type="button"
                                className="public-login"
                                onClick={() =>
                                    navigate("/login")
                                }
                            >
                                Login
                            </button>


                            <button
                                type="button"
                                className="public-register"
                                onClick={() =>
                                    navigate("/register")
                                }
                            >
                                Register
                            </button>

                        </>

                    )}

                </div>

            </header>


            {/* EDIT PROFILE */}

            {editProfileOpen && (

                <EditProfileModal

                    user={user}

                    onClose={() =>
                        setEditProfileOpen(
                            false
                        )
                    }

                    onUpdated={
                        handleProfileUpdated
                    }

                    onChangePassword={
                        handleChangePassword
                    }

                />

            )}


            {/* CHANGE PASSWORD */}

            {changePasswordOpen && (

                <ChangePasswordModal

                    onClose={() =>
                        setChangePasswordOpen(
                            false
                        )
                    }

                    onForgotPassword={() => {

                        setChangePasswordOpen(
                            false
                        );

                        navigate(
                            "/forgot-password"
                        );

                    }}

                />

            )}

            <PremiumModal
                open={premiumOpen}
                onClose={() => setPremiumOpen(false)}
               onPremium={refreshProfile}
                isPremium={
                    Number(user?.is_premium) === 1 &&
                    user?.premium_expires_at &&
                    new Date(user.premium_expires_at) > new Date()
                }
            />

        </>

    );

}


export default PublicNavbar;