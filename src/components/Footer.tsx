import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Linkedin, Twitter } from 'lucide-react';
import { getLang, getLocalizedSlug } from '@/utils/localization';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/utils/api';
import logo from '@/assets/logo.png';

const Footer: React.FC = () => {
  const lang = getLang();
  
  const { data: homeData } = useQuery({
    queryKey: ['home-content'],
    queryFn: () => api.get('/api/pages/home'),
    staleTime: 1000 * 60 * 5,
  });

  return (
    <footer className="bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 pt-16 pb-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="grid md:grid-cols-4 gap-10 mb-12">
          <div>
            <div className="mb-6">
              <img src={logo} alt="Victor Software" className="w-14 h-14 object-contain rounded-xl" />
            </div>
            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-6">
              Đối tác tin cậy trong hành trình chuyển đổi số của doanh nghiệp. Giải pháp website, phần mềm và marketing số.
            </p>
            <div className="flex gap-3">
              {homeData?.facebookUrl && (
                <a
                  href={homeData.facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="cursor-pointer w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:bg-blue-600 hover:text-white transition-all"
                >
                  <Facebook size={18} />
                </a>
              )}
              {homeData?.zaloUrl && (
                <a
                  href={homeData.zaloUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="cursor-pointer w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:bg-blue-500 hover:text-white transition-all font-bold text-xs"
                >
                  Zalo
                </a>
              )}
              {homeData?.tiktokUrl && (
                <a
                  href={homeData.tiktokUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="cursor-pointer w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:bg-black hover:text-white transition-all"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" height="18" width="18">
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
                  </svg>
                </a>
              )}
            </div>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 dark:text-white mb-6">Dịch vụ</h4>
            <ul className="space-y-3 text-sm text-slate-500 dark:text-slate-400">
                <li>
                  <Link to={`/${getLocalizedSlug('thiet-ke-website', lang)}`} className="hover:text-blue-500">
                    Thiết kế Website
                  </Link>
                </li>
                <li>
                  <Link to={`/${getLocalizedSlug('seo-tong-the', lang)}`} className="hover:text-blue-500">
                    SEO Tổng thể
                  </Link>
                </li>
                <li>
                  <Link to={`/${getLocalizedSlug('tiktok-ads', lang)}`} className="hover:text-blue-500">
                    Chạy quảng cáo
                  </Link>
                </li>
                <li>
                  <Link to={`/${getLocalizedSlug('facebook-ads', lang)}`} className="hover:text-blue-500">
                    Facebook Ads
                  </Link>
                </li>
                <li>
                  <Link to={`/${getLocalizedSlug('google-ads', lang)}`} className="hover:text-blue-500">
                    Google Ads
                  </Link>
                </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 dark:text-white mb-6">Liên kết nhanh</h4>
            <ul className="space-y-3 text-sm text-slate-500 dark:text-slate-400">
                <li>
                  <Link to="/" className="hover:text-blue-500">
                    Trang chủ
                  </Link>
                </li>
                <li>
                  <Link to={`/${getLocalizedSlug('khach-hang', lang)}`} className="hover:text-blue-500">
                    Khách hàng
                  </Link>
                </li>
                <li>
                  <Link to={`/${getLocalizedSlug('du-an', lang)}`} className="hover:text-blue-500">
                    Dự án
                  </Link>
                </li>
                <li>
                  <Link to={`/${getLocalizedSlug('lien-he', lang)}`} className="hover:text-blue-500">
                    Liên hệ
                  </Link>
                </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 dark:text-white mb-6">Liên hệ</h4>
            <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed mb-4">
              Cần tư vấn triển khai? Chúng tôi sẵn sàng hỗ trợ.
            </p>
            <button
              onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
              className="cursor-pointer inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors"
            >
              Liên hệ tư vấn
            </button>
          </div>
        </div>

        <div className="border-t border-slate-200 dark:border-slate-800 pt-8 text-center text-sm text-slate-500">
          <p>&copy; {new Date().getFullYear()} Victor Software. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
