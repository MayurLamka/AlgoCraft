import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";


function getYouTubeId(url) {

    if (!url) {
        return null;
    }

    const match =
        url.match(
            /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&?/]+)/
        );

    return match ? match[1] : null;
}


function Interviews() {

    const navigate = useNavigate();

    const [interviews, setInterviews] = useState([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");


    useEffect(() => {

        const fetchInterviews = async () => {

            try {

                const response =
                    await fetch(
                        "http://localhost:5000/api/interviews"
                    );

                const data =
                    await response.json();


                if (!response.ok ||
                    !data.success) {

                    throw new Error(
                        data.message ||
                        "Failed to load interviews"
                    );

                }


                setInterviews(
                    data.interviews || []
                );

            } catch (error) {

                console.error(error);

                setError(
                    "Failed to load interviews."
                );

            } finally {

                setLoading(false);

            }

        };


        fetchInterviews();

    }, []);


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
                    Interviews
                </h1>

                <p>
                    Learn from real interview experiences
                    and placement journeys.
                </p>

            </div>


            {/* LOADING */}

            {loading && (

                <div className="resource-message">
                    Loading interviews...
                </div>

            )}


            {/* ERROR */}

            {!loading && error && (

                <div className="resource-message resource-error">
                    {error}
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


            {/* INTERVIEWS */}

            {!loading &&
                !error &&

                <div className="interview-list">

                    {interviews.map(
                        (interview) => {

                            const youtubeId =
                                getYouTubeId(
                                    interview.youtube_url
                                );


                            const thumbnail =
                                youtubeId
                                    ? `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`
                                    : null;


                            return (

                                <div
                                    className="interview-card"
                                    key={
                                        interview.interview_id
                                    }
                                >

                                    <a
                                        href={
                                            interview.youtube_url
                                        }
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="interview-thumbnail"
                                    >

                                        {thumbnail ? (

                                            <img
                                                src={thumbnail}
                                                alt={
                                                    interview.title
                                                }
                                            />

                                        ) : (

                                            <div className="interview-placeholder">

                                                ▶

                                            </div>

                                        )}


                                        <div className="interview-play">

                                            ▶

                                        </div>

                                    </a>


                                    <div className="interview-info">

                                        <h2>
                                            {
                                                interview.title
                                            }
                                        </h2>

                                        <p>
                                            {
                                                interview.description
                                            }
                                        </p>

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

                                    </div>

                                </div>

                            );

                        }
                    )}

                </div>

            }

        </div>

    );

}


export default Interviews;