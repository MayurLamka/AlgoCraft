const SavedQuestion = require("../models/SavedQuestion");


// ======================================
// Save Question
// ======================================
const saveQuestion = (req, res) => {

    const { question_id } = req.body;

    const userId = req.user.user_id;


    if (!question_id) {
        return res.status(400).json({
            success: false,
            message: "question_id is required"
        });
    }


    SavedQuestion.saveQuestion(
        userId,
        question_id,
        (err, result) => {

            if (err) {

                console.error(err);

                // Duplicate saved question
                if (err.code === "ER_DUP_ENTRY") {
                    return res.status(400).json({
                        success: false,
                        message: "Question already saved"
                    });
                }

                return res.status(500).json({
                    success: false,
                    message: "Failed to save question"
                });
            }


            res.status(201).json({
                success: true,
                message: "Question saved successfully"
            });

        }
    );
};


// ======================================
// Get Saved Questions
// ======================================
const getSavedQuestions = (req, res) => {

    const userId = req.user.user_id;


    SavedQuestion.getSavedQuestions(
        userId,
        (err, results) => {

            if (err) {

                console.error(err);

                return res.status(500).json({
                    success: false,
                    message: "Failed to fetch saved questions"
                });
            }


            res.status(200).json({
                success: true,
                count: results.length,
                savedQuestions: results
            });

        }
    );
};


// ======================================
// Remove Saved Question
// ======================================
const removeSavedQuestion = (req, res) => {

    const { questionId } = req.params;

    const userId = req.user.user_id;


    SavedQuestion.removeSavedQuestion(
        userId,
        questionId,
        (err, result) => {

            if (err) {

                console.error(err);

                return res.status(500).json({
                    success: false,
                    message: "Failed to remove saved question"
                });
            }


            if (result.affectedRows === 0) {
                return res.status(404).json({
                    success: false,
                    message: "Saved question not found"
                });
            }


            res.status(200).json({
                success: true,
                message: "Question removed from saved questions"
            });

        }
    );
};


module.exports = {
    saveQuestion,
    getSavedQuestions,
    removeSavedQuestion
};