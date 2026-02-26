import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
<<<<<<< HEAD
import { isAuthenticated } from '@/utils/auth';
=======
import { isAuthenticated } from '../utils/auth';
>>>>>>> b2df92e (first commit)

const PrivateRoute: React.FC = () => {
  const isAuth = isAuthenticated();

  // Nếu có token (đã đăng nhập), cho phép truy cập route con (Outlet)
  // Nếu không, chuyển hướng về trang login
  return isAuth ? <Outlet /> : <Navigate to="/admin/login" replace />;
};

export default PrivateRoute;
