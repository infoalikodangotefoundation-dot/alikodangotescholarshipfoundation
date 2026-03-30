import React, { useEffect } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Globe, User, Home, ClipboardList, GraduationCap, Bell } from 'lucide-react';
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
  const { currentUser: user, userProfile } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  const handleNavClick = (path: string) => {
    if (location.pathname === path) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans">
      <header className="bg-white shadow-sm sticky top-0 z-50">
        {/* Global Marquee */}
        <div className="bg-green-700 text-white overflow-hidden py-2 flex items-center relative w-full">
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
              <Link to="/" onClick={() => handleNavClick('/')} className="text-xl font-bold text-green-700 flex items-center gap-2">
                <div className="w-8 h-8 bg-green-700 rounded-full flex items-center justify-center text-white font-bold">D</div>
                <span>Dangote Scholarship</span>
              </Link>
            </div>

            <div className="flex items-center space-x-4">
              <Link to="/" onClick={() => handleNavClick('/')} className={`font-medium px-3 py-2 rounded-md transition-colors ${location.pathname === '/' ? 'text-green-700 bg-green-50' : 'text-gray-700 hover:text-green-700'}`}>
                {t('nav.home')}
              </Link>
              <Link to="/benefits" onClick={() => handleNavClick('/benefits')} className={`font-medium px-3 py-2 rounded-md transition-colors ${location.pathname === '/benefits' ? 'text-green-700 bg-green-50' : 'text-gray-700 hover:text-green-700'}`}>
                {t('nav.benefits')}
              </Link>
              {user ? (
                <>
                  <Link to="/application-status" onClick={() => handleNavClick('/application-status')} className={`font-medium px-3 py-2 rounded-md transition-colors ${location.pathname === '/application-status' ? 'text-green-700 bg-green-50' : 'text-gray-700 hover:text-green-700'}`}>
                    Application Status
                  </Link>
                  {userProfile?.role === 'admin' && (
                    <Link to="/admin" onClick={() => handleNavClick('/admin')} className={`font-medium px-3 py-2 rounded-md transition-colors ${location.pathname === '/admin' ? 'text-green-700 bg-green-50' : 'text-gray-700 hover:text-green-700'}`}>
                      Admin Dashboard
                    </Link>
                  )}
                  <Link to="/profile" onClick={() => handleNavClick('/profile')} className={`font-medium px-3 py-2 rounded-md transition-colors flex items-center gap-2 ${location.pathname === '/profile' ? 'text-green-700 bg-green-50' : 'text-gray-700 hover:text-green-700'}`}>
                    <User className="w-4 h-4" />
                    Profile
                  </Link>
                </>
              ) : (
                <Link to="/login" onClick={() => handleNavClick('/login')}>
                  <Button className="bg-green-700 hover:bg-green-800 text-white">
                    {t('home.login')}
                  </Button>
                </Link>
              )}

              <DropdownMenu>
                <DropdownMenuTrigger render={<Button variant="outline" size="icon" className="rounded-full" />}>
                  <Globe className="h-4 w-4" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => changeLanguage('en')}>English</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => changeLanguage('fr')}>Français</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => changeLanguage('zh')}>中文</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => changeLanguage('ar')}>العربية</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>

        {/* Mobile Header */}
        <div className="md:hidden flex flex-col w-full bg-white shadow-sm">
          <div className="px-2 py-3 text-center overflow-hidden">
            <h1 className="text-green-700 font-bold text-[13px] sm:text-sm whitespace-nowrap">
              Aliko Dangote Scholarship Foundation Portal
            </h1>
          </div>
        </div>
      </header>

      <main className="flex-1 w-full min-h-screen bg-slate-50">
        <Outlet />
      </main>

      <FloatingChatbot />

      <footer className="bg-slate-900 text-slate-300 py-8 mt-auto pb-24 md:pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-white text-lg font-bold mb-4">Dangote Scholarship</h3>
              <p className="text-sm text-slate-400">
                Empowering Nigerian students to achieve their dreams at top global universities.
              </p>
            </div>
            <div>
              <h3 className="text-white text-lg font-bold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-sm">
                <li><Link to="/" className="hover:text-white transition-colors">{t('nav.home')}</Link></li>
                <li><Link to="/benefits" className="hover:text-white transition-colors">{t('nav.benefits')}</Link></li>
                <li><Link to="/apply" className="hover:text-white transition-colors">{t('home.apply_now')}</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white text-lg font-bold mb-4">Legal</h3>
              <ul className="space-y-2 text-sm">
                <li><Link to="/privacy" className="hover:text-white transition-colors">{t('legal.privacy')}</Link></li>
                <li><Link to="/terms" className="hover:text-white transition-colors">{t('legal.terms')}</Link></li>
                <li><Link to="/refund" className="hover:text-white transition-colors">{t('legal.refund')}</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white text-lg font-bold mb-4">Disclaimer</h3>
              <p className="text-xs text-slate-400 border-l-2 border-green-500 pl-3">
                {t('disclaimer')}
              </p>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-slate-800 text-sm text-center text-slate-500">
            &copy; {new Date().getFullYear()} Independent Scholarship Portal. All rights reserved.
          </div>
        </div>
      </footer>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-[0_-4px_10px_rgba(0,0,0,0.05)] z-50 pb-safe">
        <div className="flex justify-between items-center h-16 px-4 relative">
          <Link to="/" onClick={() => handleNavClick('/')} className={`flex flex-col items-center justify-center w-16 transition-colors ${location.pathname === '/' ? 'text-green-700' : 'text-gray-500 hover:text-green-700'}`}>
            <Home className="w-6 h-6 mb-1" />
            <span className="text-[10px] font-medium">Home</span>
          </Link>
          
          <Link to="/application-status" onClick={() => handleNavClick('/application-status')} className={`flex flex-col items-center justify-center w-16 transition-colors ${location.pathname === '/application-status' ? 'text-green-700' : 'text-gray-500 hover:text-green-700'}`}>
            <ClipboardList className="w-6 h-6 mb-1" />
            <span className="text-[10px] font-medium">Status</span>
          </Link>

          {/* Center Apply Now Button */}
          <div className="relative -top-6 flex justify-center w-16">
            <Link to="/apply" onClick={() => handleNavClick('/apply')}>
              <div className="relative">
                <div className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-75 duration-1000"></div>
                <div className="relative flex items-center justify-center w-14 h-14 bg-green-700 rounded-full shadow-lg border-4 border-white text-white hover:scale-105 transition-transform">
                  <GraduationCap className="w-6 h-6" />
                </div>
              </div>
            </Link>
          </div>

          <Link to="/notifications" onClick={() => handleNavClick('/notifications')} className={`flex flex-col items-center justify-center w-16 transition-colors ${location.pathname === '/notifications' ? 'text-green-700' : 'text-gray-500 hover:text-green-700'}`}>
            <Bell className="w-6 h-6 mb-1" />
            <span className="text-[10px] font-medium">Alerts</span>
          </Link>

          <Link to="/profile" onClick={() => handleNavClick('/profile')} className={`flex flex-col items-center justify-center w-16 transition-colors ${location.pathname === '/profile' ? 'text-green-700' : 'text-gray-500 hover:text-green-700'}`}>
            <User className="w-6 h-6 mb-1" />
            <span className="text-[10px] font-medium">Profile</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
