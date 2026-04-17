import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { GraduationCap, ArrowRight } from 'lucide-react';

export default function Login() {
  const [loading, setLoading] = useState(false);
  const { loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/home';

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      await loginWithGoogle();
      toast.success('Logged in successfully with Google!');
      navigate(from, { replace: true });
    } catch (error: any) {
      toast.error(error.message || 'Google login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 py-12">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-xl border border-slate-100">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 bg-primary-100 rounded-full flex items-center justify-center mb-4">
            <GraduationCap className="h-6 w-6 text-primary-700" />
          </div>
          <h2 className="text-3xl font-bold text-slate-900">Welcome</h2>
          <p className="mt-2 text-sm text-slate-600">
            Sign in with Google to access the scholarship portal
          </p>
        </div>

        <div className="mt-8 space-y-6">
          <Button
            type="button"
            className="w-full bg-white hover:bg-slate-50 text-slate-900 border border-slate-200 h-12 text-base font-semibold shadow-sm transition-all"
            onClick={handleGoogleLogin}
            disabled={loading}
          >
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="h-5 w-5 mr-3" />
            {loading ? 'Signing in...' : 'Continue with Google'}
            {!loading && <ArrowRight className="ml-2 h-4 w-4" />}
          </Button>

          <p className="text-center text-xs text-slate-500">
            By signing in, you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  );
}
