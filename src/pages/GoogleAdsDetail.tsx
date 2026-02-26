import { useQuery } from '@tanstack/react-query';
import { api } from '@/utils/api';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Target, TrendingUp, BarChart3, ArrowRight, Search, Globe, CheckCircle2 } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';
import { getLang } from '@/utils/localization';
import { useDarkMode } from '@/hooks/useDarkMode';

const GoogleAdsDetail = () => {
  const { isDark, toggleTheme } = useDarkMode();
  const navigate = useNavigate();
  const [lang, setLang] = useState<'en' | 'vi'>(getLang());

  const { data: content, isLoading: loading } = useQuery({
    queryKey: ['google-ads-content', lang],
    queryFn: () => api.get<any>('/api/pages/google-ads', { headers: { 'Accept-Language': lang } }),
    select: (data) => ({
      heroTitlePrefix: data.heroTitlePrefix || '',
      heroTitleHighlight: data.heroTitleHighlight || '',
      heroDescription: data.heroDescription || '',
      heroImageUrl: data.heroImageUrl,
      serviceDescriptionHtml: data.serviceDescriptionHtml || '',
      suitableFor: data.suitableFor || '',
      suggestionText: data.suggestionText || '',
      heroTitlePrefixEn: data.heroTitlePrefixEn || '',
      heroTitleHighlightEn: data.heroTitleHighlightEn || '',
      heroDescriptionEn: data.heroDescriptionEn || '',
      heroImageUrlEn: data.heroImageUrlEn || data.heroImageUrl || '',
      serviceDescriptionHtmlEn: data.serviceDescriptionHtmlEn || '',
      suitableForEn: data.suitableForEn || '',
      suggestionTextEn: data.suggestionTextEn || '',
      seoTitle: data.seoTitle || '',
      seoKeywords: data.seoKeywords || '',
      seoDescription: data.seoDescription || '',
      primaryKeyword: data.primaryKeyword || '',
      consultationLink: data.consultationLink || '',
      seoTitleEn: data.seoTitleEn || '',
      seoKeywordsEn: data.seoKeywordsEn || '',
      seoDescriptionEn: data.seoDescriptionEn || '',
      primaryKeywordEn: data.primaryKeywordEn || '',
      consultationLinkEn: data.consultationLinkEn || '',
    }),
  });

  useEffect(() => {
    const onLangChange = () => {
      const next = getLang();
      setLang(next);
      document.documentElement.lang = next;
    };
    window.addEventListener('langchange', onLangChange);
    return () => window.removeEventListener('langchange', onLangChange);
  }, []);

  const isEn = lang === 'en';

  const seoTitle =
    (isEn ? content?.seoTitleEn : content?.seoTitle) ||
    content?.seoTitle ||
    '';
  const seoDescription =
    (isEn ? content?.seoDescriptionEn : content?.seoDescription) || content?.seoDescription || '';
  const seoKeywords = (isEn ? content?.seoKeywordsEn : content?.seoKeywords) || content?.seoKeywords || '';

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": seoTitle,
    "description": seoDescription,
    "provider": {
      "@type": "Organization",
      "name": "Victor Software",
      "url": "https://www.victorsoftwave.com"
    },
    "serviceType": "Google Ads Management",
    "areaServed": "Global",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "VND",
      "availability": "https://schema.org/InStock"
    }
  };

  const heroTitlePrefix = isEn
    ? content?.heroTitlePrefixEn || ''
    : content?.heroTitlePrefix || '';
  const heroTitleHighlight = isEn
    ? content?.heroTitleHighlightEn || ''
    : content?.heroTitleHighlight || '';
  const heroDescription = isEn
    ? content?.heroDescriptionEn || ''
    : content?.heroDescription || '';
  const heroImageUrl = isEn
    ? content?.heroImageUrlEn || content?.heroImageUrl
    : content?.heroImageUrl;
  const serviceDescriptionHtml = isEn
    ? content?.serviceDescriptionHtmlEn || content?.serviceDescriptionHtml || ''
    : content?.serviceDescriptionHtml || '';
  const suitableFor = isEn ? content?.suitableForEn || content?.suitableFor : content?.suitableFor;
  const suggestionText = isEn ? content?.suggestionTextEn || content?.suggestionText : content?.suggestionText;

  const backToHomeLabel = isEn ? 'Back to homepage' : 'Quay lại trang chủ';
  const heroBadgeLabel = isEn ? 'Google Ads' : 'Quảng cáo Google';
  const heroOverlayBadgeLabel = isEn ? 'Search • Display • Video' : 'Tìm kiếm • Hiển thị • Video';
  const scopeTitle = isEn ? 'Scope of work' : 'Hạng mục triển khai';
  const scopeSubtitle = isEn
    ? 'Comprehensive Google Ads strategy from keyword research to conversion optimization.'
    : 'Chiến lược Google Ads toàn diện từ nghiên cứu từ khóa đến tối ưu chuyển đổi.';
  const processTitle = isEn ? 'Execution process' : 'Quy trình thực hiện';
  const processSubtitle = isEn
    ? 'Standardized process to ensure campaign efficiency and transparency.'
    : 'Quy trình chuẩn hóa đảm bảo hiệu quả chiến dịch và sự minh bạch.';

  const outcomes = isEn
    ? [
        {
          icon: <Search size={20} />,
          title: 'High Intent Traffic',
          desc: 'Capture users who are actively searching for your products.',
        },
        {
          icon: <Target size={20} />,
          title: 'Precise Targeting',
          desc: 'Target by keywords, location, demographics, and interests.',
        },
        {
          icon: <BarChart3 size={20} />,
          title: 'Measurable ROI',
          desc: 'Clear tracking of clicks, impressions, and conversions.',
        },
      ]
    : [
        { icon: <Search size={20} />, title: 'Traffic chất lượng', desc: 'Tiếp cận người dùng đang chủ động tìm kiếm sản phẩm.' },
        {
          icon: <Target size={20} />,
          title: 'Target chính xác',
          desc: 'Nhắm mục tiêu theo từ khóa, vị trí, nhân khẩu học và sở thích.',
        },
        {
          icon: <BarChart3 size={20} />,
          title: 'Đo lường ROI',
          desc: 'Theo dõi rõ ràng lượt click, hiển thị và chuyển đổi.',
        },
      ];

  const deliverables: { icon: React.ReactNode; title: string; desc: string }[] = isEn
    ? [
        {
          icon: <Search size={20} />,
          title: 'Keyword Research',
          desc: 'Identify high-converting keywords with optimal CPC.',
        },
        {
          icon: <Globe size={20} />,
          title: 'Campaign Setup',
          desc: 'Search, Display, YouTube campaign structure and ad copies.',
        },
        {
          icon: <TrendingUp size={20} />,
          title: 'Optimization',
          desc: 'Continuous bid adjustment, negative keywords, and A/B testing.',
        },
      ]
    : [
        {
          icon: <Search size={20} />,
          title: 'Nghiên cứu từ khóa',
          desc: 'Xác định bộ từ khóa chuyển đổi cao với CPC tối ưu.',
        },
        {
          icon: <Globe size={20} />,
          title: 'Thiết lập chiến dịch',
          desc: 'Cấu trúc chiến dịch Tìm kiếm, Hiển thị, YouTube và mẫu quảng cáo.',
        },
        {
          icon: <TrendingUp size={20} />,
          title: 'Tối ưu hóa',
          desc: 'Điều chỉnh giá thầu, từ khóa phủ định và A/B testing liên tục.',
        },
      ];

  const consultationHeading = isEn ? 'Get Google Ads consultation' : 'Nhận tư vấn Google Ads';
  const consultationIntro = isEn
    ? 'Share your business goals. We will analyze keywords and propose a suitable Google Ads strategy.'
    : 'Chia sẻ mục tiêu kinh doanh. Chúng tôi sẽ phân tích từ khóa và đề xuất chiến lược Google Ads phù hợp.';
  const consultationPoints = isEn
    ? [
        'Keyword volume and CPC analysis',
        'Campaign type recommendation (Search/Display/Video)',
        'Budget estimation and ROI projection',
      ]
    : [
        'Phân tích lượng tìm kiếm và CPC từ khóa',
        'Đề xuất loại hình chiến dịch (Search/Display/Video)',
        'Ước tính ngân sách và dự báo ROI',
      ];
  const consultationCta = isEn ? 'Contact for consultation' : 'Liên hệ tư vấn';
  const consultationLink = isEn
    ? content?.consultationLinkEn || content?.consultationLink
    : content?.consultationLink;

  if (loading && !content) {
    return (
      <div className="min-h-screen relative overflow-x-hidden selection:bg-accent/30">
        <SEO
          title={seoTitle}
          description={seoDescription}
          keywords={seoKeywords}
          type="article"
          image={heroImageUrl}
        />
        <div className="fixed inset-0 pointer-events-none z-[-1]">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/20 rounded-full blur-[100px] animate-pulse" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-500/10 rounded-full blur-[100px] animate-pulse" />
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
                  <div className="h-4 w-5/6 rounded-full bg-slate-200 dark:bg-slate-800 animate-pulse" />
                  <div className="h-4 w-2/3 rounded-full bg-slate-200 dark:bg-slate-800 animate-pulse" />
                </div>
              </div>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-x-hidden selection:bg-accent/30">
      <SEO
        title={seoTitle}
        description={seoDescription}
        keywords={seoKeywords}
        image={heroImageUrl}
        type="article"
        structuredData={structuredData}
      />
      <div className="fixed inset-0 pointer-events-none z-[-1]">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/15 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-500/10 rounded-full blur-[100px] animate-pulse" />
      </div>

      <Navbar isDark={isDark} toggleTheme={toggleTheme} />

      <main className="pt-20">
        <section className="py-20 bg-gradient-to-b from-blue-50 to-white dark:from-slate-900 dark:to-slate-950">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
            <button
          onClick={() => navigate(`/`)}
          className="cursor-pointer flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 mb-8 transition-colors"
        >
              <ArrowLeft size={20} />
              <span>{backToHomeLabel}</span>
            </button>

            <div className="grid lg:grid-cols-[1.5fr_1fr] gap-10 items-start">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 text-sm font-semibold mb-6">
                  <Search size={16} />
                  <span>{heroBadgeLabel}</span>
                </div>

                <h1 className="text-4xl md:text-6xl font-extrabold mb-6 text-slate-900 dark:text-white">
                  {heroTitlePrefix}{' '}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-500">
                    {heroTitleHighlight}
                  </span>
                </h1>

                <p className="text-xl text-slate-600 dark:text-slate-400 leading-relaxed mb-10">
                  {heroDescription}
                </p>

                <div className="grid sm:grid-cols-3 gap-4">
                  {outcomes.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm"
                    >
                      <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-semibold mb-2">
                        {item.icon}
                        <span className="whitespace-nowrap">{item.title}</span>
                      </div>
                      <div className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                        {item.desc}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="relative lg:max-w-md lg:ml-auto"
              >
                <div className="rounded-3xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
                  <div className="aspect-[4/3] relative">
                    <img src={heroImageUrl} alt="Google Ads" className="w-full h-full object-cover" loading="lazy" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/10 to-transparent" />
                    <div className="absolute bottom-5 left-5 right-5">
                      <div className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-white/90 text-slate-900 font-semibold">
                        <Search size={18} className="text-blue-600" />
                        <span>{heroOverlayBadgeLabel}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-blue-500/10 dark:bg-blue-500/5 blur-3xl rounded-full pointer-events-none" />
              </motion.div>
            </div>
          </div>
        </section>

        <section className="py-20 bg-white dark:bg-slate-950">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
            <div className="text-center mb-14">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-slate-900 dark:text-white">
                {scopeTitle}
              </h2>
              <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                {scopeSubtitle}
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {deliverables.map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="p-8 rounded-2xl bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800"
                >
                  <div className="w-12 h-12 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center text-blue-600 dark:text-blue-400 mb-5">
                    {item.icon}
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
                    {item.title}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                    {item.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 bg-slate-50 dark:bg-slate-900/40">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
            <div className="text-center mb-14">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-slate-900 dark:text-white">
                {consultationHeading}
              </h2>
              <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                {consultationIntro}
              </p>
            </div>

            <div className="max-w-3xl mx-auto bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-xl">
              <ul className="space-y-4 mb-8">
                {consultationPoints.map((point, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <CheckCircle2 className="w-6 h-6 text-green-500 shrink-0" />
                    <span className="text-slate-700 dark:text-slate-300">{point}</span>
                  </li>
                ))}
              </ul>
              <div className="flex justify-center">
                <button
                  onClick={() => {
                    if (consultationLink) {
                      window.open(consultationLink, '_blank');
                    } else {
                      document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                  className="cursor-pointer px-8 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                  <span>{consultationCta}</span>
                  <ArrowRight size={18} />
                </button>
              </div>
            </div>
          </div>
        </section>
        
        {serviceDescriptionHtml && (
          <section className="py-20 bg-white dark:bg-slate-950">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
              <motion.article
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.55 }}
                className="mx-auto max-w-4xl"
              >
                <header className="mb-10">
                  <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">
                    {isEn ? 'Service Description' : 'Mô tả dịch vụ'}
                  </h2>
                  <div className="mt-4 h-1 w-24 rounded-full bg-gradient-to-r from-blue-600 to-indigo-500" />
                </header>
                <div
                  className="text-lg leading-relaxed text-slate-700 dark:text-slate-300 [&_p]:mb-6 [&_p:last-child]:mb-0 [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:list-decimal [&_ol]:pl-6 [&_li]:mb-2 [&_strong]:text-slate-900 dark:[&_strong]:text-white [&_h2]:text-2xl [&_h2]:font-extrabold [&_h2]:text-slate-900 dark:[&_h2]:text-white [&_h2]:mt-8 [&_h2]:mb-4 [&_h3]:text-xl [&_h3]:font-bold [&_h3]:text-slate-900 dark:[&_h3]:text-white [&_h3]:mt-6 [&_h3]:mb-3"
                  dangerouslySetInnerHTML={{ __html: serviceDescriptionHtml }}
                />
                <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 p-7 shadow-sm mt-8">
                  <div className="text-slate-900 dark:text-white font-extrabold text-xl">
                    {isEn ? 'Suitable For' : 'Phù hợp cho'}
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
                <div className="rounded-3xl border border-blue-200/70 dark:border-blue-900/40 bg-blue-50/70 dark:bg-blue-950/20 p-6 mt-6">
                  <div className="font-semibold text-slate-900 dark:text-white">
                    {isEn ? 'Suggestion' : 'Gợi ý triển khai'}
                  </div>
                  <p className="mt-2 text-slate-700 dark:text-slate-300">
                    {suggestionText ||
                      (isEn
                        ? 'Contact us for a free consultation about Google Ads.'
                        : 'Liên hệ với chúng tôi để được tư vấn miễn phí về Google Ads.')}
                  </p>
                </div>
              </motion.article>
            </div>
          </section>
        )}

      </main>

      <Footer />
    </div>
  );
};

export default GoogleAdsDetail;
