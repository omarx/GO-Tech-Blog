import React from "react";
import { Link } from "react-router-dom";

const NotFoundPage: React.FC = () => {
    return (
        <div
            className="d-flex flex-column align-items-center justify-content-center text-center vh-100 "
        >
            <h1 className="display-1 text-danger">404</h1>
            <h2 className="mb-4">Page Not Found</h2>
            <p className="mb-4 text-muted">
                Oops! The page you are looking for doesn't exist or has been moved.
            </p>
            <Link to="/" className="btn btn-primary">
                Go Back to Home
            </Link>
        </div>
    );
};

export default NotFoundPage;