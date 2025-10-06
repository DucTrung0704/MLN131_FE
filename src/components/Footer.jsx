import React from "react";
import { Layout, Typography, Space } from "antd";
import { FacebookFilled } from "@ant-design/icons";

const { Footer } = Layout;
const { Text } = Typography;

const AppFooter = () => {
    return (
        <Footer
            style={{
                textAlign: "center",
                backgroundColor: "#001529",
                color: "white",
                padding: "30px 20px",
            }}
        >
            <Space direction="vertical" align="center" style={{ width: "100%" }}>
                <a
                    href="https://www.facebook.com/profile.php?id=61581271033561" 
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: "#1777f2", fontSize: "24px" }}
                >
                    <FacebookFilled />
                </a>

                <Text style={{ color: "#ccc" }}>
                    © {new Date().getFullYear()} MacLenin Blog. All rights reserved.
                </Text>
            </Space>
        </Footer>
    );
};

export default AppFooter;
