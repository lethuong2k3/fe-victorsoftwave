import React, { useEffect } from 'react';
import { Routes, Route, Navigate, useParams, useLocation } from 'react-router-dom';
import Home from '@/pages/Home';
import WebDesignDetail from '@/pages/WebDesignDetail';
import SeoDetail from '@/pages/SeoDetail';
import WebsiteCareDetail from '@/pages/WebsiteCareDetail';
import TikTokDetail from '@/pages/TikTokDetail';
import FacebookAdsDetail from '@/pages/FacebookAdsDetail';
import GoogleAdsDetail from '@/pages/GoogleAdsDetail';
import PortfolioPage from '@/pages/PortfolioPage';
import ClientsPage from '@/pages/ClientsPage';
import ClientDetail from '@/pages/ClientDetail';
import ProjectDetail from '@/pages/ProjectDetail';
import ArticlesPage from '@/pages/ArticlesPage';
import ArticleDetailPage from '@/pages/ArticleDetailPage';
import ContactPage from '@/pages/ContactPage';
import NotFound from '@/pages/NotFound';
import { SLUG_MAPPING, getLang, getLocalizedSlug } from '@/utils/localization';
import FloatingContact from '@/components/FloatingContact';
import { api } from '@/utils/api';

const PublicRoutes: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
    const recordVisit = async () => {
      try {
        if (typeof window !== 'undefined' && window.location) {
          await api.post('/api/analytics/visit?pageUrl=' + encodeURIComponent(window.location.href), {});
        }
      } catch (e) {
        // Silently fail for analytics
        console.error("Analytics error", e);
      }
    };
    recordVisit();
  }, [location.pathname]);

  const LanguageRedirect: React.FC = () => {
    return <Navigate to="/" replace />;
  };

  const LegacyDuAnRedirect: React.FC = () => {
    const { id } = useParams();
    const lang = getLang();
    return <Navigate to={`/${getLocalizedSlug('danh-muc-website', lang)}/${id}`} replace />;
  };

  const LegacyProjectSlugRedirectVi: React.FC = () => {
    const { slug } = useParams();
    return <Navigate to={`/${SLUG_MAPPING['danh-muc-website'].vi}/${slug}`} replace />;
  };

  const LegacyProjectSlugRedirectEn: React.FC = () => {
    const { slug } = useParams();
    return <Navigate to={`/${SLUG_MAPPING['danh-muc-website'].en}/${slug}`} replace />;
  };

  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        
        {/* Language prefix redirects - simplified */}
        <Route path="/vi/*" element={<LanguageRedirect />} />
        <Route path="/en/*" element={<LanguageRedirect />} />
        <Route path="/vn/*" element={<LanguageRedirect />} />

        {/* Web Design */}
        <Route path={`/${SLUG_MAPPING['thiet-ke-website'].vi}`} element={<WebDesignDetail />} />
        <Route path={`/${SLUG_MAPPING['thiet-ke-website'].en}`} element={<WebDesignDetail />} />

        {/* SEO */}
        <Route path={`/${SLUG_MAPPING['seo-tong-the'].vi}`} element={<SeoDetail />} />
        <Route path={`/${SLUG_MAPPING['seo-tong-the'].en}`} element={<SeoDetail />} />

        {/* Website Care */}
        <Route path={`/${SLUG_MAPPING['cham-soc-website'].vi}`} element={<WebsiteCareDetail />} />
        <Route path={`/${SLUG_MAPPING['cham-soc-website'].en}`} element={<WebsiteCareDetail />} />

        {/* TikTok */}
        <Route path={`/${SLUG_MAPPING['tiktok-ads'].vi}`} element={<TikTokDetail />} />
        <Route path={`/${SLUG_MAPPING['tiktok-ads'].en}`} element={<TikTokDetail />} />

        {/* Facebook Ads */}
        <Route path={`/${SLUG_MAPPING['facebook-ads'].vi}`} element={<FacebookAdsDetail />} />
        <Route path={`/${SLUG_MAPPING['facebook-ads'].en}`} element={<FacebookAdsDetail />} />

        {/* Google Ads */}
        <Route path={`/${SLUG_MAPPING['google-ads'].vi}`} element={<GoogleAdsDetail />} />
        <Route path={`/${SLUG_MAPPING['google-ads'].en}`} element={<GoogleAdsDetail />} />

        {/* Portfolio */}
        <Route path={`/${SLUG_MAPPING['danh-muc-website'].vi}`} element={<PortfolioPage />} />
        <Route path={`/${SLUG_MAPPING['danh-muc-website'].en}`} element={<PortfolioPage />} />

        {/* Project Detail under Web Category */}
        <Route path={`/${SLUG_MAPPING['danh-muc-website'].vi}/:slug`} element={<ProjectDetail />} />
        <Route path={`/${SLUG_MAPPING['danh-muc-website'].en}/:slug`} element={<ProjectDetail />} />

        {/* Clients */}
        <Route path={`/${SLUG_MAPPING['khach-hang'].vi}`} element={<ClientsPage />} />
        <Route path={`/${SLUG_MAPPING['khach-hang'].en}`} element={<ClientsPage />} />
        
        {/* Client Detail with Slug */}
        <Route path={`/${SLUG_MAPPING['khach-hang'].vi}/:slug`} element={<ClientDetail />} />
        <Route path={`/${SLUG_MAPPING['khach-hang'].en}/:slug`} element={<ClientDetail />} />

        {/* Articles / Blog */}
        <Route path={`/${SLUG_MAPPING['bai-viet'].vi}`} element={<ArticlesPage />} />
        <Route path={`/${SLUG_MAPPING['bai-viet'].en}`} element={<ArticlesPage />} />
        
        {/* Article Detail */}
        <Route path={`/${SLUG_MAPPING['bai-viet'].vi}/:slug`} element={<ArticleDetailPage />} />
        <Route path={`/${SLUG_MAPPING['bai-viet'].en}/:slug`} element={<ArticleDetailPage />} />

        {/* Contact Page */}
        <Route path={`/${SLUG_MAPPING['lien-he'].vi}`} element={<ContactPage />} />
        <Route path={`/${SLUG_MAPPING['lien-he'].en}`} element={<ContactPage />} />
   
        {/* Legacy project detail URLs with /du-an or /project segment */}
        <Route path={`/${SLUG_MAPPING['du-an'].vi}/:slug`} element={<LegacyProjectSlugRedirectVi />} />
        <Route path={`/${SLUG_MAPPING['du-an'].en}/:slug`} element={<LegacyProjectSlugRedirectEn />} />
        <Route path={`/vi/${SLUG_MAPPING['du-an'].vi}/:slug`} element={<LegacyProjectSlugRedirectVi />} />
        <Route path={`/en/${SLUG_MAPPING['du-an'].en}/:slug`} element={<LegacyProjectSlugRedirectEn />} />

        {/* Legacy redirects without language prefix */}
        <Route path="/thiet-ke-website" element={<Navigate to={`/${SLUG_MAPPING['thiet-ke-website'].vi}`} replace />} />
        <Route path="/seo-tong-the" element={<Navigate to={`/${SLUG_MAPPING['seo-tong-the'].vi}`} replace />} />
        <Route path="/cham-soc-website" element={<Navigate to={`/${SLUG_MAPPING['cham-soc-website'].vi}`} replace />} />
        <Route path="/tiktok-ads" element={<Navigate to={`/${SLUG_MAPPING['tiktok-ads'].vi}`} replace />} />
        <Route path="/facebook-ads" element={<Navigate to={`/${SLUG_MAPPING['facebook-ads'].vi}`} replace />} />
        <Route path="/google-ads" element={<Navigate to={`/${SLUG_MAPPING['google-ads'].vi}`} replace />} />
        <Route path="/danh-muc-website" element={<Navigate to={`/${SLUG_MAPPING['danh-muc-website'].vi}`} replace />} />
        <Route path="/khach-hang" element={<Navigate to={`/${SLUG_MAPPING['khach-hang'].vi}`} replace />} />
        <Route path="/bai-viet" element={<Navigate to={`/${SLUG_MAPPING['bai-viet'].vi}`} replace />} />
        <Route path="/lien-he" element={<Navigate to={`/${SLUG_MAPPING['lien-he'].vi}`} replace />} />
        <Route path="/du-an/:id" element={<LegacyDuAnRedirect />} />

        {/* 404 - Not Found */}
        <Route path="*" element={<NotFound />} />
    </Routes>
      <FloatingContact />
    </>
  );
};

export default PublicRoutes;
