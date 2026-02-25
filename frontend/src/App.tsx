import React from 'react';
import { Routes, Route } from 'react-router-dom';
import PublicRoutes from './router/PublicRoutes';
import PrivateRoutes from './router/PrivateRoutes';
import ScrollToTop from './components/ScrollToTop';

const App: React.FC = () => {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/admin/*" element={<PrivateRoutes />} />
        <Route path="/*" element={<PublicRoutes />} />
      </Routes>
    </>
  );
};

export default App;

