const express = require("express");

const router =
    express.Router();


const {
    createNote,
    deleteNote
} = require(
    "../controllers/noteController"
);


const {
    uploadNote
} = require(
    "../middleware/uploadResource"
);


const authMiddleware =
    require(
        "../middleware/authMiddleware"
    );

const adminMiddleware =
    require(
        "../middleware/adminMiddleware"
    );


// =====================================================
// ADD NOTE
// =====================================================

router.post(
    "/",
    authMiddleware,
    adminMiddleware,

    uploadNote.fields([
        {
            name: "image",
            maxCount: 1
        },
        {
            name: "pdf",
            maxCount: 1
        }
    ]),

    createNote
);


// =====================================================
// DELETE NOTE
// =====================================================

router.delete(
    "/:id",
    authMiddleware,
    adminMiddleware,

    deleteNote
);


module.exports = router;