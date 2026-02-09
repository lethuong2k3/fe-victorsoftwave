import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { getLang, getLocalizedSlug } from '@/utils/localization';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/utils/api';
import { useDarkMode } from '@/hooks/useDarkMode';

const categories = ["Tất cả", "Doanh nghiệp", "Bán hàng", "Landing Page", "Nội thất", "Giáo dục", "Thời trang"];

type Project = {
  id: number;
  title: string;
  titleEn?: string | null;
  cat: string;
  img: string;
  slug?: string;
  slugEn?: string;
};

type ProjectPageResponse = {
  content: Project[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
};

type ProjectsPageContent = {
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

  const PortfolioPage: React.FC = () => {
  const { isDark, toggleTheme } = useDarkMode();
  const navigate = useNavigate();
  const lang = getLang();
  
  const categoriesVi = ["Tất cả", "Doanh nghiệp", "Bán hàng", "Landing Page", "Nội thất", "Giáo dục", "Thời trang"];
  const categoriesEn = ["All", "Business", "E-commerce", "Landing Page", "Interior", "Education", "Fashion"];
  const categories = lang === 'en' ? categoriesEn : categoriesVi;
  
  const [activeCat, setActiveCat] = useState(categories[0]);
  const [page, setPage] = useState(0);

  useEffect(() => {
    setPage(0);
  }, [activeCat]);

  const getFilterCategory = (displayCat: string) => {
    if (lang !== 'en') return displayCat;
    const index = categoriesEn.indexOf(displayCat);
    if (index !== -1) return categoriesVi[index];
    return displayCat;
  };

  const queryCat = getFilterCategory(activeCat);

  const { data: projectPage, isLoading: projectsLoading, error } = useQuery<ProjectPageResponse>({
    queryKey: ['projects', page, queryCat],
    queryFn: () => api.get<ProjectPageResponse>(`/api/projects?page=${page}&size=9&category=${encodeURIComponent(queryCat)}`),
    placeholderData: (prev) => prev,
  });

  const projects: Project[] = projectPage?.content || [];

  const { data: pageContent, isLoading: contentLoading } = useQuery({
    queryKey: ['projects-page-content', lang],
    queryFn: () => api.get<ProjectsPageContent>('/api/pages/projects', {
      headers: { 'Accept-Language': lang }
    }),
  });

  const isLoading = projectsLoading || contentLoading;

  useEffect(() => {
    // Reset active category when language changes
    setActiveCat(lang === 'en' ? 'All' : 'Tất cả');
  }, [lang]);

  // Update SEO
  useEffect(() => {
    if (!pageContent) return;
    const title = lang === 'en' ? (pageContent.seoTitleEn || pageContent.pageTitleEn) : (pageContent.seoTitle || pageContent.pageTitle);
    const desc = lang === 'en' ? (pageContent.seoDescriptionEn || pageContent.pageDescriptionEn) : (pageContent.seoDescription || pageContent.pageDescription);
    const keywords = lang === 'en' ? pageContent.seoKeywordsEn : pageContent.seoKeywords;

    if (title) document.title = title;
    
    // Helper to update meta tag
    const updateMeta = (name: string, content: string) => {
        let tag = document.querySelector(`meta[name="${name}"]`);
        if (!tag) {
            tag = document.createElement('meta');
            tag.setAttribute('name', name);
            document.head.appendChild(tag);
        }
        tag.setAttribute('content', content);
    };

    if (desc) updateMeta('description', desc);
    if (keywords) updateMeta('keywords', keywords);

  }, [pageContent, lang]);

  const displayTitle = (lang === 'en' ? pageContent?.pageTitleEn : pageContent?.pageTitle) || (lang === 'en' ? 'Website Portfolio' : 'Danh Mục Website');
  const displayDesc = (lang === 'en' ? pageContent?.pageDescriptionEn : pageContent?.pageDescription) || (lang === 'en' ? 'Explore our diverse, professional website templates suitable for all your business fields.' : 'Khám phá kho giao diện website đa dạng, chuyên nghiệp và phù hợp với mọi lĩnh vực kinh doanh của bạn.');

  const filteredProjects = projects;

  const totalPages = projectPage?.totalPages ?? 0;

  if (isLoading) {
    return (
      <div className="min-h-screen relative overflow-x-hidden bg-white dark:bg-slate-950">
        <Navbar isDark={isDark} toggleTheme={toggleTheme} />
        <main className="pt-24 pb-20">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
                 {/* Loading Skeleton */}
                 <div className="mb-8 h-6 w-40 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
                 <div className="text-center mb-16">
                    <div className="h-12 w-3/4 mx-auto bg-slate-200 dark:bg-slate-800 rounded mb-6 animate-pulse" />
                    <div className="h-6 w-1/2 mx-auto bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
                 </div>
                 <div className="flex justify-center gap-3 mb-12">
                    {[1, 2, 3, 4, 5].map(i => (
                        <div key={i} className="h-9 w-24 bg-slate-200 dark:bg-slate-800 rounded-full animate-pulse" />
                    ))}
                 </div>
                 <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[...Array(6)].map((_, index) => (
                      <div key={index} className="rounded-2xl overflow-hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                        <div className="aspect-[4/3] bg-slate-200 dark:bg-slate-800 animate-pulse" />
                        <div className="p-6">
                          <div className="h-4 w-24 bg-slate-200 dark:bg-slate-800 rounded mb-4 animate-pulse" />
                          <div className="h-6 w-3/4 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
                        </div>
                      </div>
                    ))}
                  </div>
            </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-x-hidden selection:bg-accent/30 bg-white dark:bg-slate-950">
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

            <div className="text-center mb-16">
                <motion.h1 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent pb-2"
                >
                    {displayTitle}
                </motion.h1>
                <motion.p 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto"
                >
                    {displayDesc}
                </motion.p>
            </div>

            <div className="flex flex-wrap justify-center gap-3 mb-12">
            {categories.map((cat) => (
                <button
                key={cat}
                onClick={() => setActiveCat(cat)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                    activeCat === cat
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
                >
                {cat}
                </button>
            ))}
            </div>

            <>
                {error && (
                  <div className="text-center text-red-600 dark:text-red-400 py-12">
                    {lang === 'en' ? `Could not load projects: ${error}` : `Không thể tải dự án: ${error}`}
                  </div>
                )}
                {!error && filteredProjects.length === 0 && (
                  <div className="text-center text-slate-600 dark:text-slate-400 py-12">
                    {lang === 'en' ? 'No projects found in this category.' : 'Không có dự án phù hợp danh mục này.'}
                  </div>
                )}

                <motion.div 
                    className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8"
                >
                <AnimatePresence mode='popLayout'>
                    {filteredProjects.map((project) => (
                    <motion.div
                        key={project.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="group relative rounded-2xl overflow-hidden cursor-pointer bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl dark:shadow-none hover:-translate-y-1 transition-all duration-300"
                        onClick={() => {
                          const projectSlug = (lang === 'en' ? project.slugEn : project.slug);
                          if (projectSlug) {
                            navigate(`/${lang}/${getLocalizedSlug('danh-muc-website', lang)}/${projectSlug}`);
                          }
                        }}
                    >
                        <div className="aspect-[4/3] overflow-hidden relative">
                            <img 
                                src={project.img} 
                                alt={(lang === 'en' && project.titleEn) ? project.titleEn : project.title} 
                                className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                <button 
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        const projectSlug = (lang === 'en' ? project.slugEn : project.slug);
                                        if (projectSlug) {
                                          navigate(`/${lang}/${getLocalizedSlug('danh-muc-website', lang)}/${projectSlug}`);
                                        }
                                    }}
                                    className="px-6 py-2 bg-white text-slate-900 rounded-full font-bold flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300"
                                >
                                    {lang === 'en' ? 'View Details' : 'Xem chi tiết'} <ExternalLink size={16} />
                                </button>
                            </div>
                        </div>
                        <div className="p-6">
                            <span className="text-blue-600 dark:text-blue-400 text-sm font-semibold mb-2 block">{project.cat}</span>
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                              {(lang === 'en' && project.titleEn) ? project.titleEn : project.title}
                            </h3>
                        </div>
                    </motion.div>
                    ))}
                </AnimatePresence>
                </motion.div>

                {totalPages > 1 && (
                  <div className="mt-10 flex justify-center gap-2">
                    <button
                      disabled={page === 0}
                      onClick={() => setPage((p) => Math.max(p - 1, 0))}
                      className={`px-3 py-1 rounded-md text-sm border ${
                        page === 0
                          ? 'border-slate-200 text-slate-400 cursor-not-allowed'
                          : 'border-slate-300 text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800'
                      }`}
                    >
                      {lang === 'en' ? 'Prev' : 'Trước'}
                    </button>
                    {Array.from({ length: totalPages }).map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setPage(i)}
                        className={`px-3 py-1 rounded-md text-sm border ${
                          i === page
                            ? 'bg-blue-600 text-white border-blue-600'
                            : 'border-slate-300 text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800'
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}
                    <button
                      disabled={page >= totalPages - 1}
                      onClick={() => setPage((p) => Math.min(p + 1, totalPages - 1))}
                      className={`px-3 py-1 rounded-md text-sm border ${
                        page >= totalPages - 1
                          ? 'border-slate-200 text-slate-400 cursor-not-allowed'
                          : 'border-slate-300 text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800'
                      }`}
                    >
                      {lang === 'en' ? 'Next' : 'Sau'}
                    </button>
                  </div>
                )}
            </>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PortfolioPage;
