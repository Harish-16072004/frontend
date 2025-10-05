import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Loader from './common/Loader';

const PrivateRoute = ({ children, adminOnly = false, userOnly = false }) => {
  const { user, loading, isAuthenticated } = useAuth();

  if (loading) {
    return <Loader />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Admin/Coordinator only routes
  if (adminOnly && user?.role !== 'admin' && user?.role !== 'coordinator') {
    return <Navigate to="/" replace />;
  }

  // User only routes (prevent admin/coordinator access)
  if (userOnly && (user?.role === 'admin' || user?.role === 'coordinator')) {
    return <Navigate to="/admin" replace />;
  }

  return children;
};

export default PrivateRoute;
