const express = require("express");

const router = express.Router();

const {
    getAllSubjects,
    getFilesBySubject
} = require("../controllers/noteController");


router.get(
    "/subjects",
    getAllSubjects
);


router.get(
    "/subjects/:subjectId/files",
    getFilesBySubject
);


module.exports = router;