const db = require("../config/db");

const getAllInterviews = (callback) => {
    const sql = `
        SELECT
            interview_id,
            title,
            description,
            youtube_url,
            image_url,
            created_at
        FROM interviews
        ORDER BY interview_id DESC
    `;

    db.query(sql, callback);
};

const getInterviewById = (interviewId, callback) => {
    const sql = `
        SELECT
            interview_id,
            title,
            description,
            youtube_url,
            image_url
        FROM interviews
        WHERE interview_id = ?
        LIMIT 1
    `;

    db.query(sql, [interviewId], callback);
};

const createInterview = (
    title,
    description,
    youtubeUrl,
    imageUrl,
    callback
) => {
    const sql = `
        INSERT INTO interviews
        (
            title,
            description,
            youtube_url,
            image_url
        )
        VALUES (?, ?, ?, ?)
    `;

    db.query(
        sql,
        [
            title,
            description,
            youtubeUrl,
            imageUrl
        ],
        callback
    );
};

const deleteInterview = (interviewId, callback) => {
    const sql = `
        DELETE FROM interviews
        WHERE interview_id = ?
    `;

    db.query(sql, [interviewId], callback);
};

module.exports = {
    getAllInterviews,
    getInterviewById,
    createInterview,
    deleteInterview
};
