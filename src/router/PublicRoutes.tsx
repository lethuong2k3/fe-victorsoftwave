import React, { useEffect, Suspense, lazy } from 'react';
import { Routes, Route, Navigate, useParams, useLocation } from 'react-router-dom';
import { SLUG_MAPPING, getLang, getLocalizedSlug } from '@/utils/localization';
import { api } from '@/utils/api';

// Lazy load pages
const Home = lazy(() => import('@/pages/Home'));
const WebDesignDetail = lazy(() => import('@/pages/WebDesignDetail'));
const SeoDetail = lazy(() => import('@/pages/SeoDetail'));
const WebsiteCareDetail = lazy(() => import('@/pages/WebsiteCareDetail'));
const TikTokDetail = lazy(() => import('@/pages/TikTokDetail'));
const FacebookAdsDetail = lazy(() => import('@/pages/FacebookAdsDetail'));
const GoogleAdsDetail = lazy(() => import('@/pages/GoogleAdsDetail'));
const PortfolioPage = lazy(() => import('@/pages/PortfolioPage'));
const ClientsPage = lazy(() => import('@/pages/ClientsPage'));
const ProjectDetail = lazy(() => import('@/pages/ProjectDetail'));
// const ClientDetail = lazy(() => import('@/pages/ClientDetail')); // Unused in original
// const ArticlesPage = lazy(() => import('@/pages/ArticlesPage')); // Unused in original
// const ArticleDetailPage = lazy(() => import('@/pages/ArticleDetailPage')); // Unused in original
// const ContactPage = lazy(() => import('@/pages/ContactPage')); // Unused in original
// const NotFound = lazy(() => import('@/pages/NotFound')); // Unused in original

const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
  </div>
);

