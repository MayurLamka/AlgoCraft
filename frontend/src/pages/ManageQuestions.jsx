import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PageLayout from "../components/PageLayout";

const ManageQuestions = () => {
    const navigate = useNavigate();

    const [questions, setQuestions] = useState([]);
    const [filteredQuestions, setFilteredQuestions] = useState([]);

    const [search, setSearch] = useState("");
    const [difficulty, setDifficulty] = useState("All");

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const token = localStorage.getItem("token");

    // =========================
    // FETCH QUESTIONS
    // =========================
    const fetchQuestions = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await fetch(
                "http://localhost:5000/api/admin/questions",
                {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Failed to fetch questions");
            }

            setQuestions(data.questions || []);
            setFilteredQuestions(data.questions || []);

        } catch (err) {
            console.error("Fetch questions error:", err);
            setError(err.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchQuestions();
    }, []);

    // =========================
    // SEARCH + FILTER
    // =========================
    useEffect(() => {
        let result = [...questions];

        // Search by title
        if (search.trim() !== "") {
            result = result.filter((question) =>
                question.title
                    .toLowerCase()
                    .includes(search.toLowerCase())
            );
        }

        // Difficulty filter
        if (difficulty !== "All") {
            result = result.filter(
                (question) =>
                    question.difficulty.toLowerCase() ===
                    difficulty.toLowerCase()
            );
        }

        setFilteredQuestions(result);
    }, [search, difficulty, questions]);

    // =========================
    // DELETE QUESTION
    // =========================
    const handleDelete = async (questionId, title) => {
        const confirmed = window.confirm(
            `Are you sure you want to delete "${title}"?`
        );

        if (!confirmed) return;

        try {
            const response = await fetch(
                `http://localhost:5000/api/admin/questions/${questionId}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Failed to delete question"
                );
            }

            // Remove deleted question from UI
            setQuestions((prev) =>
                prev.filter(
                    (question) => question.question_id !== questionId
                )
            );

            alert("Question deleted successfully.");

        } catch (err) {
            console.error("Delete question error:", err);
            alert(err.message || "Failed to delete question");
        }
    };

    // =========================
    // DIFFICULTY BADGE
    // =========================
    const getDifficultyClass = (difficulty) => {
        switch (difficulty?.toLowerCase()) {
            case "easy":
                return "difficulty-easy";

            case "medium":
                return "difficulty-medium";

            case "hard":
                return "difficulty-hard";

            default:
                return "";
        }
    };

    return (
        <PageLayout activePage="add-question">
            <div className="manage-questions-page">

                {/* HEADER */}
                <div className="manage-questions-header">

                    <div>
                        <h1>Manage Questions</h1>
                        <p>
                            View, edit and manage all DSA questions.
                        </p>
                    </div>

                    <button
                        className="add-question-btn"
                        onClick={() => navigate("/admin/questions/add")}
                    >
                        + Add Question
                    </button>

                </div>

                {/* CONTROLS */}
                <div className="manage-questions-controls">

                    <div className="search-box">
                        <input
                            type="text"
                            placeholder="Search questions..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>

                    <select
                        value={difficulty}
                        onChange={(e) => setDifficulty(e.target.value)}
                    >
                        <option value="All">All Difficulties</option>
                        <option value="Easy">Easy</option>
                        <option value="Medium">Medium</option>
                        <option value="Hard">Hard</option>
                    </select>

                </div>

                {/* ERROR */}
                {error && (
                    <div className="manage-questions-error">
                        {error}
                    </div>
                )}

                {/* LOADING */}
                {loading ? (
                    <div className="manage-questions-loading">
                        Loading questions...
                    </div>
                ) : (

                    <div className="questions-table-container">

                        <table className="questions-table">

                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Question</th>
                                    <th>Difficulty</th>
                                    <th>Created</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>

                            <tbody>

                                {filteredQuestions.length === 0 ? (

                                    <tr>
                                        <td
                                            colSpan="5"
                                            className="no-questions"
                                        >
                                            No questions found.
                                        </td>
                                    </tr>

                                ) : (

                                    filteredQuestions.map((question, index) => (

                                        <tr key={question.question_id}>

                                            <td>
                                                {index + 1}
                                            </td>

                                            <td className="question-title">
                                                {question.title}
                                            </td>

                                            <td>
                                                <span
                                                    className={`difficulty-badge ${getDifficultyClass(
                                                        question.difficulty
                                                    )}`}
                                                >
                                                    {question.difficulty}
                                                </span>
                                            </td>

                                            <td>
                                                {question.created_at
                                                    ? new Date(
                                                        question.created_at
                                                    ).toLocaleDateString()
                                                    : "-"}
                                            </td>

                                            <td className="question-actions">

                                                <button
                                                    className="view-btn"
                                                    onClick={() =>
                                                        navigate(
                                                            `/question/${question.question_id}`
                                                        )
                                                    }
                                                >
                                                    View
                                                </button>

                                                <button
                                                    className="edit-btn"
                                                    onClick={() =>
                                                        navigate(
                                                            `/admin/questions/${question.question_id}/edit`
                                                        )
                                                    }
                                                >
                                                    Edit
                                                </button>

                                                <button
                                                    className="delete-btn"
                                                    onClick={() =>
                                                        handleDelete(
                                                            question.question_id,
                                                            question.title
                                                        )
                                                    }
                                                >
                                                    Delete
                                                </button>

                                            </td>

                                        </tr>

                                    ))

                                )}

                            </tbody>

                        </table>

                    </div>

                )}

                {/* RESULT COUNT */}
                {!loading && (
                    <div className="questions-count">
                        Showing {filteredQuestions.length} of{" "}
                        {questions.length} questions
                    </div>
                )}

            </div>
        </PageLayout>
    );
};

export default ManageQuestions;