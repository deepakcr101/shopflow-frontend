import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { isAuthenticated, isAdmin } = useAuth();

  if (!isAuthenticated()) {
    // User is not authenticated, redirect to login page
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && !isAdmin()) {
    // User is authenticated but not an admin, redirect to home or access denied page
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
