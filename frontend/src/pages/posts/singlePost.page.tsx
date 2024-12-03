import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import swal from "sweetalert2";

interface User {
    ID: number;
    Username: string;
}

interface Comment {
    ID: number;
    Body: string;
    CreatedAt: string;
    User: User;
}

interface Post {
    ID: number;
    Title: string;
    Body: string;
    CreatedAt: string;
    User: User;
    Comments: Comment[];
}

const formatDate = (date: string): string => {
    const options: Intl.DateTimeFormatOptions = { year: "numeric", month: "long", day: "numeric" };
    return new Date(date).toLocaleDateString(undefined, options);
};

const SinglePostPage: React.FC = () => {
    const { postId } = useParams<{ postId: string }>();
    const [post, setPost] = useState<Post | null>(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [comment, setComment] = useState("");
    const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
    const [editingCommentBody, setEditingCommentBody] = useState("");
    const [error, setError] = useState<string | null>(null);

    const fetchPost = async () => {
        try {
            const response = await fetch(`http://localhost:8383/api/posts/${postId}`);
            if (!response.ok) throw new Error("Failed to fetch post");
            const data: Post = await response.json();
            setPost(data);
        } catch (err) {
            console.error(err);
            setError("Unable to fetch the post.");
        }
    };

    useEffect(() => {
        fetchPost();
        const cookies = document.cookie.split("; ");
        setIsLoggedIn(cookies.some((cookie) => cookie.startsWith("mysession=")));
    }, [postId]);

    const handleAddComment = async () => {
        if (!postId) {
            setError("Post ID is missing.");
            return;
        }

        try {
            const response = await fetch(`http://localhost:8383/api/comments/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({ body: comment, post_id: Number(postId) }),
            });

            if (!response.ok) throw new Error("Failed to add comment");

            await swal.fire({
                icon: "success",
                title: "Comment Added",
                text: "Your comment was added successfully!",
            });

            await fetchPost();
            setComment("");
        } catch (err) {
            console.error("Error adding comment:", err);
            setError("Failed to add comment.");
        }
    };

    const handleDeleteComment = async (commentId: number) => {
        try {
            const response = await fetch(`http://localhost:8383/api/comments/${commentId}`, {
                method: "DELETE",
                credentials: "include",
            });

            if (!response.ok) throw new Error("Failed to delete comment");

            await swal.fire({
                icon: "success",
                title: "Comment Deleted",
                text: "Your comment was deleted successfully!",
            });

            await fetchPost();
        } catch (err) {
            console.error("Error deleting comment:", err);
            setError("Failed to delete comment.");
        }
    };

    const handleUpdateComment = async () => {
        if (!editingCommentId) return;

        try {
            const response = await fetch(`http://localhost:8383/api/comments/${editingCommentId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({ body: editingCommentBody }),
            });

            if (!response.ok) throw new Error("Failed to update comment");

            await swal.fire({
                icon: "success",
                title: "Comment Updated",
                text: "Your comment was updated successfully!",
            });

            await fetchPost();
            setEditingCommentId(null);
            setEditingCommentBody("");
        } catch (err) {
            console.error("Error updating comment:", err);
            setError("Failed to update comment.");
        }
    };

    if (error) {
        return <div className="alert alert-danger">{error}</div>;
    }

    if (!post) {
        return <div>Loading post...</div>;
    }

    return (
        <div className="d-flex flex-column align-items-center my-4">
            {/* Post Details */}
            <article className="card w-75 card-border mb-4">
                <div className="card-header card-color">
                    <h2 className="card-title card-text-color">{post.Title}</h2>
                </div>
                <div className="card-body card-body-color">{post.Body}</div>
            </article>

            {/* Add Comment Box */}
            {isLoggedIn && (
                <div className="d-flex flex-column align-items-center mb-4 w-75">
                    <article className="card card-border w-100">
                        <div className="card-header card-color">
                            <h3 className="card-title card-text-color mb-0">Add Comment</h3>
                        </div>
                        <div className="card-body card-body-color">
                            <textarea
                                className="form-control mb-3"
                                id="commentInput"
                                rows={5}
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                placeholder="Write your comment here..."
                            />
                            <button
                                type="button"
                                id="addCommentBtn"
                                className="btn btn-secondary w-100"
                                onClick={handleAddComment}
                            >
                                Add Comment
                            </button>
                        </div>
                    </article>
                </div>
            )}

            {/* Comments Section */}
            {post.Comments.length > 0 && (
                <div className="w-75">
                    {post.Comments.map((comment) => (
                        <div key={comment.ID} className="card card-border mb-3">
                            {editingCommentId === comment.ID ? (
                                <div className="card-body card-body-color">
                                    <textarea
                                        className="form-control mb-3"
                                        value={editingCommentBody}
                                        onChange={(e) => setEditingCommentBody(e.target.value)}
                                    />
                                    <button
                                        className="btn btn-primary w-100"
                                        onClick={handleUpdateComment}
                                    >
                                        Save
                                    </button>
                                    <button
                                        className="btn btn-secondary w-100 mt-2"
                                        onClick={() => {
                                            setEditingCommentId(null);
                                            setEditingCommentBody("");
                                        }}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            ) : (
                                <>
                                    <div className="card-header card-color d-flex justify-content-between">
                                        <p className="mb-0 card-text-color fs-5">{comment.Body}</p>
                                        {isLoggedIn && comment.User.ID === post.User.ID && (
                                            <div>
                                                <button
                                                    onClick={() => {
                                                        setEditingCommentId(comment.ID);
                                                        setEditingCommentBody(comment.Body);
                                                    }}
                                                    className="btn w-40 card-body-color ms-2 me-2"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                                         fill="currentColor" className="bi bi-pencil me-2"
                                                         viewBox="0 0 16 16">
                                                        <path
                                                            d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z"/>
                                                    </svg>
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteComment(comment.ID)}
                                                    className="btn btn-danger"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                    <div className="card-body card-body-color">
                                        <small className="text-muted author">
                                            - {comment.User.Username}, {formatDate(comment.CreatedAt)}
                                        </small>
                                    </div>
                                </>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default SinglePostPage;