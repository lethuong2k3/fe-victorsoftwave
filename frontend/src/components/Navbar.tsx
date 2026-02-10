import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown, Moon, Sun, Monitor, Smartphone, Globe, Search, BarChart, PenTool, DollarSign } from 'lucide-react';
import logo from '@/assets/logo.png';
import { getLocalizedSlug, getSlugKey, getLang as getGlobalLang } from '@/utils/localization';

interface NavbarProps {
  isDark: boolean;
  toggleTheme: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ isDark, toggleTheme }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [activeNav, setActiveNav] = useState<string>('/');
  
  const [lang, setLang] = useState<'vi' | 'en'>(getGlobalLang());

  // Handle Scroll Effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  // Navigation handler
  const handleNavigation = (path: string) => {
    setActiveNav(path);
    if (path.startsWith('/')) {
      if (path === '/') {
        navigate(`/${lang}`);
      } else {
        navigate(path);
      }
      setIsMobileMenuOpen(false);
      setActiveDropdown(null);
    } else {
      // Scroll to section on current page
      if (location.pathname !== '/vi' && location.pathname !== '/en') {
        navigate(`/${lang}`);
        setTimeout(() => {
          const element = document.getElementById(path);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
          }
        }, 100);
      } else {
        const element = document.getElementById(path);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }
      setIsMobileMenuOpen(false);
      setActiveDropdown(null);
    }
  };

  const toggleLanguage = () => {
    const nextLang: 'vi' | 'en' = lang === 'vi' ? 'en' : 'vi';
    localStorage.setItem('lang', nextLang);
    localStorage.setItem('language', nextLang);
    setLang(nextLang);
    window.dispatchEvent(new Event('langchange'));
    
    const currentPath = location.pathname;
    const search = location.search || '';
    const hash = location.hash || '';
    
    const parts = currentPath.split('/').filter(Boolean);
    
    if (parts.length >= 2) {
      const currentSlug = parts[1];
      const key = getSlugKey(currentSlug);
      if (key) {
        const newSlug = getLocalizedSlug(key, nextLang);
        const newParts = [nextLang, newSlug, ...parts.slice(2)];
        const newUrl = `/${newParts.join('/')}${search}${hash}`;
        window.location.href = newUrl;
        return;
      }
    }

    const rest = currentPath.replace(/^\/(vi|en|vn)/, '');
    const basePath = rest ? `/${nextLang}${rest}` : `/${nextLang}`;
    const newUrl = `${basePath}${search}${hash}`;
    window.location.href = newUrl;
  };

  // Smooth scroll handler (for backward compatibility)
  const scrollToSection = (id: string) => {
    handleNavigation(id);
  };

  // Sync language from URL if user navigates manually or via deep link
  useEffect(() => {
    const pathParts = location.pathname.split('/');
    const urlLang = pathParts[1];
    
    // Support 'vn' as alias for 'vi'
    const normalizedLang = urlLang === 'vn' ? 'vi' : urlLang;
    
    if ((normalizedLang === 'vi' || normalizedLang === 'en') && normalizedLang !== lang) {
      setLang(normalizedLang as 'vi' | 'en');
      localStorage.setItem('lang', normalizedLang);
      localStorage.setItem('language', normalizedLang);
      document.documentElement.lang = normalizedLang;
      window.dispatchEvent(new Event('langchange'));
    }
  }, [location.pathname, lang]);

  useEffect(() => {
    if (location.pathname !== '/' ) {
      setActiveNav(location.pathname);
      return;
    }
    if (activeNav.startsWith('/')) {
      setActiveNav('/');
    }
  }, [location.pathname]);

  const activeKey = location.pathname !== '/' ? location.pathname : activeNav;
  const isSubActive = (target: string) => activeKey === target;
  const isItemActive = (item: any) => {
    if (item.path && activeKey === item.path) return true;
    if (item.id && activeKey === item.id) return true;
    if (item.dropdown && item.dropdown.some((sub: any) => activeKey === sub.target)) return true;
    if (item.key === 'home' && (location.pathname === '/vi' || location.pathname === '/en' || location.pathname === '/')) return true;
    return false;
  };

  const labels = {
    vi: {
      home: 'Trang chủ',
      design: 'Thiết kế web',
      webServices: 'Dịch vụ web',
      marketing: 'Marketing',
      blog: 'Blog',
      contact: 'Liên hệ',
      catalog: 'Danh mục website',
      featuredCustomers: 'Khách hàng tiêu biểu',
      seoConsulting: 'Tư vấn SEO',
      websiteCare: 'Chăm sóc Website',
      consultNow: 'Tư vấn ngay',
      freeConsult: 'Nhận tư vấn miễn phí',
      priceList: 'Bảng giá',
    },
    en: {
      home: 'Home',
      design: 'Web Design',
      webServices: 'Web Services',
      marketing: 'Marketing',
      blog: 'Blog',
      contact: 'Contact',
      catalog: 'Website Catalog',
      featuredCustomers: 'Featured Clients',
      seoConsulting: 'SEO Consulting',
      websiteCare: 'Website Care',
      consultNow: 'Consult now',
      freeConsult: 'Free consultation',
      priceList: 'Price List',
    },
  }[lang];

  const menuItems: Array<{
    key: string;
    title: string;
    id: string;
    path?: string;
    dropdown?: Array<{ label: string; icon: React.ReactNode; target: string }>;
  }> = [
    { key: 'home', title: labels.home, id: 'home', path: '/' },
    {
      key: 'design',
      title: labels.design,
      id: 'design',
      dropdown: [
        { label: labels.priceList, icon: <DollarSign size={18} />, target: `/${lang}/${getLocalizedSlug('thiet-ke-website', lang)}` },
        { label: labels.catalog, icon: <Monitor size={18} />, target: `/${lang}/${getLocalizedSlug('danh-muc-website', lang)}` },
        { label: labels.featuredCustomers, icon: <Globe size={18} />, target: `/${lang}/${getLocalizedSlug('khach-hang', lang)}` },
      ],
    },
    {
      key: 'services',
      title: labels.webServices,
      id: 'services',
      dropdown: [
        { label: labels.seoConsulting, icon: <Search size={18} />, target: `/${lang}/${getLocalizedSlug('seo-tong-the', lang)}` },
        { label: labels.websiteCare, icon: <PenTool size={18} />, target: `/${lang}/${getLocalizedSlug('cham-soc-website', lang)}` },
      ],
    },
    {
      key: 'marketing',
      title: labels.marketing,
      id: 'marketing',
      dropdown: [
        { label: 'TikTok Ads', icon: <Smartphone size={18} />, target: `/${lang}/${getLocalizedSlug('tiktok-ads', lang)}` },
        { label: 'Facebook Ads', icon: <Globe size={18} />, target: `/${lang}/${getLocalizedSlug('facebook-ads', lang)}` },
        { label: 'Google Ads', icon: <BarChart size={18} />, target: `/${lang}/${getLocalizedSlug('google-ads', lang)}` },
      ],
    },
    {
      key: 'blog',
      title: labels.blog,
      id: 'blog',
      path: `/${lang}/${getLocalizedSlug('bai-viet', lang)}`,
    },
    {
      key: 'contact',
      title: labels.contact,
      id: 'contact',
      path: `/${lang}/${getLocalizedSlug('lien-he', lang)}`,
    },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b ${
        isScrolled
          ? 'bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-slate-200 dark:border-slate-800 py-3 shadow-lg'
          : 'bg-transparent border-transparent py-5'
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl flex items-center justify-between">
        {/* Logo */}
        <div 
          onClick={() => handleNavigation('/')}
          className="cursor-pointer group"
        >
            <div className="relative w-12 h-12 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
              <img 
                src={logo} 
                alt="Victor Software Logo" 
                className="w-full h-full object-contain rounded-xl"
                style={{ filter: 'drop-shadow(0 2px 6px rgba(0,0,0,0.15))' }}
              />
            </div>
        </div>

        {/* Desktop Menu */}
        <div className="hidden lg:flex items-center gap-1">
          {menuItems.map((item) => (
            <div
              key={item.key}
              className={`relative group px-3 py-2 rounded-full ${isItemActive(item) ? 'bg-slate-100/70 dark:bg-slate-800/60' : ''}`}
              onMouseEnter={() => setActiveDropdown(item.key)}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button
                onClick={() => {
                  // If has path (like "Thiết kế web"), navigate directly
                  if (item.path) {
                    handleNavigation(item.path);
                  } else if (!item.dropdown) {
                    // If no dropdown, scroll to section
                    handleNavigation(item.id);
                  }
                  // If has dropdown but no path, dropdown will handle hover
                }}
                className={`flex items-center gap-1 text-sm font-medium transition-colors ${
                  isItemActive(item)
                    ? 'text-blue-600 dark:text-blue-400'
                    : 'text-slate-700 dark:text-slate-200 hover:text-accent dark:hover:text-accent'
                }`}
              >
                {item.title}
                {item.dropdown && <ChevronDown size={14} className="group-hover:rotate-180 transition-transform duration-200" />}
              </button>

              {/* Dropdown */}
              {item.dropdown && activeDropdown === item.key && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute top-full left-0 w-64 pt-2"
                >
                  <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl overflow-hidden p-2">
                    {item.dropdown.map((subItem, idx) => (
                      <div
                        key={idx}
                        onClick={() => handleNavigation(subItem.target)}
                        className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors group/item ${
                          isSubActive(subItem.target) ? 'bg-slate-100 dark:bg-slate-800' : 'hover:bg-slate-50 dark:hover:bg-slate-800'
                        }`}
                      >
                        <div
                          className={`p-2 rounded-md transition-colors ${
                            isSubActive(subItem.target)
                              ? 'bg-blue-600 text-white'
                              : 'bg-blue-50 dark:bg-slate-800 text-blue-600 dark:text-blue-400 group-hover/item:bg-blue-600 group-hover/item:text-white'
                          }`}
                        >
                          {subItem.icon}
                        </div>
                        <span
                          className={`text-sm font-medium ${
                            isSubActive(subItem.target)
                              ? 'text-blue-600 dark:text-blue-400'
                              : 'text-slate-700 dark:text-slate-200 group-hover/item:text-blue-600 dark:group-hover/item:text-blue-400'
                          }`}
                        >
                          {subItem.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <button
            onClick={toggleLanguage}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors"
            aria-label="Toggle language"
            type="button"
          >
            <Globe size={18} />
            <span className="text-sm font-semibold">{lang.toUpperCase()}</span>
          </button>

          <button
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors"
          >
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          
          <button 
            onClick={() => handleNavigation('contact')}
            className="hidden lg:block px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-800 text-white text-sm font-semibold rounded-full shadow-lg hover:shadow-blue-500/30 hover:scale-105 transition-all duration-300"
          >
            {labels.consultNow}
          </button>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 text-slate-700 dark:text-slate-200"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 overflow-hidden"
          >
            <div className="container mx-auto px-4 py-6 flex flex-col gap-4">
              {menuItems.map((item) => (
                <div key={item.key}>
                  <button
                    onClick={() => {
                        if (!item.dropdown) {
                            if (item.path) {
                              handleNavigation(item.path);
                            } else {
                            handleNavigation(item.id);
                            }
                        } else {
                            // If has dropdown and it's "Thiết kế web", navigate directly
                            if (item.path) {
                              handleNavigation(item.path);
                        } else {
                            setActiveDropdown(activeDropdown === item.key ? null : item.key);
                            }
                        }
                    }}
                    className={`flex items-center justify-between w-full text-left text-lg py-2 border-b border-slate-100 dark:border-slate-900 ${
                      isItemActive(item) ? 'font-semibold text-blue-600 dark:text-blue-400' : 'font-medium text-slate-800 dark:text-slate-100'
                    }`}
                  >
                    {item.title}
                    {item.dropdown && <ChevronDown size={18} className={`${activeDropdown === item.key ? 'rotate-180' : ''} transition-transform`} />}
                  </button>
                  
                  {item.dropdown && activeDropdown === item.key && (
                    <div className="pl-4 mt-2 flex flex-col gap-2">
                      {item.dropdown.map((sub, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleNavigation(sub.target)}
                          className={`flex items-center gap-3 py-2 ${
                            isSubActive(sub.target) ? 'text-blue-600 dark:text-blue-400 font-semibold' : 'text-slate-600 dark:text-slate-400'
                          }`}
                        >
                          {sub.icon}
                          <span>{sub.label}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              <button 
                onClick={() => handleNavigation('contact')}
                className="mt-4 w-full py-3 bg-blue-600 text-white font-semibold rounded-lg"
              >
                {labels.freeConsult}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
