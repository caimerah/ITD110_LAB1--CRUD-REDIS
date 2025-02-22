import React, { useState } from "react";
import { useAuth } from "./AuthContext.js";

const Login = () => {
  const { login } = useAuth();

  const [role, setRole] = useState(null); // Track if the user is logging in as admin or user
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false); // Track modal visibility

  const handleRoleSelection = (selectedRole) => {
    setRole(selectedRole); // Set the role as 'admin' or 'user'
    setUsername("");       // Reset username and password fields
    setPassword("");
    setError("");          // Clear any previous errors
    setIsModalOpen(true);  // Open the modal
  };

  const handleLogin = () => {
    // Check credentials (You can replace this with more secure logic later)
    if (role === "admin" && username === "admin" && password === "admin123") {
      login("admin");
      setIsModalOpen(false); // Close the modal on successful login
    } else if (role === "user" && username === "user" && password === "user123") {
      login("user");
      setIsModalOpen(false); // Close the modal on successful login
    } else {
      setError("Invalid username or password");
    }
  };

  return (
    <div className="container">
      <div className="title-box">
        <h1>STUDENT DATA MANAGEMENT</h1>
        <h2>CRUD WITH REDIS</h2>
      </div>

      {/* Login Buttons */}
      <div className="button-container">
        <button onClick={() => handleRoleSelection("admin")} className="custom-button">
          Login as Admin
        </button>
        <button onClick={() => handleRoleSelection("user")} className="custom-button">
          Login as User
        </button>
      </div>

      {/* Modal for Login Form */}
      {isModalOpen && (
        <div className="popup">
          <div className="popup-content">
            <h2>Login as {role.charAt(0).toUpperCase() + role.slice(1)}</h2>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="input-field"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-field"
            />
            <button onClick={handleLogin} className="custom-button">
              Login
            </button>
            {error && <div className="error-message">{error}</div>}
            <button onClick={() => setIsModalOpen(false)} className="close-modal">
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
