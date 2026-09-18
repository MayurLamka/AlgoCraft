import React, { useEffect, useState } from "react";
import { QRCodeCanvas } from "qrcode.react";
import api from "../services/api";

function PremiumModal({ open, onClose, onPremium, isPremium = false }) {
    const [step, setStep] = useState("plans");
    const [paymentUrl, setPaymentUrl] = useState("");
    const [sessionToken, setSessionToken] = useState("");
    const [loading, setLoading] = useState(false);
    const [paymentError, setPaymentError] = useState("");
    const [success, setSuccess] = useState(false);
    const [expiresAt, setExpiresAt] = useState(null);

    useEffect(() => {
        if (!open) {
            setStep("plans");
            setPaymentUrl("");
            setSessionToken("");
            setLoading(false);
            setPaymentError("");
            setSuccess(false);
            setExpiresAt(null);
        }
    }, [open]);

    useEffect(() => {
        if (!open || step !== "payment" || !sessionToken) {
            return;
        }

        let stopped = false;

        const poll = async () => {
            try {
                const response = await api.get(
                    `/premium/session/${sessionToken}`
                );

                const session = response.data.session;

                if (
                    session?.status === "paid" &&
                    !stopped
                ) {
                    setSuccess(true);
                    setStep("success");
                    onPremium?.();
                    return;
                }
            } catch (error) {
                if (
                    error.response?.status === 410 &&
                    !stopped
                ) {
                    setPaymentError("Payment session expired. Create a new QR.");
                }
            }
        };

        poll();
        const timer = setInterval(poll, 1500);

        return () => {
            stopped = true;
            clearInterval(timer);
        };
    }, [open, step, sessionToken, onPremium]);

    if (!open) {
        return null;
    }

const createPayment = async () => {

    try {

        setLoading(true);
        setPaymentError("");

        const appUrl =
            window.location.origin;

        console.log(
            "PREMIUM APP URL:",
            appUrl
        );

        console.log(
            "PREMIUM TOKEN:",
            localStorage.getItem("token")
                ? "EXISTS"
                : "MISSING"
        );


        const response =
            await api.post(
                "/premium/create-session",
                {
                    appUrl: appUrl
                }
            );


        console.log(
            "PREMIUM RESPONSE:",
            response.data
        );


        if (
            !response.data ||
            !response.data.success
        ) {

            throw new Error(
                response.data?.message ||
                "Failed to create payment session"
            );

        }


        const paymentUrl =
            response.data.paymentUrl;


        setPaymentUrl(
            paymentUrl
        );


        setSessionToken(
            paymentUrl
                .split("/")
                .pop()
        );


        setStep("payment");


    } catch (error) {

        console.error(
            "PREMIUM ERROR:",
            error
        );

        console.error(
            "PREMIUM ERROR MESSAGE:",
            error.message
        );

        console.error(
            "PREMIUM ERROR RESPONSE:",
            error.response?.data
        );


        setPaymentError(
            error.response?.data?.message ||
            error.message ||
            "Could not create payment session."
        );


    } finally {

        setLoading(false);

    }
};

    const finishOnPhone = async () => {
        if (!sessionToken) return;

        try {
            setLoading(true);
            setPaymentError("");

            await api.post(
                "/premium/complete-session",
                { token: sessionToken }
            );

            setSuccess(true);
            setStep("success");
            onPremium?.();
        } catch (error) {
            setPaymentError(
                error.response?.data?.message ||
                "Demo payment failed."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            className="premium-modal-overlay"
            onMouseDown={(event) => {
                if (
                    event.target === event.currentTarget
                ) {
                    onClose();
                }
            }}
        >
            <div className="premium-modal">

                <button
                    className="premium-modal-close"
                    onClick={onClose}
                    aria-label="Close premium"
                >
                    ×
                </button>

                {step === "plans" && (
                    <>
                        <div className="premium-modal-glow" />

                        <div className="premium-modal-header">
                            <span className="section-kicker">
                                ALGOCRAFT PREMIUM
                            </span>

                            <h2>
                                Practice without the
                                <span> limit.</span>
                            </h2>

                            <p>
                                Unlock unlimited DSA practice and keep
                                solving beyond the 10-question free limit.
                            </p>
                        </div>

                        <div className="premium-plan-grid">

                            <div className="premium-plan free">
                                <div className="premium-plan-label">
                                    FREE
                                </div>

                                <h3>Starter</h3>

                                <div className="premium-price">
                                    ₹0
                                </div>

                                <p className="premium-price-note">
                                    Start practicing
                                </p>

                                <ul>
                                    <li>✓ 10 unique questions</li>
                                    <li>✓ Code editor</li>
                                    <li>✓ Run & submit</li>
                                    <li>✓ Progress tracking</li>
                                    <li className="muted">× Unlimited solving</li>
                                </ul>
                            </div>

                            <div className="premium-plan premium">
                                <div className="premium-plan-badge">
                                    RECOMMENDED
                                </div>

                                <div className="premium-plan-label">
                                    PREMIUM
                                </div>

                                <h3>AlgoCraft Pro</h3>

                                <div className="premium-price">
                                    ₹99<span>/month</span>
                                </div>

                                <p className="premium-price-note">
                                    Cancel anytime
                                </p>

                                <ul>
                                    <li>✓ Unlimited questions</li>
                                    <li>✓ Full coding workflow</li>
                                    <li>✓ Progress & revision</li>
                                    <li>✓ Interview preparation</li>
                                    <li>✓ Monthly premium access</li>
                                </ul>

                                <button
                                    className={
                                        isPremium
                                            ? "premium-get-button premium-already-active"
                                            : "premium-get-button"
                                    }
                                    disabled={isPremium}
                                    onClick={
                                        isPremium
                                            ? undefined
                                            : createPayment
                                    }
                                >
                                    {isPremium
                                        ? "✓ Premium Active"
                                        : "Get Premium"
                                    }
                                </button>
                            </div>

                        </div>

                        {paymentError && (
                            <p className="premium-payment-error">
                                {paymentError}
                            </p>
                        )}
                    </>
                )}

                {step === "payment" && (
                    <div className="premium-payment-step">

                        <div className="premium-payment-heading">
                            <span className="section-kicker">
                                DEMO PAYMENT
                            </span>

                            <h2>Scan to activate Premium.</h2>

                            <p>
                                Scan this QR with your phone. The phone
                                will open AlgoCraft's demo payment screen.
                            </p>
                        </div>

                        <div className="premium-qr-shell">
                            <div className="premium-scan-line" />
                            <QRCodeCanvas
                                value={paymentUrl}
                                size={230}
                                bgColor="#ffffff"
                                fgColor="#050505"
                                level="H"
                            />
                        </div>

                        <div className="premium-payment-amount">
                            <span>ALGOCRAFT PRO</span>
                            <strong>₹99 / month</strong>
                        </div>

                        <p className="premium-demo-note">
                            Demo only — no real money is charged.
                        </p>

                        <button
                            className="premium-demo-complete"
                            onClick={finishOnPhone}
                            disabled={loading}
                        >
                            {loading
                                ? "Processing..."
                                : "Complete Demo Payment"}
                        </button>

                        {paymentError && (
                            <p className="premium-payment-error">
                                {paymentError}
                            </p>
                        )}

                        <button
                            className="premium-back-button"
                            onClick={() => setStep("plans")}
                        >
                            ← Back
                        </button>
                    </div>
                )}

                {step === "success" && (
                    <div className="premium-success-step">

                        <div className="premium-success-icon">
                            ✓
                        </div>

                        <span className="section-kicker">
                            PAYMENT COMPLETE
                        </span>

                        <h2>
                            Welcome to
                            <span> Premium.</span>
                        </h2>

                        <p>
                            Your demo payment was successful.
                            Unlimited question solving is now active.
                        </p>

                        <div className="premium-success-line">
                            <span>PLAN</span>
                            <strong>₹99 / month</strong>
                        </div>

                        <button
                            className="premium-get-button"
                            onClick={onClose}
                        >
                            Start Solving ↗
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default PremiumModal;
