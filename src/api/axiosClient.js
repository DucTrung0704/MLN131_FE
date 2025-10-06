import axios from "axios";

// ✅ Lấy baseURL từ biến môi trường hoặc fallback sang backend Render
const baseURL = import.meta.env.VITE_API_URL?.trim() || "https://mln131-be.onrender.com/api";

const axiosClient = axios.create({
    baseURL,
    headers: {
        "Content-Type": "application/json",
    },
});

// ✅ Gắn token tự động vào header Authorization
axiosClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// ✅ Xử lý lỗi phản hồi (ví dụ: hết hạn token hoặc lỗi server)
axiosClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response) {
            console.error("❌ API Error:", error.response.status, error.response.data);
            if (error.response.status === 401) {
                // Token hết hạn → logout hoặc refresh
                localStorage.removeItem("token");
                window.location.href = "/login";
            }
        } else {
            console.error("❌ Network Error:", error.message);
        }
        return Promise.reject(error);
    }
);

export default axiosClient;
