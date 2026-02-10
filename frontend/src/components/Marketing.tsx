import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Facebook, TrendingUp, Target, Users, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getLang, getLocalizedSlug } from '@/utils/localization';

interface MarketingProps {
  data?: {
    marketingBadge?: string;
    marketingTitle?: string;
    marketingPlatforms?: Array<{ key: string; title?: string; description?: string; imageUrl?: string }>;
  };
}

const OptimizedImage = ({ src, alt, className }: { src: string; alt: string; className: string }) => {
  const [loaded, setLoaded] = useState(false);

  return (
    <>
      <div className={`absolute inset-0 bg-slate-200 dark:bg-slate-800 transition-opacity duration-500 ${loaded ? 'opacity-0' : 'opacity-100'}`} />
      <img
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
        onLoad={() => setLoaded(true)}
        className={`${className} transition-opacity duration-700 ${loaded ? 'opacity-100' : 'opacity-0'}`}
      />
    </>
  );
};

const Marketing: React.FC<MarketingProps> = ({ data }) => {
  const navigate = useNavigate();
  const lang = getLang();
  const tiktokPath = `/${lang}/${getLocalizedSlug('tiktok-ads', lang)}`;
  const facebookPath = `/${lang}/${getLocalizedSlug('facebook-ads', lang)}`;
  const googlePath = `/${lang}/${getLocalizedSlug('google-ads', lang)}`;
  const badge = data?.marketingBadge || "Digital Marketing";
  const title = data?.marketingTitle || "Bùng nổ doanh số đa nền tảng";
  const platforms = data?.marketingPlatforms || [];
  
  const defaultPlatform = { key: '', title: '', description: '', imageUrl: '' };
  const findPlatform = (key: string) => {
    const found = platforms.find(p => p.key === key);
    return found || { ...defaultPlatform, key };
  };

  const tiktok = findPlatform('tiktok');
  const facebook = findPlatform('facebook');
  const google = findPlatform('google');
  const viewDetailText = lang === 'en' ? 'View details' : 'Xem chi tiết';

  return (
    <section id="marketing" className="py-20 bg-white dark:bg-slate-950">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="flex flex-col md:flex-row items-end justify-between mb-12 gap-6">
            <div className="max-w-xl">
                <span className="text-blue-600 dark:text-blue-400 font-semibold tracking-wider uppercase text-sm">{badge}</span>
                <h2 className="text-3xl md:text-5xl font-bold mt-2 text-slate-900 dark:text-white">
                    {title}
                </h2>
            </div>
        </div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[300px]">
            
            {/* TikTok - Large Item */}
            <motion.div 
                initial={{opacity: 0, scale: 0.95}}
                whileInView={{opacity: 1, scale: 1}}
                viewport={{once: true}}
                className="md:col-span-2 row-span-1 rounded-3xl overflow-hidden relative group cursor-pointer bg-slate-100 dark:bg-slate-900"
                onClick={() => navigate(tiktokPath)}
            >
                <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/35 via-black/20 to-transparent group-hover:from-black/25 group-hover:via-black/10 transition-colors duration-500"></div>
                <OptimizedImage 
                    src={tiktok.imageUrl || "https://picsum.photos/seed/tiktok/800/400"} 
                    alt={tiktok.title || "TikTok Ads"} 
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 filter brightness-105" 
                />
                <div className="relative z-20 p-8 h-full flex flex-col justify-end">
                    <div className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center mb-4 border border-white/20">
                        <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.89 2.89 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/></svg>
                    </div>
                    <h3 className="text-3xl font-bold text-white mb-2">{tiktok.title || "TikTok Ads"}</h3>
                    <p className="text-slate-200 max-w-md">{tiktok.description || (lang === 'en' ? 'Reach millions of young customers with creative, viral short videos.' : 'Tiếp cận hàng triệu khách hàng trẻ với video ngắn sáng tạo và viral.')}</p>
                    <div className="flex items-center gap-2 mt-4 text-white/90 text-sm font-medium group-hover:text-white group-hover:gap-3 transition-all">
                        {viewDetailText} <ArrowRight size={16} />
                    </div>
                </div>
            </motion.div>

            {/* Facebook - Tall Item */}
            <motion.div 
                initial={{opacity: 0, scale: 0.95}}
                whileInView={{opacity: 1, scale: 1}}
                viewport={{once: true}}
                transition={{delay: 0.1}}
                className="md:col-span-1 row-span-2 rounded-3xl overflow-hidden relative group cursor-pointer shadow-lg hover:shadow-xl transition-shadow bg-slate-100 dark:bg-slate-900"
                onClick={() => navigate(facebookPath)}
            >
                <OptimizedImage 
                    src={facebook.imageUrl || "https://picsum.photos/seed/facebook/600/800"} 
                    alt={facebook.title || "Facebook Ads"} 
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 filter brightness-105" 
                />
                <div className="absolute inset-0 z-10 bg-gradient-to-t from-blue-900/30 via-blue-900/10 to-transparent group-hover:from-blue-900/20 transition-colors duration-500"></div>
                <div className="relative z-20 p-8 h-full flex flex-col">
                    <Facebook className="text-white w-12 h-12 mb-auto" />
                    <div>
                        <h3 className="text-3xl font-bold text-white mb-2">{facebook.title || "Facebook Ads"}</h3>
                        <p className="text-slate-200 mb-6">{facebook.description || (lang === 'en' ? 'Precisely target audiences and optimize conversion costs.' : 'Target đối tượng chuẩn xác, tối ưu chi phí chuyển đổi.')}</p>
                        <ul className="space-y-3 text-white/90">
                            <li className="flex items-center gap-2"><Target size={16} /> {lang === 'en' ? 'Deep targeting' : 'Nhắm mục tiêu sâu'}</li>
                            <li className="flex items-center gap-2"><Users size={16} /> {lang === 'en' ? 'Effective remarketing' : 'Remarketing hiệu quả'}</li>
                            <li className="flex items-center gap-2"><TrendingUp size={16} /> {lang === 'en' ? 'Boost brand awareness' : 'Tăng nhận diện thương hiệu'}</li>
                        </ul>
                        <div className="flex items-center gap-2 mt-6 text-white/90 text-sm font-medium group-hover:text-white group-hover:gap-3 transition-all">
                            {viewDetailText} <ArrowRight size={16} />
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Google - Standard Item with image background */}
            <motion.div 
                initial={{opacity: 0, scale: 0.95}}
                whileInView={{opacity: 1, scale: 1}}
                viewport={{once: true}}
                transition={{delay: 0.2}}
                className="md:col-span-2 row-span-1 rounded-3xl overflow-hidden relative group cursor-pointer border border-slate-200 dark:border-slate-800 shadow-lg hover:shadow-xl transition-shadow bg-slate-100 dark:bg-slate-900"
                onClick={() => navigate(googlePath)}
            >
                <OptimizedImage 
                    src={google.imageUrl || "https://picsum.photos/seed/google/800/400"} 
                    alt={google.title || "Google Ads"} 
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 filter brightness-110" 
                />
                <div className="absolute inset-0 z-10 bg-gradient-to-t from-white/55 via-white/30 to-transparent dark:from-black/45 dark:via-black/25 dark:to-transparent"></div>
                <div className="relative z-20 p-8 flex flex-col justify-between h-full bg-transparent">
                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center text-blue-600 dark:text-blue-400">
                        <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"/>
                        </svg>
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1">{google.title || "Google Ads"}</h3>
                        <p className="text-slate-700 dark:text-slate-300 text-sm">{google.description || (lang === 'en' ? 'Appear right when customers search for your services.' : 'Xuất hiện ngay khi khách hàng tìm kiếm.')}</p>
                        <div className="mt-4 flex items-center gap-2 text-blue-600 dark:text-blue-400 text-sm font-medium group-hover:gap-3 transition-all">
                            {viewDetailText} <ArrowRight size={16} />
                        </div>
                    </div>
                </div>
            </motion.div>


        </div>
      </div>
    </section>
  );
};

export default Marketing;
