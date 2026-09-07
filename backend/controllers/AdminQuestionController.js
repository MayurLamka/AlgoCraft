const Question = require("../models/Question");


// Add new question
const createQuestion = (req, res) => {

    const {
        title,
        difficulty,
        description,
        youtube_link
    } = req.body;


    // Validate required fields
    if (!title || !difficulty) {
        return res.status(400).json({
            success: false,
            message: "Title and difficulty are required"
        });
    }


    // Validate difficulty
    const allowedDifficulty = [
        "Easy",
        "Medium",
        "Hard"
    ];

    if (!allowedDifficulty.includes(difficulty)) {
        return res.status(400).json({
            success: false,
            message: "Difficulty must be Easy, Medium, or Hard"
        });
    }


    Question.createQuestion(
        title,
        difficulty,
        description || null,
        youtube_link || null,
        (err, result) => {

            if (err) {
                console.error(err);

                return res.status(500).json({
                    success: false,
                    message: "Failed to create question"
                });
            }


            res.status(201).json({
                success: true,
                message: "Question created successfully",
                question: {
                    question_id: result.insertId,
                    title,
                    difficulty,
                    description: description || null,
                    youtube_link: youtube_link || null
                }
            });

        }
    );
};

// Get all questions for admin
const getAllQuestionsforAdmin = (req, res) => {

    Question.getAllQuestionsAdmin(
        (err, results) => {

            if (err) {
                console.error(err);

                return res.status(500).json({
                    success: false,
                    message: "Failed to fetch questions"
                });
            }

            res.status(200).json({
                success: true,
                count: results.length,
                questions: results
            });
        }
    );
};

// Update question
const updateQuestion = (req, res) => {

    const questionId = req.params.id;

    const {
        title,
        difficulty,
        description,
        youtube_link
    } = req.body;


    // Validate required fields
    if (!title || !difficulty) {

        return res.status(400).json({
            success: false,
            message: "Title and difficulty are required"
        });

    }


    // Validate difficulty
    const allowedDifficulty = [
        "Easy",
        "Medium",
        "Hard"
    ];

    if (!allowedDifficulty.includes(difficulty)) {

        return res.status(400).json({
            success: false,
            message: "Difficulty must be Easy, Medium, or Hard"
        });

    }


    Question.updateQuestion(
        questionId,
        title,
        difficulty,
        description || null,
        youtube_link || null,
        (err, result) => {

            if (err) {

                console.error(err);

                return res.status(500).json({
                    success: false,
                    message: "Failed to update question"
                });

            }


            // Question doesn't exist
            if (result.affectedRows === 0) {

                return res.status(404).json({
                    success: false,
                    message: "Question not found"
                });

            }


            res.status(200).json({
                success: true,
                message: "Question updated successfully"
            });

        }
    );
};

// Delete question
const deleteQuestion = (req, res) => {

    const questionId = req.params.id;


    Question.deleteQuestion(
        questionId,
        (err, result) => {

            if (err) {

                console.error(err);

                return res.status(500).json({
                    success: false,
                    message: "Failed to delete question"
                });

            }


            // Question doesn't exist
            if (result.affectedRows === 0) {

                return res.status(404).json({
                    success: false,
                    message: "Question not found"
                });

            }


            res.status(200).json({
                success: true,
                message: "Question deleted successfully"
            });

        }
    );
};
module.exports = {
    createQuestion,
    getAllQuestionsforAdmin,
    updateQuestion,
    deleteQuestion
};