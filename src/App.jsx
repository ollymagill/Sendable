import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import RegisterLoginPage from "./pages/RegisterLoginPage";
import MyAccountPage from "./pages/MyAccountPage";
import ShareReceivePage from "./pages/ShareReceivePage";
import Header from "./components/Header";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Router>
      <Header />
      <div className="app-content">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/register_login" element={<RegisterLoginPage />} />
          <Route
            path="/my_account"
            element={
              <ProtectedRoute>
                <MyAccountPage />
              </ProtectedRoute>
            }
          />
          <Route path="/share_receive" element={<ShareReceivePage />} />
        </Routes>
      </div>
      <Footer />
    </Router>
  );
}

export default App;
