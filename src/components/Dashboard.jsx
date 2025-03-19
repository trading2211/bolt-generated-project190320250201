import React from "react";
import { DataProvider } from "../contexts/DataContext";
import Sidebar from "./Sidebar";
import DashboardContent from "./DashboardContent";
import "./Dashboard.css";

const Dashboard = () => {
  return (
    <DataProvider>
      <div className="dashboard">
        <Sidebar />
        <DashboardContent />
      </div>
    </DataProvider>
  );
};

export default Dashboard;
