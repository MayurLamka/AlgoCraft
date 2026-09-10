const db = require("../config/db");

// Get all questions
const getAllQuestions = (userId, callback) => {

    const sql = `
        SELECT
            q.question_id,
            q.title,
            q.difficulty,
            q.youtube_link,

            CASE
                WHEN sq.question_id IS NOT NULL THEN true
                ELSE false
            END AS isSaved,

            CASE
                WHEN sol.question_id IS NOT NULL THEN true
                ELSE false
            END AS isSolved

        FROM questions q

        LEFT JOIN saved_questions sq
            ON q.question_id = sq.question_id
            AND sq.user_id = ?

        LEFT JOIN solved_questions sol
            ON q.question_id = sol.question_id
            AND sol.user_id = ?

        ORDER BY q.question_id ASC
    `;

    db.query(sql, [userId, userId], callback);
};

// Get question by ID
// Get question by ID for logged-in user
const getQuestionById = (userId, questionId, callback) => {

    const questionSql = `
        SELECT
            q.question_id,
            q.title,
            q.difficulty,
            q.description,
            q.youtube_link,
            q.created_at,

            CASE
                WHEN sq.question_id IS NOT NULL THEN true
                ELSE false
            END AS isSaved,

            CASE
                WHEN sol.question_id IS NOT NULL THEN true
                ELSE false
            END AS isSolved

        FROM questions q

        LEFT JOIN saved_questions sq
            ON q.question_id = sq.question_id
            AND sq.user_id = ?

        LEFT JOIN solved_questions sol
            ON q.question_id = sol.question_id
            AND sol.user_id = ?

        WHERE q.question_id = ?
    `;


    db.query(
        questionSql,
        [userId, userId, questionId],
        (error, questionResults) => {

            if (error) {
                return callback(error);
            }

            if (questionResults.length === 0) {
                return callback(null, []);
            }

            const question = questionResults[0];


            // ==============================
            // EXAMPLES
            // ==============================

            const examplesSql = `
                SELECT
    example_id,
    example_number,
    input,
    execution_input,
    output,
    explanation
FROM question_examples
WHERE question_id = ?
ORDER BY example_number ASC
            `;


            // ==============================
            // CONSTRAINTS
            // ==============================

            const constraintsSql = `
                SELECT
                    constraint_id,
                    constraint_number,
                    constraint_text

                FROM question_constraints

                WHERE question_id = ?

                ORDER BY constraint_number ASC
            `;


            // ==============================
            // HINTS
            // ==============================

            const hintsSql = `
                SELECT
                    hint_id,
                    hint_number,
                    hint_text

                FROM question_hints

                WHERE question_id = ?

                ORDER BY hint_number ASC
            `;


            // ==============================
            // TOPICS
            // ==============================

            const topicsSql = `
                SELECT
                    t.topic_id,
                    t.name

                FROM question_topics qt

                JOIN topics t
                    ON qt.topic_id = t.topic_id

                WHERE qt.question_id = ?

                ORDER BY t.name ASC
            `;


            // ==============================
            // GET EXAMPLES
            // ==============================

            db.query(
                examplesSql,
                [questionId],
                (error, examples) => {

                    if (error) {
                        return callback(error);
                    }


                    // ==============================
                    // GET CONSTRAINTS
                    // ==============================

                    db.query(
                        constraintsSql,
                        [questionId],
                        (error, constraints) => {

                            if (error) {
                                return callback(error);
                            }


                            // ==============================
                            // GET HINTS
                            // ==============================

                            db.query(
                                hintsSql,
                                [questionId],
                                (error, hints) => {

                                    if (error) {
                                        return callback(error);
                                    }


                                    // ==============================
                                    // GET TOPICS
                                    // ==============================

                                    db.query(
                                        topicsSql,
                                        [questionId],
                                        (error, topics) => {

                                            if (error) {
                                                return callback(error);
                                            }


                                            // ==============================
                                            // ATTACH RELATED DATA
                                            // ==============================

                                            question.examples = examples;

                                            question.constraints = constraints;

                                            question.hints = hints;

                                            question.topics = topics;


                                            // ==============================
                                            // RETURN COMPLETE QUESTION
                                            // ==============================

                                            callback(
                                                null,
                                                [question]
                                            );

                                        }
                                    );

                                }
                            );

                        }
                    );

                }
            );

        }
    );
};



