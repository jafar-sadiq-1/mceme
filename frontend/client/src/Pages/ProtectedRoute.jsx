import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("jwtToken");

  if (!token) {
    return <Navigate to="/" replace />;  // Redirect to login page if token not found
  }

  return children;  // If token is present, render the page
};

export default ProtectedRoute;
