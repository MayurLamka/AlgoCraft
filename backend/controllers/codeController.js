const db = require("../config/db");
const SolvedQuestion = require("../models/SolvedQuestion");
const {
    checkFreeLimit
} = require("./SolvedQuestionController");
const Submission = require("../models/Submission");
const { runCodeByLanguage } = require("../services/codeRunner");

const {
    judgeCode
} = require("../services/judgeService");


// =====================================================
// RUN CODE
// =====================================================

const runCode = async (req, res) => {

    try {

        const {
            questionId,
            language,
            code
        } = req.body;


        // =============================================
        // VALIDATION
        // =============================================

        if (
            !questionId ||
            !language ||
            !code
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "questionId, language and code are required"
            });
        }


        // =============================================
        // GET QUESTION EXAMPLES
        // =============================================

        const examples = await new Promise(
            (resolve, reject) => {

                const sql = `
    SELECT
        example_id,
        example_number,
        input,
        execution_input,
        output
    FROM question_examples
    WHERE question_id = ?
    ORDER BY example_number ASC
`;


                db.query(
                    sql,
                    [questionId],
                    (error, results) => {

                        if (error) {
                            reject(error);
                            return;
                        }

                        resolve(results);
                    }
                );
            }
        );


        // =============================================
        // NO EXAMPLES
        // =============================================

        if (examples.length === 0) {

            return res.status(404).json({

                success: false,

                message:
                    "No examples found for this question"
            });
        }


        // =============================================
        // RUN CODE FOR EVERY EXAMPLE
        // =============================================

        const results = [];


        for (
            let i = 0;
            i < examples.length;
            i++
        ) {

            const example =
                examples[i];


            console.log(
                "================================="
            );

            console.log(
                "RUNNING EXAMPLE:",
                example.example_number
            );

            console.log(
                "DISPLAY INPUT:",
                JSON.stringify(example.input)
            );

            console.log(
                "EXECUTION INPUT:",
                JSON.stringify(example.execution_input)
            );

            console.log(
                "EXPECTED:",
                JSON.stringify(example.output)
            );

            console.log(
                "================================="
            );


            // =========================================
            // RUN C++
            // =========================================

            const execution =
                await runCodeByLanguage(
                    language,
                    code,
                    example.execution_input || ""
                );


            // =========================================
            // NORMALIZE OUTPUT
            // =========================================

            const actualOutput =
                (execution.output || "")
                    .replace(/\r\n/g, "\n")
                    .replace(/\r/g, "\n")
                    .trim();


            const expectedOutput =
                (example.output || "")
                    .replace(/\r\n/g, "\n")
                    .replace(/\r/g, "\n")
                    .trim();


            // =========================================
            // CHECK RESULT
            // =========================================

            const passed =
                execution.success &&
                actualOutput === expectedOutput;


            results.push({

                testCaseId:
                    example.example_id,

                testCaseNumber:
                    example.example_number,

                passed,

                status:
                    passed
                        ? "Passed"
                        : execution.status === "Success"
                            ? "Wrong Answer"
                            : execution.status,

                input:
                    example.input || "",

                expectedOutput,

                actualOutput,

                error:
                    execution.error || ""
            });


            // =========================================
            // DON'T STOP
            // RUN ALL EXAMPLES
            // =========================================
        }


        // =============================================
        // FINAL RESULT
        // =============================================

        const allPassed =
            results.every(
                result =>
                    result.passed
            );


        return res.status(200).json({

            success: true,

            status:
                allPassed
                    ? "Accepted"
                    : "Failed",

            allPassed,

            totalTests:
                results.length,

            passedTests:
                results.filter(
                    result =>
                        result.passed
                ).length,

            results
        });


    } catch (error) {

        console.error(
            "RUN CODE ERROR:",
            error
        );


        return res.status(500).json({

            success: false,

            message:
                "Code execution failed",

            error:
                error.message
        });
    }
};



// =====================================================
// SUBMIT CODE
// =====================================================

const submitCode = async (req, res) => {

    console.log("REQ.USER:", req.user);
    try {

        const {
            questionId,
            language,
            code
        } = req.body;

        const userId = req.user.user_id;

                // =============================================
        // VALIDATION
        // =============================================

        if (
            !questionId ||
            !language ||
            !code
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "questionId, language and code are required"
            });
        }

        // =============================================
// FREE USER LIMIT
// =============================================

const access =
    await new Promise(
        (resolve, reject) => {

            checkFreeLimit(

                userId,

                questionId,

                (
                    error,
                    result
                ) => {

                    if (error) {

                        reject(
                            error
                        );

                        return;
                    }

                    resolve(
                        result
                    );

                }
            );

        }
    );


if (!access.allowed) {

    return res.status(403).json({

        success: false,

        code:
            "PREMIUM_REQUIRED",

        message:
            "You have reached the 10 free questions limit. Get Premium to solve more questions.",

        solvedCount:
            access.solvedCount,

        freeLimit:
            10

    });

}





        

        // =============================================
        // 1. SAVE USER CODE
        // =============================================

        const saveCodeSql = `
            INSERT INTO user_code
                (user_id, question_id, language, code)
            VALUES (?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE
                code = VALUES(code)
        `;


        await new Promise((resolve, reject) => {

            db.query(
                saveCodeSql,
                [
                    userId,
                    questionId,
                    language,
                    code
                ],
                (error) => {

                    if (error) {
                        reject(error);
                        return;
                    }

                    resolve();
                }
            );

        });


        // =============================================
        // 2. JUDGE CODE
        // =============================================

       const result =
    await judgeCode(
        code,
        questionId,
        language
    );

        // =============================================
        // 3. SAVE SUBMISSION HISTORY
        // =============================================

        await new Promise((resolve, reject) => {

            Submission.createSubmission(
                userId,
                questionId,
                language,
                code,
                result.status,
                null,
                null,
                result.totalTests || 0,
                result.passedTests || 0,
                (error) => {

                    if (error) {

                        console.error(
                            "SAVE SUBMISSION ERROR:",
                            error
                        );

                        reject(error);
                        return;
                    }

                    resolve();
                }
            );

        });




        // =============================================
        // 4. ACCEPTED → MARK SOLVED
        // =============================================

        if (
            result.status === "Accepted"
        ) {

            await new Promise(
                (resolve, reject) => {

                    SolvedQuestion.markSolved(
                        userId,
                        questionId,
                        (error) => {

                            if (error) {
                                reject(error);
                                return;
                            }

                            resolve();
                        }
                    );

                }
            );

            result.isSolved = true;

        } else {

            result.isSolved = false;
        }


        // =============================================
        // 5. SEND RESULT
        // =============================================

        return res.status(200).json(
            result
        );


    } catch (error) {

        console.error(
            "SUBMIT CODE ERROR:",
            error
        );



        return res.status(500).json({

            success: false,

            message:
                "Submission failed",

            error:
                error.message
        });
    }
};


module.exports = {

    runCode,

    submitCode
};