// Search questions
// Search questions for logged-in user
const searchQuestions = (userId, keyword, callback) => {

    const sql = `
        SELECT
            q.question_id,
            q.title,
            q.difficulty,
            q.youtube_link,

            CASE
                WHEN sq.question_id IS NOT NULL THEN true
                ELSE false
            END AS isSaved,

            CASE
                WHEN sol.question_id IS NOT NULL THEN true
                ELSE false
            END AS isSolved

        FROM questions q

        LEFT JOIN saved_questions sq
            ON q.question_id = sq.question_id
            AND sq.user_id = ?

        LEFT JOIN solved_questions sol
            ON q.question_id = sol.question_id
            AND sol.user_id = ?

        WHERE q.title LIKE ?

        ORDER BY q.question_id ASC
    `;

    db.query(
        sql,
        [userId, userId, `%${keyword}%`],
        callback
    );
};

// Get questions by difficulty
// Get questions by difficulty for logged-in user
const getQuestionsByDifficulty = (userId, difficulty, callback) => {

    const sql = `
        SELECT
            q.question_id,
            q.title,
            q.difficulty,
            q.youtube_link,

            CASE
                WHEN sq.question_id IS NOT NULL THEN true
                ELSE false
            END AS isSaved,

            CASE
                WHEN sol.question_id IS NOT NULL THEN true
                ELSE false
            END AS isSolved

        FROM questions q

        LEFT JOIN saved_questions sq
            ON q.question_id = sq.question_id
            AND sq.user_id = ?

        LEFT JOIN solved_questions sol
            ON q.question_id = sol.question_id
            AND sol.user_id = ?

        WHERE q.difficulty = ?

        ORDER BY q.question_id ASC
    `;

    db.query(
        sql,
        [userId, userId, difficulty],
        callback
    );
};

// Get questions by topic
// Get questions by topic for logged-in user
const getQuestionsByTopic = (userId, topicName, callback) => {

    const sql = `
        SELECT
            q.question_id,
            q.title,
            q.difficulty,
            q.youtube_link,

            CASE
                WHEN sq.question_id IS NOT NULL THEN true
                ELSE false
            END AS isSaved,

            CASE
                WHEN sol.question_id IS NOT NULL THEN true
                ELSE false
            END AS isSolved

        FROM questions q

        JOIN question_topics qt
            ON q.question_id = qt.question_id

        JOIN topics t
            ON qt.topic_id = t.topic_id

        LEFT JOIN saved_questions sq
            ON q.question_id = sq.question_id
            AND sq.user_id = ?

        LEFT JOIN solved_questions sol
            ON q.question_id = sol.question_id
            AND sol.user_id = ?

        WHERE t.name = ?

        ORDER BY q.question_id ASC
    `;

    db.query(
        sql,
        [userId, userId, topicName],
        callback
    );
};

// Add new question
const createQuestion = (
    title,
    difficulty,
    description,
    youtubeLink,
    callback
) => {

    const sql = `
        INSERT INTO questions
        (title, difficulty, description, youtube_link)
        VALUES (?, ?, ?, ?)
    `;

    db.query(
        sql,
        [
            title,
            difficulty,
            description,
            youtubeLink
        ],
        callback
    );
};

// Get all questions for admin
const getAllQuestionsAdmin = (callback) => {

    const sql = `
        SELECT
            question_id,
            title,
            difficulty,
            description,
            youtube_link,
            created_at
        FROM questions
        ORDER BY question_id ASC
    `;

    db.query(sql, callback);
};

// Update question
const updateQuestion = (
    questionId,
    title,
    difficulty,
    description,
    youtubeLink,
    callback
) => {

    const sql = `
        UPDATE questions
        SET
            title = ?,
            difficulty = ?,
            description = ?,
            youtube_link = ?
        WHERE question_id = ?
    `;

    db.query(
        sql,
        [
            title,
            difficulty,
            description,
            youtubeLink,
            questionId
        ],
        callback
    );
};

// Delete question
const deleteQuestion = (questionId, callback) => {

    const sql = `
        DELETE FROM questions
        WHERE question_id = ?
    `;

    db.query(
        sql,
        [questionId],
        callback
    );
};
// Get code template
const getCodeTemplate = (questionId, language, callback) => {

    const sql = `
        SELECT
            template_id,
            question_id,
            language,
            starter_code
        FROM code_templates
        WHERE question_id = ?
        AND language = ?
    `;

    db.query(
        sql,
        [questionId, language],
        callback
    );
};
// =====================================================
// GET COMPLETE QUESTION FOR ADMIN EDIT
// =====================================================

