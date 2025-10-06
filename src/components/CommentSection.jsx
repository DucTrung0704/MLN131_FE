import React, { useEffect, useState } from "react";
import { List, Avatar, Input, Button, message, Empty, Card } from "antd";
import { SendOutlined, LikeOutlined, CommentOutlined, DeleteOutlined } from "@ant-design/icons";
import axiosClient from "../api/axiosClient";
import "./CommentSection.css";

const { TextArea } = Input;

const CommentSection = ({ blogId, currentUser }) => {
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [text, setText] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const fetchComments = async () => {
        try {
            const res = await axiosClient.get(`/comments/blog/${blogId}`);
            setComments(res.data.comments);
        } catch (error) {
            message.error("Failed to load comments");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchComments();
    }, [blogId]);

    const handleSubmit = async () => {
        if (!text.trim()) {
            message.warning("Please enter a comment");
            return;
        }
        try {
            setSubmitting(true);
            const res = await axiosClient.post("/comments", { text, blogId });
            setComments([res.data.comment, ...comments]);
            setText("");
            message.success("Comment posted successfully!");
        } catch (error) {
            message.error("Failed to post comment");
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (commentId) => {
        try {
            await axiosClient.delete(`/comments/${commentId}`);
            setComments(comments.filter(comment => comment._id !== commentId));
            message.success("Comment deleted successfully");
        } catch (error) {
            message.error("Failed to delete comment");
        }
    };

    const formatTimestamp = (timestamp) => {
        const now = new Date();
        const commentDate = new Date(timestamp);
        const diffInSeconds = Math.floor((now - commentDate) / 1000);

        if (diffInSeconds < 60) return 'Just now';
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
        return commentDate.toLocaleDateString('en-US');
    };

    return (
        <Card className="comments-section">
            <h3 className="comments-header">
                <CommentOutlined /> Comments ({comments.length})
            </h3>

            {currentUser ? (
                <div className="comment-input-container">
                    <Avatar className="user-avatar">
                        {currentUser.username[0].toUpperCase()}
                    </Avatar>
                    <div className="comment-input-wrapper">
                        <TextArea
                            className="comment-input"
                            placeholder="Write a comment..."
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            autoSize={{ minRows: 1, maxRows: 4 }}
                            onPressEnter={(e) => {
                                if (!e.shiftKey) {
                                    e.preventDefault();
                                    handleSubmit();
                                }
                            }}
                        />
                        <Button
                            type="primary"
                            icon={<SendOutlined />}
                            loading={submitting}
                            onClick={handleSubmit}
                            className="send-button"
                        />
                    </div>
                </div>
            ) : (
                <div className="login-prompt">
                    Please <a href="/login">login</a> to comment
                </div>
            )}

            {comments.length === 0 && !loading ? (
                <Empty description="No comments yet" />
            ) : (
                <List
                    className="comments-list"
                    loading={loading}
                    itemLayout="horizontal"
                    dataSource={comments}
                    renderItem={(item) => (
                        <List.Item className="comment-item">
                            <div className="comment-content">
                                <Avatar className="comment-avatar">
                                    {item.author.username[0].toUpperCase()}
                                </Avatar>
                                <div className="comment-bubble">
                                    <div className="comment-author">
                                        {item.author.username}
                                    </div>
                                    <div className="comment-text">{item.text}</div>
                                    <div className="comment-actions">
                                        <Button type="link" className="action-button">
                                            <LikeOutlined /> Like
                                        </Button>
                                        <Button type="link" className="action-button">
                                            Reply
                                        </Button>
                                        {currentUser && currentUser._id === item.author._id && (
                                            <Button
                                                type="link"
                                                className="action-button delete-button"
                                                onClick={() => handleDelete(item._id)}
                                            >
                                                <DeleteOutlined /> Delete
                                            </Button>
                                        )}
                                        <span className="comment-time">
                                            {formatTimestamp(item.createdAt)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </List.Item>
                    )}
                />
            )}
        </Card>
    );
};

export default CommentSection;