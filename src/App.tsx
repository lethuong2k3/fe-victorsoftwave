import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ScrollToTop from './components/ScrollToTop';
import PublicRoutes from './router/PublicRoutes';
import PrivateRoutes from './router/PrivateRoutes';

const App: React.FC = () => {
  return (
    <>
      <ScrollToTop />
      <Routes>
        {/* Admin Routes - Private/Protected Area */}
        <Route path="/admin/*" element={<PrivateRoutes />} />

        {/* Public Routes - Main Website Area */}
        <Route path="/*" element={<PublicRoutes />} />
      </Routes>
    </>
  );
};

export default App;
