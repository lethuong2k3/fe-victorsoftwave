import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ShieldCheck, Wrench, RefreshCw, Lock, Activity, Headphones, CheckCircle2, ArrowRight } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';
import { getLang } from '@/utils/localization';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/utils/api';
import { useDarkMode } from '@/hooks/useDarkMode';

const WebsiteCareDetail: React.FC = () => {
  const { isDark, toggleTheme } = useDarkMode();
  const navigate = useNavigate();
  const [lang, setLang] = useState<'en' | 'vi'>(getLang());

  type Content = {
    heroTitlePrefix: string;
    heroTitleHighlight: string;
    heroDescription: string;
    serviceDescriptionHtml: string;
    suitableFor: string;
    suggestionText: string;
    heroTitlePrefixEn: string;
    heroTitleHighlightEn: string;
    heroDescriptionEn: string;
    serviceDescriptionHtmlEn: string;
    suitableForEn: string;
    suggestionTextEn: string;
    seoTitle?: string;
    seoTitleEn?: string;
    seoDescription?: string;
    seoDescriptionEn?: string;
    seoKeywords?: string;
    seoKeywordsEn?: string;
  };
  
  const { data: content, isLoading: loading } = useQuery({
    queryKey: ['website-care-content', lang],
    queryFn: () => api.get<any>('/api/pages/website-care', {
      headers: { 'Accept-Language': lang }
    }),
    select: (data) => ({
      heroTitlePrefix: data.heroTitlePrefix || 'Chăm sóc Website',
      heroTitleHighlight: data.heroTitleHighlight || 'Ổn Định & An Toàn',
      heroDescription: data.heroDescription || 'Duy trì website hoạt động ổn định, bảo mật và tối ưu hiệu suất. Hỗ trợ cập nhật nội dung và xử lý sự cố nhanh, giúp bạn tập trung vào kinh doanh.',
      serviceDescriptionHtml: data.serviceDescriptionHtml || '',
      suitableFor: data.suitableFor || '',
      suggestionText: data.suggestionText || '',
      heroTitlePrefixEn: data.heroTitlePrefixEn || 'Website Care',
      heroTitleHighlightEn: data.heroTitleHighlightEn || 'Stable & Secure',
      heroDescriptionEn: data.heroDescriptionEn || 'Keep your website stable, secure, and fast with ongoing maintenance and support.',
      serviceDescriptionHtmlEn: data.serviceDescriptionHtmlEn || '',
      suitableForEn: data.suitableForEn || '',
      suggestionTextEn: data.suggestionTextEn || '',
      seoTitle: data.seoTitle,
      seoTitleEn: data.seoTitleEn,
      seoDescription: data.seoDescription,
      seoDescriptionEn: data.seoDescriptionEn,
      seoKeywords: data.seoKeywords,
      seoKeywordsEn: data.seoKeywordsEn,
    })
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
    (isEn ? 'Website Care Services - Victor Software' : 'Chăm sóc Website - Victor Software');
  const seoDescription =
    (isEn ? content?.seoDescriptionEn : content?.seoDescription) || content?.seoDescription || '';
  const seoKeywords =
    (isEn ? content?.seoKeywordsEn : content?.seoKeywords) ||
    content?.seoKeywords ||
    '';

  const highlights = [
    { icon: <Activity size={20} />, title: 'Giám sát vận hành', desc: 'Theo dõi uptime, lỗi, tốc độ và cảnh báo sớm.' },
    { icon: <Lock size={20} />, title: 'Bảo mật định kỳ', desc: 'Cập nhật bảo mật, quét mã độc và vá lỗ hổng.' },
    { icon: <RefreshCw size={20} />, title: 'Cập nhật nội dung', desc: 'Chỉnh sửa banner, bài viết, landing theo yêu cầu.' },
  ];

  const services = [
    { icon: <Wrench size={20} />, title: 'Bảo trì & fix lỗi', desc: 'Xử lý lỗi giao diện, chức năng và tối ưu trải nghiệm.' },
    { icon: <ShieldCheck size={20} />, title: 'Tối ưu hiệu năng', desc: 'Tối ưu tốc độ, cache, hình ảnh và các chỉ số quan trọng.' },
    { icon: <Headphones size={20} />, title: 'Hỗ trợ kỹ thuật', desc: 'Hỗ trợ nhanh qua các kênh liên hệ, theo SLA.' },
  ];

  const included = [
    'Cập nhật hệ thống & plugin (nếu có)',
    'Sao lưu định kỳ và khôi phục khi cần',
    'Kiểm tra bảo mật cơ bản, hạn chế rủi ro',
    'Tối ưu ảnh/nội dung giúp tải nhanh hơn',
    'Báo cáo công việc theo tuần/tháng',
  ];

  const plans = [
    {
      name: 'Cơ Bản',
      price: '1.500.000đ/tháng',
      desc: 'Phù hợp website giới thiệu, ít thay đổi.',
      features: ['Bảo trì định kỳ', 'Sao lưu hàng tuần', 'Fix lỗi nhỏ', 'Hỗ trợ trong giờ hành chính'],
    },
    {
      name: 'Tiêu Chuẩn',
      price: '3.000.000đ/tháng',
      desc: 'Phù hợp website doanh nghiệp vận hành thường xuyên.',
      features: ['Giám sát uptime', 'Sao lưu 2 lần/tuần', 'Tối ưu tốc độ cơ bản', 'Hỗ trợ ưu tiên'],
      featured: true,
    },
    {
      name: 'Nâng Cao',
      price: '5.000.000đ/tháng',
      desc: 'Phù hợp website bán hàng/landing chạy chiến dịch.',
      features: ['Giám sát & cảnh báo', 'Sao lưu hằng ngày', 'Tối ưu chuyên sâu', 'Hỗ trợ nhanh theo SLA'],
    },
  ];

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
    "serviceType": "Website Maintenance and Care",
    "areaServed": "Global",
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Website Care Plans",
      "itemListElement": plans.map((plan, index) => ({
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": plan.name,
          "description": plan.desc
        },
        "price": plan.price.replace(/\D/g, '') || "0",
        "priceCurrency": "VND"
      }))
    }
  };

  if (loading && !content) {
    return (
      <div className="min-h-screen relative overflow-x-hidden selection:bg-accent/30">
        <SEO
          title={seoTitle}
          description={seoDescription}
          keywords={seoKeywords}
          type="article"
          structuredData={structuredData}
        />
        <div className="fixed inset-0 pointer-events-none z-[-1]">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-teal-500/15 rounded-full blur-[100px] animate-pulse" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-[100px] animate-pulse" />
        </div>

        <Navbar isDark={isDark} toggleTheme={toggleTheme} />

        <main className="pt-20">
          <section className="py-20 bg-gradient-to-b from-teal-50 to-white dark:from-slate-900 dark:to-slate-950">
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

  return (
    <div className="min-h-screen relative overflow-x-hidden selection:bg-accent/30">
      <SEO
        title={seoTitle}
        description={seoDescription}
        keywords={seoKeywords}
        type="article"
      />
      <div className="fixed inset-0 pointer-events-none z-[-1]">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-teal-500/15 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-[100px] animate-pulse" />
      </div>

      <Navbar isDark={isDark} toggleTheme={toggleTheme} />

      <main className="pt-20">
        <section className="py-20 bg-gradient-to-b from-teal-50 to-white dark:from-slate-900 dark:to-slate-950">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
            <button
              onClick={() => navigate(`/`)}
              className="flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 mb-8 transition-colors"
            >
              <ArrowLeft size={20} />
              <span>{lang === 'en' ? 'Back to Home' : 'Quay lại trang chủ'}</span>
            </button>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-4xl"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-teal-100 dark:bg-teal-900/20 border border-teal-200 dark:border-teal-800 text-teal-700 dark:text-teal-300 text-sm font-semibold mb-6">
                <ShieldCheck size={16} />
                <span>{lang === 'en' ? 'Website Care' : 'Chăm sóc Website'}</span>
              </div>

              <h1 className="text-4xl md:text-6xl font-extrabold mb-6 text-slate-900 dark:text-white">
                {(lang === 'en' ? content?.heroTitlePrefixEn : content?.heroTitlePrefix) || (lang === 'en' ? 'Website Care' : 'Chăm Sóc Website')}{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-cyan-500">
                  {(lang === 'en' ? content?.heroTitleHighlightEn : content?.heroTitleHighlight) ||
                    (lang === 'en' ? 'Stable & Secure' : 'Ổn Định & An Toàn')}
                </span>
              </h1>

              <p className="text-xl text-slate-600 dark:text-slate-400 leading-relaxed mb-10">
                {(lang === 'en' ? content?.heroDescriptionEn : content?.heroDescription) ||
                  (lang === 'en'
                    ? 'Keep your website stable, secure, and fast with ongoing maintenance and support.'
                    : 'Duy trì website hoạt động ổn định, bảo mật và tối ưu hiệu suất. Hỗ trợ cập nhật nội dung và xử lý sự cố nhanh, giúp bạn tập trung vào kinh doanh.')}
              </p>

              <div className="grid sm:grid-cols-3 gap-4">
                {highlights.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm"
                  >
                    <div className="flex items-center gap-2 text-teal-600 dark:text-teal-400 font-semibold mb-2">
                      {item.icon}
                      <span>{item.title}</span>
                    </div>
                    <div className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{item.desc}</div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        

        <section className="py-20 bg-white dark:bg-slate-950">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
            <div className="text-center mb-14">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-slate-900 dark:text-white">
                {lang === 'en' ? 'Care Activities' : 'Hạng mục chăm sóc'}
              </h2>
              <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                {lang === 'en'
                  ? 'Essential activities to keep your website stable and reduce risks.'
                  : 'Các hạng mục thiết yếu để website chạy ổn định và hạn chế rủi ro.'}
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {services.map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="p-8 rounded-2xl bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800"
                >
                  <div className="w-12 h-12 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center text-teal-600 dark:text-teal-400 mb-5">
                    {item.icon}
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{item.title}</h3>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Removed duplicated "What Is Included?" section to avoid repetition, covered above */}

        <section className="py-20 bg-white dark:bg-slate-950">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
            <div className="text-center mb-14">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-slate-900 dark:text-white">
                {lang === 'en' ? 'Reference Plans' : 'Gói dịch vụ tham khảo'}
              </h2>
              <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                {lang === 'en'
                  ? 'Customizable based on operational needs and update frequency.'
                  : 'Có thể tùy chỉnh theo nhu cầu vận hành và mức độ cập nhật.'}
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {plans.map((plan, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className={[
                    'rounded-3xl border p-8 bg-white dark:bg-slate-950',
                    plan.featured
                      ? 'border-teal-300 dark:border-teal-700 shadow-2xl'
                      : 'border-slate-200 dark:border-slate-800',
                  ].join(' ')}
                >
                  <div className="text-slate-900 dark:text-white font-extrabold text-2xl mb-2">{plan.name}</div>
                  <div className="text-teal-700 dark:text-teal-300 font-extrabold text-3xl mb-2">{plan.price}</div>
                  <div className="text-slate-600 dark:text-slate-400 mb-6">{plan.desc}</div>
                  <div className="space-y-3 mb-8">
                    {plan.features.map((feature, fIdx) => (
                      <div key={fIdx} className="flex items-start gap-3">
                        <CheckCircle2 className="text-green-500 mt-0.5 flex-shrink-0" size={18} />
                        <span className="text-slate-700 dark:text-slate-300">{feature}</span>
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={() => navigate(`/`)}
                    className={[
                      'w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full font-bold transition-all',
                      plan.featured
                        ? 'bg-teal-600 hover:bg-teal-700 text-white shadow-lg shadow-teal-500/25'
                        : 'border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-900',
                    ].join(' ')}
                  >
                    {lang === 'en' ? 'Get a Quote' : 'Nhận báo giá'} <ArrowRight size={18} />
                  </button>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>

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
                {lang === 'en' ? 'Service Description' : 'Mô tả dịch vụ'}
              </h2>
              <div className="mt-4 h-1 w-24 rounded-full bg-gradient-to-r from-teal-600 to-cyan-500" />
            </header>

            <div className="space-y-6 text-lg leading-relaxed text-slate-700 dark:text-slate-300">
              <div
                className="text-slate-700 dark:text-slate-300 [&_p]:mb-6 [&_p:last-child]:mb-0 [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:list-decimal [&_ol]:pl-6 [&_li]:mb-2 [&_strong]:text-slate-900 dark:[&_strong]:text-white [&_h2]:text-2xl [&_h2]:font-extrabold [&_h2]:text-slate-900 dark:[&_h2]:text-white [&_h2]:mt-8 [&_h2]:mb-4 [&_h3]:text-xl [&_h3]:font-bold [&_h3]:text-slate-900 dark:[&_h3]:text-white [&_h3]:mt-6 [&_h3]:mb-3"
                dangerouslySetInnerHTML={{
                  __html:
                    (lang === 'en' ? content?.serviceDescriptionHtmlEn : content?.serviceDescriptionHtml) || '',
                }}
              />

              <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 p-7 shadow-sm">
                <div className="text-slate-900 dark:text-white font-extrabold text-xl">
                  {lang === 'en' ? 'Suitable For' : 'Phù hợp cho'}
                </div>
                <div className="mt-5 space-y-3">
                  {((lang === 'en' ? content?.suitableForEn : content?.suitableFor) || '')
                    .replace(/\r\n/g, '\n')
                    .split('\n')
                    .map((s: string) => s.trim())
                    .filter(Boolean)
                    .map((item: string, idx: number) => (
                      <div key={idx} className="flex items-start gap-3">
                        <CheckCircle2 size={18} className="mt-0.5 flex-shrink-0 text-teal-600 dark:text-teal-400" />
                        <span className="text-slate-700 dark:text-slate-300">{item}</span>
                      </div>
                    ))}
                </div>
              </div>

              <div className="rounded-3xl border border-teal-200/70 dark:border-teal-900/40 bg-teal-50/70 dark:bg-teal-950/20 p-6">
                <div className="font-semibold text-slate-900 dark:text-white">
                  {lang === 'en' ? 'Suggestion' : 'Gợi ý triển khai'}
                </div>
                <p className="mt-2 text-slate-700 dark:text-slate-300">
                  {(lang === 'en' ? content?.suggestionTextEn : content?.suggestionText) ||
                    (lang === 'en'
                      ? 'Contact us for a free consultation.'
                      : 'Liên hệ với chúng tôi để được tư vấn miễn phí.')}
                </p>
              </div>
            </div>
          </motion.article>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default WebsiteCareDetail;
