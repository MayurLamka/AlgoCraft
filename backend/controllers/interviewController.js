const fs = require("fs");
const path = require("path");

const Interview =
    require("../models/Interview");

const deleteUploadedFile = (url) => {
    if (!url) {
        return;
    }

    const relativePath =
        url.replace(/^\/uploads\//, "");

    const filePath =
        path.join(
            __dirname,
            "../uploads",
            relativePath
        );

    fs.unlink(filePath, (err) => {
        if (
            err &&
            err.code !== "ENOENT"
        ) {
            console.error(
                "Failed to delete interview image:",
                err
            );
        }
    });
};


// =====================================================
// GET ALL INTERVIEWS
// =====================================================

const getAllInterviews = (req, res) => {

    Interview.getAllInterviews(
        (err, results) => {

            if (err) {

                console.error(
                    "Failed to fetch interviews:",
                    err
                );

                return res.status(500).json({
                    success: false,
                    message:
                        "Failed to fetch interviews"
                });

            }

            res.status(200).json({
                success: true,
                interviews: results
            });

        }
    );

};


// =====================================================
// ADD INTERVIEW
// =====================================================

const createInterview = (req, res) => {

    const title =
        typeof req.body.title === "string"
            ? req.body.title.trim()
            : "";

    const description =
        typeof req.body.description === "string"
            ? req.body.description.trim()
            : "";

    const youtubeUrl =
        typeof req.body.youtube_url === "string"
            ? req.body.youtube_url.trim()
            : "";

    const imageFile =
        req.files?.image?.[0];

    if (!title || !youtubeUrl) {

        return res.status(400).json({
            success: false,
            message:
                "Title and YouTube URL are required"
        });

    }

    const imageUrl = req.files?.image?.[0]
        ? `/uploads/resources/interviews/${req.files.image[0].filename}`
        : null;
        
    Interview.createInterview(
        title,
        description || null,
        youtubeUrl,
        imageUrl,
        (err, result) => {

            if (err) {

                console.error(
                    "Failed to create interview:",
                    err
                );

                deleteUploadedFile(imageUrl);

                return res.status(500).json({
                    success: false,
                    message:
                        "Failed to add interview"
                });

            }

            res.status(201).json({
                success: true,
                message:
                    "Interview added successfully",
                interview_id:
                    result.insertId
            });

        }
    );

};


// =====================================================
// DELETE INTERVIEW
// =====================================================

const deleteInterview = (req, res) => {

    const interviewId =
        Number(req.params.id);

    if (
        !Number.isInteger(interviewId) ||
        interviewId <= 0
    ) {

        return res.status(400).json({
            success: false,
            message:
                "Invalid interview ID"
        });

    }

    Interview.getInterviewById(
        interviewId,
        (findErr, rows) => {

            if (findErr) {

                console.error(
                    "Failed to find interview:",
                    findErr
                );

                return res.status(500).json({
                    success: false,
                    message:
                        "Failed to delete interview"
                });

            }

            if (!rows.length) {

                return res.status(404).json({
                    success: false,
                    message:
                        "Interview not found"
                });

            }

            const interview =
                rows[0];

            Interview.deleteInterview(
                interviewId,
                (deleteErr, result) => {

                    if (deleteErr) {

                        console.error(
                            "Failed to delete interview:",
                            deleteErr
                        );

                        return res.status(500).json({
                            success: false,
                            message:
                                "Failed to delete interview"
                        });

                    }

                    if (
                        !result.affectedRows
                    ) {

                        return res.status(404).json({
                            success: false,
                            message:
                                "Interview not found"
                        });

                    }

                    deleteUploadedFile(
                        interview.image_url
                    );

                    res.status(200).json({
                        success: true,
                        message:
                            "Interview deleted successfully"
                    });

                }
            );

        }
    );

};


module.exports = {
    getAllInterviews,
    createInterview,
    deleteInterview
};
