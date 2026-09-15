import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PublicNavbar from "../components/PublicNavbar";

function Dashboard() {

    /* =========================================
       STATE
    ========================================= */

    const [topics, setTopics] = useState([]);

    const [selectedTopic, setSelectedTopic] = useState("all");

    const [questions, setQuestions] = useState([]);

    const [searchKeyword, setSearchKeyword] = useState("");

    const [difficulty, setDifficulty] = useState("all");

    const [loading, setLoading] = useState(false);

    const [dashboardStats, setDashboardStats] = useState({
        totalSolved: 0,
        easySolved: 0,
        mediumSolved: 0,
        hardSolved: 0
    });

    const [dashboardLoading, setDashboardLoading] = useState(true);
    const navigate = useNavigate();
    const [revisionLoading, setRevisionLoading] = useState(false);


    /* =========================================
       ADMIN ROLE
    ========================================= */

    const getUserRole = () => {

        try {

            const token = localStorage.getItem("token");

            if (!token) {
                return null;
            }

            const payload = JSON.parse(
                atob(token.split(".")[1])
            );

            return payload.role;

        } catch (error) {

            console.error(
                "Failed to read user role:",
                error
            );

            return null;

        }

    };

    const isAdmin = getUserRole() === "admin";


    /* =========================================
       FETCH TOPICS
    ========================================= */

    useEffect(() => {

        const fetchTopics = async () => {

            try {

                const response = await fetch(
                    "http://localhost:5000/api/topics"
                );

                const data = await response.json();

                if (data.success) {

                    setTopics(data.topics);

                }

            } catch (error) {

                console.error(
                    "Failed to fetch topics:",
                    error
                );

            }

        };

        fetchTopics();

    }, []);
    useEffect(() => {

        const fetchDashboardStats = async () => {

            try {

                const token = localStorage.getItem("token");

                const response = await fetch(
                    "http://localhost:5000/api/dashboard",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                const data = await response.json();

                if (data.success) {

                    setDashboardStats({
                        totalSolved: data.dashboard.totalSolved,
                        easySolved: data.dashboard.easySolved,
                        mediumSolved: data.dashboard.mediumSolved,
                        hardSolved: data.dashboard.hardSolved
                    });

                }

            } catch (error) {

                console.error(
                    "Failed to fetch dashboard statistics:",
                    error
                );

            } finally {

                setDashboardLoading(false);

            }

        };

        fetchDashboardStats();

    }, []);


    /* =========================================
       GET TOKEN
    ========================================= */

    const getToken = () => {

        return localStorage.getItem("token");

    };


    /* =========================================
       FETCH QUESTIONS
    ========================================= */

    const fetchQuestions = async () => {

        setLoading(true);

        try {

            let url =
                "http://localhost:5000/api/questions";


            /*
             * Topic is used as the base API filter.
             *
             * Search and difficulty are applied
             * on the returned real database data.
             */

            if (selectedTopic !== "all") {

                const topic = topics.find(
                    (item) =>
                        item.topic_id === selectedTopic
                );

                if (topic) {

                    url =
                        `http://localhost:5000/api/questions/topic/${encodeURIComponent(
                            topic.topic_name
                        )}`;

                }

            }


            const token = getToken();


            const response = await fetch(url, {

                headers: {

                    Authorization: `Bearer ${token}`

                }

            });


            const data = await response.json();


            if (data.success) {

                setQuestions(data.questions);

            } else {

                setQuestions([]);

            }

        } catch (error) {

            console.error(
                "Failed to fetch questions:",
                error
            );

            setQuestions([]);

        } finally {

            setLoading(false);

        }

    };


    /* =========================================
       FETCH WHEN TOPIC CHANGES
    ========================================= */

    useEffect(() => {

        if (topics.length > 0) {

            fetchQuestions();

        }

    }, [selectedTopic, topics]);


    /* =========================================
       SEARCH
    ========================================= */

    const handleSearch = (event) => {

        setSearchKeyword(event.target.value);

    };


    /* =========================================
       CLEAR SEARCH
    ========================================= */

    const clearSearch = () => {

        setSearchKeyword("");

    };


    /* =========================================
       DIFFICULTY
    ========================================= */

    const handleDifficultyChange = (event) => {

        setDifficulty(event.target.value);

    };


    /* =========================================
       FILTER QUESTIONS
    ========================================= */

    const filteredQuestions = questions.filter(
        (question) => {

            /*
             * SEARCH FILTER
             */

            const matchesSearch =
                question.title
                    .toLowerCase()
                    .includes(
                        searchKeyword
                            .toLowerCase()
                            .trim()
                    );


            /*
             * DIFFICULTY FILTER
             */

            const matchesDifficulty =
                difficulty === "all" ||
                question.difficulty === difficulty;


            return (
                matchesSearch &&
                matchesDifficulty
            );

        }
    );


    /* =========================================
       DIFFICULTY CLASS
    ========================================= */

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

    // =====================================================
    // TOGGLE REVISION
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

        console.log(
            "REVISION RESPONSE:",
            data
        );

        if (!response.ok || !data.success) {

            console.error(
                "Revision failed:",
                data.message
            );

            return;
        }

        setQuestions((previousQuestions) =>
            previousQuestions.map((question) =>
                question.question_id === questionId
                    ? {
                        ...question,
                        isRevision: data.isRevision
                    }
                    : question
            )
        );

    } catch (error) {

        console.error(
            "Revision request failed:",
            error
        );

    }
};


    return (

        <div className="dashboard">


            <PublicNavbar />


            {/* =========================================
               DASHBOARD CONTENT
            ========================================= */}

            <div className="dashboard-content">


                {/* =========================================
                   SIDEBAR
                ========================================= */}

                <aside className="sidebar">

                    <div className="sidebar-menu">

                        <button className="sidebar-item active">

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


                        <button
                            className="sidebar-item"
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


                        <button
                            className="sidebar-item"
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


                        <button
                            className="sidebar-item"
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


                    <div className="sidebar-section-title">
                        MY LISTS
                    





                    <button
                        className="sidebar-item"
                        onClick={() => navigate("/revision")}
                    >

                        <svg
                            width="19"
                            height="19"
                            viewBox="0 0 24 24"
                            fill="none"
                        >

                            <path
                                d="M12 3.5L14.6 8.8L20.5 9.7L16.2 14L17.2 20L12 17.2L6.8 20L7.8 14L3.5 9.7L9.4 8.8L12 3.5Z"
                                stroke="currentColor"
                                strokeWidth="1.7"
                                strokeLinejoin="round"
                            />

                        </svg>

                        <span>
                            Revision
                        </span>

                    </button>

                    </div>


                    {/* =========================================
                       ADMIN SECTION
                       Visible only for admin users
                    ========================================= */}

                    {isAdmin && (


                        <>


                            <div className="sidebar-section-title admin-section-title ">
                                ADMIN
                            </div>


                            {/* ADD QUESTION */}

                            <button
                                className="sidebar-item admin-sidebar-item"
                                onClick={() =>
                                    navigate("/admin/questions/add")
                                }
                            >

                                <svg
                                    width="19"
                                    height="19"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                >

                                    <path
                                        d="M12 5V19"
                                        stroke="currentColor"
                                        strokeWidth="1.8"
                                        strokeLinecap="round"
                                    />

                                    <path
                                        d="M5 12H19"
                                        stroke="currentColor"
                                        strokeWidth="1.8"
                                        strokeLinecap="round"
                                    />

                                </svg>

                                <span>
                                    Add Question
                                </span>

                            </button>


                            {/* MANAGE QUESTIONS */}

                            <button
                                className="sidebar-item admin-sidebar-item"
                                onClick={() =>
                                    navigate("/admin/questions")
                                }
                            >

                                <svg
                                    width="19"
                                    height="19"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                >

                                    <path
                                        d="M4 6C4 4.9 4.9 4 6 4H18C19.1 4 20 4.9 20 6V18C20 19.1 19.1 20 18 20H6C4.9 20 4 19.1 4 18V6Z"
                                        stroke="currentColor"
                                        strokeWidth="1.7"
                                    />

                                    <path
                                        d="M8 8H16"
                                        stroke="currentColor"
                                        strokeWidth="1.7"
                                        strokeLinecap="round"
                                    />

                                    <path
                                        d="M8 12H16"
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
                                    Manage Questions
                                </span>

                            </button>



                        </>

                    )}

                </aside>


                {/* =========================================
                   MAIN
                ========================================= */}

                <main className="dashboard-main">


                    {/* =========================================
                       WELCOME CARD
                    ========================================= */}

                    <section className="welcome-card">

                        <div className="welcome-content">

                            <h1>
                                - <span>Most Important</span>
                                <br />
                                Interview Questions
                            </h1>

                            <p className="welcome-description">
                                • All DSA topics covered
                            </p>

                            <p className="placement-question">
                                • Will this be enough for Placements, is this for me?
                            </p>

                            <div className="placement-answer">

                                <p>
                                    → Yes, these problems cover all the major types of DSA problems asked.
                                </p>

                                <p>
                                    → If doing revision: complete this sheet in 30 days
                                </p>

                                <p>
                                    → First timers can take up to 2 months
                                </p>

                            </div>


                            <div className="solving-now">

                                <div className="user-avatars">

                                    <div className="avatar avatar-one">
                                        A
                                    </div>

                                    <div className="avatar avatar-two">
                                        M
                                    </div>

                                    <div className="avatar avatar-three">
                                        R
                                    </div>

                                    <div className="avatar avatar-four">
                                        S
                                    </div>

                                </div>

                                <span>
                                    686+ people solving now
                                </span>

                            </div>

                        </div>

                    </section>


                    {/* =========================================
                       TOPIC NAVIGATION
                    ========================================= */}

                    <section className="topic-navigation">

                        <button
                            className={`topic-item ${selectedTopic === "all"
                                ? "active"
                                : ""
                                }`}
                            onClick={() =>
                                setSelectedTopic("all")
                            }
                        >
                            All Topics
                        </button>


                        {topics.map((topic) => (

                            <button
                                key={topic.topic_id}
                                className={`topic-item ${selectedTopic === topic.topic_id
                                    ? "active"
                                    : ""
                                    }`}
                                onClick={() =>
                                    setSelectedTopic(
                                        topic.topic_id
                                    )
                                }
                            >

                                <span>
                                    {topic.topic_name}
                                </span>

                                <span className="topic-count">
                                    {topic.question_count}
                                </span>

                            </button>

                        ))}

                    </section>


                    {/* =========================================
                       SEARCH + FILTER
                    ========================================= */}

                    <section className="question-filters">


                        {/* SEARCH */}

                        <div className="question-search">

                            <svg
                                width="18"
                                height="18"
                                viewBox="0 0 24 24"
                                fill="none"
                            >

                                <circle
                                    cx="11"
                                    cy="11"
                                    r="7"
                                    stroke="currentColor"
                                    strokeWidth="1.8"
                                />

                                <path
                                    d="M16.5 16.5L21 21"
                                    stroke="currentColor"
                                    strokeWidth="1.8"
                                    strokeLinecap="round"
                                />

                            </svg>


                            <input
                                type="text"
                                placeholder="Search questions..."
                                value={searchKeyword}
                                onChange={handleSearch}
                            />


                            {searchKeyword && (

                                <button
                                    className="clear-search"
                                    onClick={clearSearch}
                                >
                                    ×
                                </button>

                            )}

                        </div>


                        {/* DIFFICULTY */}

                        <div className="difficulty-filter">

                            <select
                                value={difficulty}
                                onChange={
                                    handleDifficultyChange
                                }
                            >

                                <option value="all">
                                    All Difficulties
                                </option>

                                <option value="Easy">
                                    Easy
                                </option>

                                <option value="Medium">
                                    Medium
                                </option>

                                <option value="Hard">
                                    Hard
                                </option>

                            </select>

                        </div>

                    </section>


                    {/* =========================================
                       QUESTION TABLE
                    ========================================= */}

                    <section className="question-table-container">


                        {loading ? (

                            <div className="question-message">
                                Loading questions...
                            </div>

                        ) : filteredQuestions.length === 0 ? (

                            <div className="question-message">
                                No questions found.
                            </div>

                        ) : (

                            <div className="question-table-wrapper">

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
                                                Rivision
                                            </th>

                                        </tr>

                                    </thead>


                                    <tbody>

                                        {filteredQuestions.map(
                                            (question, index) => (

                                                <tr
                                                    key={
                                                        question.question_id
                                                    }
                                                >


                                                    {/* SOLVED */}

                                                    <td className="solved-column">

                                                        {Number(question.isSolved) === 1 ? (
                                                            <span className="solved-check">✓</span>
                                                        ) : null}

                                                    </td>


                                                    {/* NUMBER */}

                                                    <td className="number-column">

                                                        {index + 1}

                                                    </td>


                                                    {/* QUESTION */}

                                                    <td className="question-column">

                                                        <span
                                                            className="question-title"
                                                            onClick={() =>
                                                                navigate(`/question/${question.question_id}`)
                                                            }
                                                        >
                                                            {question.title}
                                                        </span>

                                                    </td>


                                                    {/* DIFFICULTY */}

                                                    <td className="difficulty-column">

                                                        <span
                                                            className={getDifficultyClass(
                                                                question.difficulty
                                                            )}
                                                        >
                                                            {
                                                                question.difficulty
                                                            }
                                                        </span>

                                                    </td>


                                                    {/* YOUTUBE */}

                                                    <td className="video-column">

                                                        {question.youtube_link ? (

                                                            <a
                                                                href={
                                                                    question.youtube_link
                                                                }
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="youtube-link"
                                                                title="Watch solution"
                                                            >

                                                                <svg
                                                                    width="19"
                                                                    height="19"
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


                                                    {/* FAVOURITE */}

                                                    <td className="favorite-column">

                                                        <button
                                                            type="button"
                                                            className={
                                                                question.isRevision
                                                                    ? "revision-icon revision-saved"
                                                                    : "revision-icon"
                                                            }
                                                            onClick={() =>
                                                                handleRevisionToggle(
                                                                    question.question_id
                                                                )
                                                            }
                                                            title={
                                                                question.isRevision
                                                                    ? "Remove from Revision"
                                                                    : "Add to Revision"
                                                            }
                                                        >

                                                            {question.isRevision ? "★" : "☆"}

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

                {/* =========================================
                   RIGHT SIDEBAR
                ========================================= */}

                <aside className="right-sidebar">


                    {/* =========================================
                       DSA PROGRESS
                    ========================================= */}

                    <section className="progress-card">

                        <h2>
                            DSA Progress
                        </h2>


                        <div className="progress-total">

                            <div className="progress-number">

                                {dashboardLoading
                                    ? "—"
                                    : dashboardStats.totalSolved}

                            </div>

                            <div className="progress-label">
                                solved
                            </div>

                        </div>


                        <div className="progress-difficulties">


                            {/* EASY */}

                            <div className="progress-row">

                                <div className="progress-name">

                                    <span className="progress-dot easy-dot"></span>

                                    <span>
                                        Easy
                                    </span>

                                </div>

                                <span className="progress-count">
                                    {dashboardStats.easySolved}
                                </span>

                            </div>


                            {/* MEDIUM */}

                            <div className="progress-row">

                                <div className="progress-name">

                                    <span className="progress-dot medium-dot"></span>

                                    <span>
                                        Medium
                                    </span>

                                </div>

                                <span className="progress-count">
                                    {dashboardStats.mediumSolved}
                                </span>

                            </div>


                            {/* HARD */}

                            <div className="progress-row">

                                <div className="progress-name">

                                    <span className="progress-dot hard-dot"></span>

                                    <span>
                                        Hard
                                    </span>

                                </div>

                                <span className="progress-count">
                                    {dashboardStats.hardSolved}
                                </span>

                            </div>

                        </div>

                    </section>


                    {/* =========================================
                       CALENDAR
                    ========================================= */}

                    <section className="calendar-card">

                        <h2>
                            August 2026
                        </h2>


                        <div className="calendar-weekdays">

                            <span>S</span>
                            <span>M</span>
                            <span>T</span>
                            <span>W</span>
                            <span>T</span>
                            <span>F</span>
                            <span>S</span>

                        </div>


                        <div className="calendar-days">

                            {/* August 1, 2026 = Saturday */}

                            <span className="calendar-empty"></span>
                            <span className="calendar-empty"></span>
                            <span className="calendar-empty"></span>
                            <span className="calendar-empty"></span>
                            <span className="calendar-empty"></span>
                            <span className="calendar-empty"></span>

                            <span>1</span>

                            <span>2</span>
                            <span>3</span>
                            <span>4</span>
                            <span>5</span>
                            <span>6</span>
                            <span>7</span>
                            <span>8</span>

                            <span>9</span>
                            <span>10</span>
                            <span>11</span>
                            <span>12</span>
                            <span>13</span>
                            <span>14</span>
                            <span>15</span>

                            <span>16</span>
                            <span>17</span>
                            <span>18</span>
                            <span>19</span>
                            <span>20</span>
                            <span>21</span>
                            <span>22</span>

                            <span>23</span>
                            <span>24</span>
                            <span>25</span>
                            <span>26</span>
                            <span>27</span>
                            <span>28</span>
                            <span>29</span>

                            <span>30</span>
                            <span>31</span>

                        </div>

                    </section>

                </aside>



            </div>

        </div>
    );
}

export default Dashboard;