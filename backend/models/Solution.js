const db = require("../config/db");


// =====================================================
// GET SOLUTION FOR A QUESTION
// =====================================================

const getSolutionsByQuestion = (
    questionId,
    callback
) => {

    const sql = `
        SELECT
            solution_id,
            question_id,
            language,
            approach,
            explanation,
            time_complexity,
            space_complexity,
            code,
            created_at,
            updated_at
        FROM solutions
        WHERE question_id = ?
        ORDER BY
            CASE language
                WHEN 'cpp' THEN 1
                WHEN 'java' THEN 2
                WHEN 'python' THEN 3
                WHEN 'javascript' THEN 4
                ELSE 5
            END
    `;

    db.query(
        sql,
        [questionId],
        callback
    );
};


// =====================================================
// CREATE SOLUTION
// =====================================================

const createSolution = (
    questionId,
    language,
    approach,
    explanation,
    timeComplexity,
    spaceComplexity,
    code,
    callback
) => {

    const sql = `
        INSERT INTO solutions
        (
            question_id,
            language,
            approach,
            explanation,
            time_complexity,
            space_complexity,
            code
        )
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(
        sql,
        [
            questionId,
            language,
            approach,
            explanation,
            timeComplexity,
            spaceComplexity,
            code
        ],
        callback
    );
};


module.exports = {
    getSolutionsByQuestion,
    createSolution
};