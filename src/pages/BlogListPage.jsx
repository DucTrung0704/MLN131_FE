import React, { useEffect, useState } from "react";
import { Card, Button, Spin, Row, Col, Pagination, Typography, Image } from "antd";
import { MessageOutlined, UserOutlined, EyeOutlined, CalendarOutlined, ReadOutlined } from "@ant-design/icons";
import axiosClient from "../api/axiosClient";
import { Link, useNavigate } from "react-router-dom";
import "./BlogListPage.css";
import defaultImage from "../assets/Dang.png";

const { Title, Paragraph, Text } = Typography;
const { Meta } = Card;

const DEFAULT_THUMBNAIL = defaultImage;

const BlogListPage = () => {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const navigate = useNavigate();
    const pageSize = 9;

    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                const res = await axiosClient.get("/blogs");
                if (res.data?.success) {
                    setBlogs(res.data.blogs);
                }
            } catch (error) {
                console.error('Error fetching blogs:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchBlogs();
    }, []);

    const handleBlogClick = (blogId) => {
        navigate(`/blog/${blogId}`);
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    if (loading) {
        return (
            <div style={{ 
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: '100px 0'
            }}>
                <Spin size="large" />
                <div style={{ marginTop: '16px' }}>Loading blogs...</div>
            </div>
        );
    }

    const indexOfLastBlog = currentPage * pageSize;
    const indexOfFirstBlog = indexOfLastBlog - pageSize;
    const currentBlogs = blogs.slice(indexOfFirstBlog, indexOfLastBlog);

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <div className="blog-list-container">
            <div className="blog-list-header">
                <Title level={2}>Blog Posts ({blogs.length})</Title>
            </div>

            <Row gutter={[24, 24]} justify="start">
                {currentBlogs.map((blog) => (
                    <Col xs={24} sm={12} md={8} key={blog._id}>
                        <Card
                            hoverable
                            className="blog-card"
                            onClick={() => handleBlogClick(blog._id)}
                            cover={
                                <div className="blog-image-container">
                                    <div style={{
                                        height: 200,
                                        background: '#f0f2f5',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}>
                                        <ReadOutlined style={{ fontSize: 48, color: '#1890ff' }} />
                                    </div>
                                </div>
                            }
                        >
                            <Meta
                                title={<Text ellipsis style={{ width: '100%' }}>{blog.title}</Text>}
                                description={<Paragraph ellipsis={{ rows: 2 }}>{blog.excerpt}</Paragraph>}
                            />
                            <div style={{ marginTop: 12, color: '#8c8c8c' }}>
                                <span><UserOutlined /> {blog.author?.username || 'Anonymous'}</span>
                                <span style={{ margin: '0 8px' }}>•</span>
                                <span><MessageOutlined /> {blog.commentCount || 0}</span>
                                <div className="blog-date">
                                    <CalendarOutlined style={{ marginRight: 4 }} />
                                    {formatDate(blog.createdAt)}
                                </div>
                            </div>
                        </Card>
                    </Col>
                ))}
            </Row>

            <div className="pagination-container">
                <Pagination
                    current={currentPage}
                    onChange={handlePageChange}
                    total={blogs.length}
                    pageSize={pageSize}
                    showTotal={(total) => `Total ${total} blogs`}
                    showSizeChanger={false}
                />
            </div>
        </div>
    );
};

export default BlogListPage;