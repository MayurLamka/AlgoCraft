import { useNavigate } from "react-router-dom";

function Home() {

    const navigate = useNavigate();

    return (
        <div className="home">

            <nav className="navbar">

                <div className="logo">
                    DSA Platform
                </div>

                <div className="nav-buttons">

                    <button
                        onClick={() => navigate("/login")}
                        className="login-btn"
                    >
                        Login
                    </button>

                    <button
                        onClick={() => navigate("/register")}
                        className="register-btn"
                    >
                        Register
                    </button>

                </div>

            </nav>


            <main className="hero">

                <h1>
                    Master Data Structures & Algorithms
                </h1>

                <p>
                    Practice DSA problems, track your progress,
                    and improve your problem-solving skills.
                </p>

                <div className="hero-buttons">

                    <button
                        onClick={() => navigate("/register")}
                        className="register-btn"
                    >
                        Get Started
                    </button>

                    <button
                        onClick={() => navigate("/login")}
                        className="login-btn"
                    >
                        Login
                    </button>

                </div>

            </main>


            <section className="features">

                <div className="feature-card">
                    <h2>📚 Practice Problems</h2>
                    <p>
                        Solve problems from different topics
                        and difficulty levels.
                    </p>
                </div>

                <div className="feature-card">
                    <h2>📊 Track Progress</h2>
                    <p>
                        Keep track of your solved questions
                        and learning progress.
                    </p>
                </div>

                <div className="feature-card">
                    <h2>🎯 Improve Your Skills</h2>
                    <p>
                        Build strong DSA skills for coding
                        interviews and placements.
                    </p>
                </div>

            </section>

        </div>
    );
}

export default Home;