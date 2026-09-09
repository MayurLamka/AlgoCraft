const db = require("../config/db");
const Question = require("../models/Question");


// =====================================================
// GET DATABASE CONNECTION
// =====================================================

const getConnection = () => {

    return new Promise((resolve, reject) => {

        // If db is a pool
        if (typeof db.getConnection === "function") {

            db.getConnection((err, connection) => {

                if (err) {
                    reject(err);
                    return;
                }

                resolve({
                    connection,
                    release: true
                });

            });

        } else {

            // If db is a single connection
            resolve({
                connection: db,
                release: false
            });

        }

    });

};


// =====================================================
// RUN QUERY
// =====================================================

const runQuery = (connection, sql, values = []) => {

    return new Promise((resolve, reject) => {

        connection.query(
            sql,
            values,
            (error, results) => {

                if (error) {
                    reject(error);
                    return;
                }

                resolve(results);

            }
        );

    });

};


// =====================================================
// CREATE QUESTION
// =====================================================

const createQuestion = async (req, res) => {

    let connection = null;
    let shouldRelease = false;

    try {

        const {
            title,
            difficulty,
            description,

            // Accept both names so frontend/backend
            // mismatch does not cause a problem.
            youtube_link,
            youtubeLink,

            topics,
            constraints,
            examples,
            hints,
            testCases,
            templates,
            solution

        } = req.body;


        // =================================================
        // VALIDATION
        // =================================================

        if (!title || !title.trim()) {

            return res.status(400).json({
                success: false,
                message: "Title is required"
            });

        }


        if (!difficulty) {

            return res.status(400).json({
                success: false,
                message: "Difficulty is required"
            });

        }


        const allowedDifficulty = [
            "Easy",
            "Medium",
            "Hard"
        ];


        if (!allowedDifficulty.includes(difficulty)) {

            return res.status(400).json({
                success: false,
                message:
                    "Difficulty must be Easy, Medium, or Hard"
            });

        }


        // =================================================
        // NORMALIZE DATA
        // =================================================

        const topicList =
            Array.isArray(topics)
                ? topics
                : [];


        const constraintList =
            Array.isArray(constraints)
                ? constraints
                : [];


        const exampleList =
            Array.isArray(examples)
                ? examples
                : [];


        const hintList =
            Array.isArray(hints)
                ? hints
                : [];


        const testCaseList =
            Array.isArray(testCases)
                ? testCases
                : [];


        const templateData =
            templates &&
            typeof templates === "object"
                ? templates
                : {};


        const solutionData =
            solution &&
            typeof solution === "object"
                ? solution
                : {};


        const youtubeLinkValue =
            youtube_link || youtubeLink || null;


        // =================================================
        // GET CONNECTION
        // =================================================

        const connectionData =
            await getConnection();

        connection =
            connectionData.connection;

        shouldRelease =
            connectionData.release;


        // =================================================
        // START TRANSACTION
        // =================================================

        await runQuery(
            connection,
            "START TRANSACTION"
        );


        try {

            // =============================================
            // 1. INSERT QUESTION
            // =============================================

            const questionResult = await runQuery(
                connection,

                `
                INSERT INTO questions
                (
                    title,
                    difficulty,
                    description,
                    youtube_link
                )
                VALUES (?, ?, ?, ?)
                `,

                [
                    title.trim(),
                    difficulty,
                    description || null,
                    youtubeLinkValue
                ]
            );


            const questionId =
                questionResult.insertId;


            // =============================================
            // 2. INSERT TOPICS
            // =============================================

            for (const topic of topicList) {

                // Supports:
                // 1
                // OR
                // { topic_id: 1 }

                const topicId =
                    typeof topic === "object"
                        ? topic.topic_id
                        : topic;


                if (!topicId) {
                    continue;
                }


                await runQuery(
                    connection,

                    `
                    INSERT INTO question_topics
                    (
                        question_id,
                        topic_id
                    )
                    VALUES (?, ?)
                    `,

                    [
                        questionId,
                        topicId
                    ]
                );

            }


            // =============================================
            // 3. INSERT CONSTRAINTS
            // =============================================

            let constraintNumber = 1;


            for (const constraint of constraintList) {

                const constraintText =
                    typeof constraint === "string"
                        ? constraint
                        : constraint.constraint_text;


                if (
                    !constraintText ||
                    !constraintText.trim()
                ) {
                    continue;
                }


                await runQuery(
                    connection,

                    `
                    INSERT INTO question_constraints
                    (
                        question_id,
                        constraint_number,
                        constraint_text
                    )
                    VALUES (?, ?, ?)
                    `,

                    [
                        questionId,
                        constraintNumber,
                        constraintText.trim()
                    ]
                );


                constraintNumber++;

            }


            // =============================================
            // 4. INSERT EXAMPLES
            // =============================================

            let exampleNumber = 1;


            for (const example of exampleList) {

                if (
                    !example.input &&
                    !example.output
                ) {
                    continue;
                }


                await runQuery(
                    connection,

                    `
                    INSERT INTO question_examples
                    (
                        question_id,
                        example_number,
                        input,
                        execution_input,
                        output,
                        explanation
                    )
                    VALUES (?, ?, ?, ?, ?, ?)
                    `,

                    [
                        questionId,

                        exampleNumber,

                        example.input || "",

                        example.execution_input ||
                        null,

                        example.output || "",

                        example.explanation ||
                        null
                    ]
                );


                exampleNumber++;

            }


            // =============================================
            // 5. INSERT HINTS
            // =============================================

            let hintNumber = 1;


            for (const hint of hintList) {

                const hintText =
                    typeof hint === "string"
                        ? hint
                        : hint.hint_text;


                if (
                    !hintText ||
                    !hintText.trim()
                ) {
                    continue;
                }


                await runQuery(
                    connection,

                    `
                    INSERT INTO question_hints
                    (
                        question_id,
                        hint_number,
                        hint_text
                    )
                    VALUES (?, ?, ?)
                    `,

                    [
                        questionId,
                        hintNumber,
                        hintText.trim()
                    ]
                );


                hintNumber++;

            }


            // =============================================
            // 6. INSERT TEST CASES
            // =============================================

            for (const testCase of testCaseList) {

                if (
                    !testCase.input_data &&
                    !testCase.expected_output
                ) {
                    continue;
                }


                await runQuery(
                    connection,

                    `
                    INSERT INTO test_cases
                    (
                        question_id,
                        input_data,
                        expected_output,
                        is_hidden
                    )
                    VALUES (?, ?, ?, ?)
                    `,

                    [
                        questionId,

                        testCase.input_data ||
                        "",

                        testCase.expected_output ||
                        "",

                        testCase.is_hidden ? 1 : 0
                    ]
                );

            }


            // =============================================
            // 7. INSERT CODE TEMPLATES
            // =============================================

            const languages = [
                "cpp",
                "java",
                "python",
                "javascript"
            ];


            for (const language of languages) {

                const starterCode =
                    templateData[language];


                if (
                    starterCode === undefined ||
                    starterCode === null ||
                    starterCode === ""
                ) {
                    continue;
                }


                await runQuery(
                    connection,

                    `
                    INSERT INTO code_templates
                    (
                        question_id,
                        language,
                        starter_code
                    )
                    VALUES (?, ?, ?)
                    `,

                    [
                        questionId,
                        language,
                        starterCode
                    ]
                );

            }


            // =============================================
            // 8. INSERT OFFICIAL SOLUTIONS
            // =============================================

            const solutionLanguages = [
                "cpp",
                "java",
                "python",
                "javascript"
            ];


            for (const language of solutionLanguages) {

                const code =
                    solutionData[language];


                if (
                    code === undefined ||
                    code === null ||
                    code === ""
                ) {
                    continue;
                }


                await runQuery(
                    connection,

                    `
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
                    `,

                    [
                        questionId,

                        language,

                        solutionData.approach ||
                        null,

                        solutionData.explanation ||
                        null,

                        solutionData.time_complexity ||
                        null,

                        solutionData.space_complexity ||
                        null,

                        code
                    ]
                );

            }


            // =============================================
            // COMMIT
            // =============================================

            await runQuery(
                connection,
                "COMMIT"
            );


            // =============================================
            // SUCCESS
            // =============================================

            return res.status(201).json({

                success: true,

                message:
                    "Question created successfully",

                question_id:
                    questionId

            });

        } catch (error) {

            // =============================================
            // ROLLBACK
            // =============================================

            await runQuery(
                connection,
                "ROLLBACK"
            );

            throw error;

        }

    } catch (error) {

        console.error(
            "CREATE QUESTION ERROR:",
            error
        );


        return res.status(500).json({

            success: false,

            message:
                "Failed to create question",

            error:
                error.message

        });

    } finally {

        if (
            connection &&
            shouldRelease &&
            typeof connection.release === "function"
        ) {

            connection.release();

        }

    }

};


