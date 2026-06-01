import { createContext, useContext, useState, useEffect } from "react";
import api from "../services/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check login status on load
  useEffect(() => {
    const checkLoggedIn = async () => {
      const token = localStorage.getItem("token");

      if (token) {
        try {
          // Token is automatically injected by the request interceptor in api.js
          const res = await api.get("/auth/me");
          setUser(res.data);
        } catch (err) {
          console.error("Token verification failed:", err);
          // Token expired or invalid
          localStorage.removeItem("token");
          setUser(null);
        }
      }
      setLoading(false);
    };

    checkLoggedIn();
  }, []);

  // Login handler
  const login = async (email, password) => {
    try {
      const res = await api.post("/auth/login", { email, password });
      const { token, user: userData } = res.data;

      localStorage.setItem("token", token);
      setUser(userData);
      return { success: true };
    } catch (err) {
      console.error("Login Context error:", err);
      return {
        success: false,
        error: err.response?.data?.error || "Invalid email or password.",
      };
    }
  };

  // Signup handler
  const signup = async (name, email, password) => {
    try {
      const res = await api.post("/auth/signup", { name, email, password });
      const { token, user: userData } = res.data;

      localStorage.setItem("token", token);
      setUser(userData);
      return { success: true };
    } catch (err) {
      console.error("Signup Context error:", err);
      return {
        success: false,
        error: err.response?.data?.error || "Registration failed. Try again.",
      };
    }
  };

  // Logout handler
  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
