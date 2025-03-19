import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import "./WelcomePage.css";

const WelcomePage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { signIn, signUp, user } = useAuth();
  const navigate = useNavigate();

  const handleDashboardAccess = () => {
    if (user) {
      navigate("/dashboard");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isLogin) {
        await signIn(email, password);
      } else {
        await signUp(email, password);
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setError("");
  };

  return (
    <div className="welcome-page">
      <div className="dashboard-access">
        <h1>Access Your Dashboard</h1>
        <button 
          className="access-dashboard-button" 
          onClick={handleDashboardAccess}
          disabled={!user}
        >
          {user ? "Access Dashboard" : "Login Required"}
        </button>
        <img
          src="https://via.placeholder.com/600x300"
          alt="Dashboard Preview"
          className="dashboard-image"
        />
      </div>
      {!user && (
        <div className="login-panel">
          <h2>{isLogin ? "Welcome Back" : "Create Account"}</h2>
          {error && <div className="error-message">{error}</div>}
          <form onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="Email"
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
            <button type="submit" disabled={loading}>
              {loading ? "Processing..." : isLogin ? "Login" : "Sign Up"}
            </button>
          </form>
          <button className="toggle-auth" onClick={toggleMode}>
            {isLogin ? "Need an account? Sign up" : "Already have an account? Login"}
          </button>
        </div>
      )}
      {user && (
        <div className="login-panel">
          <h2>Welcome, {user.email}</h2>
          <p>Click "Access Dashboard" to view your dashboard</p>
        </div>
      )}
    </div>
  );
};

export default WelcomePage;
