import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, User, ArrowRight, Tag } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { getLang, getLocalizedSlug } from '@/utils/localization';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/utils/api';
import { Helmet } from 'react-helmet-async';
import { useDarkMode } from '@/hooks/useDarkMode';

interface Article {
  id: number;
  title: string;
  titleEn?: string;
  slug: string;
  slugEn?: string;
  image: string;
  description: string;
  descriptionEn?: string;
  author: string;
  category: string;
  createdAt: string;
}

interface ArticlePageResponse {
  content: Article[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

const ArticlesPage: React.FC = () => {
  const navigate = useNavigate();
  const lang = getLang();
  const { isDark, toggleTheme } = useDarkMode();
  const [page, setPage] = useState(0);
  
  // SEO Metadata
  const seoTitle = lang === 'en' ? 'Blog & News - Victor Softwave' : 'Tin tức & Bài viết - Victor Softwave';
  const seoDesc = lang === 'en' 
    ? 'Latest updates, technology news, and insights from Victor Softwave.' 
    : 'Cập nhật tin tức công nghệ, hoạt động và kiến thức mới nhất từ Victor Softwave.';

  const { data, isLoading } = useQuery<ArticlePageResponse>({
    queryKey: ['articles', page],
    queryFn: () => api.get<ArticlePageResponse>(`/api/articles?page=${page}&size=9&status=PUBLISHED&sort=createdAt,desc`),
    placeholderData: (prev) => prev
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(lang === 'en' ? 'en-US' : 'vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <>
      <Helmet>
        <title>{seoTitle}</title>
        <meta name="description" content={seoDesc} />
      </Helmet>

      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
        <Navbar isDark={isDark} toggleTheme={toggleTheme} />
        
        <main className="pt-24 pb-20 px-4 md:px-8 max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-12 text-center">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4"
            >
              {lang === 'en' ? 'Blog & News' : 'Tin Tức & Bài Viết'}
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto"
            >
              {seoDesc}
            </motion.p>
          </div>

          {/* Content */}
          {isLoading ? (
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
               {[...Array(6)].map((_, i) => (
                 <div key={i} className="bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-sm animate-pulse h-[400px]">
                   <div className="h-48 bg-slate-200 dark:bg-slate-700" />
                   <div className="p-6 space-y-4">
                     <div className="h-4 bg-slate-200 dark:bg-slate-700 w-3/4 rounded" />
                     <div className="h-4 bg-slate-200 dark:bg-slate-700 w-1/2 rounded" />
                   </div>
                 </div>
               ))}
             </div>
          ) : data?.content && data.content.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {data.content.map((article, index) => {
                  const title = lang === 'en' ? (article.titleEn || article.title) : article.title;
                  const desc = lang === 'en' ? (article.descriptionEn || article.description) : article.description;
                  const slug = lang === 'en' ? (article.slugEn || article.slug) : article.slug;
                  const detailPath = `/${lang}/${getLocalizedSlug('bai-viet', lang)}/${slug}`;

                  return (
                    <motion.article
                      key={article.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="group bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full"
                    >
                      <div className="relative overflow-hidden h-56">
                        <img 
                          src={article.image || 'https://via.placeholder.com/800x400'} 
                          alt={title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute top-4 left-4 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-lg">
                          {article.category}
                        </div>
                      </div>
                      
                      <div className="p-6 flex flex-col flex-grow">
                        <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400 mb-4">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5" />
                            {formatDate(article.createdAt)}
                          </span>
                          <span className="flex items-center gap-1">
                            <User className="w-3.5 h-3.5" />
                            {article.author}
                          </span>
                        </div>

                        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          {title}
                        </h2>
                        
                        <p className="text-slate-600 dark:text-slate-400 text-sm mb-6 line-clamp-3 flex-grow">
                          {desc}
                        </p>

                        <button 
                          onClick={() => navigate(detailPath)}
                          className="flex items-center gap-2 text-sm font-medium text-blue-600 dark:text-blue-400 group-hover:gap-3 transition-all mt-auto"
                        >
                          {lang === 'en' ? 'Read More' : 'Đọc tiếp'}
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    </motion.article>
                  );
                })}
              </div>

              {/* Pagination */}
              {data.totalPages > 1 && (
                <div className="flex justify-center mt-12 gap-2">
                  {[...Array(data.totalPages)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setPage(i)}
                      className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-medium transition-colors ${
                        page === i
                          ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                          : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-20">
              <div className="bg-slate-100 dark:bg-slate-800 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Tag className="w-10 h-10 text-slate-400" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                {lang === 'en' ? 'No articles found' : 'Chưa có bài viết nào'}
              </h3>
              <p className="text-slate-500 dark:text-slate-400">
                {lang === 'en' ? 'Check back later for updates.' : 'Vui lòng quay lại sau.'}
              </p>
            </div>
          )}
        </main>

        <Footer />
      </div>
    </>
  );
};

export default ArticlesPage;