const PublicRoutes: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
    const recordVisit = async () => {
      try {
        await api.post('/api/analytics/visit?pageUrl=' + encodeURIComponent(window.location.href), {});
      } catch (e) {
        // Silently fail for analytics
        console.error("Analytics error", e);
      }
    };
    recordVisit();
  }, [location.pathname]);

  const LanguageRedirect: React.FC = () => {
    const lang = getLang();
    return <Navigate to={`/${lang}`} replace />;
  };

  const LegacyDuAnRedirect: React.FC = () => {
    const { id } = useParams();
    const lang = getLang();
    return <Navigate to={`/${lang}/${getLocalizedSlug('danh-muc-website', lang)}/${id}`} replace />;
  };

  const LegacyProjectSlugRedirectVi: React.FC = () => {
    const { slug } = useParams();
    return <Navigate to={`/vi/${SLUG_MAPPING['danh-muc-website'].vi}/${slug}`} replace />;
  };

  const LegacyProjectSlugRedirectEn: React.FC = () => {
    const { slug } = useParams();
    return <Navigate to={`/en/${SLUG_MAPPING['danh-muc-website'].en}/${slug}`} replace />;
  };

  return (
    <Suspense fallback={<LoadingFallback />}>
      <Routes>
        <Route path="/" element={<LanguageRedirect />} />
        <Route path="/:lang" element={<Home />} />

        {/* Web Design */}
        <Route path={`/vi/${SLUG_MAPPING['thiet-ke-website'].vi}`} element={<WebDesignDetail />} />
        <Route path={`/en/${SLUG_MAPPING['thiet-ke-website'].en}`} element={<WebDesignDetail />} />

        {/* SEO */}
        <Route path={`/vi/${SLUG_MAPPING['seo-tong-the'].vi}`} element={<SeoDetail />} />
        <Route path={`/en/${SLUG_MAPPING['seo-tong-the'].en}`} element={<SeoDetail />} />

        {/* Website Care */}
        <Route path={`/vi/${SLUG_MAPPING['cham-soc-website'].vi}`} element={<WebsiteCareDetail />} />
        <Route path={`/en/${SLUG_MAPPING['cham-soc-website'].en}`} element={<WebsiteCareDetail />} />

        {/* TikTok */}
        <Route path={`/vi/${SLUG_MAPPING['tiktok-ads'].vi}`} element={<TikTokDetail />} />
        <Route path={`/en/${SLUG_MAPPING['tiktok-ads'].en}`} element={<TikTokDetail />} />

        {/* Facebook Ads */}
        <Route path={`/vi/${SLUG_MAPPING['facebook-ads'].vi}`} element={<FacebookAdsDetail />} />
        <Route path={`/en/${SLUG_MAPPING['facebook-ads'].en}`} element={<FacebookAdsDetail />} />

        {/* Google Ads */}
        <Route path={`/vi/${SLUG_MAPPING['google-ads'].vi}`} element={<GoogleAdsDetail />} />
        <Route path={`/en/${SLUG_MAPPING['google-ads'].en}`} element={<GoogleAdsDetail />} />

        {/* Portfolio */}
        <Route path={`/vi/${SLUG_MAPPING['danh-muc-website'].vi}`} element={<PortfolioPage />} />
        <Route path={`/en/${SLUG_MAPPING['danh-muc-website'].en}`} element={<PortfolioPage />} />

        {/* Project Detail under Web Category */}
        <Route path={`/vi/${SLUG_MAPPING['danh-muc-website'].vi}/:slug`} element={<ProjectDetail />} />
        <Route path={`/en/${SLUG_MAPPING['danh-muc-website'].en}/:slug`} element={<ProjectDetail />} />

        {/* Clients */}
        <Route path={`/vi/${SLUG_MAPPING['khach-hang'].vi}`} element={<ClientsPage />} />
        <Route path={`/en/${SLUG_MAPPING['khach-hang'].en}`} element={<ClientsPage />} />
        
        {/* Client Detail with Slug */}
        <Route path={`/vi/${SLUG_MAPPING['khach-hang'].vi}/:slug`} element={<ClientDetail />} />
        <Route path={`/en/${SLUG_MAPPING['khach-hang'].en}/:slug`} element={<ClientDetail />} />

        {/* Articles / Blog */}
        <Route path={`/vi/${SLUG_MAPPING['bai-viet'].vi}`} element={<ArticlesPage />} />
        <Route path={`/en/${SLUG_MAPPING['bai-viet'].en}`} element={<ArticlesPage />} />
        
        {/* Article Detail */}
        <Route path={`/vi/${SLUG_MAPPING['bai-viet'].vi}/:slug`} element={<ArticleDetailPage />} />
        <Route path={`/en/${SLUG_MAPPING['bai-viet'].en}/:slug`} element={<ArticleDetailPage />} />

        {/* Contact Page */}
        <Route path={`/vi/${SLUG_MAPPING['lien-he'].vi}`} element={<ContactPage />} />
        <Route path={`/en/${SLUG_MAPPING['lien-he'].en}`} element={<ContactPage />} />
   
        {/* Legacy project detail URLs with /du-an or /project segment */}
        <Route path={`/vi/${SLUG_MAPPING['du-an'].vi}/:slug`} element={<LegacyProjectSlugRedirectVi />} />
        <Route path={`/en/${SLUG_MAPPING['du-an'].en}/:slug`} element={<LegacyProjectSlugRedirectEn />} />

        {/* Legacy redirects without language prefix */}
        <Route path="/thiet-ke-website" element={<Navigate to={`/${getLang()}/${SLUG_MAPPING['thiet-ke-website'][getLang()]}`} replace />} />
        <Route path="/seo-tong-the" element={<Navigate to={`/${getLang()}/${SLUG_MAPPING['seo-tong-the'][getLang()]}`} replace />} />
        <Route path="/cham-soc-website" element={<Navigate to={`/${getLang()}/${SLUG_MAPPING['cham-soc-website'][getLang()]}`} replace />} />
        <Route path="/tiktok-ads" element={<Navigate to={`/${getLang()}/${SLUG_MAPPING['tiktok-ads'][getLang()]}`} replace />} />
        <Route path="/facebook-ads" element={<Navigate to={`/${getLang()}/${SLUG_MAPPING['facebook-ads'][getLang()]}`} replace />} />
        <Route path="/google-ads" element={<Navigate to={`/${getLang()}/${SLUG_MAPPING['google-ads'][getLang()]}`} replace />} />
        <Route path="/danh-muc-website" element={<Navigate to={`/${getLang()}/${SLUG_MAPPING['danh-muc-website'][getLang()]}`} replace />} />
        <Route path="/khach-hang" element={<Navigate to={`/${getLang()}/${SLUG_MAPPING['khach-hang'][getLang()]}`} replace />} />
        <Route path="/bai-viet" element={<Navigate to={`/${getLang()}/${SLUG_MAPPING['bai-viet'][getLang()]}`} replace />} />
        <Route path="/lien-he" element={<Navigate to={`/${getLang()}/${SLUG_MAPPING['lien-he'][getLang()]}`} replace />} />
        <Route path="/du-an/:id" element={<LegacyDuAnRedirect />} />

        {/* 404 - Not Found */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      <FloatingContact />
    </Suspense>
  );
};

export default PublicRoutes;