// =====================================================
// GET ALL QUESTIONS FOR ADMIN
// =====================================================

const getAllQuestionsforAdmin = (req, res) => {

    Question.getAllQuestionsAdmin(

        (err, results) => {

            if (err) {

                console.error(err);

                return res.status(500).json({

                    success: false,

                    message:
                        "Failed to fetch questions"

                });

            }


            return res.status(200).json({

                success: true,

                count: results.length,

                questions: results

            });

        }

    );

};


// =====================================================
// UPDATE QUESTION
// =====================================================

const updateQuestion = (req, res) => {

    const questionId =
        req.params.id;


    const {
        title,
        difficulty,
        description,
        youtube_link,
        youtubeLink
    } = req.body;


    if (!title || !difficulty) {

        return res.status(400).json({

            success: false,

            message:
                "Title and difficulty are required"

        });

    }


    const allowedDifficulty = [
        "Easy",
        "Medium",
        "Hard"
    ];


    if (!allowedDifficulty.includes(difficulty)) {

        return res.status(400).json({

            success: false,

            message:
                "Difficulty must be Easy, Medium, or Hard"

        });

    }


    Question.updateQuestion(

        questionId,

        title,

        difficulty,

        description || null,

        youtube_link ||
        youtubeLink ||
        null,

        (err, result) => {

            if (err) {

                console.error(err);

                return res.status(500).json({

                    success: false,

                    message:
                        "Failed to update question"

                });

            }


            if (result.affectedRows === 0) {

                return res.status(404).json({

                    success: false,

                    message:
                        "Question not found"

                });

            }


            return res.status(200).json({

                success: true,

                message:
                    "Question updated successfully"

            });

        }

    );

};


// =====================================================
// DELETE QUESTION
// =====================================================

const deleteQuestion = (req, res) => {

    const questionId =
        req.params.id;


    Question.deleteQuestion(

        questionId,

        (err, result) => {

            if (err) {

                console.error(err);

                return res.status(500).json({

                    success: false,

                    message:
                        "Failed to delete question"

                });

            }


            if (result.affectedRows === 0) {

                return res.status(404).json({

                    success: false,

                    message:
                        "Question not found"

                });

            }


            return res.status(200).json({

                success: true,

                message:
                    "Question deleted successfully"

            });

        }

    );

};


// =====================================================
// EXPORT
// =====================================================

module.exports = {

    createQuestion,

    getAllQuestionsforAdmin,

    updateQuestion,

    deleteQuestion

};