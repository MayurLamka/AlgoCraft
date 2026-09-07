const express = require("express");
const router = express.Router();

const SolvedQuestionController =
    require("../controllers/SolvedQuestionController");

const authMiddleware =
    require("../middleware/authMiddleware");


// Mark question as solved
router.post(
    "/:questionId",
    authMiddleware,
    SolvedQuestionController.markSolved
);


// Get all solved questions of logged-in user
router.get(
    "/",
    authMiddleware,
    SolvedQuestionController.getSolvedQuestions
);


// Check whether question is solved
router.get(
    "/check/:questionId",
    authMiddleware,
    SolvedQuestionController.checkSolved
);


module.exports = router;