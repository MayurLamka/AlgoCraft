import React, {
    useEffect,
    useState
} from "react";

import {
    useNavigate
} from "react-router-dom";

import PageLayout from "../components/PageLayout";

const API =
    "http://localhost:5000";


function getYouTubeId(url) {

    if (!url) {
        return null;
    }

    const match =
        url.match(
            /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&?/]+)/
        );

    return match
        ? match[1]
        : null;
}


function getUserRole() {

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

        return payload.role || null;

    } catch (error) {

        console.error(
            "Failed to read user role:",
            error
        );

        return null;

    }
}


function Interviews() {

    const navigate =
        useNavigate();

    const isAdmin =
        getUserRole() === "admin";

    const token =
        localStorage.getItem("token");


    const [interviews, setInterviews] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    const [message, setMessage] =
        useState("");

    const [showAddForm, setShowAddForm] =
        useState(false);

    const [saving, setSaving] =
        useState(false);


    const [form, setForm] =
        useState({
            title: "",
            description: "",
            youtube_url: "",
            image: null
        });


    const loadInterviews = async () => {

        try {

            setError("");

            const response =
                await fetch(
                    `${API}/api/interviews`
                );

            const data =
                await response.json();


            if (
                !response.ok ||
                !data.success
            ) {

                throw new Error(
                    data.message ||
                    "Failed to load interviews"
                );

            }


            setInterviews(
                data.interviews || []
            );


        } catch (err) {

            console.error(err);

            setError(
                err.message ||
                "Failed to load interviews."
            );

        } finally {

            setLoading(false);

        }

    };


    useEffect(() => {
        loadInterviews();
    }, []);


    const handleFormChange =
        (event) => {

            const {
                name,
                value,
                files
            } = event.target;


            setForm(
                (previous) => ({
                    ...previous,
                    [name]:
                        files
                            ? files[0] || null
                            : value
                })
            );

        };


    const resetForm = () => {

        setForm({
            title: "",
            description: "",
            youtube_url: "",
            image: null
        });


        const imageInput =
            document.getElementById(
                "interview-image"
            );


        if (imageInput) {
            imageInput.value = "";
        }

    };


    const handleAddInterview =
        async (event) => {

            event.preventDefault();

            setMessage("");
            setError("");


            if (!form.title.trim()) {

                setError(
                    "Interview title is required."
                );

                return;

            }


            if (!form.youtube_url.trim()) {

                setError(
                    "YouTube URL is required."
                );

                return;

            }


            if (
                form.image &&
                ![
                    "image/jpeg",
                    "image/png",
                    "image/webp"
                ].includes(form.image.type)
            ) {

                setError(
                    "Image must be JPG, PNG or WEBP."
                );

                return;

            }


            if (
                form.image &&
                form.image.size >
                5 * 1024 * 1024
            ) {

                setError(
                    "Image must be smaller than 5 MB."
                );

                return;

            }


            const formData =
                new FormData();


            formData.append(
                "title",
                form.title.trim()
            );

            formData.append(
                "description",
                form.description.trim()
            );

            formData.append(
                "youtube_url",
                form.youtube_url.trim()
            );


            if (form.image) {

                formData.append(
                    "image",
                    form.image
                );

            }


            setSaving(true);


            try {

                const response =
                    await fetch(
                        `${API}/api/admin/interviews`,
                        {
                            method: "POST",

                            headers: {
                                Authorization:
                                    `Bearer ${token}`
                            },

                            body: formData
                        }
                    );


                const data =
                    await response.json();


                if (
                    !response.ok ||
                    !data.success
                ) {

                    throw new Error(
                        data.message ||
                        "Failed to add interview"
                    );

                }


                setMessage(
                    "Interview added successfully."
                );

                setShowAddForm(false);

                resetForm();

                await loadInterviews();


            } catch (err) {

                console.error(err);

                setError(
                    err.message ||
                    "Failed to add interview."
                );

            } finally {

                setSaving(false);

            }

        };


    const handleDeleteInterview =
        async (interview) => {

            const confirmed =
                window.confirm(
                    `Delete "${interview.title}"?`
                );


            if (!confirmed) {
                return;
            }


            setMessage("");
            setError("");


            try {

                const response =
                    await fetch(
                        `${API}/api/admin/interviews/${interview.interview_id}`,
                        {
                            method: "DELETE",

                            headers: {
                                Authorization:
                                    `Bearer ${token}`
                            }
                        }
                    );


                const data =
                    await response.json();


                if (
                    !response.ok ||
                    !data.success
                ) {

                    throw new Error(
                        data.message ||
                        "Failed to delete interview"
                    );

                }


                setMessage(
                    "Interview deleted successfully."
                );


                setInterviews(
                    (previous) =>
                        previous.filter(
                            (item) =>
                                item.interview_id !==
                                interview.interview_id
                        )
                );


            } catch (err) {

                console.error(err);

                setError(
                    err.message ||
                    "Failed to delete interview."
                );

            }

        };


    return (
        <PageLayout activePage="interviews">

            <div className="resource-page">

                {/* HEADER */}

                <div className="resource-page-header">

                    <div className="resource-header-top">

                       


                        {isAdmin && (

                            <button
                                className="resource-admin-add-button"
                                onClick={() =>
                                    setShowAddForm(
                                        (previous) =>
                                            !previous
                                    )
                                }
                            >
                                {showAddForm
                                    ? "× Close"
                                    : "+ Add Interview"}
                            </button>

                        )}

                    </div>


                    <h1>
                        Interviews
                    </h1>

                    <p>
                        Learn from real interview experiences
                        and placement journeys.
                    </p>

                </div>


                {/* ALERTS */}

                {message && (

                    <div className="resource-alert resource-alert-success">
                        {message}
                    </div>

                )}


                {error && (

                    <div className="resource-alert resource-alert-error">
                        {error}
                    </div>

                )}




                {/* ADMIN ADD INTERVIEW MODAL */}

                {isAdmin && showAddForm && (

                    <div
                        className="resource-modal-overlay"
                        onClick={() => {
                            if (!saving) {
                                setShowAddForm(false);
                                resetForm();
                                setError("");
                            }
                        }}
                    >

                        <div
                            className="resource-modal"
                            onClick={(event) =>
                                event.stopPropagation()
                            }
                        >

                            <div className="resource-modal-header">

                                <div>
                                    <h2>Add Interview Video</h2>

                                    <p>
                                        Add a YouTube video,
                                        description and picture.
                                    </p>
                                </div>

                                <button
                                    type="button"
                                    className="resource-modal-close"
                                    onClick={() => {
                                        if (!saving) {
                                            setShowAddForm(false);
                                            resetForm();
                                            setError("");
                                        }
                                    }}
                                    disabled={saving}
                                >
                                    ×
                                </button>

                            </div>


                            <form onSubmit={handleAddInterview}>

                                <div className="resource-form-grid">

                                    <div className="resource-form-group">

                                        <label>
                                            Interview Title *
                                        </label>

                                        <input
                                            type="text"
                                            name="title"
                                            value={form.title}
                                            onChange={handleFormChange}
                                            placeholder="Google Interview Experience"
                                            required
                                        />

                                    </div>


                                    <div className="resource-form-group">

                                        <label>
                                            Interview Picture
                                        </label>

                                        <input
                                            id="interview-image"
                                            type="file"
                                            name="image"
                                            accept="image/jpeg,image/png,image/webp"
                                            onChange={handleFormChange}
                                        />

                                        <small>
                                            JPG, PNG or WEBP • Max 5 MB
                                        </small>

                                    </div>

                                </div>


                                <div className="resource-form-group">

                                    <label>
                                        Description
                                    </label>

                                    <textarea
                                        name="description"
                                        value={form.description}
                                        onChange={handleFormChange}
                                        placeholder="Short description"
                                        rows="3"
                                    />

                                </div>


                                <div className="resource-form-group">

                                    <label>
                                        YouTube URL *
                                    </label>

                                    <input
                                        type="url"
                                        name="youtube_url"
                                        value={form.youtube_url}
                                        onChange={handleFormChange}
                                        placeholder="https://www.youtube.com/watch?v=..."
                                        required
                                    />

                                </div>


                                <div className="resource-form-actions">

                                    <button
                                        type="button"
                                        className="resource-cancel-button"
                                        onClick={() => {
                                            setShowAddForm(false);
                                            resetForm();
                                            setError("");
                                        }}
                                        disabled={saving}
                                    >
                                        Cancel
                                    </button>


                                    <button
                                        type="submit"
                                        className="resource-submit-button"
                                        disabled={saving}
                                    >
                                        {saving
                                            ? "Adding..."
                                            : "Add Interview"}
                                    </button>

                                </div>

                            </form>

                        </div>

                    </div>

                )}


                {/* LOADING */}

                {loading && (

                    <div className="resource-message">
                        Loading interviews...
                    </div>

                )}


                {/* EMPTY */}

                {!loading &&
                    !error &&
                    interviews.length === 0 && (

                        <div className="resource-message">
                            No interviews available.
                        </div>

                    )}


                {/* INTERVIEW LIST */}

                {!loading &&
                    interviews.length > 0 && (

                        <div className="interview-list">

                            {interviews.map(
                                (interview) => {

                                    const youtubeId =
                                        getYouTubeId(
                                            interview.youtube_url
                                        );


                                    const youtubeThumbnail =
                                        youtubeId
                                            ? `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`
                                            : null;


                                    const image =
                                        interview.image_url
                                            ? `${API}${interview.image_url}`
                                            : youtubeThumbnail;

                                    console.log("INTERVIEW IMAGE URL:", image);
                                    console.log("DB IMAGE URL:", interview.image_url);

                                    return (

                                        <article
                                            className="interview-card"
                                            key={
                                                interview.interview_id
                                            }
                                        >

                                            <div className="interview-thumbnail">

                                                <a
                                                    href={interview.youtube_url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="interview-thumbnail"
                                                >
                                                    {image ? (
                                                        <img
                                                            src={image}
                                                            alt=""
                                                        />
                                                    ) : (
                                                        <div className="interview-placeholder">
                                                            ▶
                                                        </div>
                                                    )}
                                                </a>

                                            </div>


                                            <div className="interview-info">

                                                <h2>
                                                    {
                                                        interview.title
                                                    }
                                                </h2>


                                                <p>
                                                    {
                                                        interview.description ||
                                                        "Interview experience and placement journey."
                                                    }
                                                </p>


                                                <div className="interview-actions">

                                                    <a
                                                        href={
                                                            interview.youtube_url
                                                        }
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="watch-interview"
                                                    >
                                                        Watch on YouTube →
                                                    </a>


                                                    {isAdmin && (

                                                        <button
                                                            className="interview-delete-button"
                                                            onClick={() =>
                                                                handleDeleteInterview(
                                                                    interview
                                                                )
                                                            }
                                                        >
                                                            🗑 Delete
                                                        </button>

                                                    )}

                                                </div>

                                            </div>

                                        </article>

                                    );

                                }
                            )}

                        </div>

                    )}

            </div>

        </PageLayout >

    );

  
}


export default Interviews;
