const db = require("../config/db");


// Get all topics with question count
const getAllTopics = (callback) => {

    const sql = `
        SELECT
            t.topic_id,
            t.name AS topic_name,
            COUNT(DISTINCT qt.question_id) AS question_count
        FROM topics t
        LEFT JOIN question_topics qt
            ON t.topic_id = qt.topic_id
        GROUP BY
            t.topic_id,
            t.name
        ORDER BY
            t.topic_id ASC
    `;

    db.query(sql, callback);
};


module.exports = {
    getAllTopics
};