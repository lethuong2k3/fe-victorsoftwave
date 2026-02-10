import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, User, ArrowLeft, Share2, Tag, Instagram } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Toast, ToastMessage } from '@/components/Toast';
import { getLang, getLocalizedSlug } from '@/utils/localization';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/utils/api';
import SEO from '@/components/SEO';
import DOMPurify from 'dompurify';
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
  content: string;
  contentEn?: string;
  author: string;
  category: string;
  createdAt: string;
  seoTitle?: string;
  seoTitleEn?: string;
  seoDescription?: string;
  seoDescriptionEn?: string;
  seoKeywords?: string;
  seoKeywordsEn?: string;
}

const ArticleDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const lang = getLang();
  const { isDark, toggleTheme } = useDarkMode();
  const [toast, setToast] = useState<ToastMessage | null>(null);

  const { data: article, isLoading, error } = useQuery({
    queryKey: ['article', slug],
    queryFn: () => api.get<Article>(`/api/articles/slug/${slug}`),
    enabled: !!slug,
    retry: false
  });

  useEffect(() => {
    if (error) {
      navigate('/404');
    }
  }, [error, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!article) return null;

  const title = lang === 'en' ? (article.titleEn || article.title) : article.title;
  const description = lang === 'en' ? (article.descriptionEn || article.description) : article.description;
  const content = lang === 'en' ? (article.contentEn || article.content) : article.content;
  const seoTitle = lang === 'en' ? (article.seoTitleEn || title) : (article.seoTitle || title);
  const seoDesc = lang === 'en' ? (article.seoDescriptionEn || description) : (article.seoDescription || description);
  const seoKeywords = lang === 'en' ? article.seoKeywordsEn : article.seoKeywords;

  const fullImageUrl = article.image 
    ? (article.image.startsWith('http') ? article.image : `https://www.victorsoftwave.com${article.image.startsWith('/') ? '' : '/'}${article.image}`)
    : '';

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": title,
    "image": fullImageUrl ? [fullImageUrl] : [],
    "datePublished": article.createdAt,
    "author": {
      "@type": "Person",
      "name": article.author || "Victor Software"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Victor Software",
      "logo": {
        "@type": "ImageObject",
        "url": "https://www.victorsoftwave.com/logo.png"
      }
    },
    "description": description,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://www.victorsoftwave.com/${lang}/${getLocalizedSlug('tin-tuc', lang)}/${slug}`
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(lang === 'en' ? 'en-US' : 'vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const backLink = `/${lang}/${getLocalizedSlug('bai-viet', lang)}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setToast({
      type: 'success',
      text: lang === 'en' ? 'Link copied! Paste it to Instagram to share.' : 'Đã sao chép liên kết! Hãy dán vào Instagram để chia sẻ.'
    });
  };

  return (
    <>
      <Toast message={toast} onClose={() => setToast(null)} />
      <SEO 
        title={seoTitle}
        description={seoDesc}
        keywords={seoKeywords}
        image={fullImageUrl}
        url={window.location.href}
        type="article"
        structuredData={structuredData}
      />

      <div className="min-h-screen bg-white dark:bg-slate-900 transition-colors duration-300">
        <Navbar isDark={isDark} toggleTheme={toggleTheme} />

        <main className="pt-28 pb-20 px-4 md:px-8 max-w-5xl mx-auto">
          {/* Breadcrumb & Back */}
          <div className="mb-8 flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
            <button 
              onClick={() => navigate(backLink)}
              className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-1"
            >
              <ArrowLeft className="w-4 h-4" />
              {lang === 'en' ? 'Blog' : 'Tin tức'}
            </button>
            <span>/</span>
            <span className="text-blue-600 dark:text-blue-400 font-medium">{article.category}</span>
          </div>

          {/* Article Header */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-white leading-tight mb-6">
              {title}
            </h1>
            
            <div className="flex flex-wrap items-center justify-between gap-6 border-b border-slate-100 dark:border-slate-800 pb-8">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                  <User className="w-6 h-6 text-slate-500" />
                </div>
                <div>
                  <div className="font-medium text-slate-900 dark:text-white">{article.author}</div>
                  <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                    <Calendar className="w-3 h-3" />
                    {formatDate(article.createdAt)}
                  </div>
                </div>
              </div>

              {/* Top Share Buttons */}
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-slate-500 dark:text-slate-400 hidden sm:block">
                  {lang === 'en' ? 'Share:' : 'Chia sẻ:'}
                </span>
                <div className="flex gap-2">
                  <a 
                    href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 flex items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-[#1877F2] hover:text-white dark:hover:bg-[#1877F2] dark:hover:text-white transition-all"
                    title="Facebook"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                    </svg>
                  </a>
                  <a 
                    href={`https://zalo.me/share?url=${encodeURIComponent(window.location.href)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 flex items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-[#0068FF] hover:text-white dark:hover:bg-[#0068FF] dark:hover:text-white transition-all"
                    title="Zalo"
                  >
                    <span className="font-bold text-lg leading-none font-sans">Z</span>
                  </a>
                  <a 
                    href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(title)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 flex items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all"
                    title="X (Twitter)"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                  </a>
                  <button 
                    onClick={handleCopyLink}
                    className="w-9 h-9 flex items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-[#E1306C] hover:text-white dark:hover:bg-[#E1306C] dark:hover:text-white transition-all"
                    title="Instagram (Copy Link)"
                  >
                    <Instagram className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Featured Image */}
          <div className="mb-12 rounded-2xl overflow-hidden shadow-lg">
            <img 
              src={article.image || 'https://via.placeholder.com/1200x600'} 
              alt={title}
              className="w-full h-auto object-cover max-h-[600px]"
            />
          </div>

          {/* Content */}
          <div className="max-w-none">
            <div 
              className="prose prose-lg dark:prose-invert max-w-none prose-img:rounded-2xl prose-headings:font-bold prose-a:text-blue-600 hover:prose-a:text-blue-700 prose-p:leading-relaxed prose-headings:text-slate-900 dark:prose-headings:text-white"
              dangerouslySetInnerHTML={{ 
                __html: DOMPurify.sanitize(content || '') 
              }} 
            />
          </div>

          {/* Bottom Tags & Share */}
          <div className="mt-16 pt-8 border-t border-slate-200 dark:border-slate-800">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Tags:</span>
                <span className="inline-block px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-full text-sm font-medium">
                  {article.category}
                </span>
              </div>
              
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
                  {lang === 'en' ? 'Share this article:' : 'Chia sẻ bài viết:'}
                </span>
                <div className="flex gap-3">
                  <a 
                    href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 flex items-center justify-center rounded-full bg-[#1877F2] text-white hover:opacity-90 transition-opacity"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                    </svg>
                  </a>
                  <a 
                    href={`https://zalo.me/share?url=${encodeURIComponent(window.location.href)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 flex items-center justify-center rounded-full bg-[#0068FF] text-white hover:opacity-90 transition-opacity"
                  >
                    <span className="font-bold text-xl leading-none font-sans">Z</span>
                  </a>
                  <a 
                    href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(title)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 flex items-center justify-center rounded-full bg-black text-white hover:opacity-90 transition-opacity"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                  </a>
                  <button 
                    onClick={handleCopyLink}
                    className="w-10 h-10 flex items-center justify-center rounded-full bg-[#E1306C] text-white hover:opacity-90 transition-opacity"
                    title="Instagram (Copy Link)"
                  >
                    <Instagram className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default ArticleDetailPage;
