import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import swal from "sweetalert2";

interface User {
    ID: number;
    Username: string;
}

interface Post {
    ID: number;
    Title: string;
    Body: string;
    CreatedAt: string;
    User: User;
}

const DashboardPage: React.FC = () => {
    const [posts, setPosts] = useState<Post[]>([]);
    const [editingPostId, setEditingPostId] = useState<number | null>(null);
    const [title, setTitle] = useState("");
    const [body, setBody] = useState("");
    const [isAddingPost, setIsAddingPost] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    // Check login status
    const checkLoginStatus = () => {
        const cookies = document.cookie.split("; ");
        const loggedIn = cookies.some((cookie) => cookie.startsWith("mysession="));
        if (!loggedIn) {
            navigate("/"); // Redirect to home if not logged in
        }
    };

    useEffect(() => {
        checkLoginStatus();
    }, []);

    // Fetch user's posts
    const fetchMyPosts = async () => {
        try {
            const response = await fetch("http://localhost:8383/api/posts/myposts", {
                credentials: "include",
            });
            if (!response.ok) throw new Error("Failed to fetch posts.");
            const data: Post[] = await response.json();
            setPosts(data);
        } catch (err) {
            console.error(err);
            setError("Unable to fetch posts.");
        }
    };

    useEffect(() => {
        fetchMyPosts();
    }, []);

    // Add new post
    const handleAddPost = async () => {
        try {
            const response = await fetch("http://localhost:8383/api/posts/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({ title, body }),
            });

            if (!response.ok) throw new Error("Failed to add post.");

            const newPost = await response.json();
            setPosts([newPost.post, ...posts]);
            setIsAddingPost(false);
            setTitle("");
            setBody("");

            await swal.fire({
                icon: "success",
                title: "Post Added",
                text: "Your post was added successfully!",
            });
        } catch (err) {
            console.error(err);
            setError("Unable to add post.");
        }
    };

    // Update post
    const handleUpdatePost = async (postId: number) => {
        try {
            const response = await fetch(`http://localhost:8383/api/posts/${postId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({ title, body }),
            });

            if (!response.ok) throw new Error("Failed to update post.");

            const updatedPost = await response.json();
            setPosts((prevPosts) =>
                prevPosts.map((post) =>
                    post.ID === postId ? { ...post, Title: updatedPost.title, Body: updatedPost.body } : post
                )
            );

            setEditingPostId(null);
            setTitle("");
            setBody("");

            await swal.fire({
                icon: "success",
                title: "Post Updated",
                text: "Your post was updated successfully!",
            });
        } catch (err) {
            console.error(err);
            setError("Unable to update the post.");
        }
    };

    // Delete post
    const handleDeletePost = async (postId: number) => {
        try {
            const response = await fetch(`http://localhost:8383/api/posts/${postId}`, {
                method: "DELETE",
                credentials: "include",
            });
            if (!response.ok) throw new Error("Failed to delete post.");

            setPosts(posts.filter((post) => post.ID !== postId));
        } catch (err) {
            console.error(err);
            setError("Unable to delete the post.");
        }
    };

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className="d-flex flex-column align-items-center">
            {/* List of Posts */}
            {posts.map((post) =>
                editingPostId === post.ID ? (
                    <div key={post.ID} className="card w-75 card-border mb-4">
                        <div className="card-header card-color">
                            <h2 className="card-title card-text-color mb-0">Update Post</h2>
                        </div>
                        <div className="card-body card-body-color">
                            <div className="p-1">
                                <label>Title</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                />
                            </div>
                            <div className="p-1">
                                <label>Content</label>
                                <textarea
                                    className="form-control"
                                    value={body}
                                    onChange={(e) => setBody(e.target.value)}
                                />
                            </div>
                            <button
                                className="btn btn-secondary w-100 p-2 mt-4"
                                onClick={() => handleUpdatePost(post.ID)}
                            >
                                Update
                            </button>
                            <button
                                className="btn btn-danger w-100 p-2 mt-2"
                                onClick={()=>handleDeletePost(post.ID)}
                            >
                                Delete
                            </button>
                            <button
                                className="btn btn-light w-100 p-2 mt-2"
                                onClick={() => setEditingPostId(null)}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                ) : (
                    <article className="card w-75 card-border mb-4" key={post.ID}>
                        <div className="card-header card-color d-flex align-items-center justify-content-between">
                        <h2 className="card-title card-text-color mb-0">{post.Title}</h2>
                            <span className="card-text-color author">
                                Posted by {post.User.Username} on{" "}
                                {new Date(post.CreatedAt).toLocaleDateString()}
                                &nbsp;&nbsp;
                                <button
                                    className="btn w-40 card-body-color ms-2 me-2"
                                    onClick={() => {
                                        setEditingPostId(post.ID);
                                        setTitle(post.Title);
                                        setBody(post.Body);
                                    }}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                         fill="currentColor" className="bi bi-pencil me-2"
                                         viewBox="0 0 16 16">
                                                        <path
                                                            d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z"/>
                                                    </svg>
                                    Edit Post
                                </button>
                            <button
                                onClick={() => handleDeletePost(post.ID)}
                                className="btn btn-danger"
                            >
                                Delete
                            </button>

                            </span>
                        </div>
                        <div className="card-body card-body-color">
                            <p className="card-text text-center card-body-text">{post.Body}</p>
                        </div>
                    </article>
                )
            )}

            {/* Add New Post */}
            <div className="d-flex flex-column align-items-center w-75">
                {!isAddingPost ? (
                    <button
                        className="btn card-color w-25 card-body-text card-text-color mb-4"
                        onClick={() => setIsAddingPost(true)}
                    >
                        + Add New Post
                    </button>
                ) : (
                    <article className="card w-75 card-border mb-4">
                    <div className="card-header card-color">
                            <h2 className="card-title card-text-color mb-0 text-center">Add New Post</h2>
                        </div>
                        <div className="card-body card-body-color">
                            <div className="mb-3">
                                <label htmlFor="titleInput" className="form-label">Title</label>
                                <input
                                    id="titleInput"
                                    type="text"
                                    className="form-control"
                                    placeholder="Enter the title"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="bodyInput" className="form-label">Content</label>
                                <textarea
                                    id="bodyInput"
                                    className="form-control"
                                    placeholder="Enter the content"
                                    rows={5}
                                    value={body}
                                    onChange={(e) => setBody(e.target.value)}
                                />
                            </div>
                            <button
                                className="btn btn-secondary w-100 p-2 mt-4"
                                onClick={handleAddPost}
                            >
                                Add Post
                            </button>

                            <button
                                className="btn btn-light w-100 p-2 mt-2"
                                onClick={() => {
                                    setIsAddingPost(false);
                                    setTitle("");
                                    setBody("");
                                }}
                            >
                                Cancel
                            </button>
                        </div>
                    </article>
                )}
            </div>
        </div>
    );
};

export default DashboardPage;