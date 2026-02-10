import { useQuery } from '@tanstack/react-query';
import { api } from '@/utils/api';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Search, TrendingUp, BarChart3, FileText, Target, Link2, CheckCircle2, ArrowRight } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';
import { getLang } from '@/utils/localization';
import { useDarkMode } from '@/hooks/useDarkMode';

const SeoDetail: React.FC = () => {
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
    queryKey: ['seo-overall-content', lang],
    queryFn: () => api.get<any>('/api/pages/seo-overall', { headers: { 'Accept-Language': lang } }),
    select: (data) => ({
      heroTitlePrefix: data.heroTitlePrefix || 'Dịch vụ SEO Tổng Thể',
      heroTitleHighlight: data.heroTitleHighlight || 'Lên Top Bền Vững',
      heroDescription:
        data.heroDescription ||
        'Xây dựng tăng trưởng tự nhiên dựa trên chiến lược từ khóa, nội dung và tối ưu kỹ thuật. Tập trung chuyển đổi, đo lường rõ ràng và tối ưu liên tục để tạo kết quả bền vững.',
      serviceDescriptionHtml:
        data.serviceDescriptionHtml ||
        '<p>Xây dựng tăng trưởng tự nhiên dựa trên chiến lược từ khóa, nội dung và tối ưu kỹ thuật. Tập trung chuyển đổi, đo lường rõ ràng và tối ưu liên tục để tạo kết quả bền vững.</p>',
      suitableFor: data.suitableFor || '',
      suggestionText: data.suggestionText || '',
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
    }),
  });

  const isEn = lang === 'en';
  
  const seoTitle = (isEn ? content?.seoTitleEn : content?.seoTitle) || content?.seoTitle || 'Dịch vụ SEO Tổng Thể - Victor Software';
  const seoDescription = (isEn ? content?.seoDescriptionEn : content?.seoDescription) || content?.seoDescription || '';
  const seoKeywords = (isEn ? content?.seoKeywordsEn : content?.seoKeywords) || content?.seoKeywords || '';

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": seoTitle,
    "description": seoDescription,
    "provider": {
      "@type": "Organization",
      "name": "Victor Software",
<<<<<<< HEAD:src/pages/SeoDetail.tsx
      "url": "https://victorsoftwave.com"
=======
      "url": "https://www.victorsoftwave.com"
>>>>>>> 539f2cc (Update_domain_and_backend_files):frontend/src/pages/SeoDetail.tsx
    },
    "serviceType": "Search Engine Optimization",
    "areaServed": "Global",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "VND",
      "availability": "https://schema.org/InStock"
    }
  };

  const outcomes = isEn
    ? [
        { icon: <TrendingUp size={20} />, title: 'Traffic Growth', desc: 'Sustainable organic traffic increase month over month.' },
        { icon: <Target size={20} />, title: 'Right Audience', desc: 'Focus on converting keywords, not just volume.' },
        { icon: <BarChart3 size={20} />, title: 'Clear Measurement', desc: 'Transparent reporting on KPIs: rankings, traffic, leads.' },
      ]
    : [
        { icon: <TrendingUp size={20} />, title: 'Tăng trưởng traffic', desc: 'Tăng lượng truy cập tự nhiên bền vững theo tháng.' },
        { icon: <Target size={20} />, title: 'Đúng khách hàng', desc: 'Tập trung từ khóa chuyển đổi, không chạy theo số lượng.' },
        { icon: <BarChart3 size={20} />, title: 'Đo lường rõ ràng', desc: 'Báo cáo minh bạch theo KPI: top, traffic, leads.' },
      ];

  const deliverables = isEn
    ? [
        { icon: <Search size={20} />, title: 'Audit & Keyword Research', desc: 'Market and competitors analysis, keyword set by intent.' },
        { icon: <FileText size={20} />, title: 'Content Strategy', desc: 'Topic clustering, content plan, and conversion optimization.' },
        { icon: <Link2 size={20} />, title: 'On-page & Technical SEO', desc: 'Structure, schema, speed, indexing, and UX optimization.' },
      ]
    : [
        { icon: <Search size={20} />, title: 'Audit & nghiên cứu từ khóa', desc: 'Phân tích thị trường, đối thủ, bộ từ khóa theo intent.' },
        { icon: <FileText size={20} />, title: 'Chiến lược nội dung', desc: 'Topic cluster, kế hoạch bài viết và tối ưu chuyển đổi.' },
        { icon: <Link2 size={20} />, title: 'Onpage & technical SEO', desc: 'Tối ưu cấu trúc, schema, tốc độ, index và trải nghiệm.' },
      ];

  const processSteps = isEn
    ? [
        { title: 'Discovery & Goals', desc: 'Gather industry insights, products, and define KPIs.' },
        { title: 'Execution Plan', desc: 'Monthly SEO roadmap, prioritize quick wins and sustainability.' },
        { title: 'Optimization & Content', desc: 'Content writing, technical optimization, improve converting landing pages.' },
        { title: 'Reporting & Scaling', desc: 'Periodic reports, keyword expansion and conversion landing pages.' },
      ]
    : [
        { title: 'Khảo sát & mục tiêu', desc: 'Thu thập thông tin ngành, sản phẩm, định hướng KPI.' },
        { title: 'Kế hoạch triển khai', desc: 'Lộ trình SEO theo tháng, ưu tiên quick-win và bền vững.' },
        { title: 'Tối ưu & nội dung', desc: 'Viết bài, tối ưu kỹ thuật, cải thiện trang đích chuyển đổi.' },
        { title: 'Báo cáo & mở rộng', desc: 'Báo cáo định kỳ, mở rộng bộ từ khóa và landing chuyển đổi.' },
      ];

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
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-orange-500/15 rounded-full blur-[100px] animate-pulse" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-[100px] animate-pulse" />
        </div>

        <Navbar isDark={isDark} toggleTheme={toggleTheme} />

        <main className="pt-20">
          <section className="py-20 bg-gradient-to-b from-orange-50 to-white dark:from-slate-900 dark:to-slate-950">
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
        structuredData={structuredData}
      />
      <div className="fixed inset-0 pointer-events-none z-[-1]">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-orange-500/15 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-[100px] animate-pulse" />
      </div>

      <Navbar isDark={isDark} toggleTheme={toggleTheme} />

      <main className="pt-20">
        <section className="py-20 bg-gradient-to-b from-orange-50 to-white dark:from-slate-900 dark:to-slate-950">
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
              {loading ? (
                <div className="animate-pulse">
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-200 dark:bg-slate-800 mb-6 w-32"></div>
                  <div className="h-12 bg-slate-200 dark:bg-slate-800 rounded mb-4 w-full"></div>
                  <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded mb-3 w-5/6"></div>
                  <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded mb-3 w-4/6"></div>
                </div>
              ) : (
                <>
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-100 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 text-orange-700 dark:text-orange-300 text-sm font-semibold mb-6">
                    <Search size={16} />
                    <span>{lang === 'en' ? 'SEO Overall Service' : 'Dịch vụ SEO Tổng Thể'}</span>
                  </div>

                  <h1 className="text-4xl md:text-6xl font-extrabold mb-6 text-slate-900 dark:text-white">
                    {lang === 'en'
                      ? content?.heroTitlePrefixEn || 'SEO Overall Service'
                      : content?.heroTitlePrefix || 'SEO Tổng Thể'}{' '}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-amber-500">
                      {lang === 'en'
                        ? content?.heroTitleHighlightEn || 'Sustainable Growth'
                        : content?.heroTitleHighlight || 'Lên Top Bền Vững'}
                    </span>
                  </h1>

                  <p className="text-xl text-slate-600 dark:text-slate-400 leading-relaxed mb-10">
                    {lang === 'en'
                      ? content?.heroDescriptionEn ||
                        'Sustainable growth based on keyword strategy, content, and technical optimization. Focus on conversion, clear measurement, and continuous optimization for lasting results.'
                      : content?.heroDescription ||
                        'Xây dựng tăng trưởng tự nhiên dựa trên chiến lược từ khóa, nội dung và tối ưu kỹ thuật. Tập trung chuyển đổi, đo lường rõ ràng và tối ưu liên tục để tạo kết quả bền vững.'}
                  </p>
                </>
              )}

              <div className="grid sm:grid-cols-3 gap-4">
                {outcomes.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm"
                  >
                    <div className="flex items-center gap-2 text-orange-600 dark:text-orange-400 font-semibold mb-2">
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
                {isEn ? 'What Do You Get?' : 'Bạn nhận được gì?'}
              </h2>
              <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                {isEn
                  ? 'An overall SEO package from strategy to execution, optimization, and measurement.'
                  : 'Gói SEO tổng thể đi từ chiến lược đến triển khai, tối ưu và đo lường.'}
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
                  <div className="w-12 h-12 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center text-orange-600 dark:text-orange-400 mb-5">
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
                {isEn ? 'Implementation Process' : 'Quy trình triển khai'}
              </h2>
              <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                {isEn
                  ? 'Transparent stages to ensure effectiveness and focus on the right priorities.'
                  : 'Minh bạch từng giai đoạn để đảm bảo hiệu quả và tối ưu đúng trọng tâm.'}
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {processSteps.map((step, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="p-6 rounded-2xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800"
                >
                  <div className="w-10 h-10 rounded-xl bg-orange-100 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300 flex items-center justify-center font-extrabold mb-4">
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
            <div className="grid lg:grid-cols-2 gap-10 items-start">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold mb-4 text-slate-900 dark:text-white">
                  {isEn ? 'Commitment & Transparency' : 'Cam kết & minh bạch'}
                </h2>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-8">
                  {isEn
                    ? 'We do not promise “top rankings in 7 days”. Instead, we execute based on data, optimize technical and content, ensuring sustainable growth and measurable results.'
                    : 'Chúng tôi không hứa hẹn “lên top trong 7 ngày”. Thay vào đó, triển khai theo dữ liệu, tối ưu kỹ thuật và nội dung, đảm bảo tăng trưởng bền vững và đo lường được.'}
                </p>

                <div className="space-y-4">
                  {(isEn
                    ? [
                        'Clear KPIs by industry: rankings, traffic, conversions',
                        'Periodic reporting and transparency on completed work',
                        'Continuous optimization based on data and user behavior',
                        'Advice to improve landing pages for higher conversions',
                      ]
                    : [
                        'Bộ KPI rõ ràng theo ngành: top, traffic, chuyển đổi',
                        'Báo cáo định kỳ, minh bạch các hạng mục đã làm',
                        'Tối ưu liên tục dựa trên dữ liệu và hành vi người dùng',
                        'Tư vấn cải thiện trang đích để tăng tỉ lệ chuyển đổi',
                      ]
                  ).map((item, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <CheckCircle2 className="text-green-500 mt-0.5 flex-shrink-0" size={20} />
                      <span className="text-slate-700 dark:text-slate-300">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-gradient-to-br from-orange-500/10 to-blue-500/10 dark:from-orange-500/10 dark:to-blue-500/5 p-8">
                <div className="text-slate-900 dark:text-white font-extrabold text-2xl mb-2">
                  {isEn ? 'Get a Free SEO Consultation' : 'Nhận tư vấn SEO miễn phí'}
                </div>
                <div className="text-slate-600 dark:text-slate-400 mb-6">
                  {isEn
                    ? 'Send your website and industry; we will do a quick audit and propose a suitable roadmap.'
                    : 'Gửi website và ngành hàng, chúng tôi sẽ audit nhanh và đề xuất lộ trình phù hợp.'}
                </div>
                <button
                  onClick={() => navigate(`/${lang}`)}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-full transition-all shadow-lg shadow-orange-500/25"
                >
                  {isEn ? 'Contact Us' : 'Liên hệ tư vấn'} <ArrowRight size={18} />
                </button>
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
                  {lang === 'en' ? 'Service Description' : 'Mô tả dịch vụ'}
                </h2>
                <div className="mt-4 h-1 w-24 rounded-full bg-gradient-to-r from-orange-600 to-amber-500" />
              </header>

              <div className="space-y-6 text-lg leading-relaxed text-slate-700 dark:text-slate-300">
                <div
                  className="text-slate-700 dark:text-slate-300 [&_p]:mb-6 [&_p:last-child]:mb-0 [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:list-decimal [&_ol]:pl-6 [&_li]:mb-2 [&_strong]:text-slate-900 dark:[&_strong]:text-white [&_h2]:text-2xl [&_h2]:font-extrabold [&_h2]:text-slate-900 dark:[&_h2]:text-white [&_h2]:mt-8 [&_h2]:mb-4 [&_h3]:text-xl [&_h3]:font-bold [&_h3]:text-slate-900 dark:[&_h3]:text-white [&_h3]:mt-6 [&_h3]:mb-3"
                  dangerouslySetInnerHTML={{
                    __html: (lang === 'en' ? content?.serviceDescriptionHtmlEn : content?.serviceDescriptionHtml) || '',
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
                          <CheckCircle2 size={18} className="mt-0.5 flex-shrink-0 text-orange-600 dark:text-orange-400" />
                          <span className="text-slate-700 dark:text-slate-300">{item}</span>
                        </div>
                      ))}
                  </div>
                </div>

                <div className="rounded-3xl border border-orange-200/70 dark:border-orange-900/40 bg-orange-50/70 dark:bg-orange-950/20 p-6">
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
      </main>

      <Footer />
    </div>
  );
};

export default SeoDetail;
