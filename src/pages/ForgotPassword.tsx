import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { GraduationCap, Mail, ArrowLeft, Send, Loader2 } from 'lucide-react';
import { motion } from 'motion/react';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { resetPassword } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error('Please enter your email address');
      return;
    }

    setLoading(true);
    try {
      await resetPassword(email);
      setSubmitted(true);
      toast.success('Password reset email sent!');
    } catch (error: any) {
      console.error('Password reset error:', error);
      toast.error(error.message || 'Failed to send reset email');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 py-12">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-xl border border-slate-100"
      >
        <div className="text-center">
          <div className="mx-auto h-12 w-12 bg-primary-100 rounded-full flex items-center justify-center mb-4">
            <GraduationCap className="h-6 w-6 text-primary-700" />
          </div>
          <h2 className="text-3xl font-bold text-slate-900">Reset Password</h2>
          <p className="mt-2 text-sm text-slate-600">
            {submitted 
              ? "Check your inbox for further instructions" 
              : "Enter your email to receive a password reset link"}
          </p>
        </div>

        {!submitted ? (
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    className="pl-10"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-primary-700 hover:bg-primary-800 h-11 text-base font-semibold"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Send Reset Link
                </>
              )}
            </Button>
          </form>
        ) : (
          <div className="mt-8 p-4 bg-primary-50 border border-primary-100 rounded-xl text-center">
            <p className="text-primary-800 text-sm font-medium">
              We've sent a password reset link to <span className="font-bold">{email}</span>. 
              Please follow the instructions in the email to reset your password.
            </p>
            <Button 
              variant="outline" 
              className="mt-6 w-full border-primary-200 text-primary-700 hover:bg-primary-100"
              onClick={() => setSubmitted(false)}
            >
              Didn't receive it? Try again
            </Button>
          </div>
        )}

        <div className="text-center mt-6">
          <Link 
            to="/login" 
            className="inline-flex items-center text-sm font-semibold text-primary-700 hover:text-primary-800 transition-colors"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Login
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
