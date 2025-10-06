import React, { useState, useEffect } from "react";
import { Form, Input, Button, message } from "antd";
import { useParams, useNavigate } from "react-router-dom";
import axiosClient from "../api/axiosClient";

const EditBlogPage = () => {
    const [loading, setLoading] = useState(false);
    const [initialValues, setInitialValues] = useState(null);
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchBlog = async () => {
            try {
                const res = await axiosClient.get(`/blogs/${id}`);
                if (res.data?.success) {
                    setInitialValues(res.data.blog);
                }
            } catch (error) {
                message.error("Failed to fetch blog");
                navigate('/dashboard');
            }
        };
        fetchBlog();
    }, [id, navigate]);

    const onFinish = async (values) => {
        setLoading(true);
        try {
            const res = await axiosClient.put(`/blogs/${id}`, values);
            if (res.data?.success) {
                message.success("Blog updated successfully");
                navigate('/dashboard');
            }
        } catch (error) {
            message.error("Failed to update blog");
        } finally {
            setLoading(false);
        }
    };

    if (!initialValues) return null;

    return (
        <div style={{ maxWidth: 800, margin: "0 auto", padding: "24px" }}>
            <h1>Edit Blog</h1>
            <Form
                layout="vertical"
                initialValues={initialValues}
                onFinish={onFinish}
            >
                <Form.Item
                    name="title"
                    label="Title"
                    rules={[{ required: true, message: "Please input blog title!" }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    name="excerpt"
                    label="Excerpt"
                    rules={[{ required: true, message: "Please input blog excerpt!" }]}
                >
                    <Input.TextArea rows={4} />
                </Form.Item>

                <Form.Item
                    name="content"
                    label="Content"
                    rules={[{ required: true, message: "Please input blog content!" }]}
                >
                    <Input.TextArea rows={8} />
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit" loading={loading}>
                        Update Blog
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default EditBlogPage;