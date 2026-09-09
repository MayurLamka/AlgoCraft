const express = require("express");

const router =
    express.Router();

const {
    getSolutions,
    createSolution
} = require("../controllers/solutionController");


// =====================================================
// GET SOLUTION
// =====================================================

router.get(
    "/question/:questionId",
    getSolutions
);


// =====================================================
// CREATE SOLUTION
// =====================================================

router.post(
    "/",
    createSolution
);


module.exports = router;