import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { SLUG_MAPPING, getLocalizedSlug } from '../utils/localization';

interface PortfolioProps {
  data?: {
    portfolioTitle?: string;
    portfolioDescription?: string;
  };
  lang?: 'vi' | 'en';
}

const Portfolio: React.FC<PortfolioProps> = ({ data, lang = 'vi' }) => {
  const navigate = useNavigate();
  const [activeCat, setActiveCat] = useState("Tất cả");
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const title = data?.portfolioTitle || "Dự án tiêu biểu";
  const description = data?.portfolioDescription || "Hơn 500+ khách hàng đã tin tưởng và đồng hành cùng Victor Software.";

  useEffect(() => {
    fetch('/api/projects/featured')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setProjects(data);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const categories = ["Tất cả", ...Array.from(new Set(projects.map((p) => p.cat).filter(Boolean)))];

  const filteredProjects = activeCat === "Tất cả" 
    ? projects 
    : projects.filter(p => p.cat === activeCat);

  return (
    <section id="portfolio" className="py-20 bg-slate-50 dark:bg-slate-900/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-bold mb-4 text-slate-900 dark:text-white">
            {title}
          </h2>
          <p className="text-slate-600 dark:text-slate-400">
            {description}
          </p>
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCat(cat)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                activeCat === cat
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        <motion.div 
            layout 
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          <AnimatePresence>
            {loading ? (
               <div className="col-span-full text-center py-12">Loading...</div>
            ) : (
              filteredProjects.map((project) => (
              <motion.div
                layout
                key={project.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.3 }}
                className="group relative rounded-2xl overflow-hidden cursor-pointer shadow-sm hover:shadow-xl dark:shadow-none"
                onClick={() => {
                  const projectSlug = (lang === 'en' ? project.slugEn : project.slug);
                  if (projectSlug) {
                    navigate(`/${lang}/${getLocalizedSlug('danh-muc-website', lang)}/${projectSlug}`);
                  }
                }}
              >
                <div className="aspect-[4/3] overflow-hidden">
                    <img 
                        src={project.img || 'https://placehold.co/600x400?text=No+Image'} 
                        alt={lang === 'en' ? project.titleEn || project.title : project.title} 
                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                    />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                    <span className="text-accent-500 text-sm font-semibold mb-1">{project.cat}</span>
                    <h3 className="text-white text-xl font-bold">{lang === 'en' ? project.titleEn || project.title : project.title}</h3>
                </div>
              </motion.div>
            ))
            )}
          </AnimatePresence>
        </motion.div>
        
        <div className="mt-12 text-center">
            <button 
                onClick={() => navigate(`/${lang}/${SLUG_MAPPING['danh-muc-website'][lang]}`)}
                className="px-8 py-3 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 font-semibold transition-colors"
            >
                {lang === 'en' ? 'View All Projects' : 'Xem toàn bộ dự án'}
            </button>
        </div>
      </div>
    </section>
  );
};

export default Portfolio;
