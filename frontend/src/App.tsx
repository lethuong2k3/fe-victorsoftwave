import React from 'react';
import { Routes, Route } from 'react-router-dom';
import PublicRoutes from './router/PublicRoutes';
import PrivateRoutes from './router/PrivateRoutes';

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/admin/*" element={<PrivateRoutes />} />
      <Route path="/*" element={<PublicRoutes />} />
    </Routes>
  );
};

export default App;

