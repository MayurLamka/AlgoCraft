const db = require("../config/db");

const getAllNotes = (callback) => {
    const sql = `
        SELECT
            note_id,
            title,
            description,
            image_url,
            pdf_name,
            pdf_url,
            created_at
        FROM notes
        ORDER BY note_id DESC
    `;

    db.query(sql, callback);
};

const createNote = (
    title,
    description,
    imageUrl,
    pdfName,
    pdfUrl,
    callback
) => {
    const sql = `
        INSERT INTO notes
        (
            title,
            description,
            image_url,
            pdf_name,
            pdf_url
        )
        VALUES (?, ?, ?, ?, ?)
    `;

    db.query(
        sql,
        [
            title,
            description,
            imageUrl,
            pdfName,
            pdfUrl
        ],
        callback
    );
};

const deleteNote = (noteId, callback) => {
    const sql = `
        DELETE FROM notes
        WHERE note_id = ?
    `;

    db.query(sql, [noteId], callback);
};

const getNoteById = (
    noteId,
    callback
) => {

    const sql = `
        SELECT
            note_id,
            title,
            description,
            image_url,
            pdf_name,
            pdf_url,
            created_at
        FROM notes
        WHERE note_id = ?
    `;

    db.query(
        sql,
        [noteId],
        callback
    );
};

module.exports = {
    getAllNotes,
    createNote,
    deleteNote,
    getNoteById
};
