import React, { createContext, useState, useEffect } from "react";
import { login, register, fetchUserDetails, updateUserDetails } from "../api/authAPI";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const userId = localStorage.getItem("userId");
    if (token && userId) {
      fetchUserDetails(token, userId)
        .then((userData) => {
          setUser(userData);
          setIsLoggedIn(true);
        })
        .catch((error) => {
          console.error("Failed to fetch user details:", error);
          localStorage.removeItem("authToken");
          localStorage.removeItem("userId");
        });
    }
  }, []);

  const loginHandler = async (email, password) => {
    try {
      const data = await login(email, password);
      setUser(data.user);
      setIsLoggedIn(true);
      localStorage.setItem("authToken", data.token);
      localStorage.setItem("userId", data.user.id);
      return true;
    } catch (error) {
      console.error("Login error:", error.message);
      return false;
    }
  };

  const updateDetailsHandler = async (updatedDetails) => {
    try {
      const token = localStorage.getItem("authToken");
      const updatedUser = await updateUserDetails(token, updatedDetails);
      setUser(updatedUser);
      alert("Details updated successfully.");
    } catch (error) {
      console.error("Failed to update user details:", error);
      alert("Failed to update details. Please try again.");
    }
  };

  const registerHandler = async (userDetails) => {
    try {
      await register(userDetails);
      return true;
    } catch (error) {
      console.error("Registration failed:", error.message);
      return false;
    }
  };

  const logoutHandler = () => {
    setUser(null);
    setIsLoggedIn(false);
    localStorage.removeItem("authToken");
    localStorage.removeItem("userId");
  };

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        user,
        login: loginHandler,
        register: registerHandler,
        updateDetails: updateDetailsHandler,
        logout: logoutHandler,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
