import React from "react";
import { useAuth } from "./AuthContext.js";

const Logout = () => {
  const { logout } = useAuth();

  return <button onClick={logout}>Log Out</button>;
};

export default Logout;
