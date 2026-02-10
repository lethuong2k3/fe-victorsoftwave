import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, Search, ArrowLeft } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { getLang, getLocalizedSlug } from '@/utils/localization';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/utils/api';
import { useDarkMode } from '@/hooks/useDarkMode';
import SEO from '@/components/SEO';

type Client = {
  id: number;
  name: string;
  category: string;
  logo: string;
  link?: string;
  slug?: string;
  featured: boolean;
};

type ClientPageResponse = {
  content: Client[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
};

type ClientsPageContent = {
  pageTitle?: string;
  pageTitleEn?: string;
  pageDescription?: string;
  pageDescriptionEn?: string;
  seoTitle?: string;
  seoTitleEn?: string;
  seoDescription?: string;
  seoDescriptionEn?: string;
  seoKeywords?: string;
  seoKeywordsEn?: string;
};

const ClientsPage: React.FC = () => {
  const { isDark, toggleTheme } = useDarkMode();
  const navigate = useNavigate();
  const lang = getLang();
  
  const [activeCat, setActiveCat] = useState('All');
  const [page, setPage] = useState(0);

  // Fetch Page Content (SEO, Title, Description)
  const { data: pageContent } = useQuery<ClientsPageContent>({
    queryKey: ['clients-page-content'],
    queryFn: () => api.get<ClientsPageContent>('/api/pages/clients'),
  });

  // Fetch Categories
  const { data: categoriesData } = useQuery<string[]>({
    queryKey: ['client-categories'],
    queryFn: () => api.get<string[]>('/api/clients/categories'),
  });

  const categories = ['All', ...(categoriesData || [])];
  
  // Handle Category Selection
  // Note: Since categories are stored as simple strings in backend, we display them directly.
  // Ideally, we might want bilingual categories, but for now we use what's in the DB.
  
  const queryCat = activeCat === 'All' ? '' : activeCat;

  // Fetch Clients
  const { data: clientPage, isLoading: clientsLoading } = useQuery<ClientPageResponse>({
    queryKey: ['clients', page, queryCat],
    queryFn: () => api.get<ClientPageResponse>(`/api/clients?page=${page}&size=12&cat=${encodeURIComponent(queryCat)}`),
    placeholderData: (prev) => prev,
  });

  const clients = clientPage?.content || [];
  const totalPages = clientPage?.totalPages || 0;

  // SEO Data
  const seoTitle = lang === 'en' 
    ? (pageContent?.seoTitleEn || 'Featured Clients | Victor Software')
    : (pageContent?.seoTitle || 'Khách hàng tiêu biểu | Victor Software');
  
  const seoDesc = lang === 'en'
    ? (pageContent?.seoDescriptionEn || 'Our trusted partners and clients.')
    : (pageContent?.seoDescription || 'Danh sách đối tác và khách hàng tin cậy của Victor Software.');
    
  const seoKeywords = lang === 'en'
    ? (pageContent?.seoKeywordsEn || 'clients, partners, portfolio')
    : (pageContent?.seoKeywords || 'khách hàng, đối tác, hồ sơ năng lực');

  const pageTitle = lang === 'en'
    ? (pageContent?.pageTitleEn || 'Featured Clients')
    : (pageContent?.pageTitle || 'Khách hàng tiêu biểu');

  const pageDescription = lang === 'en'
    ? (pageContent?.pageDescriptionEn || 'We are proud to accompany businesses on their digital transformation journey.')
    : (pageContent?.pageDescription || 'Chúng tôi tự hào đồng hành cùng các doanh nghiệp trên hành trình chuyển đổi số.');

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": pageTitle,
    "description": pageDescription,
    "provider": {
      "@type": "Organization",
      "name": "Victor Software",
      "url": "https://www.victorsoftwave.com"
    },
    "mainEntity": {
      "@type": "ItemList",
      "itemListElement": clients.map((client, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "url": `https://www.victorsoftwave.com/${lang}/${getLocalizedSlug('khach-hang', lang)}/${client.slug}`,
        "name": client.name
      }))
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-200">
      <SEO 
        title={seoTitle} 
        description={seoDesc} 
        keywords={seoKeywords}
        type="website"
        structuredData={structuredData}
      />
      <Navbar isDark={isDark} toggleTheme={toggleTheme} />

      <main className="pt-24 pb-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <button
            onClick={() => {
              navigate(`/${lang}`);
            }}
            className="flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 mb-8 transition-colors"
          >
            <ArrowLeft size={20} />
            <span>{lang === 'en' ? 'Back to Home' : 'Quay lại trang chủ'}</span>
          </button>
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent pb-2"
            >
              {pageTitle}
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-lg text-slate-600 dark:text-slate-300"
            >
              {pageDescription}
            </motion.p>
          </div>

          {/* Categories */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {categories.map((cat, index) => (
              <button
                key={index}
                onClick={() => {
                  setActiveCat(cat);
                  setPage(0);
                }}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  activeCat === cat
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {cat === 'All' ? (lang === 'en' ? 'All' : 'Tất cả') : cat}
              </button>
            ))}
          </div>

          {/* Clients Grid */}
          {clientsLoading ? (
             <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-slate-100 dark:bg-slate-800 rounded-2xl aspect-[3/2] animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              <AnimatePresence mode='popLayout'>
                {clients.length > 0 ? (
                  clients.map((client, index) => (
                    <motion.div
                      key={client.id}
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className="group relative bg-white dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden hover:shadow-xl hover:border-blue-500/30 transition-all duration-300 aspect-[3/2]"
                      onClick={() => {
                        if (client.slug) {
                          navigate(`/${lang}/${getLocalizedSlug('khach-hang', lang)}/${client.slug}`);
                        }
                      }}
                    >
                      <img 
                        src={client.logo || 'https://placehold.co/400x200?text=No+Logo'} 
                        alt={client.name}
                        className="w-full h-full object-cover transition-all duration-300 transform group-hover:scale-110"
                      />
                      <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            if (client.slug) {
                              navigate(`/${lang}/${getLocalizedSlug('khach-hang', lang)}/${client.slug}`);
                            }
                          }}
                          className="px-6 py-2 bg-white text-slate-900 rounded-full font-bold flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300"
                        >
                          {lang === 'en' ? 'View Details' : 'Xem chi tiết'} <ExternalLink className="w-4 h-4" />
                        </button>
                      </div>
                      
                      <div className="absolute bottom-3 left-0 right-0 text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                         <span className="text-xs text-slate-400 dark:text-slate-500 font-medium bg-white/90 dark:bg-slate-900/90 px-2 py-1 rounded-full">
                           {client.category}
                         </span>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="col-span-full text-center py-20">
                    <div className="inline-flex justify-center items-center w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 mb-4">
                      <Search className="w-8 h-8 text-slate-400" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                      {lang === 'en' ? 'No clients found' : 'Không tìm thấy khách hàng'}
                    </h3>
                    <p className="text-slate-500 dark:text-slate-400">
                      {lang === 'en' ? 'Try adjusting your category filter.' : 'Thử thay đổi bộ lọc danh mục.'}
                    </p>
                  </div>
                )}
              </AnimatePresence>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-16 gap-2">
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setPage(i);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-medium transition-all ${
                    page === i
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                      : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:border-blue-500 hover:text-blue-500'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ClientsPage;
