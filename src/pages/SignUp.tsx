import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { db } from '../firebase';
import { doc, setDoc } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { BackButton } from '../components/BackButton';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import { LegalModal } from '../components/LegalModal';

export default function SignUp() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const { currentUser, signUp, loginWithGoogle } = useAuth();
  const [modalType, setModalType] = useState<'privacy' | 'terms' | null>(null);
  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
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

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signUp(formData.email, formData.password, formData.fullName, formData.phoneNumber);
      toast.success('Account created! Verification email sent. Please check your inbox.');
      navigate('/login');
    } catch (error: any) {
      console.error(error);
      if (error.code === 'auth/email-already-in-use') {
        toast.error('This email is already in use. Please sign in instead.');
      } else {
        toast.error(error.message || 'Failed to create account');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    setLoading(true);
    try {
      await loginWithGoogle();
      toast.success('Successfully signed up with Google');
      navigate('/');
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || 'Failed to sign up with Google');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col overflow-x-hidden bg-slate-900">
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

      {/* Main Content Container */}
      <div className="relative z-10 w-full flex flex-col md:flex-row min-h-screen">
        {/* Left Side - Animation/Content (Desktop) */}
        <div className="hidden md:flex md:w-1/2 h-full flex-col items-center justify-center p-12 text-white">
          <div className="max-w-md space-y-6 animate-in fade-in slide-in-from-left duration-1000">
            <div className="w-24 h-24 rounded-full bg-white p-2 shadow-2xl">
              <img src="https://imgur.com/rPkGr5G.png" alt="Logo" className="w-full h-full object-contain" />
            </div>
            <p className="text-xl text-white/80 leading-relaxed">
              Join thousands of students achieving their dreams. 
              Create an account today and take the first step towards a brighter future with our comprehensive scholarship program.
            </p>
            <div className="flex gap-4 pt-4">
              <div className="flex -space-x-2">
                {[5, 6, 7, 8].map((i) => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-slate-200 overflow-hidden">
                    <img src={`https://picsum.photos/seed/${i + 20}/100/100`} alt="Student" />
                  </div>
                ))}
              </div>
              <p className="text-sm self-center text-white/70">Over 10,000 scholarships awarded</p>
            </div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="w-full md:w-1/2 flex items-center justify-center p-6 sm:p-12 lg:p-20">
          <div className="w-full max-w-md animate-in fade-in slide-in-from-right duration-1000 flex flex-col items-center">
            {/* Mobile Info Section */}
            <div className="md:hidden mb-8 text-center text-white space-y-4 w-full px-4">
              <p className="text-[13px] text-white/80 leading-snug max-w-[280px] mx-auto">
                Join thousands of students achieving their dreams. Create an account today and take the first step towards a brighter future with our comprehensive scholarship program.
              </p>
              <div className="flex flex-col items-center gap-4 pt-2">
                <div className="flex -space-x-3">
                  {[5, 6, 7, 8].map((i) => (
                    <div key={i} className="w-12 h-12 rounded-full border-2 border-white bg-slate-200 overflow-hidden shadow-[0_0_15px_rgba(255,255,255,0.4),0_0_10px_rgba(239,68,68,0.3)]">
                      <img src={`https://picsum.photos/seed/${i + 20}/100/100`} alt="Student" className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
                <p className="text-sm font-medium text-white/70">Over 10,000 scholarships awarded</p>
              </div>
            </div>

            <Card className="backdrop-blur-2xl bg-white/10 border-white/20 shadow-2xl text-white overflow-hidden w-full">
              <CardHeader className="text-center pb-2 pt-6 md:pt-10 md:pb-4 px-6">
                <div className="flex justify-center mb-4 md:mb-8">
                  <div className="w-16 h-16 md:w-24 md:h-24 rounded-full bg-white p-0 shadow-[0_0_25px_rgba(255,255,255,0.6),0_0_20px_rgba(239,68,68,0.5)] overflow-hidden border-4 border-white/50">
                    <img src="https://imgur.com/rPkGr5G.png" alt="Logo" className="w-full h-full object-cover" />
                  </div>
                </div>
                <div className="space-y-1 md:space-y-2">
                  <h2 className="text-lg md:text-xl font-bold text-white leading-tight">Aliko Dangote Scholarship Foundation</h2>
                  <CardTitle className="text-2xl md:text-3xl font-bold text-white">Create Account</CardTitle>
                  <CardDescription className="text-white/70 text-sm md:text-base">Sign up to apply for the scholarship</CardDescription>
                </div>
              </CardHeader>
              <CardContent className="flex flex-col gap-4 md:gap-6 p-5 md:p-8">
                <form onSubmit={handleSignUp} className="space-y-4 md:space-y-5">
                  <div className="space-y-1.5 md:space-y-2 text-left">
                    <Label htmlFor="fullName" className="text-xs md:text-sm font-semibold text-white/90 ml-1">Full Name</Label>
                    <Input
                      id="fullName"
                      name="fullName"
                      placeholder="John Doe"
                      required
                      className="h-10 md:h-12 bg-white/5 border-white/20 text-white placeholder:text-white/30 focus:bg-white/10 focus:border-white/40 transition-all rounded-lg text-sm"
                      value={formData.fullName}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="space-y-1.5 md:space-y-2 text-left">
                    <Label htmlFor="phoneNumber" className="text-xs md:text-sm font-semibold text-white/90 ml-1">Phone Number</Label>
                    <Input
                      id="phoneNumber"
                      name="phoneNumber"
                      type="tel"
                      placeholder="+1234567890"
                      required
                      className="h-10 md:h-12 bg-white/5 border-white/20 text-white placeholder:text-white/30 focus:bg-white/10 focus:border-white/40 transition-all rounded-lg text-sm"
                      value={formData.phoneNumber}
                      onChange={handleChange}
                    />
                  </div>
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
                      minLength={6}
                      className="h-10 md:h-12 bg-white/5 border-white/20 text-white placeholder:text-white/30 focus:bg-white/10 focus:border-white/40 transition-all rounded-lg text-sm"
                      value={formData.password}
                      onChange={handleChange}
                    />
                  </div>
                  
                  <Button type="submit" className="w-full h-10 md:h-12 text-base md:text-lg font-bold bg-green-600 hover:bg-green-500 text-white shadow-xl transition-all rounded-lg mt-1 md:mt-2" disabled={loading}>
                    {loading ? 'Creating account...' : 'Sign Up'}
                  </Button>
                </form>

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
                  onClick={handleGoogleSignUp} 
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
                  Sign up with Google
                </Button>

                <div className="mt-4 text-center text-sm">
                  <span className="text-white/60">Already have an account?</span>{' '}
                  <Link to="/login" className="text-green-400 hover:text-green-300 font-semibold transition-colors">
                    Sign in
                  </Link>
                </div>

                <div className="mt-4 text-center text-xs text-white/40">
                  <p className="mb-2">By signing up, you agree to our</p>
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
