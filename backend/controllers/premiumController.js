const crypto = require("crypto");
const Premium = require("../models/Premium");

const PREMIUM_AMOUNT = 99;
const SESSION_MINUTES = 10;


// ==========================================
// CREATE PAYMENT SESSION
// ==========================================

const createSession = (req, res) => {

    const userId =
        req.user.user_id;

    const appUrl =
        String(
            req.body?.appUrl || ""
        ).trim();


    if (!appUrl) {

        return res.status(400).json({
            success: false,
            message: "appUrl is required"
        });

    }


    let parsedUrl;

    try {

        parsedUrl =
            new URL(appUrl);

    } catch {

        return res.status(400).json({
            success: false,
            message: "Invalid appUrl"
        });

    }


    if (
        !["http:", "https:"]
            .includes(parsedUrl.protocol)
    ) {

        return res.status(400).json({
            success: false,
            message: "Invalid appUrl protocol"
        });

    }


    const sessionToken =
        crypto
            .randomBytes(32)
            .toString("hex");


    const expiresAt =
        new Date(
            Date.now() +
            SESSION_MINUTES * 60 * 1000
        );


    Premium.createPaymentSession(
        userId,
        sessionToken,
        PREMIUM_AMOUNT,
        expiresAt,
        (err) => {

            if (err) {

                console.error(
                    "CREATE PREMIUM SESSION:",
                    err
                );

                return res.status(500).json({
                    success: false,
                    message:
                        "Could not create payment session"
                });

            }


            return res.status(201).json({

                success: true,

                amount:
                    PREMIUM_AMOUNT,

                expiresAt,

                paymentUrl:
                    `${parsedUrl.origin}/demo-payment/${sessionToken}`

            });

        }
    );
};


// ==========================================
// GET PAYMENT SESSION
// ==========================================

const getSession = (req, res) => {

    const { token } = req.params;

    if (!token) {

        return res.status(400).json({
            success: false,
            message: "Payment session token is required"
        });

    }

    Premium.findSession(
        token,
        (err, results) => {

            if (err) {

                console.error(
                    "GET PREMIUM SESSION:",
                    err
                );

                return res.status(500).json({
                    success: false,
                    message: "Could not load payment session"
                });

            }

            if (!results.length) {

                return res.status(404).json({
                    success: false,
                    message: "Payment session not found"
                });

            }

            const session = results[0];

            return res.json({

                success: true,

                session: {

                    amount:
                        Number(session.amount),

                    plan:
                        session.plan,

                    status:
                        session.status,

                    expiresAt:
                        session.expires_at,

                    paidAt:
                        session.paid_at

                }

            });

        }
    );
};


// ==========================================
// COMPLETE DEMO PAYMENT
// ==========================================

const completeSession = (
    req,
    res
) => {

    const { token } =
        req.body || {};


    if (!token) {

        return res.status(400).json({
            success: false,
            message:
                "Payment session token is required"
        });

    }


    Premium.findSession(
        token,
        (findErr, results) => {

            if (findErr) {

                console.error(
                    "FIND PREMIUM SESSION:",
                    findErr
                );

                return res.status(500).json({
                    success: false,
                    message:
                        "Could not verify payment session"
                });

            }


            if (!results.length) {

                return res.status(404).json({
                    success: false,
                    message:
                        "Payment session not found"
                });

            }


            const session =
                results[0];


            if (
                session.status === "paid"
            ) {

                return res.json({

                    success: true,

                    message:
                        "Premium is already active"

                });

            }


            if (
                new Date(
                    session.expires_at
                ).getTime() <= Date.now()
            ) {

                return res.status(410).json({
                    success: false,
                    message:
                        "Payment session expired"
                });

            }


            Premium.completeSession(
                token,
                (completeErr, result) => {

                    if (completeErr) {

                        console.error(
                            "COMPLETE PREMIUM SESSION:",
                            completeErr
                        );

                        return res.status(500).json({
                            success: false,
                            message:
                                "Payment could not be completed"
                        });

                    }


                    if (
                        result.affectedRows !== 1
                    ) {

                        return res.status(409).json({
                            success: false,
                            message:
                                "Payment session is no longer available"
                        });

                    }


                    Premium.activatePremium(
                        session.user_id,
                        (activateErr) => {

                            if (activateErr) {

                                console.error(
                                    "ACTIVATE PREMIUM:",
                                    activateErr
                                );

                                return res.status(500).json({
                                    success: false,
                                    message:
                                        "Payment succeeded but premium activation failed"
                                });

                            }


                            return res.json({

                                success: true,

                                message:
                                    "Demo payment successful. Premium activated.",

                                premium: true

                            });

                        }
                    );

                }
            );

        }
    );
};


// ==========================================
// PREMIUM STATUS
// ==========================================

const getStatus = (
    req,
    res
) => {

    Premium.getStatus(
        req.user.user_id,
        (err, results) => {

            if (err) {

                console.error(
                    "GET PREMIUM STATUS:",
                    err
                );

                return res.status(500).json({
                    success: false,
                    message:
                        "Could not load premium status"
                });

            }


            if (!results.length) {

                return res.status(404).json({
                    success: false,
                    message:
                        "User not found"
                });

            }


            const user =
                results[0];


            const active =
                Number(
                    user.is_premium
                ) === 1 &&
                user.premium_expires_at &&
                new Date(
                    user.premium_expires_at
                ).getTime() > Date.now();


            return res.json({

                success: true,

                isPremium:
                    active,

                premiumExpiresAt:
                    user.premium_expires_at

            });

        }
    );
};


module.exports = {
    createSession,
    getSession,
    completeSession,
    getStatus
};