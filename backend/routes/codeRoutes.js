const express = require("express");
const router = express.Router();

const {
    runCode,
    submitCode
} = require("../controllers/codeController");

const authMiddleware =
    require("../middleware/authMiddleware");


// Run code
router.post(
    "/run",
    runCode
);


// Submit code - requires login
router.post(
    "/submit",
    authMiddleware,
    submitCode
);


module.exports = router;