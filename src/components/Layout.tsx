import React, { useEffect } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Globe, User, Home, ClipboardList, GraduationCap, Bell, Mail, Phone, Facebook, MessageSquare, Twitter, Instagram, Menu } from 'lucide-react';
import { motion } from 'motion/react';
import { useAuth } from '../contexts/AuthContext';
import FloatingChatbot from './FloatingChatbot';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

const topUniversities = [
  { name: "Massachusetts Institute of Technology", code: "us" },
  { name: "Imperial College London", code: "gb" },
  { name: "University of Oxford", code: "gb" },
  { name: "Harvard University", code: "us" },
  { name: "University of Cambridge", code: "gb" },
  { name: "Stanford University", code: "us" },
  { name: "ETH Zurich", code: "ch" },
  { name: "National University of Singapore", code: "sg" },
  { name: "University College London", code: "gb" },
  { name: "California Institute of Technology", code: "us" },
  { name: "University of Chicago", code: "us" },
  { name: "Princeton University", code: "us" },
  { name: "Yale University", code: "us" },
  { name: "University of California Berkeley", code: "us" },
  { name: "Columbia University", code: "us" },
  { name: "University of Pennsylvania", code: "us" },
  { name: "Johns Hopkins University", code: "us" },
  { name: "Tsinghua University", code: "cn" },
  { name: "Peking University", code: "cn" },
  { name: "University of Tokyo", code: "jp" },
];

