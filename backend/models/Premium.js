const db = require("../config/db");

const createPaymentSession = (
    userId,
    sessionToken,
    amount,
    expiresAt,
    callback
) => {

    const sql = `
        INSERT INTO premium_payments
            (user_id, session_token, amount, plan, status, expires_at)
        VALUES (?, ?, ?, 'monthly', 'pending', ?)
    `;

    db.query(
        sql,
        [
            userId,
            sessionToken,
            amount,
            expiresAt
        ],
        callback
    );
};


const findSession = (
    sessionToken,
    callback
) => {

    const sql = `
        SELECT
            payment_id,
            user_id,
            amount,
            plan,
            status,
            expires_at,
            created_at,
            paid_at
        FROM premium_payments
        WHERE session_token = ?
        LIMIT 1
    `;

    db.query(
        sql,
        [sessionToken],
        callback
    );
};


const completeSession = (
    sessionToken,
    callback
) => {

    const sql = `
        UPDATE premium_payments
        SET
            status = 'paid',
            paid_at = NOW()
        WHERE
            session_token = ?
            AND status = 'pending'
            AND expires_at > NOW()
    `;

    db.query(
        sql,
        [sessionToken],
        callback
    );
};


const activatePremium = (
    userId,
    callback
) => {

    const sql = `
        UPDATE users
        SET
            is_premium = 1,

            premium_expires_at =
                DATE_ADD(
                    GREATEST(
                        COALESCE(
                            premium_expires_at,
                            NOW()
                        ),
                        NOW()
                    ),
                    INTERVAL 1 MONTH
                )

        WHERE user_id = ?
    `;

    db.query(
        sql,
        [userId],
        callback
    );
};


const getStatus = (
    userId,
    callback
) => {

    const sql = `
        SELECT
            is_premium,
            premium_expires_at
        FROM users
        WHERE user_id = ?
        LIMIT 1
    `;

    db.query(
        sql,
        [userId],
        callback
    );
};


module.exports = {
    createPaymentSession,
    findSession,
    completeSession,
    activatePremium,
    getStatus
};