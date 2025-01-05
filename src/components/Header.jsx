import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "../styles/Header.css";
import logo from "../assets/images/logo-cropped_transparent.png";

function Header() {
  const { isLoggedIn } = useContext(AuthContext);

  return (
    <header className="header">
      <a href="/">
        <img src={logo} alt="Logo" className="header-logo" />
      </a>
      <nav className="header-nav">
        {isLoggedIn && (
          <Link to="/share_receive" className="header-button">
            Share or Receive
          </Link>
        )}
        <Link to={isLoggedIn ? "/my_account" : "/register_login"} className="header-button">
          {isLoggedIn ? "My Account" : "Register/Login"}
        </Link>
      </nav>
    </header>
  );
}

export default Header;
