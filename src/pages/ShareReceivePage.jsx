import React, { useState } from 'react';
import '../styles/ShareReceivePage.css';

function ShareReceivePage() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileDetails, setFileDetails] = useState(null);
  const [accessCode, setAccessCode] = useState('');
  const [receiveAccessCode, setReceiveAccessCode] = useState('');
  const [receivedFileInfo, setReceivedFileInfo] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
    if (file) {
      setFileDetails({
        name: file.name,
        size: (file.size / (1024 * 1024)).toFixed(2),
        type: file.type,
      });
    }
  };

  const handleShareSubmit = async (event) => {
    event.preventDefault();
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const response = await fetch('YOUR_API_ENDPOINT', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      setAccessCode(data.accessCode);
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  const handleReceiveSubmit = async (event) => {
    event.preventDefault();
    if (!receiveAccessCode) return;

    try {
      const response = await fetch(`YOUR_API_ENDPOINT/${receiveAccessCode}`);
      const data = await response.json();
      setReceivedFileInfo(data);
    } catch (error) {
      console.error('Error retrieving file:', error);
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
              <p>Size: {fileDetails.size} MB</p>
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
            <p>File Size: {receivedFileInfo.size} MB</p>
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
