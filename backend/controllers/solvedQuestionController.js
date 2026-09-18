const db = require("../config/db");
const SolvedQuestion = require("../models/SolvedQuestion");


// =====================================================
// CHECK FREE QUESTION LIMIT
// =====================================================

const checkFreeLimit = (
    userId,
    questionId,
    callback
) => {

    const sql = `
        SELECT
            u.is_premium,
            u.premium_expires_at,

            COUNT(DISTINCT sq.question_id) AS solvedCount,

            EXISTS (
                SELECT 1
                FROM solved_questions existing_sq
                WHERE existing_sq.user_id = ?
                AND existing_sq.question_id = ?
            ) AS alreadySolved

        FROM users u

        LEFT JOIN solved_questions sq
            ON sq.user_id = u.user_id

        WHERE u.user_id = ?

        GROUP BY
            u.user_id,
            u.is_premium,
            u.premium_expires_at
    `;


    db.query(
        sql,
        [
            userId,
            questionId,
            userId
        ],
        (error, results) => {

            if (error) {

                console.error(
                    "CHECK FREE LIMIT ERROR:",
                    error
                );

                callback(
                    error
                );

                return;
            }


            if (!results.length) {

                callback(
                    new Error(
                        "User not found"
                    )
                );

                return;
            }


            const data =
                results[0];


            const solvedCount =
                Number(
                    data.solvedCount || 0
                );


            const alreadySolved =
                Number(
                    data.alreadySolved
                ) === 1;


            const isPremium =
                Number(
                    data.is_premium
                ) === 1 &&
                data.premium_expires_at &&
                new Date(
                    data.premium_expires_at
                ) > new Date();


            // =========================================
            // PREMIUM USER
            // =========================================

            if (isPremium) {

                callback(
                    null,
                    {
                        allowed: true,
                        solvedCount,
                        alreadySolved,
                        isPremium: true
                    }
                );

                return;
            }


            // =========================================
            // ALREADY SOLVED QUESTION
            // =========================================
            //
            // A free user can submit an already solved
            // question again.
            //
            // It does NOT consume another slot.
            //

            if (alreadySolved) {

                callback(
                    null,
                    {
                        allowed: true,
                        solvedCount,
                        alreadySolved: true,
                        isPremium: false
                    }
                );

                return;
            }


            // =========================================
            // FREE USER HAS REACHED LIMIT
            // =========================================

            if (solvedCount >= 10) {

                callback(
                    null,
                    {
                        allowed: false,
                        solvedCount,
                        alreadySolved: false,
                        isPremium: false
                    }
                );

                return;
            }


            // =========================================
            // FREE USER CAN SOLVE
            // =========================================

            callback(
                null,
                {
                    allowed: true,
                    solvedCount,
                    alreadySolved: false,
                    isPremium: false
                }
            );

        }
    );
};



// =====================================================
// MARK QUESTION AS SOLVED
// =====================================================

const markSolved = (
    req,
    res
) => {

    const userId =
        req.user.user_id;

    const {
        questionId
    } = req.params;


    if (!questionId) {

        return res.status(400).json({

            success: false,

            message:
                "questionId is required"

        });

    }


    SolvedQuestion.markSolved(
        userId,
        questionId,

        (err, result) => {

            if (err) {

                if (
                    err.code ===
                    "ER_DUP_ENTRY"
                ) {

                    return res.status(400).json({

                        success: false,

                        message:
                            "Question is already marked as solved"

                    });

                }


                console.error(
                    err
                );


                return res.status(500).json({

                    success: false,

                    message:
                        "Failed to mark question as solved"

                });

            }


            return res.status(201).json({

                success: true,

                message:
                    "Question marked as solved successfully"

            });

        }
    );
};



// =====================================================
// GET ALL SOLVED QUESTIONS
// =====================================================

const getSolvedQuestions = (
    req,
    res
) => {

    const userId =
        req.user.user_id;


    SolvedQuestion.getSolvedQuestions(
        userId,

        (err, results) => {

            if (err) {

                console.error(
                    err
                );


                return res.status(500).json({

                    success: false,

                    message:
                        "Failed to fetch solved questions"

                });

            }


            return res.status(200).json({

                success: true,

                count:
                    results.length,

                solvedQuestions:
                    results

            });

        }
    );
};



// =====================================================
// CHECK WHETHER QUESTION IS SOLVED
// =====================================================

const checkSolved = (
    req,
    res
) => {

    const userId =
        req.user.user_id;

    const {
        questionId
    } = req.params;


    SolvedQuestion.checkSolved(
        userId,
        questionId,

        (err, results) => {

            if (err) {

                console.error(
                    err
                );


                return res.status(500).json({

                    success: false,

                    message:
                        "Failed to check solved status"

                });

            }


            return res.status(200).json({

                success: true,

                solved:
                    results.length > 0

            });

        }
    );
};



// =====================================================
// EXPORT
// =====================================================

module.exports = {

    markSolved,

    getSolvedQuestions,

    checkSolved,

    checkFreeLimit

};