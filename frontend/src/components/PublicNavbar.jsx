
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import algoCraftLogo from "../assets/algocraft-logo.svg";

function hasSession() {
    return Boolean(localStorage.getItem("token"));
}

export default function PublicNavbar() {
    const navigate = useNavigate();
    const location = useLocation();
    const authenticated = !!localStorage.getItem("token");

    const goHome = () => navigate(authenticated ? "/dashboard" : "/");

    return (
        <header className="public-navbar">
            <button className="public-brand" onClick={goHome} aria-label="AlgoCraft home">
                <img src={algoCraftLogo} alt="AlgoCraft" />
            </button>

            <nav className="public-nav-links" aria-label="Main navigation">
                <button
                    className={location.pathname === "/" || location.pathname === "/dashboard" ? "active" : ""}
                    onClick={goHome}
                >
                    Home
                </button>
                <button
                    className={location.pathname === "/about" ? "active" : ""}
                    onClick={() => navigate("/about")}
                >
                    About
                </button>
                <button
                    className={location.pathname === "/contact" ? "active" : ""}
                    onClick={() => navigate("/contact")}
                >
                    Contact
                </button>
            </nav>

            <div className="public-auth-actions">

    {authenticated ? (
        <>
            {/* PREMIUM */}
            <button
                type="button"
                className="public-premium"
                onClick={() => navigate("/premium")}
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

                <span>Premium</span>
            </button>


            {/* PROFILE */}
            <button
                type="button"
                className="public-profile"
                onClick={() => navigate("/profile")}
            >
                <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                >
                    <circle
                        cx="12"
                        cy="8"
                        r="4"
                        stroke="currentColor"
                        strokeWidth="2"
                    />

                    <path
                        d="M4 21C4.8 16.8 7.4 14 12 14C16.6 14 19.2 16.8 20 21"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                    />
                </svg>

                <span>Profile</span>

                <span className="profile-arrow">
                    ▼
                </span>
            </button>
        </>
    ) : (
        <>
            <button
                type="button"
                className="public-login"
                onClick={() => navigate("/login")}
            >
                Login
            </button>

            <button
                type="button"
                className="public-register"
                onClick={() => navigate("/register")}
            >
                Register
            </button>
        </>
    )}

</div>
        </header>
    );
}
