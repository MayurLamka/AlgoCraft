const express = require("express");

const router = express.Router();

const {
    saveQuestion,
    getSavedQuestions,
    removeSavedQuestion
} = require("../controllers/savedQuestionController");

const authMiddleware = require("../middleware/authMiddleware");


// Get logged-in user's saved questions
router.get(
    "/",
    authMiddleware,
    getSavedQuestions
);


// Save a question
router.post(
    "/",
    authMiddleware,
    saveQuestion
);


// Remove a saved question
router.delete(
    "/:questionId",
    authMiddleware,
    removeSavedQuestion
);


module.exports = router;