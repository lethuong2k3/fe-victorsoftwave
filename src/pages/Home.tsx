import React, { useState, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Services from '../components/Services';
import Marketing from '../components/Marketing';
import Portfolio from '../components/Portfolio';
import Blog from '../components/Blog';
import Contact from '../components/Contact';
import Footer from '../components/Footer';
import { fetcher } from '../utils/api';
import { getLang as getStoredLang } from '../utils/localization';

const HeroSkeleton = () => (
  <section className="relative overflow-hidden">
    <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16 lg:py-24">
      <div className="h-6 w-40 bg-slate-200 dark:bg-slate-800 rounded mb-4 animate-pulse" />
      <div className="h-12 w-3/4 bg-slate-200 dark:bg-slate-800 rounded mb-3 animate-pulse" />
      <div className="h-12 w-2/3 bg-slate-200 dark:bg-slate-800 rounded mb-6 animate-pulse" />
      <div className="h-20 w-full bg-slate-200 dark:bg-slate-800 rounded-lg animate-pulse" />
    </div>
  </section>
);

const SectionHeaderSkeleton = () => (
  <div className="space-y-3 mb-6">
    <div className="h-4 w-28 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
    <div className="h-8 w-64 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
  </div>
);

const ServicesSkeleton = () => (
  <section className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
    <SectionHeaderSkeleton />
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="h-36 bg-slate-200 dark:bg-slate-800 rounded-xl animate-pulse" />
      ))}
    </div>
  </section>
);

const MarketingSkeleton = () => (
  <section className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
    <SectionHeaderSkeleton />
    <div className="h-40 bg-slate-200 dark:bg-slate-800 rounded-2xl animate-pulse" />
  </section>
);

const PortfolioSkeleton = () => (
  <section className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
    <SectionHeaderSkeleton />
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="h-40 bg-slate-200 dark:bg-slate-800 rounded-xl animate-pulse" />
      ))}
    </div>
  </section>
);

const BlogSkeleton = () => (
  <section className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
    <SectionHeaderSkeleton />
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="space-y-3">
          <div className="h-32 bg-slate-200 dark:bg-slate-800 rounded-xl animate-pulse" />
          <div className="h-5 w-3/4 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
          <div className="h-4 w-2/3 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
        </div>
      ))}
    </div>
  </section>
);

const ContactSkeleton = () => (
  <section className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
    <SectionHeaderSkeleton />
    <div className="h-48 bg-slate-200 dark:bg-slate-800 rounded-2xl animate-pulse" />
  </section>
);

// A simple hook to manage dark mode
const useDarkMode = () => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Check system preference or local storage on mount
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

