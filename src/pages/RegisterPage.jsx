import React from "react";
import { Form, Input, Button, Card, message } from "antd";
import axiosClient from "../api/axiosClient";
import { useNavigate } from "react-router-dom";

const RegisterPage = () => {
    const navigate = useNavigate();

    const onFinish = async (values) => {
        try {
            await axiosClient.post("/auth/register", values);
            message.success("Registration successful!");
            navigate("/login");
        } catch (err) {
            message.error(err.response?.data?.message || "Registration failed");
        }
    };

    return (
        <Card title="Register" style={{ maxWidth: 400, margin: "50px auto" }}>
            <Form onFinish={onFinish} layout="vertical">
                <Form.Item name="username" label="Username" rules={[{ required: true }]}>
                    <Input />
                </Form.Item>
                <Form.Item name="email" label="Email" rules={[{ required: true, type: "email" }]}>
                    <Input />
                </Form.Item>
                <Form.Item name="password" label="Password" rules={[{ required: true, min: 6 }]}>
                    <Input.Password />
                </Form.Item>
                <Button type="primary" htmlType="submit" block>Register</Button>
            </Form>
        </Card>
    );
};

export default RegisterPage;
