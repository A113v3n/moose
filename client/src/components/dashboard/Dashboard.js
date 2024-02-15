import React from "react";
import { useSelector } from "react-redux";
import UserDashboard from "./User/UserDashboard";
import TherapistDashboard from "./Therapist/TherapistDashboard";
import AdminDashboard from "./Admin/AdminDashboard";
import { Navigate } from "react-router-dom";

const Dashboard = () => {
  const { user, loading } = useSelector((state) => state.auth);

  // If the user data is still being fetched, show a loading message
  if (loading) {
    return <h4>Loading...</h4>;
  }

  const accountType = user?.accountType;

  switch (accountType) {
    case 1:
      return <UserDashboard />;
    case 2:
      return <TherapistDashboard />;
    case 3:
      return <AdminDashboard />;
    default:
      // If the user data is loaded and the account type is invalid, redirect to the homepage
      return <Navigate to="/" />;
  }
};

export default Dashboard;
