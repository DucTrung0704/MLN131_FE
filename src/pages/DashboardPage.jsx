import React, { useState, useEffect } from "react";
import { Table, Button, Space, message, Popconfirm, Tag } from "antd";
import { EditOutlined, DeleteOutlined, EyeOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axiosClient from "../api/axiosClient";

const DashboardPage = () => {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
        total: 0
    });
    const navigate = useNavigate();
    const { user } = useAuth();

    const fetchUserBlogs = async () => {
        if (!user?._id) return;
        
        setLoading(true);
        try {
            const res = await axiosClient.get('/blogs', {
                params: { author: user._id }
            });
            
            if (res.data?.success) {
                setBlogs(res.data.blogs);
                setPagination(prev => ({
                    ...prev,
                    total: res.data.blogs.length
                }));
            } else {
                setBlogs([]);
                message.info("No blogs found");
            }
        } catch (error) {
            console.error("Error fetching blogs:", error);
            message.error("Failed to fetch blogs");
            setBlogs([]);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (blogId) => {
        try {
            const res = await axiosClient.delete(`/blogs/${blogId}`);
            if (res.data?.success) {
                message.success("Blog deleted successfully");
                await fetchUserBlogs();
            }
        } catch (error) {
            console.error("Error deleting blog:", error);
            message.error("Failed to delete blog");
        }
    };

    useEffect(() => {
        if (!user) {
            message.warning("Please login to access dashboard");
            navigate('/login');
            return;
        }
        fetchUserBlogs();
    }, [user, navigate]);

    const columns = [
        {
            title: "Title",
            dataIndex: "title",
            key: "title",
            sorter: (a, b) => a.title.localeCompare(b.title),
            render: (text) => <strong>{text}</strong>
        },
        {
            title: "Views",
            dataIndex: "views",
            key: "views",
            sorter: (a, b) => a.views - b.views,
            render: (views) => <Tag color="blue">{views || 0}</Tag>
        },
        {
            title: "Comments",
            dataIndex: "commentCount",
            key: "commentCount",
            sorter: (a, b) => a.commentCount - b.commentCount,
            render: (count) => <Tag color="green">{count || 0}</Tag>
        },
        {
            title: "Created At",
            dataIndex: "createdAt",
            key: "createdAt",
            render: (date) => new Date(date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            }),
            sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
        },
        {
            title: "Actions",
            key: "actions",
            render: (_, record) => (
                <Space>
                    <Button
                        icon={<EyeOutlined />}
                        onClick={() => navigate(`/blog/${record._id}`)}
                    >
                        View
                    </Button>
                    <Button
                        type="primary"
                        icon={<EditOutlined />}
                        onClick={() => navigate(`/edit-blog/${record._id}`)}
                    >
                        Edit
                    </Button>
                    <Popconfirm
                        title="Delete this blog?"
                        description="This action cannot be undone."
                        onConfirm={() => handleDelete(record._id)}
                        okText="Yes"
                        cancelText="No"
                        okButtonProps={{ danger: true }}
                    >
                        <Button type="primary" danger icon={<DeleteOutlined />}>
                            Delete
                        </Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    const handleTableChange = (pagination, filters, sorter) => {
        setPagination(pagination);
    };

    return (
        <div style={{ padding: "24px" }}>
            <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                marginBottom: '24px' 
            }}>
                <h1 style={{ margin: 0 }}>My Blogs</h1>
                <Button 
                    type="primary" 
                    size="large"
                    onClick={() => navigate('/create')}
                >
                    Create New Blog
                </Button>
            </div>
            <Table
                columns={columns}
                dataSource={blogs}
                rowKey="_id"
                loading={loading}
                pagination={pagination}
                onChange={handleTableChange}
                scroll={{ x: true }}
            />
        </div>
    );
};

export default DashboardPage;