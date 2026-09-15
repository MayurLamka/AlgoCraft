
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import PublicNavbar from "../components/PublicNavbar";

function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const response = await api.post("/auth/login", { email, password });
            localStorage.setItem("token", response.data.token);
            localStorage.setItem("user", JSON.stringify(response.data.user));
            navigate("/dashboard", { replace: true });
        } catch (err) {
            setError(err.response?.data?.message || "Login failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <PublicNavbar />
            <main className="auth-shell">
                <section className="auth-copy">
                    <span className="section-kicker">WELCOME BACK</span>
                    <h1>Continue your<br /><span>DSA journey.</span></h1>
                    <p>Log in to return to your question library, code editor, progress, revision and interview resources.</p>

                    <div className="auth-animation">
                        <div className="auth-animation-bar"><span>algocraft://session</span><b>● ACTIVE</b></div>
                        <div className="auth-flow">
                            <div><span>01</span><strong>Library</strong><small>Choose a problem</small></div>
                            <i>→</i>
                            <div><span>02</span><strong>Code</strong><small>Run your solution</small></div>
                            <i>→</i>
                            <div><span>03</span><strong>Progress</strong><small>Keep improving</small></div>
                        </div>
                        <div className="auth-scan" />
                    </div>
                </section>

                <section className="auth-card">
                    <div className="auth-card-brand">ALGOCRAFT <span>/ LOGIN</span></div>
                    <h2>Sign in</h2>
                    <p className="auth-subtitle">Enter your account details to continue.</p>

                    <form onSubmit={handleLogin}>
                        <label>Email<input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" autoComplete="email" required /></label>
                        <label>Password<input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" autoComplete="current-password" required /></label>
                        {error && <p className="auth-error">{error}</p>}
                        <button className="auth-submit" type="submit" disabled={loading}>{loading ? "Signing in..." : "Login ↗"}</button>
                    </form>

                    <p className="auth-switch">Don't have an account? <button onClick={() => navigate("/register")}>Create one</button></p>
                </section>
            </main>
        </div>
    );
}

export default Login;
