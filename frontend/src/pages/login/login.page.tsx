import React, {useEffect, useState} from "react";
import swal from "sweetalert2";
import { useNavigate, Link } from "react-router-dom";

const login = async (username: string, password: string): Promise<string | null> => {
    try {
        const response = await fetch("http://localhost:8383/api/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                username,
                password,
            }),
            credentials: "include", // Include cookies for session-based authentication
        });

        if (response.ok) {
            const data = await response.json();
            await swal.fire({
                icon: "success",
                title: "Success",
                text: "Login successful",
            });
            return data.message;
        } else {
            const errorData = await response.json();
            await swal.fire({
                icon: "error",
                title: "Error",
                text: "Login failed. Username or password is incorrect.",
            });
            return errorData.message || "Login failed.";
        }
    } catch (error) {
        console.error("Error logging in:", error);
        await swal.fire({
            icon: "error",
            title: "Error",
            text: "An error occurred. Please try again.",
        });
        return "An error occurred. Please try again.";
    }
};

const LoginPage: React.FC = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate(); // Hook for navigation
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    // Check login status
    const checkLoginStatus = () => {
        const cookies = document.cookie.split("; ");
        setIsLoggedIn(cookies.some((cookie) => cookie.startsWith("mysession=")));
    };

    useEffect(() => {
        checkLoginStatus();
        if (isLoggedIn) {
            navigate("/"); // Redirect to home if not logged in
        }
    }, [isLoggedIn, navigate]);

    const handleLogin = async (event: React.FormEvent) => {
        event.preventDefault(); // Prevent the default form submission behavior
        const result = await login(username, password);
        if (result === "Login successful") {
            navigate("/"); // Redirect to home upon successful login
        }
    };

    return (
        <div className="d-flex flex-column align-items-center mt-5">
            <article className="card w-50 card-border">
                <div className="card-header card-color">
                    <h2 className="card-title card-text-color mb-0 text-center">Login</h2>
                </div>
                <div className="card-body card-body-color">
                    <form onSubmit={handleLogin}>
                        <div className="mb-3">
                            <label htmlFor="uInput" className="form-label">
                                Username
                            </label>
                            <input
                                type="text"
                                className="form-control"
                                id="uInput"
                                name="username"
                                placeholder="Enter your username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="pInput" className="form-label">
                                Password
                            </label>
                            <input
                                type="password"
                                id="pInput"
                                className="form-control"
                                name="password"
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <div className="text-center mb-3">
                            <button
                                type="submit"
                                id="loginBtn"
                                className="btn btn-secondary w-100"
                            >
                                Login!
                            </button>
                        </div>
                    </form>
                    <div className="text-center">
                        <p>
                            <Link
                                className="no-underline link-underline-opacity-100-hover"
                                to="/signup"
                            >
                                Sign up instead
                            </Link>
                        </p>
                    </div>
                </div>
            </article>
        </div>
    );
};

export default LoginPage;