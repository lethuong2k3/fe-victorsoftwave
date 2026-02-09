import React, { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import ScrollToTop from './components/ScrollToTop';
import PublicRoutes from './router/PublicRoutes';

const PrivateRoutes = lazy(() => import('./router/PrivateRoutes'));

const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
  </div>
);

const App: React.FC = () => {
  return (
    <>
      <ScrollToTop />
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          {/* Admin Routes - Private/Protected Area */}
          <Route path="/admin/*" element={<PrivateRoutes />} />

          {/* Public Routes - Main Website Area */}
          <Route path="/*" element={<PublicRoutes />} />
        </Routes>
      </Suspense>
    </>
  );
};

export default App;
