const USER_API_ENDPOINTS = {
  updateUser: "https://<YOUR_UPDATE_USER_API_URL>",
};

export const updateUserDetails = async (token, userDetails) => {
  const response = await fetch(USER_API_ENDPOINTS.updateUser, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userDetails),
  });

  if (!response.ok) {
    throw new Error("Failed to update user details");
  }

  return response.json();
};
