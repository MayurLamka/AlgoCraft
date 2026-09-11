const db = require("../config/db");


/* =========================================
   GET ALL SUBJECTS
========================================= */

const getAllSubjects = (callback) => {

    const sql = `
        SELECT
            subject_id,
            subject_name,
            description,
            image_url
        FROM note_subjects
        ORDER BY subject_id ASC
    `;

    db.query(sql, callback);
};


/* =========================================
   GET FILES OF SUBJECT
========================================= */

const getFilesBySubject = (
    subjectId,
    callback
) => {

    const sql = `
        SELECT
            file_id,
            subject_id,
            file_name,
            file_url
        FROM note_files
        WHERE subject_id = ?
        ORDER BY file_id ASC
    `;

    db.query(
        sql,
        [subjectId],
        callback
    );
};


module.exports = {
    getAllSubjects,
    getFilesBySubject
};