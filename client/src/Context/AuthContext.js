import React, { createContext, useContext, useState, useEffect } from "react";
import api from "../api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await api.get("/auth/me", { withCredentials: true });
        if (response.data.success) {
          const userData = response.data.user;
          setUser({
            id: userData.user_id,
            username: userData.username || "",
            email: userData.email,
          });
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
          setUser(null);
        }
      } catch (error) {
        setIsAuthenticated(false);
        setUser(null);
        console.error("Auth check failed:", error);
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  const login = (userData) => {
    setIsAuthenticated(true);
    setUser({
      id: userData.user_id,
      username: userData.username,
      email: userData.email,
    });
  };

  const logout = async () => {
    try {
      await api.post("/auth/logout", {}, { withCredentials: true });
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setIsAuthenticated(false);
      setUser(null);
    }
  };

  // Password reset functions
  const requestPasswordReset = async (email) => {
    try {
      const response = await api.post("/auth/request-password-reset", {
        email,
      });
      return response.data;
    } catch (error) {
      console.error("Password reset request error:", error);
      return {
        success: false,
        message:
          error.response?.data?.message || "Error requesting password reset",
      };
    }
  };

  const verifyResetCode = async (email, code) => {
    try {
      const response = await api.post("/auth/verify-reset-code", {
        email,
        code,
      });
      return response.data;
    } catch (error) {
      console.error("Verify reset code error:", error);
      return {
        success: false,
        message: error.response?.data?.message || "Error verifying reset code",
      };
    }
  };

  const resetPassword = async (token, newPassword) => {
    try {
      const response = await api.post("/auth/reset-password", {
        token,
        newPassword,
      });
      return response.data;
    } catch (error) {
      console.error("Reset password error:", error);
      return {
        success: false,
        message: error.response?.data?.message || "Error resetting password",
      };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        loading,
        login,
        logout,
        requestPasswordReset,
        verifyResetCode,
        resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
