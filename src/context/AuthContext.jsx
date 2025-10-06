import React, { createContext, useState, useEffect, useContext } from "react";
import axiosClient from "../api/axiosClient";

export const AuthContext = createContext();

// Add useAuth hook for easier context consumption
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const initAuth = async () => {
            const token = localStorage.getItem("token");
            if (token) {
                await fetchUser();
            }
            setLoading(false);
        };
        initAuth();
    }, []);

    const fetchUser = async () => {
        try {
            const res = await axiosClient.get("/auth/me");
            setUser(res.data.user);
        } catch (error) {
            console.error("Auth error:", error);
            localStorage.removeItem("token");
            setUser(null);
        }
    };

    const login = async (token, userData) => {
        try {
            localStorage.setItem("token", token);
            setUser(userData);
            return true;
        } catch (error) {
            console.error("Login error:", error);
            return false;
        }
    };

    const logout = () => {
        try {
            localStorage.removeItem("token");
            setUser(null);
            return true;
        } catch (error) {
            console.error("Logout error:", error);
            return false;
        }
    };

    if (loading) {
        return <div>Loading...</div>; // Or your loading component
    }

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};