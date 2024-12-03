import React, { useEffect, useState } from "react";
import {Link} from "react-router-dom";

interface User {
    ID: number;
    Username: string;
}

// Define the interface for a Post
interface Post {
    ID: number;
    Title: string;
    Body: string;
    CreatedAt: string;
    User:User
}

const fetchData = async (): Promise<Post[]> => {
    const response = await fetch("http://localhost:8383/api/posts");
    if (!response.ok) {
        throw new Error("Failed to fetch posts");
    }
    return response.json(); // Assuming API returns an array of posts
};

const Home: React.FC = () => {
    const [posts, setPosts] = useState<Post[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const getPosts = async () => {
            try {
                const data = await fetchData();
                setPosts(data);
            } catch (err) {
                // Safely handle the error
                if (err instanceof Error) {
                    setError(err.message);
                } else {
                    setError("An unknown error occurred.");
                }
            }
        };
        getPosts();
    }, []); // Empty dependency array means this runs once when the component mounts

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className="d-flex flex-column align-items-center">
            {posts.length > 0 ? (
                posts.map((post) => (
                    <article className="card w-75 card-border mb-3" key={post.ID}>
                        <div className="card-header card-color d-flex flex-column align-items-start">
                            <h2 className="card-title card-text-color mb-1">
                                <Link to={`/post/${post.ID}`} className="card-title card-text-color mb-1" >{post.Title}</Link>
                            </h2>
                            <small className="card-text-color author">
                                Posted by {post.User.Username} on{" "}
                                {new Date(post.CreatedAt).toLocaleDateString()} at{" "}
                                {new Date(post.CreatedAt).toLocaleTimeString()}
                            </small>
                        </div>
                        <div className="card-body card-body-color">
                            <p className="card-text">{post.Body}</p>
                        </div>
                    </article>
                ))
            ) : (
                <p>Loading posts...</p>
            )}
        </div>
    );
};

export default Home;