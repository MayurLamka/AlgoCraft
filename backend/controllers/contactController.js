
const db = require("../config/db");

const ensureTable = (callback) => {
    const sql = `
        CREATE TABLE IF NOT EXISTS contact_messages (
            message_id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(100) NOT NULL,
            email VARCHAR(255) NOT NULL,
            subject VARCHAR(200) NOT NULL,
            message TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    `;

    db.query(sql, callback);
};

const createContactMessage = (req, res) => {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
        return res.status(400).json({
            success: false,
            message: "Name, email, subject and message are required"
        });
    }

    if (String(name).trim().length < 2) {
        return res.status(400).json({
            success: false,
            message: "Please enter a valid name"
        });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email).trim())) {
        return res.status(400).json({
            success: false,
            message: "Please enter a valid email address"
        });
    }

    if (String(message).trim().length < 5) {
        return res.status(400).json({
            success: false,
            message: "Please enter a longer message"
        });
    }

    ensureTable((tableError) => {
        if (tableError) {
            console.error("Contact table error:", tableError);
            return res.status(500).json({
                success: false,
                message: "Unable to save your message"
            });
        }

        const sql = `
            INSERT INTO contact_messages
                (name, email, subject, message)
            VALUES (?, ?, ?, ?)
        `;

        db.query(
            sql,
            [
                String(name).trim(),
                String(email).trim(),
                String(subject).trim(),
                String(message).trim()
            ],
            (error, result) => {
                if (error) {
                    console.error("Contact message error:", error);
                    return res.status(500).json({
                        success: false,
                        message: "Unable to save your message"
                    });
                }

                return res.status(201).json({
                    success: true,
                    message: "Message sent successfully",
                    message_id: result.insertId
                });
            }
        );
    });
};

module.exports = {
    createContactMessage
};
