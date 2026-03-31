import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { BackButton } from '../components/BackButton';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import { LegalModal } from '../components/LegalModal';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();
  const { currentUser, login, loginWithGoogle, resendVerificationEmail, reloadUser } = useAuth();
  const [unverified, setUnverified] = useState(location.state?.unverified || false);
  const [modalType, setModalType] = useState<'privacy' | 'terms' | null>(null);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  useEffect(() => {
    if (currentUser && currentUser.emailVerified) {
      navigate('/');
    }
  }, [currentUser, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setUnverified(false);
    try {
      await login(formData.email, formData.password);
      toast.success('Successfully logged in');
      navigate('/');
    } catch (error: any) {
      console.error(error);
      if (error.message === "EMAIL_NOT_VERIFIED") {
        setUnverified(true);
        toast.error('Please verify your email before signing in.');
      } else {
        toast.error(error.message || 'Failed to login');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResendVerification = async () => {
    setLoading(true);
    try {
      await resendVerificationEmail();
      toast.success('Verification email sent! Please check your inbox.');
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || 'Failed to resend verification email');
    } finally {
      setLoading(false);
    }
  };

  const handleCheckVerification = async () => {
    setLoading(true);
    try {
      await reloadUser();
      if (currentUser?.emailVerified) {
        toast.success('Email verified! You can now sign in.');
        setUnverified(false);
        navigate('/');
      } else {
        toast.error('Email still not verified. Please check your inbox.');
      }
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || 'Failed to check verification status');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      await loginWithGoogle();
      toast.success('Successfully logged in');
      navigate('/');
    } catch (error: any) {
      console.error(error);
      if (error.message === 'UNAUTHORIZED_DOMAIN') {
        toast.error('This domain is not authorized for Google login. Please contact support or use email login.');
      } else if (error.code === 'auth/popup-closed-by-user') {
        // Ignore
      } else {
        toast.error(error.message || 'Failed to login');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative h-screen w-full flex flex-col overflow-hidden bg-slate-900">
      {/* Background Video */}
      <div className="fixed inset-0 z-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover brightness-[0.3]"
        >
          <source src="https://cdn.create.vista.com/api/media/medium/619343248/stock-video-two-young-female-college-grads-taking-selfie-together-using-smartphone?token=" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Desktop Fixed Side Content */}
      <div className="hidden md:flex fixed top-0 left-0 w-1/3 lg:w-1/4 h-full z-20 p-12 flex-col justify-start pointer-events-none">
        <div className="pointer-events-auto space-y-6 animate-in fade-in slide-in-from-left duration-1000">
          <div className="w-24 h-24 rounded-full bg-white p-2 shadow-2xl">
            <img src="https://imgur.com/rPkGr5G.png" alt="Logo" className="w-full h-full object-contain" />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl lg:text-2xl font-bold text-white leading-tight">Aliko Dangote Scholarship Foundation</h2>
            <p className="text-white/70 text-sm lg:text-base leading-relaxed">
              Empowering the next generation of leaders through education and opportunity. 
              Sign in to continue your journey towards academic excellence.
            </p>
          </div>
          <div className="flex gap-4 pt-4">
            <div className="flex -space-x-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-slate-200 overflow-hidden">
                  <img src={`https://picsum.photos/seed/${i + 10}/100/100`} alt="Student" />
                </div>
              ))}
            </div>
            <p className="text-xs lg:text-sm self-center text-white/70">Join 5,000+ applicants this year</p>
          </div>
        </div>
      </div>

      {/* Main Content Container */}
      <div className="relative z-10 w-full flex flex-col md:flex-row h-full">
        {/* Spacer for fixed content on desktop */}
        <div className="hidden md:block md:w-1/3 lg:w-1/4 flex-shrink-0" />

        {/* Form Section - Scrollable */}
        <div className="w-full md:w-2/3 lg:w-3/4 h-full overflow-y-auto flex items-start justify-center p-6 sm:p-12 lg:p-20 custom-scrollbar">
          <div className="w-full max-w-md py-8 animate-in fade-in slide-in-from-right duration-1000 flex flex-col items-center">
            {/* Mobile Info Section (Only visible on mobile) */}
            <div className="md:hidden mb-8 text-center text-white space-y-4 w-full px-4">
              <div className="flex justify-center mb-6">
                <div className="w-20 h-20 rounded-full bg-white p-2 shadow-xl">
                  <img src="https://imgur.com/rPkGr5G.png" alt="Logo" className="w-full h-full object-contain" />
                </div>
              </div>
              <h2 className="text-xl font-bold text-white leading-tight">Aliko Dangote Scholarship Foundation</h2>
              <p className="text-[13px] text-white/80 leading-snug max-w-[280px] mx-auto">
                Join thousands of students achieving their dreams. Create an account today and take the first step towards a brighter future with our comprehensive scholarship program.
              </p>
              <div className="flex flex-col items-center gap-4 pt-2">
                <div className="flex -space-x-3">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="w-12 h-12 rounded-full border-2 border-white bg-slate-200 overflow-hidden shadow-[0_0_15px_rgba(255,255,255,0.4),0_0_10px_rgba(239,68,68,0.3)]">
                      <img src={`https://picsum.photos/seed/${i + 10}/100/100`} alt="Student" className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
                <p className="text-sm font-medium text-white/70">Over 10,000 scholarships awarded</p>
              </div>
            </div>

            <Card className="backdrop-blur-2xl bg-white/10 border-white/20 shadow-2xl text-white overflow-hidden w-full">
              <CardHeader className="text-center pb-2 pt-6 md:pt-10 md:pb-4 px-6">
                <div className="space-y-1 md:space-y-2">
                  <CardTitle className="text-2xl md:text-3xl font-bold text-white">Welcome Back</CardTitle>
                  <CardDescription className="text-white/70 text-sm md:text-base">Sign in to continue your scholarship application</CardDescription>
                </div>
              </CardHeader>
              <CardContent className="flex flex-col gap-4 md:gap-6 p-5 md:p-8">
                <form onSubmit={handleEmailLogin} className="space-y-4 md:space-y-5">
                  <div className="space-y-1.5 md:space-y-2 text-left">
                    <Label htmlFor="email" className="text-xs md:text-sm font-semibold text-white/90 ml-1">Email Address</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="john@example.com"
                      required
                      className="h-10 md:h-12 bg-white/5 border-white/20 text-white placeholder:text-white/30 focus:bg-white/10 focus:border-white/40 transition-all rounded-lg text-sm"
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="space-y-1.5 md:space-y-2 text-left">
                    <Label htmlFor="password" className="text-xs md:text-sm font-semibold text-white/90 ml-1">Password</Label>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      placeholder="••••••••"
                      required
                      className="h-10 md:h-12 bg-white/5 border-white/20 text-white placeholder:text-white/30 focus:bg-white/10 focus:border-white/40 transition-all rounded-lg text-sm"
                      value={formData.password}
                      onChange={handleChange}
                    />
                  </div>
                  <Button type="submit" className="w-full h-10 md:h-12 text-base md:text-lg font-bold bg-green-600 hover:bg-green-500 text-white shadow-xl transition-all rounded-lg mt-1 md:mt-2" disabled={loading}>
                    {loading ? 'Signing in...' : 'Sign In'}
                  </Button>
                </form>

                {unverified && (
                  <div className="bg-amber-500/20 border border-amber-500/30 rounded-lg p-4 text-sm text-amber-200 flex flex-col gap-3">
                    <p>Your email is not verified. Please check your inbox for the verification link.</p>
                    <div className="flex flex-col gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full h-9 text-xs border-amber-500/50 bg-amber-500/10 hover:bg-amber-500/20 text-amber-100"
                        onClick={handleResendVerification}
                        disabled={loading}
                      >
                        {loading ? 'Sending...' : 'Resend Verification Email'}
                      </Button>
                      <Button 
                        variant="link" 
                        size="sm" 
                        className="h-6 text-xs text-amber-200 underline hover:text-white"
                        onClick={handleCheckVerification}
                        disabled={loading}
                      >
                        I've verified my email
                      </Button>
                    </div>
                  </div>
                )}

                <div className="relative my-2">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-white/10" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-transparent px-2 text-white/40">
                      Or continue with
                    </span>
                  </div>
                </div>

                <Button 
                  onClick={handleGoogleLogin} 
                  disabled={loading}
                  variant="outline"
                  className="w-full h-11 text-sm font-medium bg-white/5 hover:bg-white/10 border-white/10 text-white shadow-sm transition-all flex items-center justify-center gap-3"
                >
                  <svg viewBox="0 0 24 24" className="w-5 h-5">
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      fill="#EA4335"
                    />
                  </svg>
                  Sign in with Google
                </Button>
                
                <div className="mt-4 text-center text-sm">
                  <span className="text-white/60">Don't have an account?</span>{' '}
                  <Link to="/signup" className="text-green-400 hover:text-green-300 font-semibold transition-colors">
                    Sign up
                  </Link>
                </div>

                <div className="mt-4 text-center text-xs text-white/40">
                  <p className="mb-2">By signing in, you agree to our</p>
                  <div className="flex justify-center gap-4">
                    <button 
                      onClick={() => setModalType('terms')}
                      className="hover:text-white transition-colors cursor-pointer"
                    >
                      Terms of Service
                    </button>
                    <button 
                      onClick={() => setModalType('privacy')}
                      className="hover:text-white transition-colors cursor-pointer"
                    >
                      Privacy Policy
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <LegalModal 
        isOpen={modalType !== null} 
        onClose={() => setModalType(null)} 
        type={modalType || 'terms'} 
      />
    </div>
  );
}
