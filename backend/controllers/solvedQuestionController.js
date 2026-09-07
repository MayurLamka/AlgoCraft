const SolvedQuestion = require("../models/SolvedQuestion");


// Mark question as solved
const markSolved = (req, res) => {

    // Get user ID from JWT
    const userId = req.user.user_id;

    // Question ID comes from URL
    const { questionId } = req.params;

    // Validate question ID
    if (!questionId) {
        return res.status(400).json({
            success: false,
            message: "questionId is required"
        });
    }

    SolvedQuestion.markSolved(
        userId,
        questionId,
        (err, result) => {

            if (err) {

                // Duplicate entry
                if (err.code === "ER_DUP_ENTRY") {
                    return res.status(400).json({
                        success: false,
                        message: "Question is already marked as solved"
                    });
                }

                console.error(err);

                return res.status(500).json({
                    success: false,
                    message: "Failed to mark question as solved"
                });
            }

            res.status(201).json({
                success: true,
                message: "Question marked as solved successfully"
            });
        }
    );
};


// Get all solved questions of logged-in user
const getSolvedQuestions = (req, res) => {

    // Get user ID from JWT
    const userId = req.user.user_id;

    SolvedQuestion.getSolvedQuestions(
        userId,
        (err, results) => {

            if (err) {
                console.error(err);

                return res.status(500).json({
                    success: false,
                    message: "Failed to fetch solved questions"
                });
            }

            res.status(200).json({
                success: true,
                count: results.length,
                solvedQuestions: results
            });
        }
    );
};


// Check whether a question is solved
const checkSolved = (req, res) => {

    // Get user ID from JWT
    const userId = req.user.user_id;

    // Question ID comes from URL
    const { questionId } = req.params;

    SolvedQuestion.checkSolved(
        userId,
        questionId,
        (err, results) => {

            if (err) {
                console.error(err);

                return res.status(500).json({
                    success: false,
                    message: "Failed to check solved status"
                });
            }

            res.status(200).json({
                success: true,
                solved: results.length > 0
            });
        }
    );
};


module.exports = {
    markSolved,
    getSolvedQuestions,
    checkSolved
};