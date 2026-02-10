import { useQuery } from '@tanstack/react-query';
import { api } from '@/utils/api';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Smartphone, Target, TrendingUp, Video, BarChart3, Users, CheckCircle2, ArrowRight } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';
import { getLang } from '@/utils/localization';
import { useDarkMode } from '@/hooks/useDarkMode';

const TikTokDetail: React.FC = () => {
  const { isDark, toggleTheme } = useDarkMode();
  const navigate = useNavigate();
  const [lang, setLang] = useState<'en' | 'vi'>(getLang());

  type Content = {
    heroTitlePrefix: string;
    heroTitleHighlight: string;
    heroDescription: string;
    heroImageUrl: string;
    serviceDescriptionHtml: string;
    suitableFor: string;
    suggestionText: string;
    heroTitlePrefixEn: string;
    heroTitleHighlightEn: string;
    heroDescriptionEn: string;
    heroImageUrlEn: string;
    serviceDescriptionHtmlEn: string;
    suitableForEn: string;
    suggestionTextEn: string;
    seoTitle: string;
    seoKeywords: string;
    seoDescription: string;
    primaryKeyword: string;
    seoTitleEn: string;
    seoKeywordsEn: string;
    seoDescriptionEn: string;
    primaryKeywordEn: string;
  };

  const { data: content, isLoading: loading } = useQuery({
    queryKey: ['tiktok-ads-content', lang],
    queryFn: () =>
      api.get<any>('/api/pages/tiktok-ads', {
        headers: {
          'Accept-Language': lang,
        },
      }),
    select: (data) => ({
      heroTitlePrefix: data.heroTitlePrefix || 'Quảng Cáo TikTok',
      heroTitleHighlight: data.heroTitleHighlight || 'Tăng Trưởng Nhanh',
      heroDescription:
        data.heroDescription ||
        'Xây dựng chiến dịch TikTok Ads dựa trên creative và dữ liệu. Tập trung tối ưu chuyển đổi, giảm chi phí và mở rộng quy mô khi đạt hiệu quả.',
      heroImageUrl: data.heroImageUrl,
      serviceDescriptionHtml: data.serviceDescriptionHtml || '',
      suitableFor: data.suitableFor || '',
      suggestionText: data.suggestionText || '',
      heroTitlePrefixEn: data.heroTitlePrefixEn || 'TikTok Ads',
      heroTitleHighlightEn: data.heroTitleHighlightEn || 'Scale Fast',
      heroDescriptionEn:
        data.heroDescriptionEn ||
        'Build TikTok Ads campaigns based on creative and data. Focus on conversion optimization, lowering costs, and scaling once results are achieved.',
      heroImageUrlEn: data.heroImageUrlEn || data.heroImageUrl,
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
    (isEn ? 'TikTok Ads Service - Victor Software' : 'Dịch vụ TikTok Ads - Victor Software');
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
    "serviceType": "TikTok Ads Management",
    "areaServed": "Global",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "VND",
      "availability": "https://schema.org/InStock"
    }
  };

  const heroTitlePrefix = isEn
    ? content?.heroTitlePrefixEn || 'TikTok Ads'
    : content?.heroTitlePrefix || 'Quảng Cáo TikTok';
  const heroTitleHighlight = isEn
    ? content?.heroTitleHighlightEn || 'Scale Fast'
    : content?.heroTitleHighlight || 'Tăng Trưởng Nhanh';
  const heroDescription = isEn
    ? content?.heroDescriptionEn ||
      'Build TikTok Ads campaigns based on creative and data. Focus on conversion optimization, lowering costs, and scaling once results are achieved.'
    : content?.heroDescription ||
      'Xây dựng chiến dịch TikTok Ads dựa trên creative và dữ liệu. Tập trung tối ưu chuyển đổi, giảm chi phí và mở rộng quy mô khi đạt hiệu quả.';
  const heroImageUrl = isEn
    ? content?.heroImageUrlEn || content?.heroImageUrl
    : content?.heroImageUrl;
  const serviceDescriptionHtml = isEn
    ? content?.serviceDescriptionHtmlEn || content?.serviceDescriptionHtml || ''
    : content?.serviceDescriptionHtml || '';
  const suitableFor = isEn ? content?.suitableForEn || content?.suitableFor : content?.suitableFor;
  const suggestionText = isEn ? content?.suggestionTextEn || content?.suggestionText : content?.suggestionText;

  const backToHomeLabel = isEn ? 'Back to homepage' : 'Quay lại trang chủ';
  const heroBadgeLabel = isEn ? 'TikTok Ads' : 'Quảng cáo TikTok';
  const heroOverlayBadgeLabel = isEn ? 'Creative • Target • Scale' : 'Ý tưởng • Target • Mở rộng';
  const scopeTitle = isEn ? 'Scope of work' : 'Hạng mục triển khai';
  const scopeSubtitle = isEn
    ? 'From setup to creative testing and optimization for clear results.'
    : 'Từ setup đến test creative và tối ưu để ra kết quả rõ ràng.';
  const processTitle = isEn ? 'Execution process' : 'Quy trình thực hiện';
  const processSubtitle = isEn
    ? 'Do it right from tracking to creative to maximize performance.'
    : 'Làm đúng từ tracking đến creative để tối ưu hiệu quả.';

  const outcomes = isEn
    ? [
        {
          icon: <TrendingUp size={20} />,
          title: 'More orders & inbox',
          desc: 'Optimize conversion from video views to actions.',
        },
        {
          icon: <Target size={20} />,
          title: 'Right audience',
          desc: 'Target by behavior, interests and lookalike.',
        },
        {
          icon: <BarChart3 size={20} />,
          title: 'Data-driven optimization',
          desc: 'Track CPA/ROAS and optimize continuously.',
        },
      ]
    : [
        { icon: <TrendingUp size={20} />, title: 'Tăng đơn & inbox', desc: 'Tối ưu chuyển đổi từ video sang hành động.' },
        { icon: <Target size={20} />, title: 'Đúng tệp khách', desc: 'Target theo hành vi, sở thích và lookalike.' },
        { icon: <BarChart3 size={20} />, title: 'Tối ưu theo dữ liệu', desc: 'Theo dõi CPA/ROAS và tối ưu liên tục.' },
      ];

  const deliverables = isEn
    ? [
        {
          icon: <Video size={20} />,
          title: 'Script & concept',
          desc: 'Content direction by industry and customer insights.',
        },
        {
          icon: <Smartphone size={20} />,
          title: 'Campaign setup',
          desc: 'Pixel, catalog (if any), ad group structure.',
        },
        {
          icon: <Users size={20} />,
          title: 'Optimization & scale',
          desc: 'Test creatives, audiences, budget and scale what works.',
        },
      ]
    : [
        { icon: <Video size={20} />, title: 'Kịch bản & concept', desc: 'Định hướng nội dung theo ngành và insight khách hàng.' },
        {
          icon: <Smartphone size={20} />,
          title: 'Setup chiến dịch',
          desc: 'Pixel, catalog (nếu có), cấu trúc nhóm quảng cáo.',
        },
        { icon: <Users size={20} />, title: 'Tối ưu & scale', desc: 'Test creative, audience, ngân sách và mở rộng hiệu quả.' },
      ];

  const steps = isEn
    ? [
        {
          title: 'Research & objectives',
          desc: 'Products, competitive advantages, KPIs and budget.',
        },
        {
          title: 'Setup & tracking',
          desc: 'Install pixel, events, measurement and tracking check.',
        },
        {
          title: 'Test creatives',
          desc: 'A/B test videos, hooks, CTAs and landing/inbox.',
        },
        {
          title: 'Optimize & scale',
          desc: 'Optimize by data, scale winners and cut waste.',
        },
      ]
    : [
        { title: 'Khảo sát & mục tiêu', desc: 'Sản phẩm, lợi thế cạnh tranh, KPI và ngân sách.' },
        { title: 'Setup & tracking', desc: 'Cài pixel, sự kiện, đo lường và kiểm tra tracking.' },
        { title: 'Test creative', desc: 'A/B test video, hook, CTA và landing/inbox.' },
        { title: 'Tối ưu & mở rộng', desc: 'Tối ưu theo dữ liệu, scale nhóm thắng và giảm lãng phí.' },
      ];

  const consultationHeading = isEn ? 'Get TikTok Ads consultation' : 'Nhận tư vấn TikTok Ads';
  const consultationIntro = isEn
    ? 'Send your vertical and goals (inbox/orders/traffic). We will propose campaign structure and a suitable creative testing plan.'
    : 'Gửi ngành hàng và mục tiêu (inbox/đơn hàng/traffic). Chúng tôi sẽ đề xuất cấu trúc chiến dịch và kế hoạch test creative phù hợp.';
  const consultationPoints = isEn
    ? [
        'Consult on reasonable budget and KPIs by vertical',
        'Suggest video concepts and hooks based on insights',
        'Propose tracking/landing/inbox setup optimized for conversion',
      ]
    : [
        'Tư vấn ngân sách và KPI hợp lý theo ngành',
        'Gợi ý concept video và hook theo insight',
        'Đề xuất tracking/landing/inbox tối ưu chuyển đổi',
      ];
  const consultationCta = isEn ? 'Contact for consultation' : 'Liên hệ tư vấn';

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
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-pink-500/20 rounded-full blur-[100px] animate-pulse" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-[100px] animate-pulse" />
        </div>

        <Navbar isDark={isDark} toggleTheme={toggleTheme} />

        <main className="pt-20">
          <section className="py-20 bg-gradient-to-b from-pink-50 to-white dark:from-slate-900 dark:to-slate-950">
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
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-pink-500/15 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-[100px] animate-pulse" />
      </div>

      <Navbar isDark={isDark} toggleTheme={toggleTheme} />

      <main className="pt-20">
        <section className="py-20 bg-gradient-to-b from-pink-50 to-white dark:from-slate-900 dark:to-slate-950">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
            <button
              onClick={() => navigate(`/${lang}`)}
              className="flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 mb-8 transition-colors"
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
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-pink-100 dark:bg-pink-900/20 border border-pink-200 dark:border-pink-800 text-pink-700 dark:text-pink-300 text-sm font-semibold mb-6">
                  <Smartphone size={16} />
                  <span>{heroBadgeLabel}</span>
                </div>

                <h1 className="text-4xl md:text-6xl font-extrabold mb-6 text-slate-900 dark:text-white">
                  {heroTitlePrefix}{' '}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-fuchsia-500">
                    {heroTitleHighlight}
                  </span>
                </h1>

                <p className="text-xl text-slate-600 dark:text-slate-400 leading-relaxed mb-10">{heroDescription}</p>

                <div className="grid sm:grid-cols-3 gap-4">
                  {outcomes.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm"
                    >
                      <div className="flex items-center gap-2 text-pink-600 dark:text-pink-400 font-semibold mb-2">
                        {item.icon}
                        <span>{item.title}</span>
                      </div>
                      <div className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{item.desc}</div>
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
                    <img src={heroImageUrl} alt="TikTok Ads" className="w-full h-full object-cover" loading="lazy" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/10 to-transparent" />
                    <div className="absolute bottom-5 left-5 right-5">
                      <div className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-white/90 text-slate-900 font-semibold">
                        <Smartphone size={18} className="text-pink-600" />
                        <span>{heroOverlayBadgeLabel}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-pink-500/10 dark:bg-pink-500/5 blur-3xl rounded-full pointer-events-none" />
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
                  <div className="w-12 h-12 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center text-pink-600 dark:text-pink-400 mb-5">
                    {item.icon}
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{item.title}</h3>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 bg-slate-50 dark:bg-slate-900/40">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
            <div className="text-center mb-14">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-slate-900 dark:text-white">
                {processTitle}
              </h2>
              <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                {processSubtitle}
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {steps.map((step, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="p-6 rounded-2xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800"
                >
                  <div className="w-10 h-10 rounded-xl bg-pink-100 dark:bg-pink-900/20 text-pink-700 dark:text-pink-300 flex items-center justify-center font-extrabold mb-4">
                    {idx + 1}
                  </div>
                  <div className="text-lg font-bold text-slate-900 dark:text-white mb-2">{step.title}</div>
                  <div className="text-slate-600 dark:text-slate-400 leading-relaxed">{step.desc}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

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
                <div className="mt-4 h-1 w-24 rounded-full bg-gradient-to-r from-pink-600 to-fuchsia-500" />
              </header>

              <div className="space-y-6 text-lg leading-relaxed text-slate-700 dark:text-slate-300">
                <div
                  className="text-slate-700 dark:text-slate-300 [&_p]:mb-6 [&_p:last-child]:mb-0 [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:list-decimal [&_ol]:pl-6 [&_li]:mb-2 [&_strong]:text-slate-900 dark:[&_strong]:text-white [&_h2]:text-2xl [&_h2]:font-extrabold [&_h2]:text-slate-900 dark:[&_h2]:text-white [&_h2]:mt-8 [&_h2]:mb-4 [&_h3]:text-xl [&_h3]:font-bold [&_h3]:text-slate-900 dark:[&_h3]:text-white [&_h3]:mt-6 [&_h3]:mb-3"
                  dangerouslySetInnerHTML={{
                    __html: serviceDescriptionHtml,
                  }}
                />

                <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 p-7 shadow-sm">
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
                          <CheckCircle2 size={18} className="mt-0.5 flex-shrink-0 text-pink-600 dark:text-pink-400" />
                          <span className="text-slate-700 dark:text-slate-300">{item}</span>
                        </div>
                      ))}
                  </div>
                </div>

                <div className="rounded-3xl border border-pink-200/70 dark:border-pink-900/40 bg-pink-50/70 dark:bg-pink-950/20 p-6">
                  <div className="font-semibold text-slate-900 dark:text-white">
                    {isEn ? 'Suggestion' : 'Gợi ý triển khai'}
                  </div>
                  <p className="mt-2 text-slate-700 dark:text-slate-300">
                    {suggestionText ||
                      (isEn
                        ? 'Contact us for a free consultation about TikTok Ads.'
                        : 'Liên hệ với chúng tôi để được tư vấn miễn phí về TikTok Ads.')}
                  </p>
                </div>
              </div>
            </motion.article>
          </div>
        </section>

        <section className="py-20 bg-white dark:bg-slate-950">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
            <div className="rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-gradient-to-br from-pink-500/10 to-blue-500/10 dark:from-pink-500/10 dark:to-blue-500/5 p-8">
              <div className="grid lg:grid-cols-2 gap-8 items-start">
                <div>
                  <div className="text-slate-900 dark:text-white font-extrabold text-3xl mb-3">{consultationHeading}</div>
                  <div className="text-slate-600 dark:text-slate-400 leading-relaxed">{consultationIntro}</div>
                  <div className="mt-6 space-y-3">
                    {consultationPoints.map((item, idx) => (
                      <div key={idx} className="flex items-start gap-3">
                        <CheckCircle2 className="text-green-500 mt-0.5 flex-shrink-0" size={20} />
                        <span className="text-slate-700 dark:text-slate-300">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="lg:justify-self-end">
                  <button
                    onClick={() => navigate(`/${lang}`)}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-pink-600 hover:bg-pink-700 text-white font-bold rounded-full transition-all shadow-lg shadow-pink-500/25"
                  >
                    {consultationCta} <ArrowRight size={18} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};
export default TikTokDetail;
