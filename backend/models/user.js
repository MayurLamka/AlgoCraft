const db = require("../config/db");

// Find user by email
const findByEmail = (email, callback) => {
    const sql = "SELECT * FROM users WHERE email = ?";

    db.query(sql, [email], callback);
};

// Insert new user
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

module.exports = {
    findByEmail,
    createUser
};