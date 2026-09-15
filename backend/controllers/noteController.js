const fs = require("fs");
const path = require("path");

const Note = require("../models/Note");

const deleteUploadedFile = (url) => {
    if (!url) {
        return;
    }

    const relativePath = url.replace(/^\/uploads\//, "");
    const filePath = path.join(
        __dirname,
        "../uploads",
        relativePath
    );

    fs.unlink(filePath, (err) => {
        if (err && err.code !== "ENOENT") {
            console.error("Failed to delete uploaded file:", err);
        }
    });
};


// =====================================================
// GET ALL NOTES
// =====================================================

const getAllNotes = (req, res) => {
    Note.getAllNotes((err, results) => {
        if (err) {
            console.error("Failed to fetch notes:", err);

            return res.status(500).json({
                success: false,
                message: "Failed to fetch notes"
            });
        }

        res.status(200).json({
            success: true,
            notes: results
        });
    });
};


// =====================================================
// ADD NOTE
// =====================================================

const createNote = (req, res) => {
    const title =
        typeof req.body.title === "string"
            ? req.body.title.trim()
            : "";

    const description =
        typeof req.body.description === "string"
            ? req.body.description.trim()
            : "";

    const imageFile =
        req.files?.image?.[0];

    const pdfFile =
        req.files?.pdf?.[0];

    if (!title) {
        return res.status(400).json({
            success: false,
            message: "Note title is required"
        });
    }

    if (!pdfFile) {
        return res.status(400).json({
            success: false,
            message: "PDF file is required"
        });
    }

    const imageUrl = imageFile
        ? `/uploads/resources/notes/${imageFile.filename}`
        : null;

    const pdfUrl =
        `/uploads/resources/notes/${pdfFile.filename}`;

    Note.createNote(
        title,
        description || null,
        imageUrl,
        pdfFile.originalname,
        pdfUrl,
        (err, result) => {
            if (err) {
                console.error("Failed to create note:", err);

                deleteUploadedFile(imageUrl);
                deleteUploadedFile(pdfUrl);

                return res.status(500).json({
                    success: false,
                    message: "Failed to add note"
                });
            }

            res.status(201).json({
                success: true,
                message: "Note added successfully",
                note_id: result.insertId
            });
        }
    );
};


// =====================================================
// DELETE NOTE
// =====================================================

const deleteNote = (req, res) => {
    const noteId = Number(req.params.id);

    if (!Number.isInteger(noteId) || noteId <= 0) {
        return res.status(400).json({
            success: false,
            message: "Invalid note ID"
        });
    }

    Note.getNoteById(noteId, (findErr, rows) => {
        if (findErr) {
            console.error("Failed to find note:", findErr);

            return res.status(500).json({
                success: false,
                message: "Failed to delete note"
            });
        }

        if (!rows.length) {
            return res.status(404).json({
                success: false,
                message: "Note not found"
            });
        }

        const note = rows[0];

        Note.deleteNote(noteId, (deleteErr, result) => {
            if (deleteErr) {
                console.error("Failed to delete note:", deleteErr);

                return res.status(500).json({
                    success: false,
                    message: "Failed to delete note"
                });
            }

            if (!result.affectedRows) {
                return res.status(404).json({
                    success: false,
                    message: "Note not found"
                });
            }

            deleteUploadedFile(note.image_url);
            deleteUploadedFile(note.pdf_url);

            res.status(200).json({
                success: true,
                message: "Note deleted successfully"
            });
        });
    });
};



// =====================================================
// DOWNLOAD NOTE
// =====================================================

const downloadNote = (
    req,
    res
) => {

    const {
        id
    } = req.params;


    Note.getNoteById(
        id,
        (err, results) => {

            if (err) {

                console.error(
                    "Failed to find note:",
                    err
                );

                return res.status(500).json({
                    success: false,
                    message:
                        "Failed to download note"
                });

            }


            if (
                !results ||
                results.length === 0
            ) {

                return res.status(404).json({
                    success: false,
                    message:
                        "Note not found"
                });

            }


            const note =
                results[0];


            if (!note.pdf_url) {

                return res.status(404).json({
                    success: false,
                    message:
                        "PDF file not available"
                });

            }


            // Remove leading slash

            const relativePath =
                note.pdf_url.replace(
                    /^[/\\]+/,
                    ""
                );


            // Build real filesystem path

            const filePath =
                path.join(
                    __dirname,
                    "..",
                    relativePath
                );


            console.log(
                "DOWNLOAD FILE:",
                filePath
            );


            if (
                !fs.existsSync(
                    filePath
                )
            ) {

                console.error(
                    "PDF NOT FOUND:",
                    filePath
                );

                return res.status(404).json({
                    success: false,
                    message:
                        "PDF file not found on server"
                });

            }


            res.download(
                filePath,
                note.pdf_name,
                (downloadError) => {

                    if (downloadError) {

                        console.error(
                            "Download error:",
                            downloadError
                        );

                    }

                }
            );

        }
    );

};


module.exports = {
    getAllNotes,
    createNote,
    deleteNote,
    downloadNote
};
