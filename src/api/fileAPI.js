import { API_ENDPOINTS } from "../config/apiConfig";

export const uploadFileAPI = async (userId, token, file, mediaType, format) => {
  const fileContent = await getFileAsBase64(file);
  const payload = {
    user_id: userId,
    media_type: mediaType,
    format: format,
    file_size: file.size.toString(), // File size in bytes
    file: fileContent, // Base64-encoded content
  };

  try {
    const response = await fetch(API_ENDPOINTS.uploadFile, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error("Failed to upload file");
    }

    const data = await response.json();
    return data; // Expecting { "access_code": "generated_code" }
  } catch (error) {
    console.error("Error uploading file:", error);
    throw error;
  }
};

const getFileAsBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result.split(",")[1]); // Extract Base64 string
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
};

export const retrieveFileAPI = async (userId, token, accessCode) => {
  const response = await fetch(`${API_ENDPOINTS.retrieveFile}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      user_id: userId,
      token: token,
      access_code: accessCode,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "Failed to retrieve file.");
  }

  return response.json();
};
