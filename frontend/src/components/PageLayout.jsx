import React from "react";
import { useNavigate } from "react-router-dom";
import PublicNavbar from "./PublicNavbar";


function getUserRole() {

    try {

        const token = localStorage.getItem("token");

        if (!token) {
            return null;
        }

        const payload = JSON.parse(
            atob(token.split(".")[1])
        );

        return payload.role || null;

    } catch (error) {

        console.error(
            "Failed to read user role:",
            error
        );

        return null;

    }

}


function PageLayout({
    children,
    activePage = ""
}) {

    const navigate = useNavigate();

    const isAdmin =
        getUserRole() === "admin";


    return (

        <div className="app-layout">


            {/* =====================================================
                NAVBAR
            ===================================================== */}

            <PublicNavbar />


            {/* =====================================================
                BODY
            ===================================================== */}

            <div className="app-layout-body">


                {/* =================================================
                    SIDEBAR
                ================================================= */}

                <aside className="sidebar">


                    <div className="sidebar-menu">


                        {/* LIBRARY */}

                        <button
                            className={`sidebar-item ${
                                activePage === "library"
                                    ? "active"
                                    : ""
                            }`}
                            onClick={() =>
                                navigate("/dashboard")
                            }
                        >

                            <svg
                                width="19"
                                height="19"
                                viewBox="0 0 24 24"
                                fill="none"
                            >

                                <path
                                    d="M5 4.5C5 3.67 5.67 3 6.5 3H18V19H6.5C5.67 19 5 19.67 5 20.5C5 21.33 5.67 22 6.5 22H18"
                                    stroke="currentColor"
                                    strokeWidth="1.7"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />

                                <path
                                    d="M5 4.5V20.5"
                                    stroke="currentColor"
                                    strokeWidth="1.7"
                                />

                                <path
                                    d="M8 7H15"
                                    stroke="currentColor"
                                    strokeWidth="1.7"
                                    strokeLinecap="round"
                                />

                            </svg>

                            <span>
                                Library
                            </span>

                        </button>


                        {/* INTERVIEWS */}

                        <button
                            className={`sidebar-item ${
                                activePage === "interviews"
                                    ? "active"
                                    : ""
                            }`}
                            onClick={() =>
                                navigate("/interviews")
                            }
                        >

                            <svg
                                width="19"
                                height="19"
                                viewBox="0 0 24 24"
                                fill="none"
                            >

                                <circle
                                    cx="9"
                                    cy="8"
                                    r="3"
                                    stroke="currentColor"
                                    strokeWidth="1.7"
                                />

                                <path
                                    d="M3.5 19C4.2 15.7 6 14 9 14C12 14 13.8 15.7 14.5 19"
                                    stroke="currentColor"
                                    strokeWidth="1.7"
                                    strokeLinecap="round"
                                />

                                <circle
                                    cx="17"
                                    cy="9"
                                    r="2.2"
                                    stroke="currentColor"
                                    strokeWidth="1.7"
                                />

                                <path
                                    d="M15.5 14.5C17.9 14.6 19.5 16 20 18"
                                    stroke="currentColor"
                                    strokeWidth="1.7"
                                    strokeLinecap="round"
                                />

                            </svg>

                            <span>
                                Interviews
                            </span>

                        </button>


                        {/* NOTES */}

                        <button
                            className={`sidebar-item ${
                                activePage === "notes"
                                    ? "active"
                                    : ""
                            }`}
                            onClick={() =>
                                navigate("/notes")
                            }
                        >

                            <svg
                                width="19"
                                height="19"
                                viewBox="0 0 24 24"
                                fill="none"
                            >

                                <path
                                    d="M6 3H15L19 7V21H6C4.9 21 4 20.1 4 19V5C4 3.9 4.9 3 6 3Z"
                                    stroke="currentColor"
                                    strokeWidth="1.7"
                                    strokeLinejoin="round"
                                />

                                <path
                                    d="M14 3V8H19"
                                    stroke="currentColor"
                                    strokeWidth="1.7"
                                    strokeLinejoin="round"
                                />

                                <path
                                    d="M8 12H15"
                                    stroke="currentColor"
                                    strokeWidth="1.7"
                                    strokeLinecap="round"
                                />

                                <path
                                    d="M8 16H13"
                                    stroke="currentColor"
                                    strokeWidth="1.7"
                                    strokeLinecap="round"
                                />

                            </svg>

                            <span>
                                Notes
                            </span>

                        </button>


                        {/* PROGRESS */}

                        <button
                            className={`sidebar-item ${
                                activePage === "progress"
                                    ? "active"
                                    : ""
                            }`}
                            onClick={() =>
                                navigate("/progress")
                            }
                        >

                            <svg
                                width="19"
                                height="19"
                                viewBox="0 0 24 24"
                                fill="none"
                            >

                                <path
                                    d="M4 19V10"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                />

                                <path
                                    d="M10 19V5"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                />

                                <path
                                    d="M16 19V13"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                />

                                <path
                                    d="M22 19V8"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                />

                            </svg>

                            <span>
                                Progress
                            </span>

                        </button>

                    </div>


                    <div className="sidebar-divider"></div>


                    {/* MY LISTS */}

                    <div className="sidebar-section-title">
                        MY LISTS
                    </div>


                    <button
                        className={`sidebar-item ${
                            activePage === "revision"
                                ? "active"
                                : ""
                        }`}
                        onClick={() =>
                            navigate("/revision")
                        }
                    >

                        <span className="sidebar-star">
                            ★
                        </span>

                        <span>
                            Revision
                        </span>

                    </button>


                    {/* ADMIN */}

                    {isAdmin && (

                        <>

                            <div className="sidebar-section-title admin-section-title">
                                ADMIN
                            </div>


                            <button
                                className={`sidebar-item ${
                                    activePage === "add-question"
                                        ? "active"
                                        : ""
                                }`}
                                onClick={() =>
                                    navigate(
                                        "/admin/questions/add"
                                    )
                                }
                            >

                                <span>
                                    ＋
                                </span>

                                <span>
                                    Add Question
                                </span>

                            </button>


                            <button
                                className={`sidebar-item ${
                                    activePage === "manage-questions"
                                        ? "active"
                                        : ""
                                }`}
                                onClick={() =>
                                    navigate(
                                        "/admin/questions"
                                    )
                                }
                            >

                                <span>
                                    ▤
                                </span>

                                <span>
                                    Manage Questions
                                </span>

                            </button>

                        </>

                    )}

                </aside>


                {/* =================================================
                    PAGE CONTENT
                ================================================= */}

                <main className="app-layout-main">

                    {children}

                </main>

            </div>

        </div>

    );

}


export default PageLayout;