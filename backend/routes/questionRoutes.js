const express = require("express");

const router = express.Router();

const {
    getAllQuestions,
    getQuestionById,
    searchQuestions,
    getQuestionsByDifficulty,
    getQuestionsByTopic,
    getCodeTemplate,
    saveUserCode
} = require("../controllers/questionController");

const authMiddleware =
    require("../middleware/authMiddleware");


// Get all questions
router.get(
    "/",
    authMiddleware,
    getAllQuestions
);


// Search questions
router.get(
    "/search",
    authMiddleware,
    searchQuestions
);


// Get questions by difficulty
router.get(
    "/difficulty/:difficulty",
    authMiddleware,
    getQuestionsByDifficulty
);


// Get questions by topic
router.get(
    "/topic/:topicName",
    authMiddleware,
    getQuestionsByTopic
);


// Get question by ID
router.get(
    "/:id",
    authMiddleware,
    getQuestionById
);

// Get code template
router.get(
    "/:id/code",
    authMiddleware,
    getCodeTemplate
);

router.post(
    "/:questionId/code/save",
    authMiddleware,
    saveUserCode
);

module.exports = router;