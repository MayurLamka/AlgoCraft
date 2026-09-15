const multer = require("multer");
const path = require("path");
const fs = require("fs");


// =====================================================
// DIRECTORIES
// =====================================================

const notesDirectory =
    path.join(
        __dirname,
        "..",
        "uploads",
        "resources",
        "notes"
    );

const interviewsDirectory =
    path.join(
        __dirname,
        "..",
        "uploads",
        "resources",
        "interviews"
    );


fs.mkdirSync(
    notesDirectory,
    {
        recursive: true
    }
);

fs.mkdirSync(
    interviewsDirectory,
    {
        recursive: true
    }
);


// =====================================================
// COMMON FILENAME
// =====================================================

const createFilename = (
    req,
    file,
    cb
) => {

    const extension =
        path.extname(
            file.originalname
        );

    const name =
        path
            .basename(
                file.originalname,
                extension
            )
            .replace(
                /[^a-zA-Z0-9-_]/g,
                "-"
            );

    const filename =
        `${name}-${Date.now()}${extension}`;

    cb(
        null,
        filename
    );

};


// =====================================================
// NOTES STORAGE
// =====================================================

const notesStorage =
    multer.diskStorage({

        destination: (
            req,
            file,
            cb
        ) => {

            cb(
                null,
                notesDirectory
            );

        },

        filename:
            createFilename

    });


// =====================================================
// INTERVIEW STORAGE
// =====================================================

const interviewsStorage =
    multer.diskStorage({

        destination: (
            req,
            file,
            cb
        ) => {

            cb(
                null,
                interviewsDirectory
            );

        },

        filename:
            createFilename

    });


// =====================================================
// NOTES FILE FILTER
// =====================================================

const notesFileFilter =
    (
        req,
        file,
        cb
    ) => {

        const isPdf =
            file.mimetype ===
            "application/pdf";

        const isImage =
            file.mimetype.startsWith(
                "image/"
            );


        if (
            isPdf ||
            isImage
        ) {

            cb(
                null,
                true
            );

        } else {

            cb(
                new Error(
                    "Only PDF and image files are allowed."
                )
            );

        }

    };


// =====================================================
// INTERVIEW FILE FILTER
// =====================================================

const interviewFileFilter =
    (
        req,
        file,
        cb
    ) => {

        if (
            file.mimetype.startsWith(
                "image/"
            )
        ) {

            cb(
                null,
                true
            );

        } else {

            cb(
                new Error(
                    "Only image files are allowed."
                )
            );

        }

    };


// =====================================================
// NOTES UPLOAD
// =====================================================

const uploadNote =
    multer({

        storage:
            notesStorage,

        fileFilter:
            notesFileFilter,

        limits: {
            fileSize:
                10 * 1024 * 1024
        }

    });


// =====================================================
// INTERVIEW IMAGE UPLOAD
// =====================================================

const uploadInterview =
    multer({

        storage:
            interviewsStorage,

        fileFilter:
            interviewFileFilter,

        limits: {
            fileSize:
                5 * 1024 * 1024
        }

    });


module.exports = {
    uploadNote,
    uploadInterview
};