import React, { createContext, useState, useContext } from "react";

// Create Authentication Context
const AuthContext = createContext();

// Custom Hook for Accessing AuthContext
export const useAuth = () => useContext(AuthContext);

// AuthProvider Component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Login Function
  const login = (role) => {
    setUser({ role });
    localStorage.setItem("userRole", role); // Store role in localStorage
  };

  // Logout Function
  const logout = () => {
    setUser(null);
    localStorage.removeItem("userRole");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
