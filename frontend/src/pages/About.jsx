
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import algoCraftLogo from "../assets/algocraft-logo.svg";
import PublicNavbar from "../components/PublicNavbar";

const stages = [
    {
        label: "QUESTION",
        accent: "question",
        title: "Two Sum",
        lines: [
            ["01", "Find two numbers that add up to target."],
            ["02", "nums = [2, 7, 11, 15], target = 9"],
            ["03", "Output: [0, 1]"],
        ],
        footer: "Understand →",
    },
    {
        label: "CODE",
        accent: "code",
        title: "solution.cpp",
        lines: [
            ["01", "unordered_map<int, int> seen;"],
            ["02", "for (int i = 0; i < nums.size(); i++) {"],
            ["03", "  int need = target - nums[i];"],
            ["04", "  if (seen.count(need)) return {seen[need], i};"],
        ],
        footer: "Build →",
    },
    {
        label: "PROGRESS",
        accent: "progress",
        title: "Your Progress",
        lines: [
            ["01", "Arrays                 ██████████  92%"],
            ["02", "Strings                ████████░░  78%"],
            ["03", "Trees                  ██████░░░░  61%"],
            ["04", "DP                     ████░░░░░░  43%"],
        ],
        footer: "Track →",
    },
    {
        label: "INTERVIEW",
        accent: "interview",
        title: "Interview Ready",
        lines: [
            ["01", "✓ Problem solving"],
            ["02", "✓ Time & space analysis"],
            ["03", "✓ Coding under pressure"],
            ["04", "→ Keep practicing"],
        ],
        footer: "Prepare →",
    },
];

function TransformShowcase() {
    const [stage, setStage] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => setStage((current) => (current + 1) % stages.length), 3000);
        return () => clearInterval(timer);
    }, []);

    const item = stages[stage];

    return (
        <section className="about-transform-section">
            <div className="about-section-heading">
                <span className="section-kicker">THE ALGOCRAFT WORKFLOW</span>
                <h2>Watch practice transform into progress.</h2>
                <p>From the first question you read to the confidence you carry into an interview.</p>
            </div>

            <div className="transform-stage">
                <div className="transform-window">
                    <div className="window-topbar">
                        <div className="window-dots"><i /><i /><i /></div>
                        <span>algocraft://learning-loop</span>
                        <span className="window-live"><b /> LIVE</span>
                    </div>

                    <div className="transform-body">
                        <div className="transform-sidebar">
                            {stages.map((step, index) => (
                                <button
                                    key={step.label}
                                    className={index === stage ? "side-active" : ""}
                                    onClick={() => setStage(index)}
                                >
                                    0{index + 1}
                                </button>
                            ))}
                        </div>

                        <div className={`transform-card stage-${item.accent}`} key={item.label}>
                            <div className="transform-card-head">
                                <span className="stage-number">0{stage + 1}</span>
                                <span className="stage-label">{item.label}</span>
                                <span className="stage-arrow">↗</span>
                            </div>
                            <div className="transform-title-row">
                                <h3>{item.title}</h3>
                                <span className="transform-pulse">●</span>
                            </div>
                            <div className="transform-code">
                                {item.lines.map(([number, text]) => (
                                    <div className="code-line" key={number}>
                                        <span>{number}</span>
                                        <code>{text}</code>
                                    </div>
                                ))}
                            </div>
                            <div className="transform-footer">
                                <span>ALGOCRAFT</span>
                                <span>{item.footer}</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="transform-orbit orbit-one" />
                <div className="transform-orbit orbit-two" />
                <div className="transform-grid" />
            </div>

            <div className="transform-steps">
                {stages.map((step, index) => (
                    <button
                        key={step.label}
                        className={index === stage ? "transform-step active" : "transform-step"}
                        onClick={() => setStage(index)}
                    >
                        <span>0{index + 1}</span>{step.label}
                    </button>
                ))}
            </div>
        </section>
    );
}

function About() {
    const navigate = useNavigate();

    return (
        <div className="public-page about-page">
            <PublicNavbar />

            <main>
                <section className="about-hero">
                    <div className="about-hero-glow" />
                    <div className="about-hero-content">
                        <span className="section-kicker">ABOUT ALGOCRAFT</span>
                        <h1>Turn <span>practice</span> into<br />placement confidence.</h1>
                        <p>
                            AlgoCraft is a focused DSA practice platform where you can solve
                            problems, write and test code, track your progress, revise important
                            questions, and prepare for technical interviews.
                        </p>
                        <button className="hero-primary" onClick={() => navigate("/register")}>
                            Start Practicing <span>↗</span>
                        </button>
                    </div>
                    <div className="about-hero-brand">
                        <img src={algoCraftLogo} alt="" />
                    </div>
                </section>

                <TransformShowcase />

                <section className="about-features">
                    <div className="about-section-heading compact">
                        <span className="section-kicker">WHAT ALGOCRAFT CONNECTS</span>
                        <h2>Everything in one learning loop.</h2>
                    </div>
                    <div className="about-feature-grid">
                        {[
                            ["01", "Practice", "Topic-wise DSA questions with difficulty filters and an integrated coding workflow."],
                            ["02", "Code", "Use the editor to write, run examples, submit solutions and receive judge results."],
                            ["03", "Track", "Follow solved-question progress and keep important questions ready for revision."],
                            ["04", "Prepare", "Use interview resources and consistent practice to strengthen placement readiness."],
                        ].map(([number, title, text]) => (
                            <article className="about-feature-card" key={number}>
                                <span>{number}</span>
                                <h3>{title}</h3>
                                <p>{text}</p>
                            </article>
                        ))}
                    </div>
                </section>

                <section className="about-cta">
                    <span className="section-kicker">READY?</span>
                    <h2>Build the habit. Crack the interview.</h2>
                    <button className="hero-primary" onClick={() => navigate("/register")}>
                        Create your account <span>↗</span>
                    </button>
                </section>
            </main>
        </div>
    );
}

export default About;
