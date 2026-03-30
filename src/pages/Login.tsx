import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import { BackButton } from '../components/BackButton';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();
  const { currentUser, login, loginWithGoogle, resendVerificationEmail, reloadUser } = useAuth();
  const [unverified, setUnverified] = useState(location.state?.unverified || false);
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
      toast.error(error.message || 'Failed to login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-sm mx-auto">
      <Card className="border-none sm:border shadow-none sm:shadow-sm">
        <CardHeader className="text-center pb-2">
          <div className="flex justify-center mb-4">
            <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center shadow-[0_0_30px_rgba(204,0,0,0.45)] border border-red-100 overflow-hidden">
              <img src="https://imgur.com/rPkGr5G.png" alt="Aliko Dangote Scholarship Foundation" className="w-full h-full object-cover" />
            </div>
          </div>
          <CardTitle className="text-xl font-bold text-green-800">Welcome Back</CardTitle>
          <CardDescription className="text-xs">Sign in to continue your scholarship application</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <form onSubmit={handleEmailLogin} className="space-y-3">
            <div className="space-y-1">
              <Label htmlFor="email" className="text-xs">Email Address</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="john@example.com"
                required
                className="h-9 text-sm"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="password" className="text-xs">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                required
                className="h-9 text-sm"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
            <Button type="submit" className="w-full h-9 text-sm bg-green-700 hover:bg-green-800" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>

          {unverified && (
            <div className="bg-amber-50 border border-amber-200 rounded-md p-3 text-xs text-amber-800 flex flex-col gap-2">
              <p>Your email is not verified. Please check your inbox for the verification link.</p>
              <Button 
                variant="outline" 
                size="sm" 
                className="h-8 text-[10px] border-amber-300 bg-white hover:bg-amber-100 text-amber-800"
                onClick={handleResendVerification}
                disabled={loading}
              >
                {loading ? 'Sending...' : 'Resend Verification Email'}
              </Button>
              <Button 
                variant="link" 
                size="sm" 
                className="h-6 text-[10px] text-amber-900 underline"
                onClick={handleCheckVerification}
                disabled={loading}
              >
                I've verified my email
              </Button>
            </div>
          )}

          <div className="relative my-1">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-[10px] uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>

          <Button 
            onClick={handleGoogleLogin} 
            disabled={loading}
            variant="outline"
            className="w-full h-11 text-sm font-medium bg-white hover:bg-slate-50 border-slate-200 shadow-sm transition-all flex items-center justify-center gap-3"
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
          
          <div className="mt-2 text-center text-xs">
            Don't have an account?{' '}
            <Link to="/signup" className="text-green-700 hover:underline font-medium">
              Sign up
            </Link>
          </div>

          <div className="mt-1 text-center text-[10px] text-slate-500">
            <p className="mb-1">By signing in, you agree to our</p>
            <div className="flex justify-center gap-2">
              <Link to="/terms" className="text-green-700 hover:underline">Terms</Link>
              <span>&middot;</span>
              <Link to="/privacy" className="text-green-700 hover:underline">Privacy</Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
