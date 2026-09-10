const express = require("express");

const router = express.Router();

const authMiddleware =
    require("../middleware/authMiddleware");

const adminMiddleware =
    require("../middleware/adminMiddleware");


const {
    createQuestion,
    getAllQuestionsforAdmin,
    getAdminQuestionById,
    updateQuestion,
    deleteQuestion
} = require("../controllers/AdminQuestionController");

router.get(
    "/questions/:id",
    authMiddleware,
    adminMiddleware,
    getAdminQuestionById
);

// Admin test route
router.get(
    "/test",
    authMiddleware,
    adminMiddleware,
    (req, res) => {

        res.status(200).json({
            success: true,
            message: "Admin access granted",
            admin: {
                user_id: req.user.user_id,
                role: req.user.role
            }
        });

    }
);

// Add question
router.post(
    "/questions",
    authMiddleware,
    adminMiddleware,
    createQuestion
);

// View all questions
router.get(
    "/questions",
    authMiddleware,
    adminMiddleware,
    getAllQuestionsforAdmin
);

router.put(
    "/questions/:id",
    authMiddleware,
    adminMiddleware,
    updateQuestion
);
router.delete(
    "/questions/:id",
    authMiddleware,
    adminMiddleware,
    deleteQuestion
);

module.exports = router;