import React, { useEffect, useState } from "react";
import { Card, Spin } from "antd";
import axiosClient from "../api/axiosClient";
import { useParams } from "react-router-dom";
import CommentSection from "../components/CommentSection";
import { useAuth } from "../context/AuthContext"; 

const BlogDetailPage = () => {
    const { id } = useParams();
    const [blog, setBlog] = useState(null);
    const { user } = useAuth(); // Change from currentUser to user

    const fetchBlog = async () => {
        try {
            const res = await axiosClient.get(`/blogs/${id}`);
            setBlog(res.data.blog);
        } catch (error) {
            console.error("Error fetching blog:", error);
        }
    };

    useEffect(() => {
        fetchBlog();
    }, [id]);

    if (!blog) return <Spin style={{ display: "block", margin: "100px auto" }} />;

    return (
        <div style={{ padding: 20, maxWidth: 800, margin: "0 auto" }}>
            <Card title={blog.title}>
                <p>{blog.content}</p>
                <p><b>Author:</b> {blog.author.username}</p>
            </Card>

            <CommentSection blogId={id} currentUser={user} /> {/* Pass user instead of currentUser */}
        </div>
    );
};

export default BlogDetailPage;