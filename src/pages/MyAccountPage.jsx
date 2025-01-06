import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { fetchUserDetailsAPI, updateUserDetailsAPI } from "../api/userAPI";
import { useNavigate } from "react-router-dom";
import "../styles/MyAccountPage.css";

function MyAccountPage() {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("accountInfo");
  const [isEditing, setIsEditing] = useState(false);

  // Account Info State
  const [formData, setFormData] = useState({
    forename: "",
    surname: "",
    email_address: "",
    date_of_birth: "",
  });
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Shared and Received Files State
  const [sharedFiles, setSharedFiles] = useState([]);
  const [receivedFiles, setReceivedFiles] = useState([]);

  // Fetch user info on page load
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const userId = localStorage.getItem("userId");

    if (token && userId) {
      fetchUserDetailsAPI(token, userId)
        .then((userData) => {
          localStorage.setItem("userInfo", JSON.stringify(userData));
          setFormData({
            forename: userData.forename || "",
            surname: userData.surname || "",
            email_address: userData.email_address || "",
            date_of_birth: userData.date_of_birth || "",
          });
        })
        .catch((error) => {
          console.error("Failed to fetch user details:", error);
        });
    } else {
      localStorage.removeItem("userInfo");
    }
  }, []);

  // Populate formData from localStorage
  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    if (userInfo) {
      setFormData({
        forename: userInfo.forename || "",
        surname: userInfo.surname || "",
        email_address: userInfo.email_address || "",
        date_of_birth: userInfo.date_of_birth || "",
      });
    }
  }, []);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    setFormData({
      forename: userInfo.forename || "",
      surname: userInfo.surname || "",
      email_address: userInfo.email_address || "",
      date_of_birth: userInfo.date_of_birth || "",
    });
    setPassword("");
    setConfirmPassword("");
    setIsEditing(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    const token = localStorage.getItem("authToken");
    const userId = localStorage.getItem("userId");

    const updatedData = {
      forename: formData.forename,
      surname: formData.surname,
      email_address: formData.email_address.toLowerCase(),
      date_of_birth: formData.date_of_birth,
    };

    if (password) {
      updatedData.password = password; // Only include password if it has been updated
    }

    try {
      await updateUserDetailsAPI(token, userId, updatedData); // Send updated details to the backend
      alert("Details saved successfully.");
      window.location.reload(); // Reload the page to fetch and display updated details
    } catch (error) {
      console.error("Failed to update user details:", error);
      alert("Failed to save details. Please try again.");
    }
  };

  const fetchSharedFiles = () => {
    // Replace with API call
    setSharedFiles(["File1.pdf", "File2.docx", "File3.xlsx"]);
  };

  const fetchReceivedFiles = () => {
    // Replace with API call
    setReceivedFiles(["Image1.png", "Report.pdf", "Notes.txt"]);
  };

  useEffect(() => {
    if (activeTab === "sharedFiles") fetchSharedFiles();
    if (activeTab === "receivedFiles") fetchReceivedFiles();
  }, [activeTab]);

  return (
    <div className="my-account-page">
      <h2>My Account</h2>
      <div className="tabs">
        <button
          className={activeTab === "accountInfo" ? "active-tab" : ""}
          onClick={() => setActiveTab("accountInfo")}
        >
          Account Info
        </button>
        <button
          className={activeTab === "sharedFiles" ? "active-tab" : ""}
          onClick={() => setActiveTab("sharedFiles")}
        >
          Shared Files
        </button>
        <button
          className={activeTab === "receivedFiles" ? "active-tab" : ""}
          onClick={() => setActiveTab("receivedFiles")}
        >
          Received Files
        </button>
      </div>

      {activeTab === "accountInfo" && (
        <div className="tab-content">
          <label>Forename:</label>
          <input
            type="text"
            name="forename"
            value={formData.forename}
            onChange={handleChange}
            disabled={!isEditing}
          />
          <label>Surname:</label>
          <input
            type="text"
            name="surname"
            value={formData.surname}
            onChange={handleChange}
            disabled={!isEditing}
          />
          <label>Email Address:</label>
          <input
            type="email"
            name="email_address"
            value={formData.email_address}
            onChange={handleChange}
            disabled={!isEditing}
          />
          <label>Date of Birth:</label>
          <input
            type="date"
            name="date_of_birth"
            value={formData.date_of_birth}
            onChange={handleChange}
            disabled={!isEditing}
          />
          {isEditing && (
            <>
              <label>Password:</label>
              <input
                type="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <label>Confirm Password:</label>
              <input
                type="password"
                name="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </>
          )}
          <div className="action-buttons">
            {isEditing ? (
              <>
                <button className="cancel-button" onClick={handleCancel}>
                  Cancel
                </button>
                <button className="save-button" onClick={handleSave}>
                  Save
                </button>
              </>
            ) : (
              <button className="edit-button" onClick={handleEdit}>
                Edit
              </button>
            )}
          </div>
          {!isEditing && (
            <button className="logout-button" onClick={logout}>
              Logout
            </button>
          )}
        </div>
      )}

      {activeTab === "sharedFiles" && (
        <div className="tab-content">
          <h3>Shared Files</h3>
          <ul>
            {sharedFiles.map((file, index) => (
              <li key={index}>{file}</li>
            ))}
          </ul>
          <button
            className="action-button"
            onClick={() => navigate("/share_receive")}
          >
            Share New File
          </button>
        </div>
      )}

      {activeTab === "receivedFiles" && (
        <div className="tab-content">
          <h3>Received Files</h3>
          <ul>
            {receivedFiles.map((file, index) => (
              <li key={index}>{file}</li>
            ))}
          </ul>
          <button
            className="action-button"
            onClick={() => navigate("/share_receive")}
          >
            Receive New File
          </button>
        </div>
      )}
    </div>
  );
}

export default MyAccountPage;
