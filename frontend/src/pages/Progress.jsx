import React, {
    useEffect,
    useMemo,
    useState
} from "react";

import { useNavigate } from "react-router-dom";


function getUserId() {

    try {

        const token =
            localStorage.getItem("token");

        if (!token) {
            return null;
        }

        const payload =
            JSON.parse(
                atob(token.split(".")[1])
            );

        return payload.user_id;

    } catch (error) {

        console.error(error);

        return null;

    }

}


function formatDate(dateString) {

    if (!dateString) {
        return "-";
    }

    const date =
        new Date(dateString);

    return date.toLocaleString(
        "en-IN",
        {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        }
    );

}


function Progress() {

    const navigate =
        useNavigate();


    const [submissions, setSubmissions] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");


    /* =========================================
       FETCH PRACTICE HISTORY
    ========================================= */

    useEffect(() => {

        const fetchHistory = async () => {

            const userId =
                getUserId();


            if (!userId) {

                setError(
                    "Please login to view your progress."
                );

                setLoading(false);

                return;

            }


            try {

                const response =
                    await fetch(
                        `http://localhost:5000/api/submissions/${userId}`
                    );

                const data =
                    await response.json();


                if (!response.ok ||
                    !data.success) {

                    throw new Error(
                        data.message ||
                        "Failed to fetch history"
                    );

                }


                setSubmissions(
                    data.submissions || []
                );

            } catch (error) {

                console.error(error);

                setError(
                    "Failed to load practice history."
                );

            } finally {

                setLoading(false);

            }

        };


        fetchHistory();

    }, []);


    /* =========================================
       UNIQUE QUESTIONS
       Keep latest submission
    ========================================= */

    const practicedQuestions =
        useMemo(() => {

            const map =
                new Map();


            submissions.forEach(
                (submission) => {

                    if (
                        !map.has(
                            submission.question_id
                        )
                    ) {

                        map.set(
                            submission.question_id,
                            submission
                        );

                    }

                }
            );


            return Array.from(
                map.values()
            );

        }, [submissions]);


    /* =========================================
       SUMMARY
    ========================================= */

    const summary =
        useMemo(() => {

            const easy =
                practicedQuestions.filter(
                    (item) =>
                        item.difficulty ===
                        "Easy"
                ).length;

            const medium =
                practicedQuestions.filter(
                    (item) =>
                        item.difficulty ===
                        "Medium"
                ).length;

            const hard =
                practicedQuestions.filter(
                    (item) =>
                        item.difficulty ===
                        "Hard"
                ).length;


            const accepted =
                submissions.filter(
                    (item) =>
                        String(
                            item.status
                        ).toLowerCase() ===
                        "accepted"
                ).length;


            return {
                practiced:
                    practicedQuestions.length,
                submissions:
                    submissions.length,
                easy,
                medium,
                hard,
                accepted
            };

        }, [
            practicedQuestions,
            submissions
        ]);


    return (

        <div className="progress-page">


            {/* =========================================
               HEADER
            ========================================= */}

            <div className="progress-page-header">

                <button
                    className="resource-back-button"
                    onClick={() =>
                        navigate("/dashboard")
                    }
                >
                    ← Dashboard
                </button>


                <div>

                    <h1>
                        Practice History
                    </h1>

                    <p>
                        Track the problems you have
                        practiced and your submissions.
                    </p>

                </div>

            </div>


            {/* =========================================
               SUMMARY
            ========================================= */}

            {!loading &&
                !error && (

                    <div className="progress-summary">

                        <div className="progress-summary-card">

                            <span>
                                Questions Practiced
                            </span>

                            <strong>
                                {
                                    summary.practiced
                                }
                            </strong>

                        </div>


                        <div className="progress-summary-card">

                            <span>
                                Submissions
                            </span>

                            <strong>
                                {
                                    summary.submissions
                                }
                            </strong>

                        </div>


                        <div className="progress-summary-card">

                            <span>
                                Accepted
                            </span>

                            <strong className="accepted-number">
                                {
                                    summary.accepted
                                }
                            </strong>

                        </div>


                        <div className="progress-summary-card">

                            <span>
                                Easy / Medium / Hard
                            </span>

                            <strong>
                                {summary.easy}
                                {" / "}
                                {summary.medium}
                                {" / "}
                                {summary.hard}
                            </strong>

                        </div>

                    </div>

                )}


            {/* =========================================
               CONTENT
            ========================================= */}

            <div className="practice-history-layout">


                {/* HISTORY */}

                <section className="practice-history-card">

                    <div className="practice-history-title">

                        <h2>
                            Practice History
                        </h2>

                        <span>
                            {practicedQuestions.length}
                            {" "}Questions
                        </span>

                    </div>


                    {loading && (

                        <div className="resource-message">
                            Loading practice history...
                        </div>

                    )}


                    {!loading && error && (

                        <div className="resource-message resource-error">
                            {error}
                        </div>

                    )}


                    {!loading &&
                        !error &&
                        practicedQuestions.length === 0 && (

                            <div className="practice-empty">

                                <div>
                                    📝
                                </div>

                                <h3>
                                    No practice history yet
                                </h3>

                                <p>
                                    Solve a problem and
                                    your activity will
                                    appear here.
                                </p>

                            </div>

                        )}


                    {!loading &&
                        !error &&
                        practicedQuestions.length > 0 && (

                            <div className="history-table-wrapper">

                                <table className="history-table">

                                    <thead>

                                        <tr>

                                            <th>
                                                Last Submitted
                                            </th>

                                            <th>
                                                Problem
                                            </th>

                                            <th>
                                                Last Result
                                            </th>

                                            <th>
                                                Submissions
                                            </th>

                                        </tr>

                                    </thead>


                                    <tbody>

                                        {practicedQuestions.map(
                                            (question) => {

                                                const questionSubmissions =
                                                    submissions.filter(
                                                        (item) =>
                                                            Number(
                                                                item.question_id
                                                            ) ===
                                                            Number(
                                                                question.question_id
                                                            )
                                                    );


                                                const accepted =
                                                    String(
                                                        question.status
                                                    ).toLowerCase() ===
                                                    "accepted";


                                                return (

                                                    <tr
                                                        key={
                                                            question.question_id
                                                        }
                                                        className="history-row"
                                                        onClick={() =>
                                                            navigate(
                                                                `/question/${question.question_id}`
                                                            )
                                                        }
                                                    >

                                                        <td>

                                                            {formatDate(
                                                                question.submitted_at
                                                            )}

                                                        </td>


                                                        <td>

                                                            <div className="history-question">

                                                                <span className="history-check">
                                                                    {accepted
                                                                        ? "✓"
                                                                        : "•"}
                                                                </span>


                                                                <div>

                                                                    <strong>
                                                                        {
                                                                            question.question_id
                                                                        }.
                                                                        {" "}
                                                                        {
                                                                            question.title
                                                                        }
                                                                    </strong>


                                                                    <span
                                                                        className={
                                                                            `history-difficulty ${
                                                                                question.difficulty
                                                                                    ?.toLowerCase()
                                                                            }`
                                                                        }
                                                                    >
                                                                        {
                                                                            question.difficulty ===
                                                                            "Medium"
                                                                                ? "Med."
                                                                                : question.difficulty
                                                                        }
                                                                    </span>

                                                                </div>

                                                            </div>

                                                        </td>


                                                        <td>

                                                            <span
                                                                className={
                                                                    accepted
                                                                        ? "history-result accepted"
                                                                        : "history-result failed"
                                                                }
                                                            >
                                                                {
                                                                    question.status
                                                                }
                                                            </span>

                                                        </td>


                                                        <td>

                                                            {
                                                                questionSubmissions.length
                                                            }

                                                        </td>

                                                    </tr>

                                                );

                                            }
                                        )}

                                    </tbody>

                                </table>

                            </div>

                        )}

                </section>


                {/* SUMMARY */}

                <aside className="practice-summary-card">

                    <h2>
                        Summary
                    </h2>


                    <div className="practice-total">

                        <span>
                            Total Practiced
                        </span>

                        <strong>
                            {
                                summary.practiced
                            }
                        </strong>

                        <small>
                            Problems
                        </small>

                    </div>


                    <div className="practice-difficulty-grid">

                        <div>

                            <span className="easy-text">
                                Easy
                            </span>

                            <strong>
                                {
                                    summary.easy
                                }
                            </strong>

                        </div>


                        <div>

                            <span className="medium-text">
                                Med.
                            </span>

                            <strong>
                                {
                                    summary.medium
                                }
                            </strong>

                        </div>


                        <div>

                            <span className="hard-text">
                                Hard
                            </span>

                            <strong>
                                {
                                    summary.hard
                                }
                            </strong>

                        </div>

                    </div>


                    <div className="practice-stat">

                        <span>
                            Total Submissions
                        </span>

                        <strong>
                            {
                                summary.submissions
                            }
                        </strong>

                    </div>


                    <div className="practice-stat">

                        <span>
                            Accepted
                        </span>

                        <strong className="accepted-number">
                            {
                                summary.accepted
                            }
                        </strong>

                    </div>

                </aside>

            </div>

        </div>

    );

}


export default Progress;