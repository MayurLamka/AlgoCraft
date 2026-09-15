
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import PublicNavbar from "../components/PublicNavbar";
import api from "../services/api";

function Contact() {
    const [sent, setSent] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");
    const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
    const navigate = useNavigate();

    const update = (event) => {
        setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
        setSent(false);
        setError("");
    };

    const submit = async (event) => {
        event.preventDefault();
        setSubmitting(true);
        setSent(false);
        setError("");

        try {
            const response = await api.post("/contact", form);
            if (!response.data.success) throw new Error(response.data.message || "Unable to send message.");
            setSent(true);
            setForm({ name: "", email: "", subject: "", message: "" });
        } catch (err) {
            setError(err.response?.data?.message || "Unable to send your message right now.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="public-page contact-page">
            <PublicNavbar />

            <main className="contact-main">
                <section className="contact-hero">
                    <div>
                        <span className="section-kicker">CONTACT ALGOCRAFT</span>
                        <h1>Have a question?<br /><span>Let’s connect.</span></h1>
                        <p>
                            Found a bug, have a feature idea, or need help using AlgoCraft?
                            Send us a message. Your message is saved by the platform so it can
                            be reviewed and followed up.
                        </p>
                    </div>

                    <div className="contact-terminal" aria-hidden="true">
                        <div className="terminal-head">
                            <span><i /><i /><i /></span>
                            <b>contact.sh</b>
                            <small>ALGOCRAFT</small>
                        </div>
                        <div className="terminal-body">
                            <p><em>$</em> ./connect --with-user</p>
                            <p className="terminal-muted">checking communication channel...</p>
                            <p className="terminal-success">✓ channel ready</p>
                            <p><em>$</em> waiting_for_message<span className="terminal-cursor">_</span></p>
                        </div>
                    </div>
                </section>

                <section className="contact-content">
                    <form className="contact-form" onSubmit={submit}>
                        <div className="form-heading">
                            <span className="section-kicker">SEND A MESSAGE</span>
                            <h2>Tell us what’s on your mind.</h2>
                        </div>

                        <div className="form-row">
                            <label>
                                Name
                                <input name="name" value={form.name} onChange={update} placeholder="Your name" autoComplete="name" required />
                            </label>
                            <label>
                                Email
                                <input type="email" name="email" value={form.email} onChange={update} placeholder="you@example.com" autoComplete="email" required />
                            </label>
                        </div>

                        <label>
                            Subject
                            <input name="subject" value={form.subject} onChange={update} placeholder="How can we help?" required />
                        </label>

                        <label>
                            Message
                            <textarea name="message" value={form.message} onChange={update} placeholder="Write your message..." rows="6" required />
                        </label>

                        <button className="contact-submit" type="submit" disabled={submitting}>
                            {submitting ? "Sending..." : sent ? "Message Sent ✓" : "Send Message ↗"}
                        </button>

                        {sent && <p className="contact-success">Your message was sent successfully. Thank you for contacting AlgoCraft.</p>}
                        {error && <p className="contact-error">{error}</p>}
                    </form>

                    <aside className="contact-info">
                        <div className="contact-info-card">
                            <span className="info-index">01</span>
                            <h3>AlgoCraft</h3>
                            <p>DSA practice, progress tracking and interview preparation in one place.</p>
                        </div>
                        <div className="contact-info-card">
                            <span className="info-index">02</span>
                            <h3>Need to practice?</h3>
                            <p>Go directly to the question library and start solving.</p>
                            <button onClick={() => navigate(localStorage.getItem("token") ? "/dashboard" : "/register")}>
                                Open Library ↗
                            </button>
                        </div>
                        <div className="contact-info-card">
                            <span className="info-index">03</span>
                            <h3>Bug or feature?</h3>
                            <p>Use the form and include enough detail for us to reproduce or understand the request.</p>
                        </div>
                    </aside>
                </section>
            </main>
        </div>
    );
}

export default Contact;
