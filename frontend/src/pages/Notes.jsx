import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";


function Notes() {

    const navigate = useNavigate();


    const [subjects, setSubjects] =
        useState([]);

    const [selectedSubject, setSelectedSubject] =
        useState(null);

    const [files, setFiles] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [filesLoading, setFilesLoading] =
        useState(false);


    /* =========================================
       GET SUBJECTS
    ========================================= */

    useEffect(() => {

        const fetchSubjects = async () => {

            try {

                const response =
                    await fetch(
                        "http://localhost:5000/api/notes/subjects"
                    );

                const data =
                    await response.json();


                if (data.success) {

                    setSubjects(
                        data.subjects
                    );

                }

            } catch (error) {

                console.error(
                    "Failed to load notes:",
                    error
                );

            } finally {

                setLoading(false);

            }

        };


        fetchSubjects();

    }, []);


    /* =========================================
       VIEW FILES
    ========================================= */

    const viewFiles = async (subject) => {

        setSelectedSubject(subject);

        setFilesLoading(true);

        try {

            const response =
                await fetch(
                    `http://localhost:5000/api/notes/subjects/${subject.subject_id}/files`
                );

            const data =
                await response.json();


            if (data.success) {

                setFiles(
                    data.files
                );

            }

        } catch (error) {

            console.error(error);

            setFiles([]);

        } finally {

            setFilesLoading(false);

        }

    };


    return (

        <div className="resource-page">


            {/* HEADER */}

            <div className="resource-page-header">

                <button
                    className="resource-back-button"
                    onClick={() =>
                        navigate("/dashboard")
                    }
                >
                    ← Dashboard
                </button>


                <h1>
                    Notes
                </h1>

                <p>
                    Study notes and useful resources
                    for technical subjects.
                </p>

            </div>


            {/* LOADING */}

            {loading && (

                <div className="resource-message">
                    Loading notes...
                </div>

            )}


            {/* SUBJECT GRID */}

            {!loading && (

                <div className="notes-grid">

                    {subjects.map(
                        (subject) => (

                            <div
                                className={
                                    `notes-card ${
                                        selectedSubject?.subject_id ===
                                        subject.subject_id
                                            ? "selected"
                                            : ""
                                    }`
                                }
                                key={
                                    subject.subject_id
                                }
                            >

                                <div className="notes-image">

                                    <img
                                        src={
                                            subject.image_url
                                        }
                                        alt={
                                            subject.subject_name
                                        }
                                    />

                                </div>


                                <div className="notes-card-content">

                                    <h2>
                                        {
                                            subject.subject_name
                                        }
                                    </h2>

                                    <p>
                                        {
                                            subject.description
                                        }
                                    </p>


                                    <div className="notes-card-footer">

                                        <span>
                                            View resources
                                        </span>

                                        <button
                                            onClick={() =>
                                                viewFiles(
                                                    subject
                                                )
                                            }
                                        >
                                            View Files →
                                        </button>

                                    </div>

                                </div>

                            </div>

                        )
                    )}

                </div>

            )}


            {/* FILE MODAL */}

            {selectedSubject && (

                <div className="notes-modal-overlay">

                    <div className="notes-modal">

                        <div className="notes-modal-header">

                            <div>

                                <h2>
                                    {
                                        selectedSubject.subject_name
                                    }
                                </h2>

                                <p>
                                    Available resources
                                </p>

                            </div>


                            <button
                                className="notes-modal-close"
                                onClick={() => {
                                    setSelectedSubject(null);
                                    setFiles([]);
                                }}
                            >
                                ×
                            </button>

                        </div>


                        {filesLoading ? (

                            <div className="resource-message">
                                Loading files...
                            </div>

                        ) : files.length === 0 ? (

                            <div className="resource-message">
                                No files available.
                            </div>

                        ) : (

                            <div className="notes-file-list">

                                {files.map(
                                    (file) => (

                                        <a
                                            key={
                                                file.file_id
                                            }
                                            href={
                                                file.file_url
                                            }
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="notes-file"
                                        >

                                            <span className="notes-file-icon">
                                                📄
                                            </span>

                                            <span>
                                                {
                                                    file.file_name
                                                }
                                            </span>

                                            <span>
                                                →
                                            </span>

                                        </a>

                                    )
                                )}

                            </div>

                        )}

                    </div>

                </div>

            )}

        </div>

    );

}


export default Notes;