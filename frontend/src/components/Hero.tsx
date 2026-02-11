import React from 'react';
import { ArrowRight } from 'lucide-react';
import { getLang } from '@/utils/localization';

type HeroProps = {
  data?: {
    badgeText?: string;
    titlePrefix?: string;
    titleHighlight?: string;
    titleSuffix?: string;
    description?: string;
    heroImageUrl?: string;
    ctaPrimaryText?: string;
    ctaSecondaryText?: string;
    benefit1?: string;
    benefit2?: string;
    benefit3?: string;
  };
};

const Hero: React.FC<HeroProps> = ({ data }) => {
  const lang = getLang();
  const badge = data?.badgeText || (lang === 'en' ? 'Digital Solutions' : 'Giải pháp số');
  const prefix = data?.titlePrefix || (lang === 'en' ? 'We build' : 'Chúng tôi xây dựng');
  const highlight = data?.titleHighlight || 'Web & Marketing';
  const suffix = data?.titleSuffix || (lang === 'en' ? 'for growth' : 'cho tăng trưởng');
  const desc =
    data?.description ||
    (lang === 'en'
      ? 'Professional websites and full-funnel marketing to scale your business.'
      : 'Website chuyên nghiệp và marketing toàn phễu giúp doanh nghiệp tăng trưởng.');
  const img = data?.heroImageUrl || '';
  const ctaPrimary = data?.ctaPrimaryText || (lang === 'en' ? 'Get a Quote' : 'Nhận báo giá');
  const ctaSecondary = data?.ctaSecondaryText || (lang === 'en' ? 'See Portfolio' : 'Xem dự án');
  const b1 = data?.benefit1 || (lang === 'en' ? 'Fast delivery' : 'Triển khai nhanh');
  const b2 = data?.benefit2 || (lang === 'en' ? 'SEO-ready' : 'Chuẩn SEO');
  const b3 = data?.benefit3 || (lang === 'en' ? 'Conversion focused' : 'Tối ưu chuyển đổi');

  return (
    <section className="relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <span className="inline-block py-1 px-3 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-sm font-semibold mb-4">
              {badge}
            </span>
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">
              <span>{prefix} </span>
              <span className="text-blue-600 dark:text-blue-400">{highlight} </span>
              <span>{suffix}</span>
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-400 mb-8">{desc}</p>
            <div className="flex flex-wrap gap-3">
              <a
                href="/lien-he"
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl transition"
              >
                {ctaPrimary}
                <ArrowRight className="w-4 h-4" />
              </a>
              <a
                href="/danh-muc-website"
                className="inline-flex items-center gap-2 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white px-4 py-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition"
              >
                {ctaSecondary}
              </a>
            </div>
            <div className="mt-6 flex flex-wrap gap-4 text-slate-700 dark:text-slate-300">
              <div className="inline-flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="text-sm">{b1}</span>
              </div>
              <div className="inline-flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-amber-500" />
                <span className="text-sm">{b2}</span>
              </div>
              <div className="inline-flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-blue-500" />
                <span className="text-sm">{b3}</span>
              </div>
            </div>
          </div>
          <div className="relative">
            {img ? (
              <img
                src={img}
                alt="Hero"
                className="w-full rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm"
                loading="lazy"
              />
            ) : (
              <div className="w-full h-64 rounded-2xl bg-slate-100 dark:bg-slate-800" />
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;

