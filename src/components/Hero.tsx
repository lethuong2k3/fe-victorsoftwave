import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

interface HeroProps {
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
}

import { ImageWithFallback } from './ImageWithFallback';

const Hero: React.FC<HeroProps> = ({ data }) => {
  // Default values if data is not provided or fields are missing
  const badgeText = data?.badgeText || "";
  const titlePrefix = data?.titlePrefix || "";
  const titleHighlight = data?.titleHighlight || "";
  const titleSuffix = data?.titleSuffix || "";
  const description = data?.description || "";
  const heroImageUrl = data?.heroImageUrl || "";
  const ctaPrimaryText = data?.ctaPrimaryText || "";
  const ctaSecondaryText = data?.ctaSecondaryText || "";
  const benefit1 = data?.benefit1 || "";
  const benefit2 = data?.benefit2 || "";
  const benefit3 = data?.benefit3 || "";

  return (
    <section id="home" className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-dot-pattern">
      {/* Background Gradients */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-b from-blue-200 to-transparent dark:from-blue-900/30 dark:to-transparent rounded-full blur-[80px] -z-10 opacity-60" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gradient-to-t from-orange-200 to-transparent dark:from-orange-900/20 dark:to-transparent rounded-full blur-[80px] -z-10 opacity-60" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl grid lg:grid-cols-2 gap-12 items-center">
        
        {/* Text Content */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-8"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-300 text-sm font-semibold">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            {badgeText}
          </div>

          <h1 className="text-4xl lg:text-7xl font-extrabold tracking-tight leading-[1.1]">
            {titlePrefix} <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500 dark:from-blue-400 dark:to-cyan-300">
              {titleHighlight}
            </span> <br/>
            {titleSuffix}
          </h1>

          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-lg leading-relaxed">
            {description}
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <button onClick={() => document.getElementById('contact')?.scrollIntoView({behavior:'smooth'})} className="px-8 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold rounded-xl shadow-lg hover:translate-y-[-2px] hover:shadow-xl transition-all flex items-center justify-center gap-2">
              {ctaPrimaryText} <ArrowRight size={20} />
            </button>
            <button onClick={() => document.getElementById('portfolio')?.scrollIntoView({behavior:'smooth'})} className="px-8 py-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-bold rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-all">
              {ctaSecondaryText}
            </button>
          </div>

          <div className="flex items-center gap-6 pt-4 text-sm text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-green-500" /> 
              <span>{benefit1}</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-green-500" /> 
              <span>{benefit2}</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-green-500" /> 
              <span>{benefit3}</span>
            </div>
          </div>
        </motion.div>

        {/* Hero Image / Visual */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative lg:h-[600px] flex items-center justify-center"
        >
          {/* Abstract Composition simulating "Magic UI" */}
          <div className="relative w-full h-full max-w-md mx-auto perspective-1000">
             {/* Main Card */}
             <div className="absolute inset-0 bg-gradient-to-br from-white to-slate-100 dark:from-slate-800 dark:to-slate-900 rounded-3xl border border-white/20 shadow-2xl overflow-hidden z-20 flex flex-col transform rotate-y-12 transition-transform hover:rotate-y-0 duration-500">
                <div className="h-8 bg-slate-100 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 flex items-center px-4 gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-400"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                  <div className="w-3 h-3 rounded-full bg-green-400"></div>
                </div>
                <div className="p-6 flex-1 relative bg-dot-pattern">
                    <ImageWithFallback src={heroImageUrl} alt="Dashboard Preview" className="w-full h-48 object-cover rounded-lg mb-4 opacity-90 hover:scale-105 transition-transform duration-500" />
                    <div className="space-y-3">
                        <div className="h-4 w-3/4 bg-slate-200 dark:bg-slate-700 rounded animate-pulse"></div>
                        <div className="h-4 w-1/2 bg-slate-200 dark:bg-slate-700 rounded animate-pulse"></div>
                        <div className="flex gap-2 mt-4">
                            <div className="h-20 w-1/3 bg-blue-100 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800"></div>
                            <div className="h-20 w-1/3 bg-purple-100 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800"></div>
                            <div className="h-20 w-1/3 bg-orange-100 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800"></div>
                        </div>
                    </div>
                </div>
             </div>

             {/* Floating Elements */}
             <motion.div 
                animate={{ y: [0, -20, 0] }}
                transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                className="hidden md:block absolute -right-12 top-20 z-30 bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700"
             >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600">
                    <CheckCircle2 size={20} />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Dự án hoàn thành</p>
                    <p className="text-lg font-bold text-slate-900 dark:text-white">120+</p>
                  </div>
                </div>
             </motion.div>

             <motion.div 
                animate={{ y: [0, 20, 0] }}
                transition={{ repeat: Infinity, duration: 5, ease: "easeInOut", delay: 1 }}
                className="hidden md:block absolute -left-12 bottom-20 z-30 bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700"
             >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600">
                    <ArrowRight size={20} />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Tăng trưởng</p>
                    <p className="text-lg font-bold text-slate-900 dark:text-white">+250%</p>
                  </div>
                </div>
             </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
