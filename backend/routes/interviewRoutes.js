const express = require("express");

const router = express.Router();

const {
    getAllInterviews
} = require("../controllers/interviewController");


router.get(
    "/",
    getAllInterviews
);


module.exports = router;