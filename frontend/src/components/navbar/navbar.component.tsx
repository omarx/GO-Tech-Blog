import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar: React.FC = () => {
    const navigate = useNavigate();

    // Function to check if the session cookie exists
    const isSessionActive = (): boolean => {
        const cookies = document.cookie.split("; ");
        return cookies.some((cookie) => cookie.startsWith("mysession="));
    };

    // Logout handler
    const handleLogout = () => {
        document.cookie =
            "mysession=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        navigate("/"); // Redirect to home
    };

    return (
        <header>
            <nav>
                <ul>
                    <li>
                        <Link to="/">Home</Link>
                    </li>
                    {isSessionActive() ? (
                        <>
                            <li>
                                <Link to="/dashboard">Dashboard</Link>
                            </li>
                            <li>
                                <span id="logout" onClick={handleLogout}>
                                    Logout
                                </span>
                            </li>
                        </>
                    ) : (
                        <>
                            <li>
                                <Link to="/login">Login</Link>
                            </li>
                            <li>
                                <Link to="/signup">Signup</Link>
                            </li>
                        </>
                    )}
                </ul>
                <div id="Logo">
                    <h1>
                        <strong>
                            <Link to="/" id="logo-link">
                                The Tech Blog
                            </Link>
                        </strong>
                    </h1>
                </div>
            </nav>
        </header>
    );
};

export default Navbar;