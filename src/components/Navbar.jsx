import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button, Layout, Menu, Dropdown } from "antd";
import { AuthContext } from "../context/AuthContext";
import { 
    UserOutlined, 
    DashboardOutlined, 
    LogoutOutlined,
    ReadOutlined 
} from "@ant-design/icons";

const { Header } = Layout;

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const userMenu = (
        <Menu>
            <Menu.Item key="dashboard" icon={<DashboardOutlined />} onClick={() => navigate("/dashboard")}>
                My Blogs
            </Menu.Item>
            <Menu.Divider />
            <Menu.Item 
                key="logout" 
                icon={<LogoutOutlined />} 
                onClick={() => { 
                    logout(); 
                    navigate("/login"); 
                }}
            >
                Logout
            </Menu.Item>
        </Menu>
    );

    return (
        <Header style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
                <Link to="/" style={{ color: "#fff", fontSize: 20 }}>Knowledge Blog</Link>
                <Button 
                    type="link" 
                    icon={<ReadOutlined />}
                    onClick={() => navigate("/blog")}
                    style={{ color: "#fff" }}
                >
                    Blogs
                </Button>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                {user ? (
                    <>
                        <Button 
                            type="primary" 
                            onClick={() => navigate("/create")}
                            style={{ marginRight: 8 }}
                        >
                            Create Blog
                        </Button>
                        <Dropdown overlay={userMenu} trigger={["click"]}>
                            <Button type="link" style={{ color: "#fff" }}>
                                <UserOutlined /> {user.username}
                            </Button>
                        </Dropdown>
                    </>
                ) : (
                    <>
                        <Button type="primary" onClick={() => navigate("/login")} style={{ marginRight: 8 }}>
                            Login
                        </Button>
                        <Button onClick={() => navigate("/register")}>
                            Register
                        </Button>
                    </>
                )}
            </div>
        </Header>
    );
};

export default Navbar;