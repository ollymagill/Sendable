import React, { useContext } from "react";
import { Link } from "react-router-dom";
import "../styles/HomePage.css";
import { AuthContext } from "../context/AuthContext";
import scenery from "../assets/images/scenery.jpg";

function HomePage() {
  const { isLoggedIn } = useContext(AuthContext);

  return (
    <div className="home-page">
      <h1>Welcome to Sendable</h1>
      <p>Sendable is your go-to platform for securely sharing media files with ease.</p>
      <img src={scenery} alt="Scenery" className="home-image" />
      <p>Get started by signing up or uploading your files today!</p>
      <Link to={isLoggedIn ? "/my_account" : "/register_login"} className="header-button">
        {isLoggedIn ? "My Account" : "Register or Login"}
      </Link>
      <p>&nbsp;</p>
    </div>
  );
}

export default HomePage;
