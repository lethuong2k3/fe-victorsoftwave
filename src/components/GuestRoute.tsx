import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
<<<<<<< HEAD
import { isAuthenticated } from '@/utils/auth';
=======
import { isAuthenticated } from '../utils/auth';
>>>>>>> b2df92e (first commit)

const GuestRoute: React.FC = () => {
  const isAuth = isAuthenticated();

  // Nếu đã đăng nhập (có token), chuyển hướng ngay vào dashboard
  // Nếu chưa đăng nhập, cho phép truy cập trang login (Outlet)
  return isAuth ? <Navigate to="/admin/dashboard" replace /> : <Outlet />;
};

export default GuestRoute;
