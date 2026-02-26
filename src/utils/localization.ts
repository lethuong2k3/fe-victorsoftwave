export type Lang = 'vi' | 'en';

export const SLUG_MAPPING = {
  'thiet-ke-website': {
    vi: 'thiet-ke-website',
    en: 'web-design',
    component: 'WebDesignDetail'
  },
  'seo-tong-the': {
    vi: 'seo-tong-the',
    en: 'seo-services',
    component: 'SeoDetail'
  },
  'cham-soc-website': {
    vi: 'cham-soc-website',
    en: 'website-care',
    component: 'WebsiteCareDetail'
  },
  'tiktok-ads': {
    vi: 'tiktok-ads',
    en: 'tiktok-advertising',
    component: 'TikTokDetail'
  },
  'facebook-ads': {
    vi: 'facebook-ads',
    en: 'facebook-ads',
    component: 'FacebookAdsDetail'
  },
  'google-ads': {
    vi: 'google-ads',
    en: 'google-ads',
    component: 'GoogleAdsDetail'
  },
  'danh-muc-website': {
    vi: 'danh-muc-website',
    en: 'website-portfolio',
    component: 'PortfolioPage'
  },
  'khach-hang': {
    vi: 'khach-hang-tieu-bieu',
    en: 'featured-clients',
    component: 'ClientsPage'
  },
  'du-an': {
    vi: 'du-an',
    en: 'project',
    component: 'ProjectDetail'
  },
  'bai-viet': {
    vi: 'bai-viet',
    en: 'blog',
    component: 'ArticlesPage'
  },
  'lien-he': {
    vi: 'lien-he',
    en: 'contact',
    component: 'ContactPage'
  }
} as const;

export type SlugKey = keyof typeof SLUG_MAPPING;

export const getLocalizedSlug = (key: string, lang: Lang): string => {
  const mapping = SLUG_MAPPING[key as SlugKey];
  if (!mapping) return key;
  return mapping[lang];
};

export const getSlugKey = (slug: string): SlugKey | null => {
  for (const [key, mapping] of Object.entries(SLUG_MAPPING)) {
    if (mapping.vi === slug || mapping.en === slug) {
      return key as SlugKey;
    }
  }
  return null;
};

export const getLang = (): Lang => {
  if (typeof window === 'undefined') return 'vi';
<<<<<<< HEAD
  
  // Prioritize localStorage
  const stored = (localStorage.getItem('lang') || localStorage.getItem('language') || '').toLowerCase();
  if (stored === 'en' || stored === 'vi') return stored as Lang;
  
  // Fallback to URL path (only for initial detection if no storage)
=======
>>>>>>> b2df92e (first commit)
  const path = (window.location.pathname || '').toLowerCase();
  const seg = path.split('/').filter(Boolean)[0] || '';
  if (seg === 'vi' || seg === 'vn') return 'vi';
  if (seg === 'en') return 'en';
<<<<<<< HEAD

  return 'vi';
=======
  const stored = (localStorage.getItem('lang') || localStorage.getItem('language') || '').toLowerCase();
  if (stored === 'en' || stored === 'vi') return stored as Lang;
  return (navigator.language || '').toLowerCase().startsWith('en') ? 'en' : 'vi';
>>>>>>> b2df92e (first commit)
};
