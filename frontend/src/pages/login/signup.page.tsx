import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";

const SignupPage: React.FC = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const navigate = useNavigate();

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

    return (
        <div className="d-flex flex-column align-items-center mt-5">
            <article className="card w-50 card-border">
                <div className="card-header card-color">
                    <h2 className="card-title card-text-color mb-0 text-center">
                        Signup
                    </h2>
                </div>
                <div className="card-body card-body-color">
                    <div className="mb-3">
                        <label htmlFor="eInput" className="form-label">
                            Email
                        </label>
                        <input
                            type="email"
                            id="eInput"
                            name="email"
                            className="form-control"
                            placeholder="Enter your email"
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="uInput" className="form-label">
                            Username
                        </label>
                        <input
                            type="text"
                            id="uInput"
                            name="username"
                            className="form-control"
                            placeholder="Enter your username"
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="pInput" className="form-label">
                            Password
                        </label>
                        <input
                            type="password"
                            id="pInput"
                            name="password"
                            className="form-control"
                            placeholder="Enter your password"
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="confirmPInput" className="form-label">
                            Confirm Password
                        </label>
                        <input
                            type="password"
                            id="confirmPInput"
                            name="confirmPassword"
                            className="form-control"
                            placeholder="Confirm your password"
                        />
                    </div>
                    <div className="text-center mb-3">
                        <button
                            type="button"
                            id="signupBtn"
                            className="btn btn-secondary w-100"
                        >
                            Signup!
                        </button>
                    </div>
                    <div className="text-center">
                        <p>
                            <a
                                className="no-underline link-underline-opacity-100-hover"
                                href="/login"
                            >
                                Login instead
                            </a>
                        </p>
                    </div>
                </div>
            </article>
        </div>
    );
};

export default SignupPage;