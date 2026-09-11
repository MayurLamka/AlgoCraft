const db = require("../config/db");

const {
    judgeCpp,
    judgeJava,
    judgePython,
    judgeJavaScript
} = require("./codeRunner");


// =====================================================
// NORMALIZE OUTPUT
// =====================================================

const normalizeOutput = (
    output = ""
) => {

    return output
        .replace(/\r\n/g, "\n")
        .replace(/\r/g, "\n")
        .trim();
};


// =====================================================
// GET TEST CASES
// =====================================================

const getTestCases = (
    questionId
) => {

    return new Promise(
        (resolve, reject) => {

            const sql = `
                SELECT
                    test_case_id,
                    input_data,
                    expected_output,
                    is_hidden
                FROM test_cases
                WHERE question_id = ?
                ORDER BY test_case_id ASC
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
};


// =====================================================
// PARSE TEST OUTPUT
// =====================================================

const parseTestResults = (
    output,
    testCases
) => {

    const results = [];


    for (
        let i = 0;
        i < testCases.length;
        i++
    ) {

        const startMarker =
            `__TEST_${i}_START__`;

        const endMarker =
            `__TEST_${i}_END__`;


        const startIndex =
            output.indexOf(
                startMarker
            );


        if (startIndex === -1) {

            results.push({

                executionFound: false,

                output: ""

            });

            continue;
        }


        const contentStart =
            startIndex +
            startMarker.length;


        const endIndex =
            output.indexOf(
                endMarker,
                contentStart
            );


        const actualOutput =
            endIndex === -1
                ? output.substring(
                    contentStart
                )
                : output.substring(
                    contentStart,
                    endIndex
                );


        results.push({

            executionFound: true,

            output:
                actualOutput.trim()
        });
    }


    return results;
};


// =====================================================
// JUDGE CODE
// =====================================================

const judgeCode = async (
    code,
    questionId,
    language
) => {

    try {

        // =============================================
        // 1. GET TEST CASES
        // =============================================

        const testCases =
            await getTestCases(
                questionId
            );


        if (
            testCases.length === 0
        ) {

            return {

                success: false,

                status:
                    "No Test Cases",

                message:
                    "No test cases found"
            };
        }


        // =============================================
        // 2. COMPILE ONCE + RUN ALL
        // =============================================

       let execution;

switch (language.toLowerCase()) {

    case "cpp":

        execution =
            await judgeCpp(
                code,
                testCases
            );

        break;


    case "java":

        execution =
            await judgeJava(
                code,
                testCases
            );

        break;


    case "python":

        execution =
            await judgePython(
                code,
                testCases
            );

        break;


    case "javascript":

        execution =
            await judgeJavaScript(
                code,
                testCases
            );

        break;


    default:

        return {

            success: false,

            status: "Unsupported Language",

            message:
                `Unsupported language: ${language}`
        };
}


        // =============================================
        // COMPILATION ERROR
        // =============================================

        if (
            execution.status ===
            "Compilation Error"
        ) {

            return {

                success: false,

                status:
                    "Compilation Error",

                allPassed: false,

                totalTests:
                    testCases.length,

                passedTests: 0,

                results: [],

                error:
                    execution.error
            };
        }


        // =============================================
        // TLE
        // =============================================

        if (
            execution.status ===
            "Time Limit Exceeded"
        ) {

            return {

                success: true,

                status:
                    "Failed",

                allPassed: false,

                totalTests:
                    testCases.length,

                passedTests: 0,

                results: [],

                error:
                    execution.error
            };
        }


        // =============================================
        // RUNTIME ERROR
        // =============================================

        if (
            execution.status ===
            "Runtime Error"
        ) {

            return {

                success: true,

                status:
                    "Failed",

                allPassed: false,

                totalTests:
                    testCases.length,

                passedTests: 0,

                results: [],

                error:
                    execution.error
            };
        }


        // =============================================
        // 3. PARSE OUTPUT
        // =============================================

        const testOutputs =
            parseTestResults(
                execution.output,
                testCases
            );


        const results = [];


        // =============================================
        // 4. COMPARE TESTS
        // =============================================

        for (
            let i = 0;
            i < testCases.length;
            i++
        ) {

            const testCase =
                testCases[i];

            const parsed =
                testOutputs[i];


            const actualOutput =
                normalizeOutput(
                    parsed.output
                );


            const expectedOutput =
                normalizeOutput(
                    testCase.expected_output
                );


            const passed =
                parsed.executionFound &&
                actualOutput ===
                    expectedOutput;


            const status =
                passed
                    ? "Passed"
                    : "Wrong Answer";


            // =========================================
            // PUBLIC
            // =========================================

            if (
                Number(testCase.is_hidden) === 0
            ) {

                results.push({

                    testCaseId:
                        testCase.test_case_id,

                    testCaseNumber:
                        i + 1,

                    hidden: false,

                    passed,

                    status,

                    input:
                        testCase.input_data || "",

                    expectedOutput,

                    actualOutput,

                    error: ""
                });

            }


            // =========================================
            // HIDDEN
            // =========================================

            else {

                results.push({

                    testCaseId:
                        testCase.test_case_id,

                    testCaseNumber:
                        i + 1,

                    hidden: true,

                    passed,

                    status,

                    input: "",

                    expectedOutput: "",

                    actualOutput:
                        passed
                            ? ""
                            : actualOutput,

                    error: ""
                });
            }
        }


        // =============================================
        // 5. FINAL RESULT
        // =============================================

        const allPassed =
            results.length ===
                testCases.length &&
            results.every(
                result =>
                    result.passed
            );


        return {

            success: true,

            status:
                allPassed
                    ? "Accepted"
                    : "Failed",

            allPassed,

            totalTests:
                testCases.length,

            passedTests:
                results.filter(
                    result =>
                        result.passed
                ).length,

            results
        };


    } catch (error) {

        console.error(
            "JUDGE ERROR:",
            error
        );


        return {

            success: false,

            status:
                "Judge Error",

            message:
                error.message
        };
    }
};


module.exports = {
    judgeCode
};