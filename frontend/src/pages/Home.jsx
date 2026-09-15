
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PublicNavbar from "../components/PublicNavbar";

const learningStages = [
    { number: "01", label: "QUESTION", title: "Understand the problem", text: "Read the problem, examples, constraints and identify the pattern." },
    { number: "02", label: "CODE", title: "Write the solution", text: "Use the integrated editor to build, run and submit your solution." },
    { number: "03", label: "TRACK", title: "Measure your progress", text: "See solved questions, difficulty breakdown and your practice journey." },
    { number: "04", label: "PREPARE", title: "Get interview ready", text: "Revise important problems and build confidence for placements." },
];

function Home() {
    const navigate = useNavigate();

    useEffect(() => {
        if (localStorage.getItem("token")) {
            navigate("/dashboard", { replace: true });
        }
    }, [navigate]);

    return (
        <div className="public-page home-page">
            <PublicNavbar />

            <main>
                <section className="home-hero">
                    <div className="home-hero-glow" />
                    <div className="home-hero-copy">
                        <span className="section-kicker">ALGOCRAFT · DSA PRACTICE</span>
                        <h1>
                            Think in <span>patterns.</span><br />
                            Code with confidence.
                        </h1>
                        <p>
                            Practice Data Structures & Algorithms in one focused workspace.
                            Solve questions, run your code, track progress, revise problems,
                            and prepare for technical interviews.
                        </p>
                        <div className="home-hero-actions">
                            <button className="hero-primary" onClick={() => navigate("/register")}>
                                Start Practicing <span>↗</span>
                            </button>
                            <button className="hero-secondary" onClick={() => navigate("/about")}>
                                Explore AlgoCraft
                            </button>
                        </div>
                    </div>

                    <div className="home-code-window" aria-hidden="true">
                        <div className="home-window-head">
                            <span className="window-dots"><i /><i /><i /></span>
                            <span>solution.cpp</span>
                            <span className="window-status">● RUNNING</span>
                        </div>
                        <div className="home-code-body">
                            <div className="home-code-line"><b>01</b><span><em>#include</em> &lt;bits/stdc++.h&gt;</span></div>
                            <div className="home-code-line"><b>02</b><span><em>using namespace</em> std;</span></div>
                            <div className="home-code-line"><b>03</b><span>&nbsp;</span></div>
                            <div className="home-code-line"><b>04</b><span><strong>int</strong> solve(vector&lt;int&gt;&amp; nums) {"{"}</span></div>
                            <div className="home-code-line active-code"><b>05</b><span>&nbsp;&nbsp;sort(nums.begin(), nums.end());</span></div>
                            <div className="home-code-line"><b>06</b><span>&nbsp;&nbsp;<strong>return</strong> nums[0];</span></div>
                            <div className="home-code-line"><b>07</b><span>{"}"}</span></div>
                            <div className="home-terminal-result">✓ Test cases passed&nbsp;&nbsp; 4/4</div>
                        </div>
                    </div>
                </section>

                <section className="home-transform">
                    <div className="about-section-heading">
                        <span className="section-kicker">THE ALGOCRAFT LOOP</span>
                        <h2>One workflow. Four steps.</h2>
                        <p>Everything you need to turn daily DSA practice into placement confidence.</p>
                    </div>

                    <div className="home-transform-grid">
                        {learningStages.map((stage, index) => (
                            <article className="home-stage-card" key={stage.number}>
                                <div className="home-stage-top">
                                    <span>{stage.number}</span>
                                    <span>{stage.label}</span>
                                </div>
                                <div className={`home-stage-icon stage-icon-${index}`}>
                                    {index === 0 ? "?" : index === 1 ? "</>" : index === 2 ? "↗" : "✓"}
                                </div>
                                <h3>{stage.title}</h3>
                                <p>{stage.text}</p>
                            </article>
                        ))}
                    </div>
                </section>

                <section className="home-features">
                    <div className="home-feature-intro">
                        <span className="section-kicker">BUILT FOR PLACEMENTS</span>
                        <h2>Your DSA workspace, without the noise.</h2>
                    </div>
                    <div className="home-feature-list">
                        <div><span>01</span><strong>Topic-wise Library</strong><p>Find problems by topic and difficulty.</p></div>
                        <div><span>02</span><strong>Integrated Code Editor</strong><p>Write, run and submit code from the question page.</p></div>
                        <div><span>03</span><strong>Progress & Revision</strong><p>Track solved questions and save problems for revision.</p></div>
                        <div><span>04</span><strong>Interview Preparation</strong><p>Use curated interview resources alongside your practice.</p></div>
                    </div>
                </section>

                <section className="home-cta">
                    <span className="section-kicker">START TODAY</span>
                    <h2>Build consistency before the interview.</h2>
                    <button className="hero-primary" onClick={() => navigate("/register")}>
                        Create your account <span>↗</span>
                    </button>
                </section>
            </main>
        </div>
    );
}

export default Home;
