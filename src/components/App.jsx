import React, { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { DataProvider } from "./contexts/DataContext";
import ProtectedRoute from "./components/ProtectedRoute";
import WelcomePage from "./components/WelcomePage";
import Dashboard from "./components/Dashboard";
import { initializeMetricsCache } from "./lib/metricService";

const App = () => {
  const [metricsCache, setMetricsCache] = useState({});
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Initialize metrics cache on app startup
    setLoading(true);
    
    initializeMetricsCache()
      .then(cache => {
        setMetricsCache(cache);
        setLoading(false);
        console.log("Metrics cache initialized");
      })
      .catch(error => {
        console.error("Failed to initialize metrics cache:", error);
        setLoading(false);
      });
  }, []);
  
  return (
    <AuthProvider>
      <DataProvider initialMetricsCache={metricsCache} cacheLoading={loading}>
        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading metrics data...</p>
          </div>
        ) : (
          <Routes>
            <Route path="/" element={<WelcomePage />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
          </Routes>
        )}
      </DataProvider>
    </AuthProvider>
  );
};

export default App;
