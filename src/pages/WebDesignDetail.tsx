import { useQuery } from '@tanstack/react-query';
import { api } from '@/utils/api';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, CheckCircle2, Monitor, Smartphone, Globe, Zap, Shield, TrendingUp } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';
import { getLang, getLocalizedSlug, getSlugKey } from '@/utils/localization';

import { useDarkMode } from '@/hooks/useDarkMode';

interface PricingPackage {
  name: string;
  price: string;
  desc: string;
  features: string[];
  popular?: boolean;
  link?: string;
}

const WebDesignDetail: React.FC = () => {
  const { isDark, toggleTheme } = useDarkMode();
  const navigate = useNavigate();

  const [lang, setLang] = useState<'en' | 'vi'>(getLang());
  useEffect(() => {
    const onLangChange = () => {
      const next = getLang();
      setLang(next);
      document.documentElement.lang = next;
    };
    window.addEventListener('langchange', onLangChange);
    return () => window.removeEventListener('langchange', onLangChange);
  }, []);

  const { data: content, isLoading: loading } = useQuery({
    queryKey: ['web-design-content', lang],
    queryFn: () => api.get<any>('/api/pages/web-design', { headers: { 'Accept-Language': lang } }),
    select: (data) => ({
      heroTitlePrefix: data.heroTitlePrefix || 'Giải Pháp Thiết Kế Website',
      heroTitleHighlight: data.heroTitleHighlight || 'Chuyên Nghiệp',
      heroDescription:
        data.heroDescription ||
        'Website chuẩn SEO, giao diện độc quyền UX/UI, tương thích mọi thiết bị di động. Chúng tôi tạo ra những website không chỉ đẹp mà còn hiệu quả trong việc chuyển đổi khách hàng.',
      serviceDescriptionHtml:
        data.serviceDescriptionHtml ||
        `<p>${
          data.serviceIntro ||
          'Chúng tôi thiết kế và phát triển website theo mục tiêu kinh doanh của bạn: đẹp, nhanh, chuẩn SEO và tối ưu chuyển đổi. Từ website giới thiệu, landing page đến website doanh nghiệp, mọi hạng mục đều được xây dựng với cấu trúc rõ ràng, trải nghiệm người dùng tốt và dễ quản trị.'
        }</p><p>${
          data.serviceSecondary ||
          'Trọng tâm của chúng tôi là kết hợp UX/UI hiện đại với hiệu năng và SEO kỹ thuật, giúp website vừa “đẹp để xem” vừa “mạnh để bán”.'
        }</p>`,
      suitableFor:
        data.suitableFor ||
        [
          'Doanh nghiệp cần website chuyên nghiệp để xây dựng thương hiệu',
          'Chủ shop/đơn vị bán hàng muốn tăng chuyển đổi từ Google và quảng cáo',
          'Dự án cần landing page triển khai nhanh, đo lường rõ ràng',
          'Website hiện tại cần nâng cấp giao diện và tối ưu tốc độ',
        ].join('\n'),
      suggestionText:
        data.suggestionText ||
        'Nếu bạn đang chạy quảng cáo, hãy ưu tiên Landing Page để tối ưu chuyển đổi và đo lường. Nếu cần xây dựng thương hiệu dài hạn, Website doanh nghiệp chuẩn SEO sẽ mang lại hiệu quả bền vững.',
      heroTitlePrefixEn: data.heroTitlePrefixEn || '',
      heroTitleHighlightEn: data.heroTitleHighlightEn || '',
      heroDescriptionEn: data.heroDescriptionEn || '',
      serviceDescriptionHtmlEn: data.serviceDescriptionHtmlEn || '',
      suitableForEn: data.suitableForEn || '',
      suggestionTextEn: data.suggestionTextEn || '',
      seoTitle: data.seoTitle || '',
      seoKeywords: data.seoKeywords || '',
      seoDescription: data.seoDescription || '',
      primaryKeyword: data.primaryKeyword || '',
      seoTitleEn: data.seoTitleEn || '',
      seoKeywordsEn: data.seoKeywordsEn || '',
      seoDescriptionEn: data.seoDescriptionEn || '',
      primaryKeywordEn: data.primaryKeywordEn || '',
      pricingJsonVi: data.pricingJsonVi || '',
      pricingJsonEn: data.pricingJsonEn || '',
    }),
  });

  const isEn = lang === 'en';
  
  const seoTitle = (isEn ? content?.seoTitleEn : content?.seoTitle) || content?.seoTitle || 'Victor Software';
  const seoDescription = (isEn ? content?.seoDescriptionEn : content?.seoDescription) || content?.seoDescription || '';
  const seoKeywords = (isEn ? content?.seoKeywordsEn : content?.seoKeywords) || content?.seoKeywords || '';

  const heroTitlePrefix = isEn ? content?.heroTitlePrefixEn || content?.heroTitlePrefix : content?.heroTitlePrefix;
  const heroTitleHighlight = isEn
    ? content?.heroTitleHighlightEn || content?.heroTitleHighlight
    : content?.heroTitleHighlight;
  const heroDescription = isEn ? content?.heroDescriptionEn || content?.heroDescription : content?.heroDescription;
  const serviceHtml = isEn
    ? content?.serviceDescriptionHtmlEn || content?.serviceDescriptionHtml
    : content?.serviceDescriptionHtml;
  const suitableFor = isEn ? content?.suitableForEn || content?.suitableFor : content?.suitableFor;
  const suggestionText = isEn ? content?.suggestionTextEn || content?.suggestionText : content?.suggestionText;

  if (loading && !content) {
    return (
      <div className="min-h-screen relative overflow-x-hidden selection:bg-accent/30">
        <SEO
          title={seoTitle}
          description={seoDescription}
          keywords={seoKeywords}
          type="article"
        />
        <div className="fixed inset-0 pointer-events-none z-[-1]">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/20 rounded-full blur-[100px] animate-pulse" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent-500/10 rounded-full blur-[100px] animate-pulse" />
        </div>
        <Navbar isDark={isDark} toggleTheme={toggleTheme} />
        <main className="pt-20">
          <section className="py-20 bg-gradient-to-b from-blue-50 to-white dark:from-slate-900 dark:to-slate-950">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
              <div className="h-6 w-40 rounded-full bg-slate-200 dark:bg-slate-800 animate-pulse mb-6" />
              <div className="space-y-4 max-w-4xl">
                <div className="h-10 w-3/4 rounded-2xl bg-slate-200 dark:bg-slate-800 animate-pulse" />
                <div className="h-10 w-2/3 rounded-2xl bg-slate-200 dark:bg-slate-800 animate-pulse" />
                <div className="mt-4 space-y-2">
                  <div className="h-4 w-full rounded-full bg-slate-200 dark:bg-slate-800 animate-pulse" />
                  <div className="h-4 w-11/12 rounded-full bg-slate-200 dark:bg-slate-800 animate-pulse" />
                  <div className="h-4 w-3/4 rounded-full bg-slate-200 dark:bg-slate-800 animate-pulse" />
                </div>
              </div>
            </div>
          </section>
          <section className="py-16 bg-white dark:bg-slate-950">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {Array.from({ length: 6 }).map((_, idx) => (
                  <div
                    key={idx}
                    className="p-6 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 animate-pulse space-y-4"
                  >
                    <div className="w-12 h-12 rounded-lg bg-slate-200 dark:bg-slate-800" />
                    <div className="h-5 w-3/4 rounded-full bg-slate-200 dark:bg-slate-800" />
                    <div className="h-4 w-full rounded-full bg-slate-200 dark:bg-slate-800" />
                    <div className="h-4 w-5/6 rounded-full bg-slate-200 dark:bg-slate-800" />
                  </div>
                ))}
              </div>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    );
  }

  const features = [
    ...(isEn
      ? [
          { icon: <Monitor size={24} />, title: 'Responsive Design', desc: 'Works seamlessly on desktop, tablet, and mobile' },
          { icon: <Zap size={24} />, title: 'Fast Loading', desc: 'Optimized performance, load in 2–3 seconds' },
          { icon: <TrendingUp size={24} />, title: 'SEO Ready', desc: 'Technical SEO optimization from the start' },
          { icon: <Shield size={24} />, title: 'High Security', desc: 'SSL, firewall, and data encryption' },
          { icon: <Smartphone size={24} />, title: 'Mobile First', desc: 'Prioritized experience on mobile devices' },
          { icon: <Globe size={24} />, title: 'Multilingual', desc: 'Support multiple languages if needed' },
        ]
      : [
          { icon: <Monitor size={24} />, title: 'Responsive Design', desc: 'Tương thích mọi thiết bị từ desktop đến mobile' },
          { icon: <Zap size={24} />, title: 'Tốc độ tải nhanh', desc: 'Tối ưu hiệu suất, tải trang trong 2-3 giây' },
          { icon: <TrendingUp size={24} />, title: 'Chuẩn SEO', desc: 'Tối ưu hóa công cụ tìm kiếm từ đầu' },
          { icon: <Shield size={24} />, title: 'Bảo mật cao', desc: 'SSL, firewall và mã hóa dữ liệu' },
          { icon: <Smartphone size={24} />, title: 'Mobile First', desc: 'Ưu tiên trải nghiệm trên di động' },
          { icon: <Globe size={24} />, title: 'Đa ngôn ngữ', desc: 'Hỗ trợ nhiều ngôn ngữ nếu cần' },
        ])
  ];

  const safeParse = (s?: string): PricingPackage[] => {
    try {
      const v = JSON.parse(s || '[]');
      return Array.isArray(v) ? v : [];
    } catch {
      return [];
    }
  };

  const pricingPackages =
    (lang === 'en' ? safeParse(content?.pricingJsonEn) : safeParse(content?.pricingJsonVi))?.length > 0
      ? lang === 'en'
        ? safeParse(content?.pricingJsonEn)
        : safeParse(content?.pricingJsonVi)
      : [];

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": seoTitle,
    "description": seoDescription,
    "provider": {
      "@type": "Organization",
      "name": "Victor Software",
      "url": "https://victorsoftwave.com"
    },
    "serviceType": "Web Design and Development",
    "areaServed": "Global",
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": isEn ? "Web Design Packages" : "Gói thiết kế website",
      "itemListElement": pricingPackages.map((pkg, index) => ({
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": pkg.name,
          "description": pkg.desc
        },
        "price": pkg.price.replace(/\D/g, '') || "0",
        "priceCurrency": "VND"
      }))
    }
  };

  const buildLocalizedHref = (rawLink: string) => {
    if (!rawLink) return rawLink;
    if (rawLink.startsWith('http')) return rawLink;
    if (!rawLink.startsWith('/')) return rawLink;
    
    // Check if it already has prefix
    if (rawLink.startsWith('/en/') || rawLink.startsWith('/vi/')) return rawLink;

    const cleanLink = rawLink.slice(1);
    const key = getSlugKey(cleanLink);
    if (key) {
      return `/${lang}/${getLocalizedSlug(key, lang)}`;
    }

    const prefix = lang === 'en' ? '/en' : '/vi';
    return `${prefix}${rawLink}`;
  };

  return (
    <div className="min-h-screen relative overflow-x-hidden selection:bg-accent/30">
      <SEO
        title={seoTitle}
        description={seoDescription}
        keywords={seoKeywords}
        type="article"
      />
      {/* Background Ambient Effect */}
      <div className="fixed inset-0 pointer-events-none z-[-1]">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/20 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent-500/10 rounded-full blur-[100px] animate-pulse" />
      </div>

      <Navbar isDark={isDark} toggleTheme={toggleTheme} />

      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-b from-blue-50 to-white dark:from-slate-900 dark:to-slate-950">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
            <button
              onClick={() => navigate(`/${lang}`)}
              className="flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 mb-8 transition-colors"
            >
              <ArrowLeft size={20} />
              <span>{isEn ? 'Back to Home' : 'Quay lại trang chủ'}</span>
            </button>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-4xl"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-300 text-sm font-semibold mb-6">
                <Monitor size={16} />
                <span>Thiết kế Website</span>
              </div>

              <h1 className="text-4xl md:text-6xl font-extrabold mb-6 text-slate-900 dark:text-white">
                {(heroTitlePrefix || 'Giải Pháp Thiết Kế Website')}{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">
                  {heroTitleHighlight || 'Chuyên Nghiệp'}
                </span>
              </h1>

              <p className="text-xl text-slate-600 dark:text-slate-400 leading-relaxed mb-8">
                {heroDescription ||
                  'Website chuẩn SEO, giao diện độc quyền UX/UI, tương thích mọi thiết bị di động. Chúng tôi tạo ra những website không chỉ đẹp mà còn hiệu quả trong việc chuyển đổi khách hàng.'}
              </p>
            </motion.div>
          </div>
        </section>



        {/* Features Section */}
        <section className="py-20 bg-white dark:bg-slate-950">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-slate-900 dark:text-white">
                {isEn ? 'Key Features' : 'Tính năng nổi bật'}
              </h2>
              <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                {isEn ? 'Strengths that make your website stand out' : 'Những điểm mạnh khiến website của bạn vượt trội'}
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="p-6 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:shadow-lg transition-all group"
                >
                  <div className="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-slate-900 dark:text-white">
                    {feature.title}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400">
                    {feature.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Packages Section */}
        <section className="py-20 bg-slate-50 dark:bg-slate-900/50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
            <div className="mb-20"> 
              <div className="text-center mb-12"> 
                <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
                  {isEn ? 'Service Pricing' : 'Bảng Giá Dịch Vụ'}
                </h2> 
                <p className="text-slate-600 dark:text-slate-400">
                  {isEn
                    ? 'Transparent costs, no hidden fees, suitable for all business sizes'
                    : 'Chi phí minh bạch, không phát sinh, phù hợp mọi quy mô doanh nghiệp'}
                </p> 
              </div> 
              <div className="grid md:grid-cols-3 gap-8 items-start"> 
                {pricingPackages.map((pkg, idx) => ( 
                  <motion.div 
                    key={idx} 
                    initial={{ opacity: 0, y: 30 }} 
                    whileInView={{ opacity: 1, y: 0 }} 
                    viewport={{ once: true }} 
                    transition={{ delay: idx * 0.1 }} 
                    className={`relative rounded-3xl p-8 border ${pkg.popular 
                      ? 'bg-[#1e293b] text-white border-blue-500 shadow-2xl scale-105 z-10' 
                      : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white shadow-lg' 
                    }`} 
                  > 
                    {pkg.popular && ( 
                      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-4 py-1 rounded-full text-sm font-bold shadow-lg"> 
                        Phổ Biến Nhất 
                      </div> 
                    )} 
                    <h3 className={`text-xl font-bold mb-2 ${pkg.popular ? 'text-white' : 'text-slate-900 dark:text-white'}`}>{pkg.name}</h3> 
                    <div className="flex items-baseline gap-1 mb-4"> 
                      <span className="text-3xl font-bold">{pkg.price}</span> 
                    </div> 
                    <p className={`text-sm mb-6 ${pkg.popular ? 'text-slate-300' : 'text-slate-500 dark:text-slate-400'}`}>{pkg.desc}</p> 
                    
                    <div className="space-y-4 mb-8"> 
                      {pkg.features.map((feat: string, i: number) => ( 
                        <div key={i} className="flex items-start gap-3"> 
                          <CheckCircle2 size={18} className={`mt-0.5 flex-shrink-0 ${pkg.popular ? 'text-blue-400' : 'text-blue-600'}`} /> 
                          <span className={`text-sm ${pkg.popular ? 'text-slate-200' : 'text-slate-600 dark:text-slate-300'}`}>{feat}</span> 
                        </div> 
                      ))} 
                    </div> 

                    {pkg.link ? (
                      <a
                        href={buildLocalizedHref(pkg.link)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`block text-center w-full py-3 rounded-xl font-bold transition-transform active:scale-95 ${
                          pkg.popular
                            ? 'bg-blue-600 hover:bg-blue-500 text-white'
                            : 'bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-900 dark:text-white'
                        }`}
                      >
                        {isEn ? 'Choose this package' : 'Chọn gói này'}
                      </a>
                    ) : (
                      <button
                        onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                        className={`w-full py-3 rounded-xl font-bold transition-transform active:scale-95 ${
                          pkg.popular
                            ? 'bg-blue-600 hover:bg-blue-500 text-white'
                            : 'bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-900 dark:text-white'
                        }`}
                      >
                        {isEn ? 'Choose this package' : 'Chọn gói này'}
                      </button>
                    )} 
                  </motion.div> 
                ))} 
              </div> 
            </div>
          </div>
        </section>
        
        {/* Description Section */}
        <section className="py-20 bg-white dark:bg-slate-950">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
            <motion.article
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55 }}
              className="mx-auto max-w-3xl"
            >
              <header className="mb-10">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">
                {isEn ? 'Service Description' : 'Mô tả dịch vụ'}
              </h2>
              <div className="mt-4 h-1 w-24 rounded-full bg-gradient-to-r from-blue-600 to-cyan-500" />
              </header>

              <div className="space-y-6 text-lg leading-relaxed text-slate-700 dark:text-slate-300">
                <div
                  className="text-slate-700 dark:text-slate-300 [&_p]:mb-6 [&_p:last-child]:mb-0 [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:list-decimal [&_ol]:pl-6 [&_li]:mb-2 [&_strong]:text-slate-900 dark:[&_strong]:text-white [&_h2]:text-2xl [&_h2]:font-extrabold [&_h2]:text-slate-900 dark:[&_h2]:text-white [&_h2]:mt-8 [&_h2]:mb-4 [&_h3]:text-xl [&_h3]:font-bold [&_h3]:text-slate-900 dark:[&_h3]:text-white [&_h3]:mt-6 [&_h3]:mb-3"
                  dangerouslySetInnerHTML={{
                    __html: serviceHtml || '',
                  }}
                />

                <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 p-7 shadow-sm">
                  <div className="text-slate-900 dark:text-white font-extrabold text-xl">
                    Phù hợp cho
                  </div>
                  <div className="mt-5 space-y-3">
                    {(suitableFor || '')
                      .replace(/\r\n/g, '\n')
                      .split('\n')
                      .map((s: string) => s.trim())
                      .filter(Boolean)
                      .map((item: string, idx: number) => (
                      <div key={idx} className="flex items-start gap-3">
                        <CheckCircle2 size={18} className="mt-0.5 flex-shrink-0 text-blue-600 dark:text-blue-400" />
                        <span className="text-slate-700 dark:text-slate-300">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-3xl border border-blue-200/70 dark:border-blue-900/40 bg-blue-50/70 dark:bg-blue-950/20 p-6">
                  <div className="font-semibold text-slate-900 dark:text-white">
                    Gợi ý triển khai
                  </div>
                  <p className="mt-2 text-slate-700 dark:text-slate-300">
                    {suggestionText}
                  </p>
                </div>
              </div>
            </motion.article>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default WebDesignDetail;