const getAdminQuestionById = (questionId, callback) => {

    const questionSql = `
        SELECT
            question_id,
            title,
            difficulty,
            description,
            youtube_link,
            created_at
        FROM questions
        WHERE question_id = ?
    `;

    db.query(
        questionSql,
        [questionId],
        (error, questionResults) => {

            if (error) {
                return callback(error);
            }

            if (questionResults.length === 0) {
                return callback(null, null);
            }

            const question = questionResults[0];

            // ==============================
            // TOPICS
            // ==============================

            const topicsSql = `
                SELECT
                    t.topic_id,
                    t.name
                FROM question_topics qt
                JOIN topics t
                    ON qt.topic_id = t.topic_id
                WHERE qt.question_id = ?
                ORDER BY t.name ASC
            `;

            // ==============================
            // CONSTRAINTS
            // ==============================

            const constraintsSql = `
                SELECT
                    constraint_id,
                    constraint_number,
                    constraint_text
                FROM question_constraints
                WHERE question_id = ?
                ORDER BY constraint_number ASC
            `;

            // ==============================
            // EXAMPLES
            // ==============================

            const examplesSql = `
                SELECT
                    example_id,
                    example_number,
                    input,
                    execution_input,
                    output,
                    explanation
                FROM question_examples
                WHERE question_id = ?
                ORDER BY example_number ASC
            `;

            // ==============================
            // HINTS
            // ==============================

            const hintsSql = `
                SELECT
                    hint_id,
                    hint_number,
                    hint_text
                FROM question_hints
                WHERE question_id = ?
                ORDER BY hint_number ASC
            `;

            // ==============================
            // TEST CASES
            // ==============================

            const testCasesSql = `
                SELECT
                    test_case_id,
                    input_data,
                    expected_output,
                    is_hidden
                FROM test_cases
                WHERE question_id = ?
                ORDER BY test_case_id ASC
            `;

            // ==============================
            // CODE TEMPLATES
            // ==============================

            const templatesSql = `
                SELECT
                    template_id,
                    language,
                    starter_code
                FROM code_templates
                WHERE question_id = ?
                ORDER BY template_id ASC
            `;

            // ==============================
            // SOLUTIONS
            // ==============================

            const solutionsSql = `
                SELECT
                    solution_id,
                    language,
                    approach,
                    explanation,
                    time_complexity,
                    space_complexity,
                    code
                FROM solutions
                WHERE question_id = ?
                ORDER BY solution_id ASC
            `;

            // Run all queries

            db.query(topicsSql, [questionId], (error, topics) => {

                if (error) {
                    return callback(error);
                }

                db.query(
                    constraintsSql,
                    [questionId],
                    (error, constraints) => {

                        if (error) {
                            return callback(error);
                        }

                        db.query(
                            examplesSql,
                            [questionId],
                            (error, examples) => {

                                if (error) {
                                    return callback(error);
                                }

                                db.query(
                                    hintsSql,
                                    [questionId],
                                    (error, hints) => {

                                        if (error) {
                                            return callback(error);
                                        }

                                        db.query(
                                            testCasesSql,
                                            [questionId],
                                            (error, testCases) => {

                                                if (error) {
                                                    return callback(error);
                                                }

                                                db.query(
                                                    templatesSql,
                                                    [questionId],
                                                    (error, templates) => {

                                                        if (error) {
                                                            return callback(error);
                                                        }

                                                        db.query(
                                                            solutionsSql,
                                                            [questionId],
                                                            (error, solutions) => {

                                                                if (error) {
                                                                    return callback(error);
                                                                }

                                                                question.topics = topics;
                                                                question.constraints = constraints;
                                                                question.examples = examples;
                                                                question.hints = hints;
                                                                question.testCases = testCases;
                                                                question.templates = templates;
                                                                question.solutions = solutions;

                                                                callback(
                                                                    null,
                                                                    question
                                                                );

                                                            }
                                                        );

                                                    }
                                                );

                                            }
                                        );

                                    }
                                );

                            }
                        );

                    }
                );

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
    createQuestion,
    getAllQuestionsAdmin,
    getAdminQuestionById,
    updateQuestion,
    deleteQuestion,
    getCodeTemplate
};