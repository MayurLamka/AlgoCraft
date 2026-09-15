import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PageLayout from "../components/PageLayout";

function Revision() {

    const navigate = useNavigate();

    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);


    // =====================================================
    // FETCH REVISION QUESTIONS
    // =====================================================

    const fetchRevisionQuestions = async () => {

        try {

            const token = localStorage.getItem("token");

            const response = await fetch(
                "http://localhost:5000/api/questions/revision",
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const data = await response.json();

            console.log("REVISION API STATUS:", response.status);
            console.log("REVISION API DATA:", data);
            if (data.success) {

                setQuestions(data.questions);

            } else {

                setQuestions([]);

            }

        } catch (error) {

            console.error(
                "Failed to fetch revision questions:",
                error
            );

            setQuestions([]);

        } finally {

            setLoading(false);

        }

    };


    useEffect(() => {

        fetchRevisionQuestions();

    }, []);


    // =====================================================
    // REMOVE FROM REVISION
    // =====================================================

    const handleRevisionToggle = async (questionId) => {

        try {

            const token = localStorage.getItem("token");

            const response = await fetch(
                `http://localhost:5000/api/questions/revision/${questionId}`,
                {
                    method: "POST",

                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const data = await response.json();

            if (data.success && !data.isRevision) {

                setQuestions((previousQuestions) =>
                    previousQuestions.filter(
                        (question) =>
                            question.question_id !== questionId
                    )
                );

            }

        } catch (error) {

            console.error(
                "Revision toggle error:",
                error
            );

        }

    };


    // =====================================================
    // DIFFICULTY CLASS
    // =====================================================

    const getDifficultyClass = (difficulty) => {

        if (difficulty === "Easy") {
            return "question-difficulty easy";
        }

        if (difficulty === "Medium") {
            return "question-difficulty medium";
        }

        if (difficulty === "Hard") {
            return "question-difficulty hard";
        }

        return "question-difficulty";

    };


   return (

    <PageLayout activePage="revision">

        <div className="revision-page-content">


            <div className="revision-layout">



                {/* =====================================================
                    MAIN CONTENT
                ===================================================== */}

                <main className="revision-main">


                    {/* =====================================================
                        REVISION HERO
                    ===================================================== */}

                    <section className="revision-hero">

                        <div className="revision-hero-left">

                            <div className="revision-icon-large">
                                ★
                            </div>

                            <div>

                                <div className="revision-eyebrow">
                                    MY LIST
                                </div>

                                <h1>
                                    Revision
                                </h1>

                                <p>
                                    Keep the questions you want to
                                    practice again in one place.
                                </p>

                            </div>

                        </div>


                        <div className="revision-stat">

                            <span>
                                QUESTIONS
                            </span>

                            <strong>
                                {questions.length}
                            </strong>

                        </div>

                    </section>


                    {/* =====================================================
                        TABLE CARD
                    ===================================================== */}

                    <section className="revision-table-card">


                        <div className="revision-table-header">

                            <div>

                                <h2>
                                    Revision Questions
                                </h2>

                                <p>
                                    Practice these problems again
                                    until you feel confident.
                                </p>

                            </div>

                            {questions.length > 0 && (

                                <span className="revision-table-count">
                                    {questions.length} saved
                                </span>

                            )}

                        </div>


                        {loading ? (

                            <div className="revision-empty-state">

                                <div className="revision-empty-icon">
                                    ★
                                </div>

                                <h3>
                                    Loading revision questions...
                                </h3>

                            </div>

                        ) : questions.length === 0 ? (

                            <div className="revision-empty-state">

                                <div className="revision-empty-icon">
                                    ☆
                                </div>

                                <h3>
                                    Your revision list is empty
                                </h3>

                                <p>
                                    Click the star next to any question
                                    to add it here.
                                </p>

                                <button
                                    className="revision-browse-btn"
                                    onClick={() =>
                                        navigate("/dashboard")
                                    }
                                >
                                    Browse Questions
                                </button>

                            </div>

                        ) : (

                            <div className="revision-table-wrapper">

                                <table className="question-table">

                                    <thead>

                                        <tr>

                                            <th className="solved-column">
                                                ✓
                                            </th>

                                            <th className="number-column">
                                                #
                                            </th>

                                            <th className="question-column">
                                                Question
                                            </th>

                                            <th className="difficulty-column">
                                                Difficulty
                                            </th>

                                            <th className="video-column">
                                                Video
                                            </th>

                                            <th className="favorite-column">
                                                Revision
                                            </th>

                                        </tr>

                                    </thead>


                                    <tbody>

                                        {questions.map(
                                            (question, index) => (

                                                <tr
                                                    key={
                                                        question.question_id
                                                    }
                                                    className="revision-question-row"
                                                >

                                                    {/* SOLVED */}

                                                    <td className="solved-column">

                                                        {Number(
                                                            question.isSolved
                                                        ) === 1 ? (

                                                            <span className="solved-check">
                                                                ✓
                                                            </span>

                                                        ) : (

                                                            <span className="not-solved-dot">
                                                                •
                                                            </span>

                                                        )}

                                                    </td>


                                                    {/* NUMBER */}

                                                    <td className="number-column">

                                                        {String(
                                                            index + 1
                                                        ).padStart(2, "0")}

                                                    </td>


                                                    {/* QUESTION */}

                                                    <td className="question-column">

                                                        <span
                                                            className="question-title revision-question-title"
                                                            onClick={() =>
                                                                navigate(
                                                                    `/question/${question.question_id}`
                                                                )
                                                            }
                                                        >
                                                            {question.title}
                                                        </span>

                                                    </td>


                                                    {/* DIFFICULTY */}

                                                    <td className="difficulty-column">

                                                        <span
                                                            className={
                                                                getDifficultyClass(
                                                                    question.difficulty
                                                                )
                                                            }
                                                        >
                                                            {
                                                                question.difficulty
                                                            }
                                                        </span>

                                                    </td>


                                                    {/* VIDEO */}

                                                    <td className="video-column">

                                                        {question.youtube_link ? (

                                                            <a
                                                                href={
                                                                    question.youtube_link
                                                                }
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="revision-video-btn"
                                                                title="Watch solution"
                                                            >

                                                                <svg
                                                                    width="16"
                                                                    height="16"
                                                                    viewBox="0 0 24 24"
                                                                    fill="none"
                                                                >

                                                                    <rect
                                                                        x="3"
                                                                        y="5"
                                                                        width="18"
                                                                        height="14"
                                                                        rx="4"
                                                                        stroke="currentColor"
                                                                        strokeWidth="1.7"
                                                                    />

                                                                    <path
                                                                        d="M10 9L16 12L10 15V9Z"
                                                                        fill="currentColor"
                                                                    />

                                                                </svg>

                                                            </a>

                                                        ) : (

                                                            <span className="no-video">
                                                                —
                                                            </span>

                                                        )}

                                                    </td>


                                                    {/* REVISION */}

                                                    <td className="favorite-column">

                                                        <button
                                                            type="button"
                                                            className="revision-icon revision-saved"
                                                            onClick={() =>
                                                                handleRevisionToggle(
                                                                    question.question_id
                                                                )
                                                            }
                                                            title="Remove from Revision"
                                                        >
                                                            ★
                                                        </button>

                                                    </td>

                                                </tr>

                                            )
                                        )}

                                    </tbody>

                                </table>

                            </div>

                        )}

                    </section>

                </main>

            </div>

        </div>
        </PageLayout>

    );

}

export default Revision;