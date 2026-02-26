import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { Layout, Search, ShieldCheck, ArrowRight } from 'lucide-react';
<<<<<<< HEAD
import { getLocalizedSlug, getSlugKey } from '@/utils/localization';
=======
import { getLocalizedSlug, getSlugKey } from '../utils/localization';
>>>>>>> b2df92e (first commit)

const services = [
  {
    id: 'web-design',
    icon: <Layout className="w-8 h-8 text-blue-500" />,
    title: "Thiết kế Website",
    description: "Website chuẩn SEO, giao diện độc quyền UX/UI, tương thích mọi thiết bị di động.",
    color: "bg-blue-500/10 border-blue-500/20",
    link: "/thiet-ke-website"
  },
  {
    id: 'seo',
    icon: <Search className="w-8 h-8 text-orange-500" />,
    title: "Dịch vụ SEO Tổng Thể",
    description: "Đưa website lên top Google bền vững với chiến lược từ khóa thông minh và content chất lượng.",
    color: "bg-orange-500/10 border-orange-500/20",
    link: "/seo-tong-the"
  },
  {
    id: 'website-care',
    icon: <ShieldCheck className="w-8 h-8 text-teal-500" />,
    title: "Chăm sóc Website",
    description: "Bảo trì định kỳ, cập nhật nội dung, fix lỗi và bảo mật hệ thống 24/7.",
    color: "bg-teal-500/10 border-teal-500/20",
    link: "/cham-soc-website"
  }
];

interface ServicesProps {
  data?: {
    servicesTitle?: string;
    servicesDescription?: string;
    servicesList?: Array<{
      id: string;
      title: string;
      description: string;
      link: string;
    }>;
  };
}

const Services: React.FC<ServicesProps> = ({ data }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const getCurrentLang = (): 'vi' | 'en' => {
    const seg = (location.pathname.split('/')[1] || '').toLowerCase();
    if (seg === 'vi' || seg === 'en') return seg as 'vi' | 'en';
    const stored = (localStorage.getItem('lang') || localStorage.getItem('language') || '').toLowerCase();
    if (stored === 'en' || stored === 'vi') return stored as 'vi' | 'en';
    return (navigator.language || '').toLowerCase().startsWith('en') ? 'en' : 'vi';
  };
  
  const title = data?.servicesTitle || "Dịch vụ của chúng tôi";
  const description = data?.servicesDescription || "Giải pháp công nghệ toàn diện giúp doanh nghiệp của bạn vận hành hiệu quả và tăng trưởng mạnh mẽ trên môi trường số.";

  const displayServices = services.map((def, index) => {
    const override = data?.servicesList?.[index];
    if (override) {
      return {
        ...def,
        title: override.title,
        description: override.description,
        link: override.link
      };
    }
    return def;
  });

  const handleViewDetail = (link: string) => {
    if (link !== '#') {
      const lang = getCurrentLang();
      const cleanLink = link.startsWith('/') ? link.slice(1) : link;
      const key = getSlugKey(cleanLink);
      
      if (key) {
        const localizedSlug = getLocalizedSlug(key, lang);
<<<<<<< HEAD
        navigate(`/${localizedSlug}`);
      } else {
        navigate(`${link.startsWith('/') ? '' : '/'}${link}`);
=======
        navigate(`/${lang}/${localizedSlug}`);
      } else {
        navigate(`/${lang}${link}`);
>>>>>>> b2df92e (first commit)
      }
    }
  };
  const lang = getCurrentLang();
  return (
    <section id="services" className="py-20 bg-slate-50 dark:bg-slate-900/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4 text-slate-900 dark:text-white">
            {title}
          </h2>
          <p className="text-slate-600 dark:text-slate-400">
            {description}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayServices.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className={`p-8 rounded-2xl bg-white dark:bg-slate-800 border hover:shadow-2xl transition-all duration-300 group ${service.color} flex flex-col`}
            >
              <div className="mb-6 p-4 rounded-xl bg-white dark:bg-slate-900 w-fit shadow-sm group-hover:scale-110 transition-transform">
                {service.icon}
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {service.title}
              </h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-6 flex-grow">
                {service.description}
              </p>
              
              <button 
                onClick={() => handleViewDetail(service.link)}
<<<<<<< HEAD
                className="cursor-pointer flex items-center gap-2 text-sm font-bold text-blue-600 dark:text-blue-400 group-hover:translate-x-2 transition-transform self-start"
=======
                className="flex items-center gap-2 text-sm font-bold text-blue-600 dark:text-blue-400 group-hover:translate-x-2 transition-transform self-start"
>>>>>>> b2df92e (first commit)
              >
                {lang === 'en' ? 'View details' : 'Xem chi tiết'} <ArrowRight size={16} />
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
