import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import "../styles/MyAccountPage.css";

function MyAccountPage() {
  const { user, logout, updateDetails } = useContext(AuthContext);
  const [userInfo, setUserInfo] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    if (user) {
      setUserInfo(user); // Initialize user details
      setFormData(user); // Set formData for potential edits
    }
  }, [user]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setFormData(user); // Reset formData to original user details
    setPassword("");
    setConfirmPassword("");
    setIsEditing(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleConfirm = () => {
    if (password && password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    const updatedDetails = { ...formData };
    if (password) {
      updatedDetails.password = password;
    }

    updateDetails(updatedDetails);
    setIsEditing(false);
  };

  return (
    <div className="my-account-page">
      <h2>Account Info</h2>
      {formData && (
        <div className="account-info">
          <label>
            Forename:
            <input
              type="text"
              name="forname"
              value={formData.forname}
              onChange={handleChange}
              disabled={!isEditing}
            />
          </label>
          <label>
            Surname:
            <input
              type="text"
              name="surname"
              value={formData.surname}
              onChange={handleChange}
              disabled={!isEditing}
            />
          </label>
          <label>
            Email Address:
            <input
              type="email"
              name="email_address"
              value={formData.email_address}
              onChange={handleChange}
              disabled={!isEditing}
            />
          </label>
          <label>
            Date of Birth:
            <input
              type="date"
              name="date_of_birth"
              value={formData.date_of_birth}
              onChange={handleChange}
              disabled={!isEditing}
            />
          </label>
          {isEditing && (
            <>
              <label>
                Password:
                <input
                  type="password"
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </label>
              <label>
                Confirm Password:
                <input
                  type="password"
                  name="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </label>
            </>
          )}
          {isEditing ? (
            <div className="action-buttons">
              <button onClick={handleConfirm}>Confirm</button>
              <button onClick={handleCancel}>Cancel</button>
            </div>
          ) : (
            <button onClick={handleEdit}>Edit</button>
          )}
        </div>
      )}
    </div>
  );
}

export default MyAccountPage;