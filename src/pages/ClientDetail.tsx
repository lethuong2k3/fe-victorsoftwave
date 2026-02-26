import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { getLang, SLUG_MAPPING } from '@/utils/localization';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/utils/api';
import { ArrowLeft, ExternalLink, CheckCircle2, Globe } from 'lucide-react';
import { motion } from 'framer-motion';

type Client = {
  id: number;
  name: string;
  category?: string;
  logo?: string;
  link?: string;
  slug?: string;
  description?: string;
  features?: string; // JSON string
  images?: string;   // JSON string
};

const useDarkMode = () => {
  const [isDark, setIsDark] = React.useState(false);
  useEffect(() => {
    if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      setIsDark(true);
      document.documentElement.classList.add('dark');
    } else {
      setIsDark(false);
      document.documentElement.classList.remove('dark');
    }
  }, []);
  const toggleTheme = () => {
    if (isDark) {
      document.documentElement.classList.remove('dark');
      localStorage.theme = 'light';
      setIsDark(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.theme = 'dark';
      setIsDark(true);
    }
  };
  return { isDark, toggleTheme };
};

import NotFound from './NotFound';
import SEO from '@/components/SEO';

const ClientDetail: React.FC = () => {
  const { isDark, toggleTheme } = useDarkMode();
  const navigate = useNavigate();
  const { slug } = useParams(); 
  const lang = getLang();

  const { data: client, isLoading } = useQuery({
    queryKey: ['client-detail', slug],
    queryFn: async () => {
      try {
        return await api.get<Client>(`/api/clients/${slug}`);
      } catch (error: any) {
        if (error.message.includes('404')) return null;
        throw error;
      }
    },
    enabled: !!slug,
    retry: false,
  });

  useEffect(() => {
    if (client?.name) document.title = `${client.name} | Victor Software`;
  }, [client?.name]);

  // Parse JSON fields safely
  const features: string[] = React.useMemo(() => {
    try {
      return client?.features ? JSON.parse(client.features) : [];
    } catch {
      return [];
    }
  }, [client?.features]);

  const images: string[] = React.useMemo(() => {
    try {
      return client?.images ? JSON.parse(client.images) : [];
    } catch {
      return [];
    }
  }, [client?.images]);

  if (!isLoading && !client) {
    return <NotFound />;
  }

  const structuredData = client ? {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": client.name,
    "description": client.description,
    "image": client.logo,
    "url": client.link || window.location.href,
    "sameAs": client.link ? [client.link] : []
  } : undefined;

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 transition-colors duration-300">
      {client && (
        <SEO
          title={`${client.name} | Victor Software`}
          description={client.description}
          image={client.logo}
          type="article"
          structuredData={structuredData}
        />
      )}
      <Navbar isDark={isDark} toggleTheme={toggleTheme} />
      <main className="pt-24 pb-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <button
            onClick={() => {
              navigate(`/${SLUG_MAPPING['khach-hang'][lang]}`);
            }}
            className="cursor-pointer flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 mb-8 transition-colors group"
          >
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            <span>{lang === 'en' ? 'Back to Clients' : 'Quay lại Khách hàng'}</span>
          </button>

          {isLoading ? (
            <div className="animate-pulse space-y-8">
              <div className="h-12 w-1/3 bg-slate-200 dark:bg-slate-800 rounded-lg" />
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                <div className="lg:col-span-2 space-y-4">
                  <div className="h-4 w-full bg-slate-200 dark:bg-slate-800 rounded" />
                  <div className="h-4 w-full bg-slate-200 dark:bg-slate-800 rounded" />
                  <div className="h-4 w-2/3 bg-slate-200 dark:bg-slate-800 rounded" />
                </div>
                <div className="h-64 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
              </div>
            </div>
          ) : client ? (
            <div className="space-y-16">
              {/* Header Section */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
                <div className="lg:col-span-2 space-y-6">
                  <div>
                    <span className="inline-block px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-sm font-medium mb-4">
                      {client.category || 'Portfolio'}
                    </span>
                    <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white leading-tight">
                      {client.name}
                    </h1>
                  </div>
                  
                  <div className="prose dark:prose-invert max-w-none text-slate-600 dark:text-slate-300 text-lg leading-relaxed whitespace-pre-line">
                    {client.description || (lang === 'en' ? 'No description available.' : 'Đang cập nhật mô tả.')}
                  </div>

                  {features.length > 0 && (
                    <div className="pt-6">
                      <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
                        {lang === 'en' ? 'Key Highlights' : 'Điểm nổi bật'}
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {features.map((feature, idx) => (
                          <div key={idx} className="flex items-start gap-3 p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800">
                            <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                            <span className="text-slate-700 dark:text-slate-300">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Sidebar Info */}
                <div className="lg:col-span-1 space-y-6">
                  <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm sticky top-24 overflow-hidden">
                    <div className="aspect-video bg-slate-50 dark:bg-slate-950 border-b border-slate-100 dark:border-slate-800">
                      <img
                        src={client.logo || 'https://placehold.co/400x200?text=Logo'}
                        alt={client.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    {client.link && (
                      <div className="p-6">
                        <a
                          href={client.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors"
                        >
                          <Globe className="w-4 h-4" />
                          {lang === 'en' ? 'Visit Website' : 'Ghé thăm Website'}
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Gallery Section */}
              {images.length > 0 && (
                <div className="pt-8 border-t border-slate-200 dark:border-slate-800">
                  <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-8">
                    {lang === 'en' ? 'Project Gallery' : 'Hình ảnh dự án'}
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {images.map((img, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: idx * 0.1 }}
                        className="group relative aspect-video rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
                      >
                        <img
                          src={img}
                          alt={`${client.name} - ${idx + 1}`}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : null}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ClientDetail;
