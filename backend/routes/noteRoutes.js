const express = require("express");

const router = express.Router();

const {
    getAllNotes,
    downloadNote
} = require("../controllers/noteController");


router.get(
    "/",
    getAllNotes
);


router.get(
    "/:id/download",
    downloadNote
);


module.exports = router;