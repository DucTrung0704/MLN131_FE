import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout, ConfigProvider } from "antd";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import BlogListPage from "./pages/BlogListPage";
import BlogDetailPage from "./pages/BlogDetailPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import CreateBlogPage from "./pages/CreateBlogPage";
import DashboardPage from "./pages/DashboardPage";
import EditBlogPage from "./pages/EditBlogPage";
import HomePage from "./pages/HomePage";
import AppFooter from "./components/Footer"; // ✅ chỉ cần 1 import đúng
import "./index.css";

const { Content } = Layout;

function App() {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#1890ff",
          borderRadius: 6,
        },
      }}
    >
      <AuthProvider>
        <BrowserRouter>
          <Layout className="layout" style={{ minHeight: "100vh" }}>
            {/* Navbar */}
            <Navbar />

            {/* Main Content */}
            <Content
              style={{
                padding: "24px 50px",
                marginTop: 64,
                minHeight: "calc(100vh - 134px)",
                background: "#fff",
              }}
            >
              <div
                style={{
                  maxWidth: 1200,
                  margin: "0 auto",
                  padding: "24px",
                  minHeight: 380,
                }}
              >
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/blog" element={<BlogListPage />} />
                  <Route path="/blog/:id" element={<BlogDetailPage />} />
                  <Route path="/create" element={<CreateBlogPage />} />
                  <Route path="/dashboard" element={<DashboardPage />} />
                  <Route path="/edit-blog/:id" element={<EditBlogPage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />
                </Routes>
              </div>
            </Content>

            {/* Footer */}
            <AppFooter />
          </Layout>
        </BrowserRouter>
      </AuthProvider>
    </ConfigProvider>
  );
}

export default App;
