const db = require("../config/db");
const Question = require("../models/Question");

// Get all questions
const getAllQuestions = (req, res) => {

    const userId = req.user.user_id;

    Question.getAllQuestions(
        userId,
        (err, results) => {

            if (err) {
                console.error(err);

                return res.status(500).json({
                    success: false,
                    message: "Database Error"
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

// Get question by ID
// Get question by ID
const getQuestionById = (req, res) => {

    // Get user ID from JWT
    const userId = req.user.user_id;

    // Get question ID from URL
    const questionId = req.params.id;

    Question.getQuestionById(
        userId,
        questionId,
        (err, results) => {

            if (err) {
                console.error(err);

                return res.status(500).json({
                    success: false,
                    message: "Database Error"
                });
            }

            if (results.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: "Question not found"
                });
            }

            res.status(200).json({
                success: true,
                question: results[0]
            });

        }
    );
};

// Get code template
const getCodeTemplate = (req, res) => {
     const userId = req.user.user_id;
    const questionId = req.params.id;
    const { language } = req.query;

    if (!language) {
        return res.status(400).json({
            success: false,
            message: "Language is required"
        });
    }

    const userCodeSql = `
        SELECT code
        FROM user_code
        WHERE user_id = ?
          AND question_id = ?
          AND language = ?
        LIMIT 1
    `;

    db.query(
        userCodeSql,
        [userId, questionId, language],
        (err, userResults) => {
            if (err) {
                console.error("Get user code error:", err);

                return res.status(500).json({
                    success: false,
                    message: "Failed to load code"
                });
            }

            // User has previously saved code
            if (userResults.length > 0) {
                return res.status(200).json({
                    success: true,
                    template: {
                        starter_code: userResults[0].code,
                        isUserCode: true
                    }
                });
            }

            // Otherwise load platform starter code
            const templateSql = `
                SELECT starter_code
                FROM code_templates
                WHERE question_id = ?
                  AND language = ?
                LIMIT 1
            `;

            db.query(
                templateSql,
                [questionId, language],
                (err, templateResults) => {
                    if (err) {
                        console.error("Get template error:", err);

                        return res.status(500).json({
                            success: false,
                            message: "Failed to load template"
                        });
                    }

                    if (templateResults.length === 0) {
                        return res.status(404).json({
                            success: false,
                            message: "Code template not found"
                        });
                    }

                    return res.status(200).json({
                        success: true,
                        template: {
                            starter_code: templateResults[0].starter_code,
                            isUserCode: false
                        }
                    });
                }
            );
        }
    );
};

// Search Questions
// Search Questions
const searchQuestions = (req, res) => {

    const userId = req.user.user_id;
    const keyword = req.query.keyword;

    if (!keyword) {
        return res.status(400).json({
            success: false,
            message: "Please provide a search keyword"
        });
    }

    Question.searchQuestions(
        userId,
        keyword,
        (err, results) => {

            if (err) {
                console.error(err);

                return res.status(500).json({
                    success: false,
                    message: "Database Error"
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
// Get Questions by Difficulty
// Get Questions by Difficulty
const getQuestionsByDifficulty = (req, res) => {

    const userId = req.user.user_id;
    const difficulty = req.params.difficulty;

    Question.getQuestionsByDifficulty(
        userId,
        difficulty,
        (err, results) => {

            if (err) {
                console.error(err);

                return res.status(500).json({
                    success: false,
                    message: "Database Error"
                });
            }

            if (results.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: "No questions found"
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

// Get Questions by Topic
// Get Questions by Topic
const getQuestionsByTopic = (req, res) => {

    const userId = req.user.user_id;
    const topicName = req.params.topicName;

    Question.getQuestionsByTopic(
        userId,
        topicName,
        (err, results) => {

            if (err) {
                console.error(err);

                return res.status(500).json({
                    success: false,
                    message: "Database Error"
                });
            }

            if (results.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: "No Questions Found"
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
const saveUserCode = (req, res) => {
     const userId = req.user.user_id;
    const questionId = req.params.questionId;

    const { language, code } = req.body;

    if (!language || code === undefined) {
        return res.status(400).json({
            success: false,
            message: "Language and code are required"
        });
    }

    const sql = `
        INSERT INTO user_code
            (user_id, question_id, language, code)
        VALUES (?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
            code = VALUES(code)
    `;

    db.query(
        sql,
        [userId, questionId, language, code],
        (err) => {
            if (err) {
                console.error("Save user code error:", err);

                return res.status(500).json({
                    success: false,
                    message: "Failed to save code"
                });
            }

            return res.status(200).json({
                success: true,
                message: "Code saved successfully"
            });
        }
    );
};

// =====================================================
// TOGGLE REVISION
// =====================================================

const toggleRevision = (req, res) => {

    const userId = req.user.user_id;
    const questionId = req.params.questionId;

    Question.toggleRevision(
        userId,
        questionId,
        (err, result) => {

            if (err) {

                console.error(
                    "Toggle revision error:",
                    err
                );

                return res.status(500).json({
                    success: false,
                    message: "Failed to update revision"
                });

            }

            return res.status(200).json({
                success: true,
                isRevision: result.isRevision
            });

        }
    );
};




// =====================================================
// GET REVISION QUESTIONS
// =====================================================

const getRevisionQuestions = (req, res) => {

    const userId = req.user.user_id;

    Question.getRevisionQuestions(
        userId,
        (err, results) => {

            if (err) {

                console.error(
                    "Get revision questions error:",
                    err
                );

                return res.status(500).json({
                    success: false,
                    message: "Failed to load revision questions"
                });

            }

            return res.status(200).json({
                success: true,
                count: results.length,
                questions: results
            });

        }
    );
};

module.exports = {
    getAllQuestions,
    getQuestionById,
    searchQuestions,
    getQuestionsByDifficulty,
    getQuestionsByTopic,
    getCodeTemplate,
    saveUserCode,
    toggleRevision,
    getRevisionQuestions
};