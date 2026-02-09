import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Home as HomeIcon, Search as SearchIcon } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { getLang, Lang } from '@/utils/localization';
import { useDarkMode } from '@/hooks/useDarkMode';

const NotFound: React.FC = () => {
  const { isDark, toggleTheme } = useDarkMode();
  const navigate = useNavigate();
  const [lang, setLang] = useState<Lang>(getLang());

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const title = lang === 'en' ? 'Page not found' : 'Không tìm thấy trang';
  const description =
    lang === 'en'
      ? 'The page you are looking for may have been moved, deleted, or the URL is incorrect.'
      : 'Trang bạn đang tìm có thể đã bị di chuyển, xóa hoặc URL không chính xác.';
  const backHomeLabel = lang === 'en' ? 'Back to homepage' : 'Về trang chủ';
  const backPrevLabel = lang === 'en' ? 'Go back' : 'Quay lại';

  const homePath = `/${lang}`;

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col">
      <Navbar isDark={isDark} toggleTheme={toggleTheme} />
      <main className="flex-1 flex items-center justify-center pt-24 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
          <div className="flex items-center justify-between mb-8">
            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{backPrevLabel}</span>
            </button>
          </div>

          <div className="grid md:grid-cols-[1.2fr,1fr] gap-10 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-50 dark:bg-red-900/30 border border-red-100 dark:border-red-800 text-red-600 dark:text-red-300 text-xs font-semibold">
                <SearchIcon className="w-3.5 h-3.5" />
                <span>404</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">{title}</h1>
              <p className="text-slate-600 dark:text-slate-400 text-sm md:text-base leading-relaxed">
                {description}
              </p>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  onClick={() => navigate(homePath)}
                  className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-blue-600 text-white text-sm font-semibold shadow-md hover:bg-blue-500 transition-colors"
                >
                  <HomeIcon className="w-4 h-4" />
                  <span>{backHomeLabel}</span>
                </button>
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="relative"
            >
              <div className="relative rounded-3xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 p-6 shadow-xl overflow-hidden">
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-500/10 dark:bg-blue-500/20 rounded-full blur-3xl" />
                <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-slate-400/10 rounded-full blur-3xl" />

                <div className="relative space-y-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-red-400" />
                      <div className="w-2 h-2 rounded-full bg-amber-400" />
                      <div className="w-2 h-2 rounded-full bg-emerald-400" />
                    </div>
                    <span className="text-[10px] text-slate-400">victorsoftwave.com</span>
                  </div>
                  <div className="space-y-2">
                    <div className="h-4 w-5/6 rounded-full bg-slate-200 dark:bg-slate-800" />
                    <div className="h-3 w-11/12 rounded-full bg-slate-100 dark:bg-slate-800/80" />
                    <div className="h-3 w-2/3 rounded-full bg-slate-100 dark:bg-slate-800/80" />
                  </div>
                  <div className="mt-4 grid grid-cols-3 gap-2">
                    <div className="h-16 rounded-xl bg-slate-100 dark:bg-slate-800" />
                    <div className="h-16 rounded-xl bg-slate-100 dark:bg-slate-800" />
                    <div className="h-16 rounded-xl bg-slate-100 dark:bg-slate-800" />
                  </div>
                  <div className="mt-4 flex items-center justify-between text-[11px] text-slate-400">
                    <span>{lang === 'en' ? 'Try checking the URL again.' : 'Hãy kiểm tra lại địa chỉ đường dẫn.'}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default NotFound;

