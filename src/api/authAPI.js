import { API_ENDPOINTS } from "../config/apiConfig";

// Fetch user details
export const fetchUserDetails = async (token, userId) => {
  const response = await fetch(`${API_ENDPOINTS.fetchUserDetails}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ id: userId }),
  });

  if (!response.ok) {
    throw new Error("Failed to fetch user details");
  }

  return response.json();
};

// Update user details
export const updateUserDetails = async (token, userDetails) => {
  const response = await fetch(`${API_ENDPOINTS.updateUserDetails}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(userDetails),
  });

  if (!response.ok) {
    throw new Error("Failed to update user details");
  }

  return response.json();
};

export const login = async (email, password) => {
  const response = await fetch(API_ENDPOINTS.login, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email_address: email, password }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "Login failed");
  }

  return response.json();
};

export const register = async (userDetails) => {
  const response = await fetch(API_ENDPOINTS.register, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userDetails),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "Registration failed");
  }

  return response.json();
};