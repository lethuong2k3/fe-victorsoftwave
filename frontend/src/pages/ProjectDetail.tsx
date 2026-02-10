import React, { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/utils/api';
import { SLUG_MAPPING, getLocalizedSlug } from '@/utils/localization';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ExternalLink, Calendar, User, Code, CheckCircle2 } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import NotFound from '@/pages/NotFound';
import SEO from '@/components/SEO';
import { useDarkMode } from '@/hooks/useDarkMode';

type Project = {
  id: number;
  title: string;
  titleEn?: string | null;
  cat: string;
  img: string;
  description: string;
  descriptionEn?: string | null;
  features: string[];
  technologies: string[];
  gallery: string[];
  demoLink?: string | null;
  client?: string | null;
  completionDate?: string | null;
  seoTitle?: string | null;
  seoTitleEn?: string | null;
  seoDescription?: string | null;
  seoDescriptionEn?: string | null;
  seoKeywords?: string | null;
  seoKeywordsEn?: string | null;
  slug?: string | null;
  slugEn?: string | null;
};

const ProjectDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const getCurrentLang = (): 'vi' | 'en' => {
    const seg = (location.pathname.split('/')[1] || '').toLowerCase();
    if (seg === 'vi' || seg === 'en') return seg as 'vi' | 'en';
    const stored = (localStorage.getItem('lang') || localStorage.getItem('language') || '').toLowerCase();
    if (stored === 'en' || stored === 'vi') return stored as 'vi' | 'en';
    return (navigator.language || '').toLowerCase().startsWith('en') ? 'en' : 'vi';
  };
  const { isDark, toggleTheme } = useDarkMode();
  const { data: project, isLoading, error: queryError } = useQuery({
    queryKey: ['project', slug],
    queryFn: async () => {
      if (!slug) return null;
      try {
        return await api.get<Project>(`/api/projects/${slug}`);
      } catch (err: any) {
        if (err.message && err.message.includes('404')) {
          return null;
        }
        throw err;
      }
    },
    enabled: !!slug,
    retry: false,
  });

  const error = queryError instanceof Error ? queryError.message : queryError ? 'Không thể tải dữ liệu' : null;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  useEffect(() => {
    if (project) {
      const lang = getCurrentLang();
      
      // Redirect to slug URL if currently using ID
      if (slug && /^\d+$/.test(slug)) {
        const correctSlug = lang === 'en' ? project.slugEn : project.slug;
        if (correctSlug) {
          navigate(`/${lang}/${getLocalizedSlug('danh-muc-website', lang)}/${correctSlug}`, { replace: true });
        }
      }
    }
  }, [project, location.pathname]);


  if (isLoading) {
    return (
      <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-200 selection:bg-blue-500/30">
        <Navbar isDark={isDark} toggleTheme={toggleTheme} />
        <main className="pt-24 pb-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
            <div className="w-32 h-6 bg-slate-200 dark:bg-slate-800 rounded mb-8 animate-pulse" />

            <div className="grid lg:grid-cols-2 gap-12 mb-16">
              <div>
                <div className="w-24 h-8 bg-slate-200 dark:bg-slate-800 rounded-full mb-4 animate-pulse" />
                <div className="w-3/4 h-12 bg-slate-200 dark:bg-slate-800 rounded mb-6 animate-pulse" />
                <div className="space-y-3 mb-8">
                  <div className="w-full h-4 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
                  <div className="w-full h-4 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
                  <div className="w-2/3 h-4 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
                </div>

                <div className="grid grid-cols-2 gap-6 border-t border-slate-200 dark:border-slate-800 pt-8">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className={i === 3 ? "col-span-2" : ""}>
                      <div className="w-24 h-5 bg-slate-200 dark:bg-slate-800 rounded mb-2 animate-pulse" />
                      <div className="w-32 h-4 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
                    </div>
                  ))}
                </div>
                
                <div className="mt-8 w-48 h-12 bg-slate-200 dark:bg-slate-800 rounded-full animate-pulse" />
              </div>

              <div>
                <div className="aspect-video rounded-2xl bg-slate-200 dark:bg-slate-800 animate-pulse shadow-2xl" />
              </div>
            </div>
            
            <div className="mb-20">
                <div className="w-48 h-8 bg-slate-200 dark:bg-slate-800 rounded mb-8 animate-pulse" />
                <div className="grid sm:grid-cols-2 gap-4">
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className="h-16 bg-slate-200 dark:bg-slate-800 rounded-xl animate-pulse" />
                    ))}
                </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!isLoading && error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-slate-950 text-slate-900 dark:text-white">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4">Không thể tải dự án</h2>
          <p className="text-slate-600 dark:text-slate-400 mb-6">{error}</p>
          <button
            onClick={() => navigate(`/${getCurrentLang()}/${getLocalizedSlug('danh-muc-website', getCurrentLang())}`)}
            className="text-blue-600 hover:underline"
          >
            Quay lại danh sách
          </button>
        </div>
      </div>
    );
  }

  if (!project) {
    return <NotFound />;
  }

  const currentLang = getCurrentLang();
  const displayTitle =
    currentLang === 'en' && project.titleEn ? project.titleEn : project.title;
  const displayDescription =
    currentLang === 'en' && project.descriptionEn ? project.descriptionEn : project.description;

  const seoTitle = currentLang === 'en' && project.seoTitleEn ? project.seoTitleEn : project.seoTitle;
  const seoDesc = currentLang === 'en' && project.seoDescriptionEn ? project.seoDescriptionEn : project.seoDescription;
  const seoKw = currentLang === 'en' && project.seoKeywordsEn ? project.seoKeywordsEn : project.seoKeywords;

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    "name": displayTitle,
    "description": displayDescription,
    "image": project.img,
    "creator": {
      "@type": "Organization",
      "name": "Victor Software",
      "url": "https://www.victorsoftwave.com"
    },
    "dateCreated": project.completionDate,
    "keywords": project.technologies?.join(", "),
    "url": `https://www.victorsoftwave.com/${currentLang}/${getLocalizedSlug('danh-muc-website', currentLang)}/${currentLang === 'en' && project.slugEn ? project.slugEn : project.slug}`,
    ...(project.demoLink && { "sameAs": project.demoLink })
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-200 selection:bg-blue-500/30">
      <SEO 
        title={seoTitle || displayTitle || 'Victor Software'}
        description={seoDesc || displayDescription || ''}
        keywords={seoKw || ''}
        image={project.img}
        type="article"
        structuredData={structuredData}
      />
      <Navbar isDark={isDark} toggleTheme={toggleTheme} />

      <main className="pt-24 pb-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <button
            onClick={() => navigate(`/${getCurrentLang()}/${getLocalizedSlug('danh-muc-website', getCurrentLang())}`)}
            className="flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 mb-8 transition-colors group"
          >
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            <span>Quay lại danh mục</span>
          </button>

          <div className="grid lg:grid-cols-2 gap-12 mb-16">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <span className="inline-block px-4 py-1.5 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-medium text-sm mb-4">
                {project.cat}
              </span>
              <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white mb-6 leading-tight">
                {displayTitle}
              </h1>
              <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed mb-8">
                {displayDescription}
              </p>

              <div className="grid grid-cols-2 gap-6 border-t border-slate-200 dark:border-slate-800 pt-8">
                <div>
                    <h4 className="flex items-center gap-2 text-slate-900 dark:text-white font-semibold mb-2">
                        <User size={18} className="text-blue-600" /> Khách hàng
                    </h4>
                    <p className="text-slate-600 dark:text-slate-400">{project.client || 'Đang cập nhật'}</p>
                </div>
                <div>
                    <h4 className="flex items-center gap-2 text-slate-900 dark:text-white font-semibold mb-2">
                        <Calendar size={18} className="text-blue-600" /> Hoàn thành
                    </h4>
                    <p className="text-slate-600 dark:text-slate-400">{project.completionDate || 'Đang cập nhật'}</p>
                </div>
                <div className="col-span-2">
                    <h4 className="flex items-center gap-2 text-slate-900 dark:text-white font-semibold mb-2">
                        <Code size={18} className="text-blue-600" /> Công nghệ
                    </h4>
                    <div className="flex flex-wrap gap-2">
                        {project.technologies?.map((tech, index) => (
                            <span key={index} className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded text-sm">
                                {tech}
                            </span>
                        ))}
                    </div>
                </div>
              </div>

              {project.demoLink && (
                  <div className="mt-8">
                      <a 
                        href={project.demoLink} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-full transition-all shadow-lg shadow-blue-500/30 hover:shadow-blue-500/40"
                      >
                          Xem Demo Trực Tiếp <ExternalLink size={18} />
                      </a>
                  </div>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="relative"
            >
                <div className="rounded-2xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900">
                    <img 
                        src={project.img} 
                        alt={displayTitle} 
                        className="w-full h-auto object-cover"
                    />
                </div>
                <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-blue-500/10 dark:bg-blue-500/5 blur-3xl rounded-full pointer-events-none"></div>
            </motion.div>
          </div>

          <div className="mb-20">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-8 border-l-4 border-blue-600 pl-4">
                Tính năng nổi bật
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
                {project.features?.map((feature, index) => (
                    <motion.div 
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-start gap-3 p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800"
                    >
                        <CheckCircle2 className="text-green-500 mt-0.5 flex-shrink-0" size={20} />
                        <span className="text-slate-700 dark:text-slate-300">{feature}</span>
                    </motion.div>
                ))}
            </div>
          </div>

          {project.gallery && project.gallery.length > 0 && (
            <div className="mb-20">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-8 border-l-4 border-blue-600 pl-4">
                    Hình ảnh dự án
                </h2>
                <div className="grid md:grid-cols-2 gap-6">
                    {project.gallery.map((img, index) => (
                        <motion.div 
                            key={index}
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="rounded-xl overflow-hidden shadow-lg border border-slate-200 dark:border-slate-800"
                        >
                            <img src={img} alt={`${project.title} - ${index + 1}`} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                        </motion.div>
                    ))}
                </div>
            </div>
          )}
          
          <div className="text-center py-16 bg-slate-50 dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
                Bạn thích dự án này?
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mb-8 max-w-xl mx-auto">
                Hãy để lại thông tin, chúng tôi sẽ tư vấn giải pháp tương tự cho doanh nghiệp của bạn.
            </p>
            <button 
                onClick={() => navigate(`/${getCurrentLang()}`)}
                className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-full transition-all shadow-lg hover:shadow-blue-500/25"
            >
                Liên hệ tư vấn ngay
            </button>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ProjectDetail;
