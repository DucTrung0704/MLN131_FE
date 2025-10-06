import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Button, Typography, Spin } from 'antd';
import { useNavigate } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import { ReadOutlined, UserOutlined, MessageOutlined } from '@ant-design/icons';
import banner from '../assets/banner.jpg';
import './HomePage.css';

const { Title, Paragraph, Text } = Typography;
const { Meta } = Card;

const HomePage = () => {
    const [featuredBlogs, setFeaturedBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchFeaturedBlogs = async () => {
            try {
                const res = await axiosClient.get('/blogs');
                if (res.data?.success) {
                    const sortedBlogs = res.data.blogs
                        .sort((a, b) => b.views - a.views)
                        .slice(0, 3);
                    setFeaturedBlogs(sortedBlogs);
                }
            } catch (error) {
                console.error('Error fetching blogs:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchFeaturedBlogs();
    }, []);

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <div>
            {/* Hero Section */}
            <div className="hero-section">
                {/* Background Image */}
                <div 
    className="hero-background"
    style={{
        backgroundImage: `url(${banner})`,
    }}
/>

                {/* Content Overlay */}
                <div className="hero-content">
                    <Title level={1}>
                        Welcome to Knowledge Blog. A Platform where you can share your knowledge.
                    </Title>
                    <Button type="primary" size="large" ghost onClick={() => navigate('/blog')}>
                        Explore Blogs
                    </Button>
                </div>
            </div>

            {/* Featured Blogs Section */}
            <div className="featured-section">
                <Title level={2}>
                    Featured Posts
                </Title>
                {loading ? (
                    <div className="loading-container">
                        <Spin size="large" />
                    </div>
                ) : (
                    <Row gutter={[24, 24]} justify="center">
                        {featuredBlogs.map(blog => (
                            <Col xs={24} sm={12} md={8} key={blog._id}>
                                <Card
                                    hoverable
                                    className="blog-card"
                                    onClick={() => navigate(`/blog/${blog._id}`)}
                                    cover={
                                        <div className="blog-card-cover">
                                            <ReadOutlined className="blog-card-icon" />
                                        </div>
                                    }
                                >
                                    <Meta
                                        title={<Text ellipsis>{blog.title}</Text>}
                                        description={
                                            <Paragraph ellipsis={{ rows: 2 }}>
                                                {blog.excerpt || 'Click to read more...'}
                                            </Paragraph>
                                        }
                                    />
                                    <div className="blog-card-footer">
                                        <span>
                                            <UserOutlined /> {blog.author?.username || 'Anonymous'}
                                        </span>
                                        <span className="separator">•</span>
                                        <span>
                                            <MessageOutlined /> {blog.commentCount || 0}
                                        </span>
                                    </div>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                )}
            </div>

            {/* Call to Action Section */}
            <div className="cta-section">
                <Title level={2}>Start Writing Today</Title>
                <Paragraph>
                    Share your knowledge and experiences with our growing community.
                </Paragraph>
                <Button type="primary" size="large" onClick={() => navigate('/create')}>
                    Start Writing
                </Button>
            </div>
        </div>
    );
};

export default HomePage;