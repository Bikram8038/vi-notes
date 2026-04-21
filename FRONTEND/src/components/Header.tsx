import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Header.css"

export default function Header() {
  const [userName, setUserName] = useState<string>(() => {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user).username : "";
  });
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUserName("");
    window.dispatchEvent(new CustomEvent("userLogout"));

    // redirect to home page
    navigate("/");
  };

  return (
    <header className="header">
      <div className="header-content">
        <h2 className="logo">📝 My Notes</h2>

        <nav className="nav">
          {userName ? (
            <div className="user-section">
              <div className="user-info">
                <div className="user-avatar">
                  {userName.charAt(0).toUpperCase()}
                </div>
                <span className="username">Welcome, {userName}</span>
              </div>
              <button onClick={handleLogout} className="logout-btn">
                Logout
              </button>
            </div>
          ) : (
            <div className="auth-buttons">
              <Link to="/login" className="login-btn">
                Login
              </Link>
              <Link to="/register" className="register-btn">
                Sign Up
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}