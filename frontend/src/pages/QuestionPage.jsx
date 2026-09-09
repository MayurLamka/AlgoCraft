import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Editor from "@monaco-editor/react";
import algoCraftLogo from "../assets/algocraft-logo.svg";

function QuestionPage() {

    const [leftWidth, setLeftWidth] = useState(33);

    const handleMouseDown = (event) => {

        event.preventDefault();

        const handleMouseMove = (moveEvent) => {

            const container = document.querySelector(".problem-page-content");

            if (!container) return;

            const rect = container.getBoundingClientRect();

            const newWidth =
                ((moveEvent.clientX - rect.left) / rect.width) * 100;

            // Keep both panels usable
            const limitedWidth = Math.min(
                Math.max(newWidth, 30),
                70
            );

            setLeftWidth(limitedWidth);
        };

        const handleMouseUp = () => {

            document.removeEventListener(
                "mousemove",
                handleMouseMove
            );

            document.removeEventListener(
                "mouseup",
                handleMouseUp
            );

            document.body.style.cursor = "";
            document.body.style.userSelect = "";
        };

        document.body.style.cursor = "col-resize";
        document.body.style.userSelect = "none";

        document.addEventListener(
            "mousemove",
            handleMouseMove
        );

        document.addEventListener(
            "mouseup",
            handleMouseUp
        );
    };

    const { id } = useParams();

    const [question, setQuestion] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [language, setLanguage] = useState("cpp");

    const [codes, setCodes] = useState({
        cpp: "",
        java: "",
        python: "",
        javascript: ""
    });

    const [codeLoading, setCodeLoading] = useState(true);

    const [exampleResults, setExampleResults] = useState([]);
    const [isRunning, setIsRunning] = useState(false);
    const [runError, setRunError] = useState("");

    const [activeTab, setActiveTab] = useState("description");
    const [submissionResult, setSubmissionResult] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState("");

    const [solutions, setSolutions] = useState([]);
    const [solutionsLoading, setSolutionsLoading] = useState(false);
    const [solutionsError, setSolutionsError] = useState("");

    const [submissions, setSubmissions] = useState([]);
    const [submissionsLoading, setSubmissionsLoading] = useState(false);
    const [submissionsError, setSubmissionsError] = useState("");

    const [outputOpen, setOutputOpen] = useState(false);
    const [outputHeight, setOutputHeight] = useState(260);



    useEffect(() => {

        const fetchQuestion = async () => {

            try {

                setLoading(true);
                setError("");

                const token = localStorage.getItem("token");

                const response = await fetch(
                    `http://localhost:5000/api/questions/${id}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                const data = await response.json();



                if (!response.ok || !data.success) {
                    console.log("QUESTION RESPONSE:", {
                        status: response.status,
                        data: data
                    });

                    setError(
                        data.message ||
                        data.error ||
                        "Failed to load question"
                    );

                    return;
                }



                setQuestion({
                    ...data.question,

                    isSolved: Number(data.question.isSolved) === 1,

                    isSaved: Number(data.question.isSaved) === 1,

                    topics: data.question.topics || []
                });

            } catch (error) {

                console.error(
                    "Failed to fetch question:",
                    error
                );

                setError("Unable to load question");

            } finally {

                setLoading(false);

            }

        };

        fetchQuestion();

    }, [id]);

    useEffect(() => {

        const fetchCodeTemplate = async () => {

            try {

                setCodeLoading(true);

                const token = localStorage.getItem("token");

                const response = await fetch(
                    `http://localhost:5000/api/questions/${id}/code?language=${language}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                const data = await response.json();

                if (!response.ok || !data.success) {

                    console.error(
                        data.message || "Failed to load code template"
                    );

                    return;
                }

                setCodes((previousCodes) => {

                    // Don't overwrite user's existing code
                    if (previousCodes[language]) {
                        return previousCodes;
                    }

                    return {
                        ...previousCodes,
                        [language]: data.template.starter_code
                    };

                });

            } catch (error) {

                console.error(
                    "Failed to fetch code template:",
                    error
                );

            } finally {

                setCodeLoading(false);

            }

        };

        fetchCodeTemplate();

    }, [id, language]);
    if (loading) {

        return (
            <div className="question-page-loading">
                Loading question...
            </div>
        );

    }


    if (error) {

        return (
            <div className="question-page-loading">
                {error}
            </div>
        );

    }


    if (!question) {

        return (
            <div className="question-page-loading">
                Question not found
            </div>
        );

    }

    const handleOutputResizeStart = (event) => {

        event.preventDefault();

        const startY = event.clientY;
        const startHeight = outputHeight;

        const handleMouseMove = (moveEvent) => {

            const delta =
                startY - moveEvent.clientY;

            const newHeight =
                startHeight + delta;

            const limitedHeight =
                Math.min(
                    Math.max(newHeight, 120),
                    600
                );

            setOutputHeight(limitedHeight);
        };

        const handleMouseUp = () => {

            document.removeEventListener(
                "mousemove",
                handleMouseMove
            );

            document.removeEventListener(
                "mouseup",
                handleMouseUp
            );

            document.body.style.cursor = "";
            document.body.style.userSelect = "";
        };

        document.body.style.cursor = "row-resize";
        document.body.style.userSelect = "none";

        document.addEventListener(
            "mousemove",
            handleMouseMove
        );

        document.addEventListener(
            "mouseup",
            handleMouseUp
        );
    };

    const saveUserCode = async (codeToSave) => {
        try {
            const token = localStorage.getItem("token");

            const response = await fetch(
                `http://localhost:5000/api/questions/${id}/code/save`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },

                    body: JSON.stringify({
                        language,
                        code: codeToSave
                    })
                }
            );

            const data = await response.json();

            if (!response.ok || !data.success) {
                console.error(
                    data.message || "Failed to save code"
                );
            }

        } catch (error) {
            console.error(
                "Failed to save user code:",
                error
            );
        }
    };
    const fetchSubmissions = async () => {

        try {

            setSubmissionsLoading(true);
            setSubmissionsError("");

            const token =
                localStorage.getItem("token");

            const response = await fetch(
                `http://localhost:5000/api/submissions/question/${id}`,
                {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const data = await response.json();

            console.log(
                "SUBMISSIONS RESPONSE:",
                data
            );

            if (!response.ok || !data.success) {

                setSubmissionsError(
                    data.message ||
                    "Failed to load submissions"
                );

                return;
            }

            setSubmissions(
                data.submissions || []
            );

        } catch (error) {

            console.error(
                "FETCH SUBMISSIONS ERROR:",
                error
            );

            setSubmissionsError(
                "Unable to load submissions"
            );

        } finally {

            setSubmissionsLoading(false);

        }
    };
    const fetchSolutions = async () => {
        try {
            setSolutionsLoading(true);
            setSolutionsError("");

            const token = localStorage.getItem("token");

            const response = await fetch(
                `http://localhost:5000/api/solutions/question/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const data = await response.json();

            if (!response.ok || !data.success) {
                throw new Error(data.message || "Failed to fetch solutions");
            }

            setSolutions(data.solutions || []);

        } catch (error) {
            console.error("Fetch solutions error:", error);
            setSolutionsError(error.message || "Failed to load solutions");
        } finally {
            setSolutionsLoading(false);
        }
    };
    const handleRunCode = async () => {

        const currentCode = codes[language];

        if (!currentCode.trim()) {

            setRunError("Code cannot be empty");

            return;
        }

        await saveUserCode(currentCode);

        if (
            !question.examples ||
            question.examples.length === 0
        ) {

            setRunError(
                "No examples available for this question"
            );

            return;
        }


        try {

            setIsRunning(true);
            setOutputOpen(true);
            setExampleResults([]);
            setRunError("");


            const token =
                localStorage.getItem("token");


            const response = await fetch(
                "http://localhost:5000/api/code/run",
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json",

                        Authorization:
                            `Bearer ${token}`
                    },

                    body: JSON.stringify({

                        questionId: id,

                        language: language,

                        code: currentCode
                    })
                }
            );


            const data =
                await response.json();


            console.log(
                "RUN CODE RESPONSE:",
                data
            );


            if (!response.ok || !data.success) {

                setRunError(
                    data.message ||
                    data.error ||
                    "Failed to run code"
                );

                return;
            }


            setExampleResults(
                data.results || []
            );


        } catch (error) {

            console.error(
                "Run code error:",
                error
            );


            setRunError(
                "Unable to connect to code execution server"
            );


        } finally {

            setIsRunning(false);
        }
    };





    const handleSubmitCode = async () => {

        const currentCode = codes[language];

        if (!currentCode || !currentCode.trim()) {
            setSubmitError("Code cannot be empty");
            setSubmissionResult(null);
            setActiveTab("description");
            return;
        }

        try {
            setIsSubmitting(true);
            setSubmitError("");
            setSubmissionResult(null);
            setActiveTab("description");

            await saveUserCode(currentCode);

            const token = localStorage.getItem("token");

            const response = await fetch(
                "http://localhost:5000/api/code/submit",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        questionId: id,
                        language,
                        code: currentCode
                    })
                }
            );

            const data = await response.json();

            console.log("SUBMIT CODE RESPONSE:", data);

            if (!response.ok || !data.success) {
                setSubmitError(
                    data.message ||
                    data.error ||
                    "Submission failed"
                );
                return;
            }

            setSubmissionResult(data);

            if (data.isSolved) {
                setQuestion((previousQuestion) => ({
                    ...previousQuestion,
                    isSolved: true
                }));
            }

        } catch (error) {
            console.error("Submit code error:", error);
            setSubmitError(
                "Unable to connect to code execution server"
            );
        } finally {
            setIsSubmitting(false);
        }
    };


    return (
        <div className="question-page">

            {/* =========================================
               TOP NAVBAR
            ========================================= */}

            <header className="problem-navbar">

                {/* LEFT SIDE */}

                <div className="problem-navbar-left">

                    {/* LOGO */}

                    <div className="problem-logo">

                        <img
                            src={algoCraftLogo}
                            alt="AlgoCraft"
                        />

                    </div>


                    {/* PROBLEM LIST */}

                    <button
                        className="problem-nav-button problem-list-button"
                        title="Problem List"
                    >

                        <svg
                            width="19"
                            height="19"
                            viewBox="0 0 24 24"
                            fill="none"
                        >

                            <path
                                d="M4 6H7"
                                stroke="currentColor"
                                strokeWidth="1.8"
                                strokeLinecap="round"
                            />

                            <path
                                d="M4 12H7"
                                stroke="currentColor"
                                strokeWidth="1.8"
                                strokeLinecap="round"
                            />

                            <path
                                d="M4 18H7"
                                stroke="currentColor"
                                strokeWidth="1.8"
                                strokeLinecap="round"
                            />

                            <path
                                d="M10 6H20"
                                stroke="currentColor"
                                strokeWidth="1.8"
                                strokeLinecap="round"
                            />

                            <path
                                d="M10 12H20"
                                stroke="currentColor"
                                strokeWidth="1.8"
                                strokeLinecap="round"
                            />

                            <path
                                d="M10 18H20"
                                stroke="currentColor"
                                strokeWidth="1.8"
                                strokeLinecap="round"
                            />

                        </svg>

                        <span>
                            Problem List
                        </span>

                    </button>


                    {/* PREVIOUS QUESTION */}

                    <button
                        className="problem-nav-icon"
                        title="Previous Question"
                    >

                        <svg
                            width="22"
                            height="22"
                            viewBox="0 0 24 24"
                            fill="none"
                        >

                            <path
                                d="M15 5L8 12L15 19"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />

                        </svg>

                    </button>


                    {/* NEXT QUESTION */}

                    <button
                        className="problem-nav-icon"
                        title="Next Question"
                    >

                        <svg
                            width="22"
                            height="22"
                            viewBox="0 0 24 24"
                            fill="none"
                        >

                            <path
                                d="M9 5L16 12L9 19"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />

                        </svg>

                    </button>


                    {/* RANDOM QUESTION */}

                    <button
                        className="problem-nav-icon"
                        title="Random Question"
                    >

                        <svg
                            width="21"
                            height="21"
                            viewBox="0 0 24 24"
                            fill="none"
                        >

                            <path
                                d="M16 3H21V8"
                                stroke="currentColor"
                                strokeWidth="1.8"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />

                            <path
                                d="M4 7H6C9 7 10 10 12 12"
                                stroke="currentColor"
                                strokeWidth="1.8"
                                strokeLinecap="round"
                            />

                            <path
                                d="M12 12C14 14 15 17 18 17H21"
                                stroke="currentColor"
                                strokeWidth="1.8"
                                strokeLinecap="round"
                            />

                            <path
                                d="M16 21H21V16"
                                stroke="currentColor"
                                strokeWidth="1.8"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />

                        </svg>

                    </button>

                </div>


                {/* CENTER / ACTIONS */}

                <div className="problem-navbar-actions">


                    {/* RUN */}

                    <button
                        className="run-button"
                        title="Run Code"
                        onClick={handleRunCode}
                        disabled={isRunning}
                    >

                        <svg
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                        >

                            <path
                                d="M8 5L19 12L8 19V5Z"
                                fill="currentColor"
                            />

                        </svg>

                    </button>


                    {/* SUBMIT */}

                    <button
                        className="submit-button"
                        title="Submit Code"
                        onClick={handleSubmitCode}
                        disabled={isSubmitting || isRunning}
                    >

                        <svg
                            width="19"
                            height="19"
                            viewBox="0 0 24 24"
                            fill="none"
                        >

                            <path
                                d="M5 19L19 5"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                            />

                            <path
                                d="M14 5H19V10"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />

                        </svg>

                        <span>
                            {isSubmitting ? "Submitting..." : "Submit"}
                        </span>

                    </button>

                </div>


                {/* RIGHT SIDE */}

                <div className="problem-navbar-right">



                    {/* STREAK */}

                    <div className="problem-streak">

                        <svg
                            width="19"
                            height="19"
                            viewBox="0 0 24 24"
                            fill="none"
                        >

                            <path
                                d="M12 22C16.4 22 20 18.7 20 14.5C20 11.2 18.1 8.5 15.4 6.2C15.6 9.1 14.1 10.8 12.5 11.6C12.9 8.1 11.1 4.7 7.8 2C8.1 5.9 5 8.2 4.2 11.7C3.1 16.5 6.3 22 12 22Z"
                                stroke="currentColor"
                                strokeWidth="1.7"
                            />

                        </svg>

                        <span>
                            0
                        </span>

                    </div>


                    {/* PROFILE */}

                    <button
                        className="problem-profile"
                        title="Profile"
                    >

                        <svg
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                        >

                            <circle
                                cx="12"
                                cy="8"
                                r="4"
                                stroke="currentColor"
                                strokeWidth="1.8"
                            />

                            <path
                                d="M4 21C4.8 16.8 7.4 14 12 14C16.6 14 19.2 16.8 20 21"
                                stroke="currentColor"
                                strokeWidth="1.8"
                                strokeLinecap="round"
                            />

                        </svg>

                    </button>


                    {/* PREMIUM */}

                    <button className="problem-premium">

                        <svg
                            width="17"
                            height="17"
                            viewBox="0 0 24 24"
                            fill="none"
                        >

                            <path
                                d="M3 6L6 18H18L21 6L16 11L12 4L8 11L3 6Z"
                                stroke="currentColor"
                                strokeWidth="1.7"
                                strokeLinejoin="round"
                            />

                        </svg>

                        <span>
                            Premium
                        </span>

                    </button>

                </div>

            </header>


            {/* =========================================
               PAGE CONTENT
            ========================================= */}

            <div
                className="problem-page-content"
                style={{
                    gridTemplateColumns: `${leftWidth}% 8px ${100 - leftWidth}%`
                }}
            >

                {/* LEFT PROBLEM PANEL */}

                <section className="problem-description">

                    {/* =========================================
        DESCRIPTION NAVIGATION
    ========================================= */}

                    <div className="description-navbar">

                        <button
                            className={`description-tab ${activeTab === "description" ? "active" : ""}`}
                            onClick={() => setActiveTab("description")}
                        >

                            <span className="tab-icon">▣</span>

                            Description

                        </button>





                        <button
                            className={`description-tab ${activeTab === "submissions"
                                ? "active"
                                : ""
                                }`}
                            onClick={() => {
                                setActiveTab("submissions");
                                fetchSubmissions();
                            }}
                        >
                            <span className="tab-icon">
                                ↻
                            </span>

                            Submissions
                        </button>


                        <button
                            className={`description-tab ${activeTab === "solutions"
                                ? "active"
                                : ""
                                }`}
                            onClick={() => {
                                setActiveTab("solutions");
                                fetchSolutions();
                            }}
                        >

                            <span className="tab-icon">⚗</span>

                            Solutions

                        </button>

                    </div>


                    {/* =========================================
        QUESTION CONTENT
    ========================================= */}

                    <div
                        className="question-content"
                        style={{
                            display:
                                activeTab === "description" &&
                                    !isSubmitting &&
                                    !submissionResult &&
                                    !submitError
                                    ? "block"
                                    : "none"
                        }}
                    >

                        {/* QUESTION HEADER */}

                        <div className="question-title-row">

                            <h1>
                                {question.question_id}. {question.title}
                            </h1>

                            {question.isSolved && (
                                <span className="solved-status">
                                    Solved
                                    <span className="solved-status-mark">
                                        ✓
                                    </span>
                                </span>
                            )}

                        </div>


                        {/* QUESTION META */}

                        <div className="question-meta">

                            <span
                                className={`difficulty-badge ${question.difficulty?.toLowerCase()
                                    }`}
                            >
                                {question.difficulty}
                            </span>


                            <div className="question-topics">

                                {(question.topics || []).map((topic) => (
                                    <span
                                        className="question-meta-button topic-button"
                                        key={topic.topic_id}
                                    >
                                        🏷 {topic.name}
                                    </span>
                                ))}

                            </div>





                            {/* HINT BUTTON */}

                            <button
                                className="question-meta-button hint-button"
                                onClick={() => {
                                    document
                                        .getElementById("question-hints")
                                        ?.scrollIntoView({
                                            behavior: "smooth"
                                        });
                                }}
                            >
                                <span></span>
                                Hint
                            </button>

                        </div>


                        {/* =========================================
            DESCRIPTION
        ========================================= */}

                        <div className="question-section">

                            <div
                                className="question-description-text"
                                dangerouslySetInnerHTML={{
                                    __html: question.description || ""
                                }}
                            />

                        </div>


                        {/* =========================================
            EXAMPLE 1
        ========================================= */}

                        <div className="question-section">

                            {(question.examples || []).map((example) => (
                                <div
                                    className="question-section"
                                    key={example.example_id}
                                >

                                    <h2>
                                        Example {example.example_number}:
                                    </h2>

                                    <div className="example-box">

                                        <p>
                                            <strong>Input:</strong>{" "}
                                            {example.input}
                                        </p>

                                        <p>
                                            <strong>Output:</strong>{" "}
                                            {example.output}
                                        </p>

                                        {example.explanation && (
                                            <p>
                                                <strong>Explanation:</strong>{" "}
                                                {example.explanation}
                                            </p>
                                        )}

                                    </div>

                                </div>
                            ))}



                        </div>



                        {/* =========================================
            CONSTRAINTS
        ========================================= */}

                        <div className="question-section">

                            <h2>
                                Constraints
                            </h2>

                            <ul className="constraints-list">

                                {(question.constraints || []).map((constraint) => (

                                    <li
                                        key={constraint.constraint_id}
                                    >
                                        {constraint.constraint_text}
                                    </li>

                                ))}

                            </ul>

                        </div>


                        {/* =========================================
            HINTS
        ========================================= */}

                        <div
                            className="question-section hints-section"
                            id="question-hints"
                        >

                            <h2>
                                Hints
                            </h2>


                            {(question.hints || []).map((hint) => (

                                <div
                                    className="hint-card"
                                    key={hint.hint_id}
                                >

                                    <div>

                                        <strong>
                                            Hint {hint.hint_number}
                                        </strong>

                                        <p>
                                            {hint.hint_text}
                                        </p>

                                    </div>

                                </div>

                            ))}




                        </div>

                    </div>


                    {/* =========================================
                        SUBMISSION RESULT
                    ========================================= */}

                    {activeTab === "description" &&
                        (isSubmitting || submissionResult || submitError) && (

                            <div className="submission-result-content">

                                {isSubmitting && (
                                    <div className="submission-loading">
                                        <div className="submission-loading-icon">↻</div>
                                        <h1>Judging...</h1>
                                        <p>Your code is being compiled and tested.</p>
                                    </div>
                                )}

                                {!isSubmitting && submitError && (
                                    <div className="submission-error-card">
                                        <div className="submission-result-title">
                                            <span className="submission-failure-icon">✕</span>
                                            <div>
                                                <h1>Submission Failed</h1>
                                                <p>{submitError}</p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {!isSubmitting && submissionResult && (
                                    <>
                                        <div className={`submission-status-card ${submissionResult.status === "Accepted"
                                            ? "accepted"
                                            : "failed"
                                            }`}>

                                            <div className="submission-status-title">

                                                <span className="submission-status-icon">
                                                    {submissionResult.status === "Accepted" ? "✓" : "✕"}
                                                </span>

                                                <div>
                                                    <h1>
                                                        {submissionResult.status === "Accepted"
                                                            ? "Accepted"
                                                            : submissionResult.status}
                                                    </h1>

                                                    <p>
                                                        {submissionResult.passedTests || 0}
                                                        {" / "}
                                                        {submissionResult.totalTests || 0}
                                                        {" test cases passed"}
                                                    </p>
                                                </div>

                                            </div>

                                        </div>


                                        <div className="submission-stats">

                                            <div className="submission-stat-card">
                                                <span>Language</span>
                                                <strong>
                                                    {language === "cpp"
                                                        ? "C++"
                                                        : language}
                                                </strong>
                                            </div>

                                            <div className="submission-stat-card">
                                                <span>Test Cases</span>
                                                <strong>
                                                    {submissionResult.passedTests || 0}
                                                    /
                                                    {submissionResult.totalTests || 0}
                                                </strong>
                                            </div>

                                            <div className="submission-stat-card">
                                                <span>Result</span>
                                                <strong>
                                                    {submissionResult.allPassed
                                                        ? "All Passed"
                                                        : "Failed"}
                                                </strong>
                                            </div>

                                        </div>


                                        <div className="submission-section">

                                            <h2>Complexity</h2>

                                            <div className="complexity-grid">

                                                <div className="complexity-card">
                                                    <span>Time Complexity</span>
                                                    <strong>
                                                        {submissionResult.timeComplexity ||
                                                            "Not analyzed"}
                                                    </strong>
                                                </div>

                                                <div className="complexity-card">
                                                    <span>Space Complexity</span>
                                                    <strong>
                                                        {submissionResult.spaceComplexity ||
                                                            "Not analyzed"}
                                                    </strong>
                                                </div>

                                            </div>

                                            {!submissionResult.timeComplexity &&
                                                !submissionResult.spaceComplexity && (
                                                    <p className="complexity-note">
                                                        Big-O complexity is not automatically inferred
                                                        by the judge yet.
                                                    </p>
                                                )}

                                        </div>


                                        {!submissionResult.allPassed && (
                                            <div className="submission-section">

                                                <h2>Test Results</h2>

                                                <div className="submission-tests">

                                                    {(submissionResult.results || []).map(
                                                        (result) => (

                                                            <div
                                                                key={result.testCaseId}
                                                                className={`submission-test ${result.passed
                                                                    ? "passed"
                                                                    : "failed"
                                                                    }`}
                                                            >

                                                                <div className="submission-test-header">

                                                                    <strong>
                                                                        Test Case {result.testCaseNumber}
                                                                    </strong>

                                                                    <span>
                                                                        {result.passed
                                                                            ? "✓ Passed"
                                                                            : `✕ ${result.status}`}
                                                                    </span>

                                                                </div>

                                                                {!result.passed && (
                                                                    <>
                                                                        {!result.hidden && (
                                                                            <div className="submission-test-block">

                                                                                <span>Input</span>

                                                                                <pre>
                                                                                    {result.input ||
                                                                                        "(no input)"}
                                                                                </pre>

                                                                            </div>
                                                                        )}

                                                                        {!result.hidden && (
                                                                            <div className="submission-test-block">

                                                                                <span>Expected Output</span>

                                                                                <pre>
                                                                                    {result.expectedOutput ||
                                                                                        "(no output)"}
                                                                                </pre>

                                                                            </div>
                                                                        )}

                                                                        <div className="submission-test-block">

                                                                            <span>Your Output</span>

                                                                            <pre>
                                                                                {result.actualOutput ||
                                                                                    "(no output)"}
                                                                            </pre>

                                                                        </div>

                                                                        {result.error && (
                                                                            <div className="submission-test-block">

                                                                                <span>Error</span>

                                                                                <pre className="submission-error-text">
                                                                                    {result.error}
                                                                                </pre>

                                                                            </div>
                                                                        )}
                                                                    </>
                                                                )}

                                                            </div>

                                                        )
                                                    )}

                                                </div>

                                            </div>
                                        )}


                                        <div className="submission-section">

                                            <h2>Your Submitted Code</h2>

                                            <pre className="submitted-code">
                                                {codes[language]}
                                            </pre>

                                        </div>

                                    </>
                                )}

                            </div>
                        )}

                    {activeTab === "submissions" && (

                        <div className="submissions-content">

                            <div className="submissions-header">

                                <h2>
                                    Submissions
                                </h2>

                                <span>
                                    {submissions.length} submission
                                    {submissions.length !== 1 ? "s" : ""}
                                </span>

                            </div>


                            {submissionsLoading && (

                                <div className="submissions-message">
                                    Loading submissions...
                                </div>

                            )}


                            {!submissionsLoading &&
                                submissionsError && (

                                    <div className="submissions-message error">
                                        {submissionsError}
                                    </div>

                                )}


                            {!submissionsLoading &&
                                !submissionsError &&
                                submissions.length === 0 && (

                                    <div className="submissions-empty">

                                        <div className="submissions-empty-icon">
                                            📝
                                        </div>

                                        <h3>
                                            No submissions yet
                                        </h3>

                                        <p>
                                            Submit your solution to see
                                            your submission history here.
                                        </p>

                                    </div>

                                )}


                            {!submissionsLoading &&
                                !submissionsError &&
                                submissions.length > 0 && (

                                    <div className="submissions-list">

                                        {submissions.map((submission) => (

                                            <div
                                                className="submission-item"
                                                key={submission.submission_id}
                                            >

                                                <div className="submission-item-left">

                                                    <div
                                                        className={`submission-status ${submission.status === "Accepted"
                                                            ? "accepted"
                                                            : "failed"
                                                            }`}
                                                    >

                                                        {submission.status === "Accepted"
                                                            ? "✓ Accepted"
                                                            : "✕ " + submission.status}

                                                    </div>


                                                    <div className="submission-language">

                                                        {submission.language === "cpp"
                                                            ? "C++"
                                                            : submission.language}

                                                    </div>

                                                </div>


                                                <div className="submission-item-middle">

                                                    <span>
                                                        {submission.passed_tests}
                                                        /
                                                        {submission.total_tests}
                                                        {" test cases"}
                                                    </span>

                                                </div>


                                                <div className="submission-item-right">

                                                    {new Date(
                                                        submission.submitted_at
                                                    ).toLocaleString()}

                                                </div>

                                            </div>

                                        ))}

                                    </div>

                                )}

                        </div>

                    )}
                   {activeTab === "solutions" && (
    <div className="solutions-content">

        {solutionsLoading && (
            <div className="solutions-loading">
                Loading solutions...
            </div>
        )}

        {solutionsError && (
            <div className="solutions-error">
                {solutionsError}
            </div>
        )}

        {!solutionsLoading && !solutionsError && solutions.length === 0 && (
            <div className="no-solutions">
                No solutions available for this question.
            </div>
        )}

        {!solutionsLoading && !solutionsError && solutions.length > 0 && (
            <div className="solution-wrapper">

                {/* Approach */}
                <section className="solution-section">
                    <h3>💡 Approach</h3>

                    <p>
                        {solutions[0].approach}
                    </p>
                </section>


                {/* Explanation */}
                <section className="solution-section">
                    <h3>📖 Explanation</h3>

                    <p>
                        {solutions[0].explanation}
                    </p>
                </section>


                {/* Complexity */}
                <section className="solution-section">
                    <h3>⏱️ Complexity</h3>

                    <div className="complexity-box">

                        <div>
                            <strong>Time:</strong>{" "}
                            {solutions[0].time_complexity}
                        </div>

                        <div>
                            <strong>Space:</strong>{" "}
                            {solutions[0].space_complexity}
                        </div>

                    </div>
                </section>


                {/* Language Solutions */}
                <section className="solution-section">

                    <h3>💻 Solutions</h3>

                    {solutions.map((solution) => {

                        const languageNames = {
                            cpp: "C++",
                            java: "Java",
                            python: "Python",
                            javascript: "JavaScript"
                        };

                        return (
                            <div
                                className="language-solution"
                                key={solution.solution_id}
                            >

                                <div className="language-title">
                                    {languageNames[solution.language] ||
                                        solution.language}
                                </div>

                                <pre>
                                    <code>
                                        {solution.code}
                                    </code>
                                </pre>

                            </div>
                        );

                    })}

                </section>

            </div>
        )}

    </div>
)}

                </section>


                {/* RESIZABLE DIVIDER */}

                <div
                    className="problem-resize-divider"
                    onMouseDown={handleMouseDown}
                    title="Drag to resize"
                >
                    <div className="resize-handle">
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                </div>


                {/* RIGHT EDITOR PANEL */}

                {/* RIGHT EDITOR PANEL */}

                <section className="problem-editor">

                    {/* EDITOR HEADER */}

                    <div className="editor-header">

                        <select
                            className="editor-language-select"
                            value={language}
                            onChange={(e) => setLanguage(e.target.value)}
                        >

                            <option value="cpp">
                                C++
                            </option>

                            <option value="java">
                                Java
                            </option>

                            <option value="python">
                                Python
                            </option>

                            <option value="javascript">
                                JavaScript
                            </option>

                        </select>

                    </div>


                    {/* CODE EDITOR */}

                    <div className="editor-code-container">

                        {codeLoading ? (

                            <div className="editor-loading">
                                Loading code...
                            </div>

                        ) : (

                            <Editor
                                height="100%"
                                language={language}
                                value={codes[language]}
                                onChange={(value) => {
                                    setCodes((previousCodes) => ({
                                        ...previousCodes,
                                        [language]: value || ""
                                    }));
                                }}
                                theme="vs-dark"

                                options={{
                                    fontSize: 14,

                                    minimap: {
                                        enabled: true
                                    },

                                    automaticLayout: true,

                                    scrollBeyondLastLine: false,

                                    wordWrap: "off",

                                    tabSize: 4,

                                    insertSpaces: true,

                                    padding: {
                                        top: 12
                                    }
                                }}
                            />

                        )}

                    </div>

                    <div
                        className={`editor-output-wrapper ${outputOpen ? "open" : "closed"
                            }`}
                        style={
                            outputOpen
                                ? { height: `${outputHeight}px` }
                                : { height: "42px" }
                        }
                    >

                        {/* =========================================
        OUTPUT RESIZE HANDLE
    ========================================= */}

                        {outputOpen && (
                            <div
                                className="editor-output-resize-divider"
                                onMouseDown={handleOutputResizeStart}
                                title="Drag to resize output"
                            >
                                <div className="output-resize-handle">
                                    <span></span>
                                    <span></span>
                                    <span></span>
                                </div>
                            </div>
                        )}


                        {/* =========================================
        OUTPUT HEADER
    ========================================= */}

                        <div
                            className="editor-output-header"
                            onClick={() => {

                                setOutputOpen(
                                    (previous) => !previous
                                );

                            }}
                        >

                            <div className="editor-output-header-left">

                                <span className="output-chevron">
                                    {outputOpen ? "⌄" : "›"}
                                </span>

                                <span>
                                    Output
                                </span>

                            </div>


                            {outputOpen && (
                                <span className="output-header-status">

                                    {isRunning
                                        ? "Running..."
                                        : exampleResults.length > 0
                                            ? `${exampleResults.filter(
                                                (result) => result.passed
                                            ).length}/${exampleResults.length} passed`
                                            : ""
                                    }

                                </span>
                            )}

                        </div>


                        {/* =========================================
        OUTPUT CONTENT
    ========================================= */}

                        {outputOpen && (

                            <div className="editor-output-content">

                                {isRunning && (

                                    <div className="output-status">

                                        Running examples...

                                    </div>

                                )}


                                {!isRunning && runError && (

                                    <pre className="run-error">
                                        {runError}
                                    </pre>

                                )}


                                {!isRunning &&
                                    !runError &&
                                    exampleResults.length > 0 && (

                                        <div className="example-results">

                                            <div className="run-summary">

                                                {exampleResults.every(
                                                    (result) => result.passed
                                                )
                                                    ? "✓ All examples passed"
                                                    : "✗ Some examples failed"}

                                            </div>


                                            {exampleResults.map((result) => (

                                                <div
                                                    className={`example-result ${result.passed
                                                        ? "passed"
                                                        : "failed"
                                                        }`}
                                                    key={result.testCaseId}
                                                >

                                                    <div className="example-result-header">

                                                        <strong>
                                                            Test Case {result.testCaseNumber}
                                                        </strong>

                                                        <span>
                                                            {result.passed
                                                                ? "✓ Passed"
                                                                : `✗ ${result.status}`}
                                                        </span>

                                                    </div>


                                                    <div className="example-result-block">

                                                        <div className="example-result-label">
                                                            Input
                                                        </div>

                                                        <pre>
                                                            {result.input ||
                                                                "(no input)"}
                                                        </pre>

                                                    </div>


                                                    <div className="example-result-block">

                                                        <div className="example-result-label">
                                                            Expected Output
                                                        </div>

                                                        <pre>
                                                            {result.expectedOutput}
                                                        </pre>

                                                    </div>


                                                    <div className="example-result-block">

                                                        <div className="example-result-label">
                                                            Your Output
                                                        </div>

                                                        <pre>
                                                            {result.actualOutput ||
                                                                "(no output)"}
                                                        </pre>

                                                    </div>


                                                    {!result.passed &&
                                                        result.error && (

                                                            <div className="example-result-block">

                                                                <div className="example-result-label">
                                                                    Error
                                                                </div>

                                                                <pre className="run-error">
                                                                    {result.error}
                                                                </pre>

                                                            </div>

                                                        )}

                                                </div>

                                            ))}

                                        </div>

                                    )}


                                {!isRunning &&
                                    !runError &&
                                    exampleResults.length === 0 && (

                                        <div className="output-placeholder">

                                            Run your code to test it against
                                            the question examples.

                                        </div>

                                    )}

                            </div>

                        )}

                    </div>




                </section>

            </div>

        </div>
    );
}

export default QuestionPage;