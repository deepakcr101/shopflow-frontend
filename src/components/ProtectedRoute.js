import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  if (!isAuthenticated) {
    // User is not authenticated, redirect to login page
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && user?.role !== 'ADMIN') {
    // User is authenticated but not an admin, redirect to home or access denied page
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;