const db = require("../config/db");


// Save question
const saveQuestion = (
    userId,
    questionId,
    callback
) => {
    const sql = `
        INSERT INTO saved_questions
        (user_id, question_id)
        VALUES (?, ?)
    `;

    db.query(
        sql,
        [userId, questionId],
        callback
    );
};


// Get saved questions
const getSavedQuestions = (
    userId,
    callback
) => {

    const sql = `
        SELECT
            sq.question_id,
            q.title,
            q.difficulty,
            q.youtube_link
        FROM saved_questions sq
        JOIN questions q
            ON sq.question_id = q.question_id
        WHERE sq.user_id = ?
        ORDER BY sq.question_id ASC
    `;

    db.query(
        sql,
        [userId],
        callback
    );
};


// Remove saved question
const removeSavedQuestion = (
    userId,
    questionId,
    callback
) => {

    const sql = `
        DELETE FROM saved_questions
        WHERE user_id = ?
        AND question_id = ?
    `;

    db.query(
        sql,
        [userId, questionId],
        callback
    );
};


module.exports = {
    saveQuestion,
    getSavedQuestions,
    removeSavedQuestion
};