import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AdminLogin from '../pages/AdminLogin';
import AdminDashboard from '../pages/AdminDashboard';
import PrivateRoute from '../components/PrivateRoute';
import GuestRoute from '../components/GuestRoute';

const PrivateRoutes: React.FC = () => {
  return (
    <Routes>
      <Route element={<GuestRoute />}>
        <Route path="login" element={<AdminLogin />} />
      </Route>

      <Route element={<PrivateRoute />}>
        <Route path="dashboard" element={<AdminDashboard />} />
      </Route>
      
      {/* Default redirect to dashboard for any unknown admin route */}
      <Route path="*" element={<Navigate to="dashboard" replace />} />
    </Routes>
  );
};

export default PrivateRoutes;
