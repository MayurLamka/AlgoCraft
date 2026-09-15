
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import PublicNavbar from "../components/PublicNavbar";

function Register() {
    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [mobileNumber, setMobileNumber] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleRegister = async (e) => {
        e.preventDefault();
        setMessage("");
        setError("");
        setLoading(true);

        try {
            const response = await api.post("/auth/register", {
                name,
                email,
                mobile_number: mobileNumber,
                password
            });
            setMessage(response.data.message || "Account created successfully.");
            setTimeout(() => navigate("/login"), 900);
        } catch (err) {
            setError(err.response?.data?.message || "Registration failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page register-auth-page">
            <PublicNavbar />
            <main className="auth-shell">
                <section className="auth-copy">
                    <span className="section-kicker">CREATE YOUR WORKSPACE</span>
                    <h1>Start building<br /><span>real consistency.</span></h1>
                    <p>Create your AlgoCraft account and get a focused workspace for DSA practice, progress and interview preparation.</p>

                    <div className="register-transform">
                        <div className="register-orbit register-orbit-one" />
                        <div className="register-orbit register-orbit-two" />
                        <div className="register-node node-one"><span>DSA</span><small>Practice</small></div>
                        <div className="register-node node-two"><span>CODE</span><small>Execute</small></div>
                        <div className="register-node node-three"><span>TRACK</span><small>Improve</small></div>
                        <div className="register-center">A</div>
                    </div>
                </section>

                <section className="auth-card">
                    <div className="auth-card-brand">ALGOCRAFT <span>/ REGISTER</span></div>
                    <h2>Create account</h2>
                    <p className="auth-subtitle">Set up your account in a few seconds.</p>

                    <form onSubmit={handleRegister}>
                        <label>Name<input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" autoComplete="name" required /></label>
                        <label>Email<input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" autoComplete="email" required /></label>
                        <label>Mobile Number<input type="tel" value={mobileNumber} onChange={(e) => setMobileNumber(e.target.value)} placeholder="10-digit mobile number" autoComplete="tel" required /></label>
                        <label>Password<input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Create a password" autoComplete="new-password" minLength="6" required /></label>

                        {message && <p className="auth-success">{message}</p>}
                        {error && <p className="auth-error">{error}</p>}

                        <button className="auth-submit" type="submit" disabled={loading}>{loading ? "Creating account..." : "Create Account ↗"}</button>
                    </form>

                    <p className="auth-switch">Already have an account? <button onClick={() => navigate("/login")}>Login</button></p>
                </section>
            </main>
        </div>
    );
}

export default Register;
