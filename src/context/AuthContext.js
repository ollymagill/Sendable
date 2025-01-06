import React, { createContext, useState, useEffect } from "react";
import { loginAPI, registerAPI } from "../api/authAPI";
import { fetchUserDetailsAPI, updateUserDetailsAPI } from "../api/userAPI";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const userId = localStorage.getItem("userId");

    if (token && userId) {
      fetchUserDetailsAPI(token, userId)
        .then((data) => {
          setUser(data);
          setIsLoggedIn(true);
        })
        .catch(() => {
          console.error("Session expired or invalid token.");
          localStorage.removeItem("authToken");
          localStorage.removeItem("userId");
          setIsLoggedIn(false);
        });
    }
  }, []);

  const loginHandler = async (email, password) => {
    try {
      const data = await loginAPI(email, password);
      localStorage.setItem("authToken", data.token); // Store token
      console.log("Token saved to localstorage: " + data.token);
      localStorage.setItem("userId", data.user.id); // Store user ID
      console.log("User ID saved to localstorage: " + data.user.id);
      setUser(data.user); // Set user in state
      setIsLoggedIn(true); // Update logged-in state
      return true;
    } catch (error) {
      console.error("Login failed:", error.message);
      return false;
    }
  };  

  const registerHandler = async (userDetails) => {
    try {
      await registerAPI(userDetails);
      return true;
    } catch (error) {
      console.error("Registration failed:", error.message);
      return false;
    }
  };

  const updateDetailsHandler = async (updatedDetails) => {
    try {
      const token = localStorage.getItem("authToken");
      const updatedUser = await updateUserDetailsAPI(token, updatedDetails);
      setUser(updatedUser);
      alert("Details updated successfully.");
    } catch (error) {
      console.error("Failed to update user details:", error.message);
      alert("Failed to update details. Please try again.");
    }
  };

  const logoutHandler = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userId");
    setUser(null);
    setIsLoggedIn(false);
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
