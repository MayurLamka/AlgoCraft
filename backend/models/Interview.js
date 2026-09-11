const db = require("../config/db");


/* =========================================
   GET ALL INTERVIEWS
========================================= */

const getAllInterviews = (callback) => {

    const sql = `
        SELECT
            interview_id,
            title,
            description,
            youtube_url,
            created_at
        FROM interviews
        ORDER BY interview_id ASC
    `;

    db.query(sql, callback);
};


module.exports = {
    getAllInterviews
};