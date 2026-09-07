import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function Register() {

    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [mobileNumber, setMobileNumber] = useState("");
    const [password, setPassword] = useState("");

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const handleRegister = async (e) => {

        e.preventDefault();

        setMessage("");
        setError("");

        try {

            const response = await api.post("/auth/register", {
                name,
                email,
                mobile_number: mobileNumber,
                password
            });

            console.log(response.data);

            setMessage(response.data.message);

            setTimeout(() => {
                navigate("/login");
            }, 1000);

        } catch (error) {

            console.error(error);

            setError(
                error.response?.data?.message ||
                "Registration failed"
            );
        }
    };

    return (
        <div>

            <h1>Register</h1>

            <form onSubmit={handleRegister}>

                <div>
                    <label>Name</label>

                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>


                <div>
                    <label>Email</label>

                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>


                <div>
                    <label>Mobile Number</label>

                    <input
                        type="tel"
                        value={mobileNumber}
                        onChange={(e) => setMobileNumber(e.target.value)}
                        required
                    />
                </div>


                <div>
                    <label>Password</label>

                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>


                <button type="submit">
                    Register
                </button>

            </form>


            {message && (
                <p>{message}</p>
            )}

            {error && (
                <p>{error}</p>
            )}

        </div>
    );
}

export default Register;