export default function Layout() {
  const { t, i18n } = useTranslation();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isApplying, setIsApplying] = React.useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (location.pathname === '/apply-selection' || location.pathname === '/apply') {
      setIsApplying(true);
    } else {
      setIsApplying(false);
    }
  }, [location.pathname]);

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  const handleNavClick = (path: string) => {
    if (location.pathname === path) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleApplyClick = () => {
    setIsApplying(true);
    handleNavClick('/apply-selection');
  };

  const isAuthPage = location.pathname === '/login' || 
                    location.pathname === '/signup' || 
                    location.pathname === '/forgot-password' || 
                    location.pathname === '/reset-password';

  const hasBackButton = [
    '/benefits',
    '/faq',
    '/how-to-apply',
    '/admin',
    '/apply-selection',
    '/apply',
    '/privacy',
    '/terms',
    '/refund'
  ].some(path => location.pathname.startsWith(path)) || location.pathname.startsWith('/university/');

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans">
      {!isAuthPage && (
        <header className="bg-white shadow-sm sticky top-0 z-50">
          {/* Global Marquee */}
          <div className="bg-primary-700 text-white overflow-hidden py-2 flex items-center relative w-full">
            <div className="whitespace-nowrap animate-marquee text-sm font-medium inline-flex items-center" style={{ animationDuration: '150s' }}>
              <span>Through the <strong>Aliko Dangote Foundation Scholarship Program</strong>, you have the opportunity to study at some of the world’s top universities across different countries, including:</span>
              {topUniversities.map((uni, idx) => (
                <React.Fragment key={idx}>
                  <span className="ml-2">{idx + 1}. {uni.name}</span>
                  <img src={`https://flagcdn.com/20x15/${uni.code}.png`} alt={uni.code} className="inline-block w-5 h-auto shadow-sm ml-1" />
                </React.Fragment>
              ))}
              <span className="ml-3">This program opens doors for students to gain world-class education at leading institutions across the globe.</span>
            </div>
          </div>

          {/* Desktop Header */}
          <div className="hidden md:block max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16 items-center">
              <div className="flex-shrink-0 flex items-center">
                <Link to="/home" onClick={() => handleNavClick('/home')} className="text-xl font-bold text-primary-700 flex items-center gap-2">
                  <div className="w-8 h-8 bg-primary-700 rounded-full flex items-center justify-center text-white font-bold">D</div>
                  <span>Dangote Scholarship</span>
                </Link>
              </div>
              <div className="flex items-center space-x-1 lg:space-x-2">
                <Link to="/home" onClick={() => handleNavClick('/home')} className={`font-medium px-2 py-2 rounded-md transition-colors text-sm ${location.pathname === '/home' ? 'text-primary-700 bg-primary-50' : 'text-gray-700 hover:text-primary-700'}`}>
                  {t('nav.home')}
                </Link>
                <Link to="/benefits" onClick={() => handleNavClick('/benefits')} className={`font-medium px-2 py-2 rounded-md transition-colors text-sm ${location.pathname === '/benefits' ? 'text-primary-700 bg-primary-50' : 'text-gray-700 hover:text-primary-700'}`}>
                  {t('nav.benefits')}
                </Link>
                <Link to="/how-to-apply" onClick={() => handleNavClick('/how-to-apply')} className={`font-medium px-2 py-2 rounded-md transition-colors text-sm ${location.pathname === '/how-to-apply' ? 'text-primary-700 bg-primary-50' : 'text-gray-700 hover:text-primary-700'}`}>
                  {t('nav.how_to_apply')}
                </Link>
                
                <Link to="/status" onClick={() => handleNavClick('/status')} className={`font-medium px-2 py-2 rounded-md transition-colors text-sm ${location.pathname === '/status' ? 'text-primary-700 bg-primary-50' : 'text-gray-700 hover:text-primary-700'}`}>
                  {t('nav.status') || 'Status'}
                </Link>

                <Link to="/faq" onClick={() => handleNavClick('/faq')} className={`font-medium px-2 py-2 rounded-md transition-colors text-sm ${location.pathname === '/faq' ? 'text-primary-700 bg-primary-50' : 'text-gray-700 hover:text-primary-700'}`}>
                  {t('nav.faq')}
                </Link>
                
                <Link to="/support" onClick={() => handleNavClick('/support')} className={`font-medium px-2 py-2 rounded-md transition-colors text-sm ${location.pathname === '/support' ? 'text-primary-700 bg-primary-50' : 'text-gray-700 hover:text-primary-700'}`}>
                  Support
                </Link>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="rounded-full h-9 w-9 text-gray-700 hover:text-primary-700">
                      <Globe className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => changeLanguage('en')}>English</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => changeLanguage('fr')}>Français</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => changeLanguage('zh')}>中文</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => changeLanguage('ar')}>العربية</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <Link to="/notifications" onClick={() => handleNavClick('/notifications')} className={`font-medium p-2 rounded-full transition-colors ${location.pathname === '/notifications' ? 'text-primary-700 bg-primary-50' : 'text-gray-700 hover:text-primary-700'}`}>
                  <Bell className="w-5 h-5" />
                </Link>

                {currentUser ? (
                  <Link to="/profile" onClick={() => handleNavClick('/profile')} className={`font-medium p-2 rounded-full transition-colors ${location.pathname === '/profile' ? 'text-primary-700 bg-primary-50' : 'text-gray-700 hover:text-primary-700'}`}>
                    <User className="w-5 h-5" />
                  </Link>
                ) : (
                  <Link to="/login" onClick={() => handleNavClick('/login')} className={`font-medium p-2 rounded-full transition-colors ${location.pathname === '/login' ? 'text-primary-700 bg-primary-50' : 'text-gray-700 hover:text-primary-700'}`}>
                    <User className="w-5 h-5" />
                  </Link>
                )}
              </div>
            </div>
          </div>

          {/* Mobile Header */}
          <div className="md:hidden flex flex-col w-full bg-white shadow-sm">
            <div className="px-4 py-3 flex items-center justify-between">
              <Link to="/home" onClick={() => handleNavClick('/home')} className="text-lg font-bold text-primary-700 flex items-center gap-2">
                <div className="w-7 h-7 bg-primary-700 rounded-full flex items-center justify-center text-white font-bold text-sm">D</div>
                <span className="text-sm">Dangote Scholarship</span>
              </Link>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="text-primary-700">
                    <Menu className="h-6 w-6" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem onClick={() => navigate('/home')}>Home</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/benefits')}>Scholarship Benefits</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/how-to-apply')}>How to Apply</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/status')}>Status</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/faq')}>FAQ</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/support')}>Support</DropdownMenuItem>
                  <div className="border-t border-gray-100 my-1"></div>
                  <div className="px-2 py-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Language</div>
                  <DropdownMenuItem onClick={() => changeLanguage('en')}>English</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => changeLanguage('fr')}>Français</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => changeLanguage('zh')}>中文</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => changeLanguage('ar')}>العربية</DropdownMenuItem>
                  <div className="border-t border-gray-100 my-1"></div>
                  <DropdownMenuItem onClick={() => navigate('/notifications')}>Notifications</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/profile')}>Profile</DropdownMenuItem>
                  {!currentUser && (
                    <>
                      <DropdownMenuItem onClick={() => navigate('/login')}>Sign In</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate('/signup')}>Sign Up</DropdownMenuItem>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <div className="px-2 py-1 text-center overflow-hidden bg-primary-50 border-t border-primary-100">
              {hasBackButton ? (
                <div className="whitespace-nowrap animate-marquee text-primary-700 font-bold text-[10px] flex items-center" style={{ animationDuration: '20s' }}>
                  <span className="px-4">Aliko Dangote Scholarship Foundation Portal — Click the back icon to return to the previous page — Aliko Dangote Scholarship Foundation Portal — Click the back icon to return to the previous page</span>
                </div>
              ) : (
                <h1 className="text-primary-700 font-bold text-[10px] whitespace-nowrap">
                  Aliko Dangote Scholarship Foundation Portal
                </h1>
              )}
            </div>
          </div>
        </header>
      )}

      <main className="flex-1 w-full min-h-screen bg-slate-50">
        <Outlet />
      </main>

      {!isAuthPage && <FloatingChatbot />}

      {!isAuthPage && (
        <footer className="relative z-10 bg-slate-900 text-slate-300 py-12 mt-auto pb-24 md:pb-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
              <div>
                <h3 className="text-white text-lg font-bold mb-6">Dangote Scholarship</h3>
                <p className="text-sm text-slate-400 mb-6 leading-relaxed">
                  Empowering Nigerian students to achieve their dreams at top global universities through the Aliko Dangote Foundation.
                </p>
                <div className="flex items-center gap-4">
                  <a 
                    href="https://web.facebook.com/profile.php?id=61586630617393" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center hover:bg-primary-700 hover:text-white transition-all"
                  >
                    <Facebook className="w-5 h-5" />
                  </a>
                  <a 
                    href="#" 
                    className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center hover:bg-primary-700 hover:text-white transition-all"
                  >
                    <Twitter className="w-5 h-5" />
                  </a>
                  <a 
                    href="#" 
                    className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center hover:bg-primary-700 hover:text-white transition-all"
                  >
                    <Instagram className="w-5 h-5" />
                  </a>
                </div>
              </div>

              <div>
                <h3 className="text-white text-lg font-bold mb-6">Quick Links</h3>
                <ul className="space-y-3 text-sm">
                  <li><Link to="/home" className="hover:text-white transition-colors">{t('nav.home')}</Link></li>
                  <li><Link to="/benefits" className="hover:text-white transition-colors">{t('nav.benefits')}</Link></li>
                  <li><Link to="/faq" className="hover:text-white transition-colors">{t('nav.faq')}</Link></li>
                  <li><Link to="/how-to-apply" className="hover:text-white transition-colors">{t('nav.how_to_apply')}</Link></li>
                  <li>
                    <button 
                      onClick={() => window.dispatchEvent(new CustomEvent('open-chatbot'))}
                      className="hover:text-white transition-colors flex items-center gap-2 font-bold text-primary-500 text-left"
                    >
                      <MessageSquare className="w-4 h-4" />
                      Support & Help
                    </button>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-white text-lg font-bold mb-6">Contact Us</h3>
                <ul className="space-y-4 text-sm">
                  <li className="flex items-start gap-3">
                    <Mail className="w-5 h-5 text-primary-500 shrink-0" />
                    <a href="mailto:info.alikodangotefoundation@gmail.com" className="text-slate-400 hover:text-white transition-colors break-all">
                      info.alikodangotefoundation@gmail.com
                    </a>
                  </li>
                  <li className="flex items-start gap-3">
                    <Phone className="w-5 h-5 text-primary-500 shrink-0" />
                    <a href="tel:+234800DANGOTE" className="text-slate-400 hover:text-white transition-colors">
                      +234 800 DANGOTE
                    </a>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-5 h-5 text-primary-500 shrink-0 flex items-center justify-center font-bold text-xs">HQ</div>
                    <span className="text-slate-400">Lagos, Nigeria</span>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-white text-lg font-bold mb-6">Legal</h3>
                <ul className="space-y-3 text-sm">
                  <li><Link to="/privacy" className="hover:text-white transition-colors">{t('legal.privacy')}</Link></li>
                  <li><Link to="/terms" className="hover:text-white transition-colors">{t('legal.terms')}</Link></li>
                  <li><Link to="/refund" className="hover:text-white transition-colors">{t('legal.refund')}</Link></li>
                </ul>
                <div className="mt-6">
                  <p className="text-[10px] text-slate-500 italic leading-tight">
                    {t('disclaimer')}
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-12 pt-8 border-t border-slate-800 text-sm text-center text-slate-500">
              &copy; {new Date().getFullYear()} Independent Scholarship Portal. All rights reserved.
            </div>
          </div>
        </footer>
      )}

      {/* Mobile Bottom Navigation */}
      {!isAuthPage && !isApplying && (
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-[0_-4px_10px_rgba(0,0,0,0.05)] z-50 pb-safe">
          <div className="flex justify-around items-center h-16 px-4 relative">
            <Link to="/home" onClick={() => handleNavClick('/home')} className={`flex flex-col items-center justify-center w-16 transition-colors ${location.pathname === '/home' ? 'text-primary-700' : 'text-gray-500 hover:text-primary-700'}`}>
              <Home className="w-6 h-6 mb-1" />
              <span className="text-[10px] font-medium">Home</span>
            </Link>
            
            <Link to="/status" onClick={() => handleNavClick('/status')} className={`flex flex-col items-center justify-center w-16 transition-colors ${location.pathname === '/status' ? 'text-primary-700' : 'text-gray-500 hover:text-primary-700'}`}>
              <ClipboardList className="w-6 h-6 mb-1" />
              <span className="text-[10px] font-medium">Status</span>
            </Link>

            {/* Center Apply Now Button */}
            <div className="relative -top-6 flex justify-center w-16">
              <Link to="/apply-selection" onClick={handleApplyClick}>
                <div className="relative">
                  {!isApplying && (
                    <div className="absolute inset-0 bg-primary-500 rounded-full animate-ping opacity-75 duration-1000"></div>
                  )}
                  <motion.div 
                    animate={!isApplying ? {
                      scale: [1, 1, 1.25, 0.75, 1, 1],
                      rotate: [0, -5, 5, -5, 5, 0, 0, 0, 0, -5, 5, -5, 5, 0],
                      x: [0, -2, 2, -2, 2, 0, 0, 0, 0, -2, 2, -2, 2, 0]
                    } : { scale: 1, rotate: 0, x: 0 }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      ease: "easeInOut",
                      times: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.85, 0.9, 0.95, 1]
                    }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="relative flex items-center justify-center w-14 h-14 bg-primary-700 rounded-full shadow-lg border-4 border-white text-white"
                  >
                    <GraduationCap className="w-6 h-6" />
                  </motion.div>
                </div>
              </Link>
            </div>

            <Link to="/support" onClick={() => handleNavClick('/support')} className={`flex flex-col items-center justify-center w-16 transition-colors ${location.pathname === '/support' ? 'text-primary-700' : 'text-gray-500 hover:text-primary-700'}`}>
              <MessageSquare className="w-6 h-6 mb-1" />
              <span className="text-[10px] font-medium">Support</span>
            </Link>

            <Link to="/profile" onClick={() => handleNavClick('/profile')} className={`flex flex-col items-center justify-center w-16 transition-colors ${location.pathname === '/profile' ? 'text-primary-700' : 'text-gray-500 hover:text-primary-700'}`}>
              <User className="w-6 h-6 mb-1" />
              <span className="text-[10px] font-medium">Profile</span>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
