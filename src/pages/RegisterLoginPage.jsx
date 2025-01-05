import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "../styles/RegisterLoginPage.css";

function RegisterLoginPage() {
  const { login, register } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isRegistering, setIsRegistering] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const [forename, setForename] = useState("");
  const [surname, setSurname] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    const success = await login(email, password); // Returns true or false
    if (success) {
      navigate("/my_account"); // Navigate only on success
    } else {
      setErrorMessage("Login failed: Please check your email and password.");
    }
  };   

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }
    const success = await register({
      forname: forename,
      surname: surname,
      date_of_birth: dateOfBirth,
      email_address: email,
      password,
    });
    if (success) {
      setIsRegistering(false);
      alert("Registration successful. Please log in.");
    } else {
      setErrorMessage("Registration failed. Please try again.");
    }
  };

  return (
    <div className="register-login-page">
      {isRegistering ? (
        <form onSubmit={handleRegisterSubmit} className="register-form">
          <h2>Register</h2>
          {errorMessage && <p className="error-message">{errorMessage}</p>}
          <input
            type="text"
            placeholder="Forename"
            value={forename}
            onChange={(e) => setForename(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Surname"
            value={surname}
            onChange={(e) => setSurname(e.target.value)}
            required
          />
          <input
            type="date"
            placeholder="Date of Birth"
            value={dateOfBirth}
            onChange={(e) => setDateOfBirth(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <button type="submit">Register</button>
          <p>
            Already have an account? <span className="clickable" onClick={() => setIsRegistering(false)}>Login</span>
          </p>
        </form>
      ) : (
        <form onSubmit={handleLoginSubmit} className="login-form">
          <h2>Login</h2>
          {errorMessage && <p className="error-message">{errorMessage}</p>}
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Login</button>
          <p>
            Don't have an account? <span className="clickable" onClick={() => setIsRegistering(true)}>Register</span>
          </p>
        </form>
      )}
    </div>
  );
}

export default RegisterLoginPage;
