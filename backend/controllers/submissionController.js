const Submission = require("../models/Submission");


// Create submission
const createSubmission = (req, res) => {

    const {
        user_id,
        question_id,
        language,
        code,
        status,
        execution_time,
        memory_used
    } = req.body;


    // Validate required fields
    if (
        !user_id ||
        !question_id ||
        !language ||
        !code ||
        !status
    ) {
        return res.status(400).json({
            success: false,
            message: "user_id, question_id, language, code and status are required"
        });
    }


    Submission.createSubmission(
        user_id,
        question_id,
        language,
        code,
        status,
        execution_time || null,
        memory_used || null,
        (err, result) => {

            if (err) {

                console.error(err);

                return res.status(500).json({
                    success: false,
                    message: "Failed to create submission"
                });
            }


            res.status(201).json({
                success: true,
                message: "Submission created successfully",
                submission_id: result.insertId
            });
        }
    );
};


// Get user's submissions
const getUserSubmissions = (req, res) => {

    const { userId } = req.params;


    Submission.getUserSubmissions(
        userId,
        (err, results) => {

            if (err) {

                console.error(err);

                return res.status(500).json({
                    success: false,
                    message: "Failed to fetch submissions"
                });
            }


            res.status(200).json({
                success: true,
                count: results.length,
                submissions: results
            });
        }
    );
};


// Get submissions for a question
const getQuestionSubmissions = (req, res) => {

    const userId =
        req.user.user_id;

    const { questionId } =
        req.params;


    Submission.getQuestionSubmissions(
        userId,
        questionId,
        (err, results) => {

            if (err) {

                console.error(err);

                return res.status(500).json({
                    success: false,
                    message:
                        "Failed to fetch question submissions"
                });
            }


            res.status(200).json({

                success: true,

                count:
                    results.length,

                submissions:
                    results

            });

        }
    );
};


module.exports = {
    createSubmission,
    getUserSubmissions,
    getQuestionSubmissions
};