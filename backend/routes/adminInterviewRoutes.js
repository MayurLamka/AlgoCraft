const express = require("express");

const router = express.Router();

const {
    createInterview,
    deleteInterview
} = require("../controllers/interviewController");

const {
    uploadInterview
} = require("../middleware/uploadResource");

const authMiddleware =
    require("../middleware/authMiddleware");

const adminMiddleware =
    require("../middleware/adminMiddleware");


// =====================================================
// ADD INTERVIEW
// =====================================================

router.post(
    "/",
    authMiddleware,
    adminMiddleware,

    uploadInterview.fields([
        {
            name: "image",
            maxCount: 1
        }
    ]),

    createInterview
);


// =====================================================
// DELETE INTERVIEW
// =====================================================

router.delete(
    "/:id",
    authMiddleware,
    adminMiddleware,

    deleteInterview
);


module.exports = router;