import { API_ENDPOINTS } from "../config/apiConfig";

export const fetchUserDetailsAPI = async (token, userId) => {
  const response = await fetch(API_ENDPOINTS.fetchUserDetails, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ token, user_id: userId }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "Failed to fetch user details");
  }

  return response.json();
};

export const updateUserDetailsAPI = async (token, userId, updatedData) => {
  const payload = {
    ...updatedData,
    token,
    user_id: userId,
  };

  const response = await fetch(API_ENDPOINTS.updateUserDetails, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "Failed to update user details");
  }

  return response.json();
};
