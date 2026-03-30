import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { db } from '../firebase';
import { doc, setDoc } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { useAuth } from '../contexts/AuthContext';
import { BackButton } from '../components/BackButton';

export default function SignUp() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { currentUser, signUp, loginWithGoogle } = useAuth();
  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
    email: '',
    password: '',
  });

  useEffect(() => {
    if (currentUser) {
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
      toast.success('Account created successfully!');
      navigate('/');
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || 'Failed to create account');
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
    <div className="w-full max-w-sm mx-auto">
      <Card className="border-none sm:border shadow-none sm:shadow-sm">
        <CardHeader className="text-center pb-2">
          <div className="flex justify-center mb-4">
            <img src="https://imgur.com/rPkGr5G.png" alt="Aliko Dangote Scholarship Foundation" className="h-16 object-contain" />
          </div>
          <CardTitle className="text-xl font-bold text-green-800">Create Account</CardTitle>
          <CardDescription className="text-xs">Sign up to apply for the scholarship</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <form onSubmit={handleSignUp} className="space-y-3">
            <div className="space-y-1">
              <Label htmlFor="fullName" className="text-xs">Full Name</Label>
              <Input
                id="fullName"
                name="fullName"
                placeholder="John Doe"
                required
                className="h-9 text-sm"
                value={formData.fullName}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="phoneNumber" className="text-xs">Phone Number</Label>
              <Input
                id="phoneNumber"
                name="phoneNumber"
                type="tel"
                placeholder="+1234567890"
                required
                className="h-9 text-sm"
                value={formData.phoneNumber}
                onChange={handleChange}
              />
            </div>
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
                minLength={6}
                className="h-9 text-sm"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
            
            <Button type="submit" className="w-full h-9 text-sm bg-green-700 hover:bg-green-800" disabled={loading}>
              {loading ? 'Creating account...' : 'Sign Up'}
            </Button>
          </form>

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
            onClick={handleGoogleSignUp} 
            disabled={loading}
            className="w-full h-9 text-sm"
            variant="outline"
          >
            <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Google
          </Button>

          <div className="mt-2 text-center text-xs">
            Already have an account?{' '}
            <Link to="/login" className="text-green-700 hover:underline font-medium">
              Sign in
            </Link>
          </div>

          <div className="mt-1 text-center text-[10px] text-slate-500">
            <p className="mb-1">By signing up, you agree to our</p>
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
