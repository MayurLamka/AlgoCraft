const db = require("../config/db");


// Mark question as solved
const markSolved = (userId, questionId, callback) => {

    const sql = `
        INSERT INTO solved_questions
            (user_id, question_id)
        VALUES (?, ?)
        ON DUPLICATE KEY UPDATE
            question_id = VALUES(question_id)
    `;

    db.query(
        sql,
        [userId, questionId],
        callback
    );
};

// Get all solved questions of a user
const getSolvedQuestions = (userId, callback) => {

    const sql = `
        SELECT
            q.question_id,
            q.title,
            q.difficulty,
            sq.solved_at
        FROM solved_questions sq
        JOIN questions q
            ON sq.question_id = q.question_id
        WHERE sq.user_id = ?
        ORDER BY sq.solved_at DESC
    `;

    db.query(sql, [userId], callback);
};


// Check whether a question is solved
const checkSolved = (userId, questionId, callback) => {

    const sql = `
        SELECT *
        FROM solved_questions
        WHERE user_id = ?
        AND question_id = ?
    `;

    db.query(sql, [userId, questionId], callback);
};


module.exports = {
    markSolved,
    getSolvedQuestions,
    checkSolved
};