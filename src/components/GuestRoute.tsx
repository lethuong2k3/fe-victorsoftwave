import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { isAuthenticated } from '@/utils/auth';

const GuestRoute: React.FC = () => {
  const isAuth = isAuthenticated();

  // Nếu đã đăng nhập (có token), chuyển hướng ngay vào dashboard
  // Nếu chưa đăng nhập, cho phép truy cập trang login (Outlet)
  return isAuth ? <Navigate to="/admin/dashboard" replace /> : <Outlet />;
};

export default GuestRoute;
