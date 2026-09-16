const db = require("../config/db");

// ==========================================
// Find user by email
// ==========================================
const findByEmail = (email, callback) => {

    const sql = `
        SELECT *
        FROM users
        WHERE email = ?
    `;

    db.query(sql, [email], callback);
};


// ==========================================
// Find user by ID
// ==========================================
const findById = (userId, callback) => {

    const sql = `
        SELECT
            user_id,
            name,
            email,
            mobile_number,
            profile_picture,
            role,
            created_at
        FROM users
        WHERE user_id = ?
    `;

    db.query(sql, [userId], callback);
};


// ==========================================
// Create user
// ==========================================
const createUser = (
    name,
    email,
    mobile_number,
    password,
    callback
) => {

    const sql = `
        INSERT INTO users
        (name, email, mobile_number, password)
        VALUES (?, ?, ?, ?)
    `;

    db.query(
        sql,
        [
            name,
            email,
            mobile_number,
            password
        ],
        callback
    );
};


// ==========================================
// Update profile
// ==========================================
const updateProfile = (
    userId,
    name,
    profilePicture,
    callback
) => {

    const sql = `
        UPDATE users
        SET
            name = ?,
            profile_picture = ?
        WHERE user_id = ?
    `;

    db.query(
        sql,
        [
            name,
            profilePicture,
            userId
        ],
        callback
    );
};


// ==========================================
// Update name only
// ==========================================
const updateName = (
    userId,
    name,
    callback
) => {

    const sql = `
        UPDATE users
        SET name = ?
        WHERE user_id = ?
    `;

    db.query(
        sql,
        [name, userId],
        callback
    );
};


// ==========================================
// Update password
// ==========================================
const updatePassword = (
    userId,
    password,
    callback
) => {

    const sql = `
        UPDATE users
        SET password = ?
        WHERE user_id = ?
    `;

    db.query(
        sql,
        [password, userId],
        callback
    );
};

const findByIdWithPassword = (
    userId,
    callback
) => {

    const sql = `
        SELECT *
        FROM users
        WHERE user_id = ?
    `;

    db.query(
        sql,
        [userId],
        callback
    );
};


module.exports = {
    findByEmail,
    findById,
    createUser,
    updateProfile,
    updateName,
    updatePassword,
    findByIdWithPassword 
};