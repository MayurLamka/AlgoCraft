const db = require("../config/db");


// Get total solved questions
const getTotalSolved = (userId, callback) => {

    const sql = `
        SELECT COUNT(*) AS totalSolved
        FROM solved_questions
        WHERE user_id = ?
    `;

    db.query(sql, [userId], callback);
};


// Get solved questions by difficulty
const getSolvedByDifficulty = (userId, callback) => {

    const sql = `
        SELECT
            q.difficulty,
            COUNT(*) AS count
        FROM solved_questions sq
        JOIN questions q
            ON sq.question_id = q.question_id
        WHERE sq.user_id = ?
        GROUP BY q.difficulty
    `;

    db.query(sql, [userId], callback);
};


// Get saved question count
const getSavedCount = (userId, callback) => {

    const sql = `
        SELECT COUNT(*) AS savedQuestions
        FROM saved_questions
        WHERE user_id = ?
    `;

    db.query(sql, [userId], callback);
};


// Get recent submissions
const getRecentSubmissions = (userId, callback) => {

    const sql = `
        SELECT
            s.submission_id,
            s.question_id,
            q.title,
            q.difficulty,
            s.language,
            s.status,
            s.execution_time,
            s.memory_used,
            s.submitted_at
        FROM submissions s
        JOIN questions q
            ON s.question_id = q.question_id
        WHERE s.user_id = ?
        ORDER BY s.submitted_at DESC
        LIMIT 5
    `;

    db.query(sql, [userId], callback);
};


module.exports = {
    getTotalSolved,
    getSolvedByDifficulty,
    getSavedCount,
    getRecentSubmissions
};