const FILE_API_ENDPOINTS = {
  upload: "https://<YOUR_UPLOAD_API_URL>",
  receivedFiles: "https://<YOUR_RECEIVED_FILES_API_URL>",
  sharedFiles: "https://<YOUR_SHARED_FILES_API_URL>",
};

export const uploadFile = async (token, file) => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(FILE_API_ENDPOINTS.upload, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (!response.ok) {
    throw new Error("File upload failed");
  }

  return response.json();
};

export const getReceivedFiles = async (token) => {
  const response = await fetch(FILE_API_ENDPOINTS.receivedFiles, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch received files");
  }

  return response.json();
};

export const getSharedFiles = async (token) => {
  const response = await fetch(FILE_API_ENDPOINTS.sharedFiles, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch shared files");
  }

  return response.json();
};
