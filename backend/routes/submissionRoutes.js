const express = require("express");

const router = express.Router();

const authMiddleware =
    require("../middleware/authMiddleware");
const {
    createSubmission,
    getUserSubmissions,
    getQuestionSubmissions
} = require("../controllers/submissionController");


// Get submissions for a question
router.get(
    "/question/:questionId",
    authMiddleware,
    getQuestionSubmissions
);


// Create submission
router.post(
    "/",
    createSubmission
);


// Get user's submissions
router.get(
    "/:userId",
    getUserSubmissions
);


module.exports = router;