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


function Notes() {

    const navigate =
        useNavigate();

    const isAdmin =
        getUserRole() === "admin";

    const token =
        localStorage.getItem("token");


    const [notes, setNotes] =
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
            image: null,
            pdf: null
        });


    const loadNotes = async () => {

        try {

            setLoading(true);
            setError("");

            const response = await fetch(
                "http://localhost:5000/api/notes"
            );


            const contentType =
                response.headers.get("content-type") || "";


            if (!contentType.includes("application/json")) {

                const text =
                    await response.text();

                console.error(
                    "Server returned non-JSON response:",
                    text
                );

                throw new Error(
                    `Notes API returned ${response.status} instead of JSON. Check that the backend is running on port 5000 and /api/notes exists.`
                );

            }


            const data =
                await response.json();


            if (
                !response.ok ||
                !data.success
            ) {

                throw new Error(
                    data.message ||
                    "Failed to load notes"
                );

            }


            setNotes(
                data.notes || []
            );


        } catch (err) {

            console.error(
                "Failed to load notes:",
                err
            );

            setError(
                err.message ||
                "Failed to load notes."
            );

        } finally {

            setLoading(false);

        }

    };


    useEffect(() => {
        loadNotes();
    }, []);


    const handleFormChange = (event) => {

        const {
            name,
            value,
            files
        } = event.target;

        setForm((previous) => ({
            ...previous,
            [name]:
                files
                    ? files[0] || null
                    : value
        }));
    };


    const resetForm = () => {

        setForm({
            title: "",
            description: "",
            image: null,
            pdf: null
        });

        const imageInput =
            document.getElementById(
                "note-image"
            );

        const pdfInput =
            document.getElementById(
                "note-pdf"
            );

        if (imageInput) {
            imageInput.value = "";
        }

        if (pdfInput) {
            pdfInput.value = "";
        }
    };


    const handleAddNote =
        async (event) => {

            event.preventDefault();

            setMessage("");
            setError("");


            if (!form.title.trim()) {

                setError(
                    "Note title is required."
                );

                return;
            }


            if (!form.pdf) {

                setError(
                    "Please select a PDF file."
                );

                return;
            }


            if (
                form.pdf.type !==
                "application/pdf"
            ) {

                setError(
                    "Only PDF files are allowed."
                );

                return;
            }


            if (
                form.pdf.size >
                10 * 1024 * 1024
            ) {

                setError(
                    "PDF must be smaller than 10 MB."
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

            if (form.image) {
                formData.append(
                    "image",
                    form.image
                );
            }

            formData.append(
                "pdf",
                form.pdf
            );


            setSaving(true);


            try {

                const response =
                    await fetch(
                        `${API}/api/admin/notes`,
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
                        "Failed to add note"
                    );

                }


                setMessage(
                    "Note added successfully."
                );

                setShowAddForm(false);

                resetForm();

                await loadNotes();


            } catch (err) {

                console.error(err);

                setError(
                    err.message ||
                    "Failed to add note."
                );

            } finally {

                setSaving(false);

            }
        };


    const handleDeleteNote =
        async (note) => {

            const confirmed =
                window.confirm(
                    `Delete "${note.title}"?`
                );

            if (!confirmed) {
                return;
            }


            setMessage("");
            setError("");


            try {

                const response =
                    await fetch(
                        `${API}/api/admin/notes/${note.note_id}`,
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
                        "Failed to delete note"
                    );

                }


                setMessage(
                    "Note deleted successfully."
                );


                setNotes(
                    (previous) =>
                        previous.filter(
                            (item) =>
                                item.note_id !==
                                note.note_id
                        )
                );


            } catch (err) {

                console.error(err);

                setError(
                    err.message ||
                    "Failed to delete note."
                );

            }
        };


    return (

        <PageLayout activePage="notes">

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
                                    : "+ Add Note"}
                            </button>

                        )}

                    </div>


                    <h1>
                        Download Handbooks And Notes
                    </h1>


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


                {/* ADMIN ADD FORM */}

                {/* ADMIN ADD NOTE MODAL */}

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
                                    <h2>Add New Note</h2>

                                    <p>
                                        Add a title, description,
                                        picture and PDF material.
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


                            <form onSubmit={handleAddNote}>

                                <div className="resource-form-grid">

                                    <div className="resource-form-group">

                                        <label>
                                            Note Title *
                                        </label>

                                        <input
                                            type="text"
                                            name="title"
                                            value={form.title}
                                            onChange={handleFormChange}
                                            placeholder="Java Handbook"
                                            required
                                        />

                                    </div>


                                    <div className="resource-form-group">

                                        <label>
                                            Note Picture
                                        </label>

                                        <input
                                            id="note-image"
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
                                        placeholder="Java programming notes"
                                        rows="3"
                                    />

                                </div>


                                <div className="resource-form-group">

                                    <label>
                                        PDF Material *
                                    </label>

                                    <input
                                        id="note-pdf"
                                        type="file"
                                        name="pdf"
                                        accept="application/pdf,.pdf"
                                        onChange={handleFormChange}
                                        required
                                    />

                                    <small>
                                        PDF only • Max 10 MB
                                    </small>

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
                                            : "Add Note"}
                                    </button>

                                </div>

                            </form>

                        </div>

                    </div>

                )}


                {/* LOADING */}

                {loading && (

                    <div className="resource-message">
                        Loading notes...
                    </div>

                )}


                {/* EMPTY */}

                {!loading &&
                    !error &&
                    notes.length === 0 && (

                        <div className="resource-message">
                            No notes available.
                        </div>

                    )}


                {/* NOTES */}

                {!loading &&
                    notes.length > 0 && (

                        <div className="notes-grid">

                            {notes.map(
                                (note) => (

                                    <article
                                        className="notes-card"
                                        key={
                                            note.note_id
                                        }
                                    >

                                        <div className="notes-image">
                                            <img
                                                src={`http://localhost:5000${note.image_url}`}
                                                alt={note.title}
                                            />
                                        </div>


                                        <div className="notes-card-content">

                                            <h2>
                                                {note.title}
                                            </h2>


                                            <p>
                                                {
                                                    note.description ||
                                                    "Study material and notes."
                                                }
                                            </p>


                                            <div className="notes-card-footer">

                                                <span>
                                                    PDF Notes
                                                </span>


                                                <div className="notes-actions">

                                                    <a
                                                        href={
                                                            `${API}${note.pdf_url}`
                                                        }
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="notes-view-button"
                                                    >
                                                        👁 View File
                                                    </a>


                                                    <a
                                                        href={
                                                            `${API}/api/notes/${note.note_id}/download`
                                                        }
                                                        className="notes-download-button"
                                                    >
                                                        ⬇ Download
                                                    </a>

                                                </div>

                                            </div>


                                            {isAdmin && (

                                                <button
                                                    className="notes-delete-button"
                                                    onClick={() =>
                                                        handleDeleteNote(
                                                            note
                                                        )
                                                    }
                                                >
                                                    🗑 Delete Note
                                                </button>

                                            )}

                                        </div>

                                    </article>

                                )
                            )}

                        </div>

                    )}

            </div>

        </PageLayout>

    );
}


export default Notes;
