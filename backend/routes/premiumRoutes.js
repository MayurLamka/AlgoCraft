const express = require("express");

const router =
    express.Router();

const authMiddleware =
    require("../middleware/authMiddleware");

const PremiumController =
    require("../controllers/premiumController");


// Create demo payment session
router.post(
    "/create-session",
    authMiddleware,
    PremiumController.createSession
);


// Phone opens payment session
router.get(
    "/session/:token",
    PremiumController.getSession
);


// Phone completes demo payment
router.post(
    "/complete-session",
    PremiumController.completeSession
);


// Logged-in user checks premium
router.get(
    "/status",
    authMiddleware,
    PremiumController.getStatus
);


module.exports = router;