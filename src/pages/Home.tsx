import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { 
  GraduationCap, 
  Globe2, 
  BookOpen, 
  CheckCircle2, 
  DollarSign, 
  Home as HomeIcon, 
  Stethoscope, 
  Plane,
  ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const BACKGROUND_IMAGES = [
  "https://i.imgur.com/gK3hv00.jpg",
  "https://i.imgur.com/0h4Gn7p.jpg",
  "https://i.imgur.com/HxfuTjs.jpg",
  "https://i.imgur.com/MF1Wfqj.jpg",
  "https://i.imgur.com/hHP6d44.jpg",
  "https://i.imgur.com/4SKloA4.jpg",
  "https://i.imgur.com/Nzn3oqt.jpg",
  "https://i.imgur.com/6JLaYZj.jpg",
  "https://i.imgur.com/lEyw8aI.jpg",
  "https://i.imgur.com/bEpNQDr.jpg",
  "https://i.imgur.com/LDmpxBM.jpg"
];

import { universities } from '../data/universities';

const benefitHighlights = [
  {
    title: "Full Tuition Coverage",
    icon: <CheckCircle2 className="w-8 h-8 text-primary-600" />,
    description: "100% of your academic fees are covered directly by the foundation."
  },
  {
    title: "Monthly Allowance",
    icon: <DollarSign className="w-8 h-8 text-primary-600" />,
    description: "Receive a $150 monthly stipend for feeding and personal expenses."
  },
  {
    title: "Free Accommodation",
    icon: <HomeIcon className="w-8 h-8 text-primary-600" />,
    description: "Safe and fully-funded housing provided throughout your study period."
  },
  {
    title: "Free Medical Care",
    icon: <Stethoscope className="w-8 h-8 text-primary-600" />,
    description: "Comprehensive health insurance and medical services included."
  },
  {
    title: "Travel Support",
    icon: <Plane className="w-8 h-8 text-primary-600" />,
    description: "All flight tickets and travel logistics are fully covered."
  }
];

export default function Home() {
  const { t } = useTranslation();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % BACKGROUND_IMAGES.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col w-full relative">
      {/* Fixed Background Carousel */}
      <div className="fixed inset-0 overflow-hidden bg-black z-0 pointer-events-none">
        <AnimatePresence initial={false}>
          <motion.img
            key={`img-${currentImageIndex}`}
            src={BACKGROUND_IMAGES[currentImageIndex]}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ duration: 0.8, ease: 'easeInOut' }}
            className="absolute inset-0 w-full h-full object-cover object-top"
            alt="Slideshow"
            referrerPolicy="no-referrer"
          />
        </AnimatePresence>
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/80 z-0 pointer-events-none" />
      </div>

      {/* Hero Section */}
      <section className="w-full h-[calc(100vh-64px)] min-h-[600px] text-white relative z-10 flex items-center justify-center overflow-hidden">
        <div className="container px-4 md:px-6 relative z-10 mx-auto text-center flex flex-col items-center justify-start pt-4 md:pt-6 pb-12 md:pb-0 h-full">
          {/* Mobile Hero Content - Hidden as requested */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:hidden flex flex-col items-center w-full h-full md:h-auto justify-start space-y-6 md:space-y-4"
          >
            <div className="flex flex-col items-center space-y-4">
              <div className="inline-flex items-center rounded-full bg-primary-600/80 backdrop-blur-sm px-4 py-1.5 text-xs sm:text-sm font-medium text-white mb-2 sm:mb-4 border border-primary-500/30">
                <GraduationCap className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                2026/2027 Applications Now Open
              </div>
            </div>
          </motion.div>

          {/* Desktop Hero Content (Centralized) */}
          <div className="hidden lg:flex flex-col items-center absolute bottom-16 left-1/2 -translate-x-1/2 text-center z-20 w-full max-w-5xl">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-2xl xl:text-3xl font-bold tracking-tight mb-3 text-white drop-shadow-lg whitespace-nowrap"
            >
              {t('home.title')}
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-lg xl:text-xl text-gray-200 mb-8 drop-shadow-md font-medium max-w-2xl"
            >
              {t('home.subtitle')}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="w-full flex justify-center px-4"
            >
              <Link to="/apply-selection" className="w-full max-w-[50vw] flex justify-center">
                <Button size="lg" className="w-full bg-primary-700 hover:bg-primary-800 text-white font-bold h-12 text-lg rounded-full shadow-2xl hover:scale-[1.02] transition-all duration-300 border-2 border-white/30">
                  {t('home.apply_now')}
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Top Universities Section */}
      <section className="w-full py-24 px-4 relative z-10 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">Top 12 Partner Universities</h2>
            <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto px-4">
              Our scholars have the opportunity to study at the world's most prestigious institutions across the globe.
            </p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-8">
            {universities.map((uni, index) => (
              <Link key={uni.id} to={`/university/${uni.id}`}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -5, scale: 1.02 }}
                  className="bg-white rounded-2xl sm:rounded-3xl overflow-hidden shadow-sm border border-slate-200 hover:shadow-xl transition-all duration-300 group cursor-pointer h-full flex flex-col"
                >
                  <div className="h-28 sm:h-56 overflow-hidden relative flex-shrink-0">
                    <img 
                      src={uni.image} 
                      alt={uni.name} 
                      className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-700"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-2 right-2 sm:top-4 sm:right-4 bg-white/90 backdrop-blur-sm p-1 sm:p-2 rounded-lg sm:rounded-xl shadow-lg flex items-center gap-1 sm:gap-2">
                      <img 
                        src={`https://flagcdn.com/w20/${uni.countryCode}.png`} 
                        alt={uni.countryCode} 
                        className="w-3 sm:w-5 h-auto rounded-sm"
                      />
                      <span className="text-[8px] sm:text-[10px] font-bold text-slate-800 uppercase tracking-wider">{uni.countryCode}</span>
                    </div>
                  </div>
                  <div className="p-3 sm:p-8 flex flex-col flex-grow">
                    <h3 className="text-sm sm:text-2xl font-bold mb-1 sm:mb-3 text-slate-900 group-hover:text-primary-700 transition-colors line-clamp-1 sm:line-clamp-none leading-tight">
                      {uni.name}
                    </h3>
                    <p className="text-slate-600 text-[10px] sm:text-sm mb-3 sm:mb-6 leading-relaxed line-clamp-2">
                      {uni.overview}
                    </p>
                    <div className="mt-auto space-y-2 sm:space-y-4">
                      <div className="flex items-center justify-between">
                        <p className="text-[8px] sm:text-xs font-bold text-primary-700 uppercase tracking-widest">Programs</p>
                        <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 text-primary-700 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                      </div>
                      <div className="flex flex-wrap gap-1 sm:gap-2">
                        {uni.programs.slice(0, 2).map((cat, pIdx) => (
                          <span key={pIdx} className="px-1.5 py-0.5 sm:px-3 sm:py-1 bg-slate-100 text-slate-600 text-[7px] sm:text-[10px] rounded-full font-bold uppercase tracking-tighter">
                            {cat.category}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Preview Section */}
      <section className="w-full py-24 px-4 relative z-10 bg-slate-50 border-t border-slate-200">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Scholarship Benefits</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              We provide comprehensive support to ensure our scholars can focus entirely on their academic success.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-16">
            {benefitHighlights.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 text-center flex flex-col items-center"
              >
                <div className="mb-4 bg-primary-50 w-14 h-14 rounded-2xl flex items-center justify-center">
                  {benefit.icon}
                </div>
                <h3 className="text-base font-bold mb-2 text-slate-900">{benefit.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  {benefit.description}
                </p>
              </motion.div>
            ))}
          </div>
          <div className="text-center">
            <Link to="/benefits">
              <Button size="lg" className="bg-primary-700 hover:bg-primary-800 text-white px-8 h-14 rounded-full shadow-lg group">
                View Full Scholarship Benefits
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features (Original) */}
      <section className="w-full py-24 px-4 relative z-10 bg-white border-t border-slate-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div className="flex flex-col items-center text-center p-8 bg-slate-50 rounded-3xl shadow-sm border border-slate-100">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mb-6 text-primary-700">
              <Globe2 className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-bold mb-3">Global Universities</h3>
            <p className="text-slate-600">Study at Cambridge, Harvard, Oxford, or top universities in China.</p>
          </div>
          <div className="flex flex-col items-center text-center p-8 bg-slate-50 rounded-3xl shadow-sm border border-slate-100">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mb-6 text-primary-700">
              <BookOpen className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-bold mb-3">Full Coverage</h3>
            <p className="text-slate-600">Comprehensive scholarship covering tuition, accommodation, and stipends.</p>
          </div>
          <div className="flex flex-col items-center text-center p-8 bg-slate-50 rounded-3xl shadow-sm border border-slate-100">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mb-6 text-primary-700">
              <GraduationCap className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-bold mb-3">All Degree Levels</h3>
            <p className="text-slate-600">Opportunities available for Undergraduate, Masters, and PhD programs.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
