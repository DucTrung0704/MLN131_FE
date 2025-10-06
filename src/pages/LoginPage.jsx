import React, { useContext, useState } from "react";
import { Form, Input, Button, Card, message } from "antd";
import axiosClient from "../api/axiosClient";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const onFinish = async (values) => {
        setLoading(true);
        try {
            const res = await axiosClient.post("/auth/login", values);
            if (res.data?.success) {
                message.success({
                    content: "Welcome back, " + res.data.user.username + "!",
                    duration: 3,
                    key: 'login'
                });
                login(res.data.token, res.data.user);
                navigate("/");
            }
        } catch (err) {
            message.error({
                content: err.response?.data?.message || "Invalid username or password",
                duration: 5,
                key: 'login'
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card title="Login" style={{ maxWidth: 400, margin: "50px auto" }}>
            <Form onFinish={onFinish} layout="vertical">
                <Form.Item 
                    name="username" 
                    label="Username" 
                    rules={[{ required: true, message: "Please input your username!" }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item 
                    name="password" 
                    label="Password" 
                    rules={[{ required: true, message: "Please input your password!" }]}
                >
                    <Input.Password />
                </Form.Item>
                <Button type="primary" htmlType="submit" loading={loading} block>
                    Login
                </Button>
            </Form>
        </Card>
    );
};

export default LoginPage;