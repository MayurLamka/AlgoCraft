const Solution = require("../models/Solution");

const getSolutions = (req, res) => {

    const { questionId } = req.params;

    Solution.getSolutionsByQuestion(questionId, (err, results) => {

        if (err) {
            console.error("Get solutions error:", err);

            return res.status(500).json({
                success: false,
                message: "Failed to fetch solutions"
            });
        }


        res.json({
            success: true,
            solutions: results
        });
    });
};


const createSolution = (req, res) => {

    const {
        questionId,
        language,
        approach,
        explanation,
        timeComplexity,
        spaceComplexity,
        code
    } = req.body;

    Solution.createSolution(
        questionId,
        language,
        approach,
        explanation,
        timeComplexity,
        spaceComplexity,
        code,
        (err, result) => {

            if (err) {
                console.error("Create solution error:", err);

                return res.status(500).json({
                    success: false,
                    message: "Failed to create solution"
                });
            }

            res.json({
                success: true,
                message: "Solution created successfully",
                solutionId: result.insertId
            });
        }
    );
};


module.exports = {
    getSolutions,
    createSolution
};