import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";
import algoCraftLogo from "../assets/algocraft-logo.svg";

function DemoPayment() {
    const { token } = useParams();
    const navigate = useNavigate();

    const [session, setSession] = useState(null);
    const [loading, setLoading] = useState(true);
    const [paying, setPaying] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        const loadSession = async () => {
            try {
                const response = await api.get(
                    `/premium/session/${token}`
                );

                setSession(response.data.session);

                if (response.data.session.status === "paid") {
                    setSuccess(true);
                }
            } catch (err) {
                setError(
                    err.response?.data?.message ||
                    "This payment session is invalid or expired."
                );
            } finally {
                setLoading(false);
            }
        };

        loadSession();
    }, [token]);

    const pay = async () => {
        try {
            setPaying(true);
            setError("");

            await api.post(
                "/premium/complete-session",
                { token }
            );

            setSuccess(true);
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Demo payment failed."
            );
        } finally {
            setPaying(false);
        }
    };

    if (loading) {
        return (
            <div className="demo-payment-page">
                <div className="demo-payment-card">
                    <div className="premium-loader" />
                    <p>Loading payment...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="demo-payment-page">
            <div className="demo-payment-grid" />

            <header className="demo-payment-navbar">
                <img src={algoCraftLogo} alt="AlgoCraft" />
                <span>DEMO CHECKOUT</span>
            </header>

            <main className="demo-payment-card">

                {success ? (
                    <>
                        <div className="premium-success-icon">
                            ✓
                        </div>

                        <span className="section-kicker">
                            PAYMENT SUCCESSFUL
                        </span>

                        <h1>
                            Premium is
                            <span> active.</span>
                        </h1>

                        <p>
                            Return to the AlgoCraft window.
                            Unlimited solving has been unlocked.
                        </p>

                        <button
                            className="premium-get-button"
                            onClick={() => navigate("/dashboard")}
                        >
                            Open AlgoCraft ↗
                        </button>
                    </>
                ) : (
                    <>
                        <span className="section-kicker">
                            ALGOCRAFT PREMIUM
                        </span>

                        <h1>
                            Demo payment
                            <span> checkout.</span>
                        </h1>

                        <p>
                            This is a demonstration payment screen.
                            No real money will be charged.
                        </p>

                        <div className="demo-payment-product">
                            <div>
                                <strong>AlgoCraft Pro</strong>
                                <small>Unlimited DSA practice</small>
                            </div>

                            <strong>₹99</strong>
                        </div>

                        <div className="demo-payment-divider" />

                        <div className="demo-payment-total">
                            <span>Total</span>
                            <strong>₹99</strong>
                        </div>

                        {error && (
                            <p className="premium-payment-error">
                                {error}
                            </p>
                        )}

                        <button
                            className="premium-get-button demo-pay-button"
                            onClick={pay}
                            disabled={paying || !session}
                        >
                            {paying
                                ? "Processing..."
                                : "Pay ₹99 (Demo)"}
                        </button>

                        <p className="premium-demo-note">
                            🔒 Secure demo flow · No real transaction
                        </p>
                    </>
                )}
            </main>
        </div>
    );
}

export default DemoPayment;
