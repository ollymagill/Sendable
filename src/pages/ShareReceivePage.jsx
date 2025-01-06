import React, { useState } from "react";
import { uploadFileAPI, retrieveFileAPI } from "../api/fileAPI";
import "../styles/ShareReceivePage.css";

function ShareReceivePage() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileDetails, setFileDetails] = useState(null);
  const [accessCode, setAccessCode] = useState("");
  const [receiveAccessCode, setReceiveAccessCode] = useState("");
  const [receivedFileInfo, setReceivedFileInfo] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
    if (file) {
      setFileDetails({
        name: file.name,
        size: file.size, // Size in bytes
        type: file.type,
      });
    }
  };

  const handleShareSubmit = async (event) => {
    event.preventDefault();
    if (!selectedFile) return;

    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("authToken");

    if (!userId || !token) {
      alert("You must be logged in to upload a file.");
      return;
    }

    const mediaType = selectedFile.type.split("/")[0]; // e.g., "text", "image"
    const format = selectedFile.name.split(".").pop(); // File extension

    try {
      const response = await uploadFileAPI(userId, token, selectedFile, mediaType, `.${format}`);
      setAccessCode(response.access_code);
    } catch (error) {
      console.error("Error sharing file:", error);
      alert("Failed to upload file. Please try again.");
    }
  };

  const handleReceiveSubmit = async (event) => {
    event.preventDefault();
    if (!receiveAccessCode) return;

    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("authToken");

    if (!userId || !token) {
      alert("You must be logged in to retrieve a file.");
      return;
    }

    try {
      const response = await retrieveFileAPI(userId, token, receiveAccessCode);
      setReceivedFileInfo(response);
    } catch (error) {
      console.error("Error retrieving file:", error);
      alert("Failed to retrieve file. Please check the access code and try again.");
    }
  };

  return (
    <div className="share-receive-container">
      <div className="share-section">
        <h1>Share Your Files</h1>
        <form onSubmit={handleShareSubmit} className="share-form">
          <input
            type="file"
            onChange={handleFileChange}
            className="file-input"
          />
          {fileDetails && (
            <div className="file-details">
              <p>Name: {fileDetails.name}</p>
              <p>Size: {fileDetails.size} Bytes</p>
              <p>Type: {fileDetails.type}</p>
            </div>
          )}
          <button type="submit" className="upload-button">
            Upload
          </button>
        </form>
        {accessCode && (
          <div className="access-code">
            <p>Your access code: {accessCode}</p>
          </div>
        )}
      </div>

      <div className="receive-section">
        <h1>Receive a File</h1>
        <form onSubmit={handleReceiveSubmit} className="receive-form">
          <input
            type="text"
            placeholder="Enter Access Code"
            value={receiveAccessCode}
            onChange={(e) => setReceiveAccessCode(e.target.value)}
            className="access-code-input"
          />
          <button type="submit" className="retrieve-button">
            Retrieve File
          </button>
        </form>
        {receivedFileInfo && (
          <div className="file-info">
            <p>File Name: {receivedFileInfo.name}</p>
            <p>File Size: {receivedFileInfo.size} Bytes</p>
            <a href={receivedFileInfo.downloadLink} className="download-link">
              Download File
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

export default ShareReceivePage;