const Home: React.FC = () => {
  const { isDark, toggleTheme } = useDarkMode();
  const { lang: urlLang } = useParams();
  // Logic to handle language
  const getLang = () => {
    if (urlLang === 'vi' || urlLang === 'vn') return 'vi';
    if (urlLang === 'en') return 'en';

    const stored = (localStorage.getItem('lang') || localStorage.getItem('language') || '').toLowerCase();
    if (stored === 'en' || stored === 'vi') return stored as 'en' | 'vi';
    return (navigator.language || '').toLowerCase().startsWith('en') ? 'en' : 'vi';
  };
  const [lang, setLang] = useState<'en' | 'vi'>(getLang());

  useEffect(() => {
    if (urlLang === 'vi' || urlLang === 'vn') {
      if (lang !== 'vi') setLang('vi');
    } else if (urlLang === 'en') {
      if (lang !== 'en') setLang('en');
    }
  }, [urlLang]);

  useEffect(() => {
    const onLangChange = () => {
      const next = getLang();
      setLang(next);
    };
    window.addEventListener('storage', onLangChange);
    window.addEventListener('langchange', onLangChange);
    return () => {
      window.removeEventListener('storage', onLangChange);
      window.removeEventListener('langchange', onLangChange);
    };
  }, []);

  const { data: rawHomeData, isLoading: loading } = useQuery({
    queryKey: ['home-data', lang],
    queryFn: () => fetcher<any>(`/api/pages/home?lang=${lang}`),
  });

  const { data: featuredArticlesData } = useQuery({
    queryKey: ['featured-articles', lang],
    queryFn: () => fetcher<any>('/api/articles?featured=true&status=PUBLISHED&size=3&sort=createdAt,desc'),
  });
  
  const homeContent = useMemo(() => {
    if (!rawHomeData) return null;
    const data = rawHomeData;
    return {
      badgeText: lang === 'en' ? data.badgeTextEn : data.badgeText,
      titlePrefix: lang === 'en' ? data.titlePrefixEn : data.titlePrefix,
      titleHighlight: lang === 'en' ? data.titleHighlightEn : data.titleHighlight,
      titleSuffix: lang === 'en' ? data.titleSuffixEn : data.titleSuffix,
      description: lang === 'en' ? data.descriptionEn : data.description,
      heroImageUrl: lang === 'en' ? data.heroImageUrlEn : data.heroImageUrl,
      ctaPrimaryText: lang === 'en' ? data.ctaPrimaryTextEn : data.ctaPrimaryText,
      ctaSecondaryText: lang === 'en' ? data.ctaSecondaryTextEn : data.ctaSecondaryText,
      benefit1: lang === 'en' ? data.benefit1En : data.benefit1,
      benefit2: lang === 'en' ? data.benefit2En : data.benefit2,
      benefit3: lang === 'en' ? data.benefit3En : data.benefit3,
      servicesTitle: lang === 'en' ? data.servicesTitleEn : data.servicesTitle,
      servicesDescription: lang === 'en' ? data.servicesDescriptionEn : data.servicesDescription,
      servicesList: (() => {
        const json = lang === 'en' ? data.servicesListJsonEn : data.servicesListJsonVi;
        try {
          return JSON.parse(json);
        } catch (e) {
          return [];
        }
      })(),
      marketingPlatforms: (() => {
        const json = lang === 'en' ? data.marketingPlatformsJsonEn : data.marketingPlatformsJsonVi;
        try {
          const parsed = JSON.parse(json);
          return Array.isArray(parsed) ? parsed : [];
        } catch (e) {
          return [];
        }
      })(),
      marketingBadge: lang === 'en' ? data.marketingBadgeEn : data.marketingBadge,
      marketingTitle: lang === 'en' ? data.marketingTitleEn : data.marketingTitle,
      marketingCtaText: lang === 'en' ? data.marketingCtaTextEn : data.marketingCtaText,
      portfolioTitle: lang === 'en' ? data.portfolioTitleEn : data.portfolioTitle,
      portfolioDescription: lang === 'en' ? data.portfolioDescriptionEn : data.portfolioDescription,
      blogTitle: lang === 'en' ? data.blogTitleEn : data.blogTitle,
      blogViewAllText: lang === 'en' ? data.blogViewAllTextEn : data.blogViewAllText,
      contactTitle: lang === 'en' ? data.contactTitleEn : data.contactTitle,
      contactDescription: lang === 'en' ? data.contactDescriptionEn : data.contactDescription,
      contactHotlineLabel: lang === 'en' ? data.contactHotlineLabelEn : data.contactHotlineLabel,
      contactEmailLabel: lang === 'en' ? data.contactEmailLabelEn : data.contactEmailLabel,
      contactAddressLabel: lang === 'en' ? data.contactAddressLabelEn : data.contactAddressLabel,
      contactAddressValue: lang === 'en' ? data.contactAddressValueEn : data.contactAddressValue,
    };
  }, [rawHomeData, lang]);

  useEffect(() => {
    if (!rawHomeData) return;
    const isEn = lang === 'en';
    const seoTitle = (isEn ? rawHomeData.seoTitleEn : rawHomeData.seoTitle) || rawHomeData.seoTitle || '';
    const seoDescription =
      (isEn ? rawHomeData.seoDescriptionEn : rawHomeData.seoDescription) || rawHomeData.seoDescription || '';
    const seoKeywords =
      (isEn ? rawHomeData.seoKeywordsEn : rawHomeData.seoKeywords) || rawHomeData.seoKeywords || '';
    const fallbackTitle = isEn
      ? [rawHomeData.titlePrefixEn, rawHomeData.titleHighlightEn].filter(Boolean).join(' ')
      : [rawHomeData.titlePrefix, rawHomeData.titleHighlight].filter(Boolean).join(' ');
    const title = seoTitle.trim() || fallbackTitle || 'Victor Software';
    const description = seoDescription.trim();
    const keywords = seoKeywords.trim();

    document.title = title;

    const upsertMeta = (name: string, value: string) => {
      const trimmed = (value || '').trim();
      if (!trimmed) return;
      let meta = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement | null;
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute('name', name);
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', trimmed);
    };

    upsertMeta('description', description);
    upsertMeta('keywords', keywords);
  }, [rawHomeData, lang]);

  return (
    <div className="min-h-screen relative overflow-x-hidden selection:bg-accent/30">
       {/* Background Ambient Effect */}
      <div className="fixed inset-0 pointer-events-none z-[-1]">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/20 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent-500/10 rounded-full blur-[100px] animate-pulse" />
      </div>

      <Navbar isDark={isDark} toggleTheme={toggleTheme} />
      
      <main className="pt-20">
        {loading || !homeContent ? <HeroSkeleton /> : <Hero data={homeContent} />}
        {loading || !homeContent ? <ServicesSkeleton /> : <Services data={homeContent} />}
        {loading || !homeContent ? <MarketingSkeleton /> : <Marketing data={homeContent} />}
        {loading || !homeContent ? <BlogSkeleton /> : <Blog data={homeContent} posts={featuredArticlesData?.content || []} lang={lang} />}
        {loading || !homeContent ? <ContactSkeleton /> : <Contact data={homeContent} />}
      </main>

      <Footer />
      
      {/* Scroll to top button can be added here */}
    </div>
  );
};

export default Home;
