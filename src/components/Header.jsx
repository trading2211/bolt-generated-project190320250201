import React from "react";
import { useAuth } from "../contexts/AuthContext";
import "./Header.css";

const Header = () => {
  const { signOut } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error("Error signing out:", error.message);
    }
  };

  return (
    <div className="header">
      <button>Dashboard</button>
      <button>Models</button>
      <button>Analytics</button>
      <button>Statistics</button>
      <button onClick={handleSignOut} className="sign-out-button">
        Sign Out
      </button>
    </div>
  );
};

export default Header;
