const db = require("../config/db");

// Create a submission
const createSubmission = (
    userId,
    questionId,
    language,
    code,
    status,
    executionTime,
    memoryUsed,
    totalTests,
    passedTests,
    callback
) => {

    const sql = `
        INSERT INTO submissions
        (
            user_id,
            question_id,
            language,
            code,
            status,
            execution_time,
            memory_used,
            total_tests,
            passed_tests
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(
        sql,
        [
            userId,
            questionId,
            language,
            code,
            status,
            executionTime,
            memoryUsed,
            totalTests,
            passedTests
        ],
        callback
    );
};


// Get all submissions of a user
const getUserSubmissions = (userId, callback) => {

    const sql = `
        SELECT
            s.submission_id,
            s.user_id,
            s.question_id,
            q.title,
            q.difficulty,
            s.language,
            s.status,
            s.execution_time,
            s.memory_used,
            s.submitted_at
        FROM submissions s
        JOIN questions q
            ON s.question_id = q.question_id
        WHERE s.user_id = ?
        ORDER BY s.submitted_at DESC
    `;

    db.query(sql, [userId], callback);
};


// Get submissions for a question
const getQuestionSubmissions = (
    userId,
    questionId,
    callback
) => {

    const sql = `
    SELECT
        s.submission_id,
        s.user_id,
        s.question_id,
        q.title,
        s.language,
        s.status,
        s.execution_time,
        s.memory_used,
        s.total_tests,
        s.passed_tests,
        s.submitted_at
    FROM submissions s
    JOIN questions q
        ON s.question_id = q.question_id
    WHERE s.user_id = ?
      AND s.question_id = ?
    ORDER BY s.submitted_at DESC
`;

db.query(
    sql,
    [userId, questionId],
    callback
);
};


module.exports = {
    createSubmission,
    getUserSubmissions,
    getQuestionSubmissions
};