import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Linkedin, Twitter } from 'lucide-react';
import logo from '../assets/logo.png';
import { getLang, getLocalizedSlug } from '../utils/localization';
import { useQuery } from '@tanstack/react-query';
import { fetcher } from '../utils/api';

const Footer: React.FC = () => {
  const lang = getLang();
  
  const { data: homeData } = useQuery({
    queryKey: ['home-content'],
    queryFn: () => fetcher('/api/pages/home'),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  return (
    <footer className="bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 pt-16 pb-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="grid md:grid-cols-4 gap-8 mb-12">
          
          <div className="col-span-1 md:col-span-1">
            <div className="mb-6">
              <div className="relative w-14 h-14 flex items-center justify-center">
                <img 
                  src={logo} 
                  alt="Victor Software Logo" 
                  className="w-full h-full object-contain rounded-xl"
                  style={{ filter: 'drop-shadow(0 2px 6px rgba(0,0,0,0.15))' }}
                />
              </div>
            </div>
            <p className="text-slate-500 text-sm mb-6 leading-relaxed">
              Đối tác tin cậy trong hành trình chuyển đổi số của doanh nghiệp. Chúng tôi mang đến những giải pháp công nghệ tiên tiến nhất.
            </p>
            <div className="flex gap-4">
                {homeData?.facebookUrl && (
                  <a href={homeData.facebookUrl} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:bg-blue-600 hover:text-white transition-all"><Facebook size={18} /></a>
                )}
                {homeData?.zaloUrl && (
                   <a href={homeData.zaloUrl} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:bg-blue-500 hover:text-white transition-all font-bold text-xs">Zalo</a>
                )}
                <a href="#" className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:bg-pink-600 hover:text-white transition-all"><Instagram size={18} /></a>
                <a href="#" className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:bg-blue-500 hover:text-white transition-all"><Linkedin size={18} /></a>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 dark:text-white mb-6">Dịch vụ</h4>
            <ul className="space-y-3 text-sm text-slate-500 dark:text-slate-400">
                <li>
                  <Link to={`/${lang}/${getLocalizedSlug('thiet-ke-website', lang)}`} className="hover:text-blue-500">
                    Thiết kế Website
                  </Link>
                </li>
                <li><a href="#" className="hover:text-blue-500">Viết App Mobile</a></li>
                <li>
                  <Link to={`/${lang}/${getLocalizedSlug('seo-tong-the', lang)}`} className="hover:text-blue-500">
                    SEO Tổng thể
                  </Link>
                </li>
                <li>
                  <Link to={`/${lang}/${getLocalizedSlug('tiktok-ads', lang)}`} className="hover:text-blue-500">
                    Chạy quảng cáo
                  </Link>
                </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 dark:text-white mb-6">Về chúng tôi</h4>
            <ul className="space-y-3 text-sm text-slate-500 dark:text-slate-400">
                <li><a href="#" className="hover:text-blue-500">Câu chuyện thương hiệu</a></li>
                <li><a href="#" className="hover:text-blue-500">Quy trình làm việc</a></li>
                <li><a href="#" className="hover:text-blue-500">Tuyển dụng</a></li>
                <li><a href="#" className="hover:text-blue-500">Chính sách bảo mật</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 dark:text-white mb-6">Đăng ký nhận tin</h4>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
              Nhận thông tin ưu đãi và kiến thức marketing mới nhất.
            </p>
            <div className="flex">
                <input type="email" placeholder="Email của bạn" className="bg-slate-100 dark:bg-slate-900 px-4 py-2 rounded-l-lg outline-none w-full text-sm dark:text-white" />
                <button className="bg-blue-600 px-4 py-2 rounded-r-lg text-white text-sm font-medium hover:bg-blue-700">Gửi</button>
            </div>
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
