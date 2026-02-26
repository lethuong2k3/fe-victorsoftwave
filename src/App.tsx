import React from 'react';
import { Routes, Route } from 'react-router-dom';
<<<<<<< HEAD
import PublicRoutes from './router/PublicRoutes';
import PrivateRoutes from './router/PrivateRoutes';
import ScrollToTop from './components/ScrollToTop';
=======
import ScrollToTop from './components/ScrollToTop';
import PublicRoutes from './router/PublicRoutes';
import PrivateRoutes from './router/PrivateRoutes';
>>>>>>> b2df92e (first commit)

const App: React.FC = () => {
  return (
    <>
      <ScrollToTop />
      <Routes>
<<<<<<< HEAD
        <Route path="/admin/*" element={<PrivateRoutes />} />
=======
        {/* Admin Routes - Private/Protected Area */}
        <Route path="/admin/*" element={<PrivateRoutes />} />

        {/* Public Routes - Main Website Area */}
>>>>>>> b2df92e (first commit)
        <Route path="/*" element={<PublicRoutes />} />
      </Routes>
    </>
  );
};

export default App;
<<<<<<< HEAD

=======
>>>>>>> b2df92e (first commit)
