import React, { useState } from "react";
import { Form, Input, Button, Card, message } from "antd";
import axiosClient from "../api/axiosClient";
import { useNavigate } from "react-router-dom";

const CreateBlogPage = () => {
    const navigate = useNavigate();

    const onFinish = async (values) => {
        try {
            await axiosClient.post("/blogs", values);
            message.success("Blog created!");
            navigate("/");
        } catch {
            message.error("Login required or missing fields");
        }
    };

    return (
        <Card title="Create Blog" style={{ maxWidth: 600, margin: "40px auto" }}>
            <Form onFinish={onFinish} layout="vertical">
                <Form.Item name="title" label="Title" rules={[{ required: true }]}>
                    <Input />
                </Form.Item>
                <Form.Item name="excerpt" label="Excerpt" rules={[{ required: true }]}>
                    <Input />
                </Form.Item>
                <Form.Item name="content" label="Content" rules={[{ required: true }]}>
                    <Input.TextArea rows={5} />
                </Form.Item>
                <Button type="primary" htmlType="submit" block>Create</Button>
            </Form>
        </Card>
    );
};

export default CreateBlogPage;
