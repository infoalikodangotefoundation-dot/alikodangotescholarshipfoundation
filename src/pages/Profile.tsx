import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import { updatePassword, sendPasswordResetEmail } from 'firebase/auth';
import { BackButton } from '../components/BackButton';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { LogOut, User, Lock, Mail, Phone, Shield } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function Profile() {
  const { currentUser: user, userProfile: userData, logout } = useAuth();
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
    } else {
      setLoading(false);
    }
  }, [user, navigate]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      toast.error('Failed to log out');
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return;
    }
    if (!auth.currentUser) return;
    try {
      await updatePassword(auth.currentUser, newPassword);
      toast.success('Password updated successfully');
      setNewPassword('');
    } catch (error: any) {
      if (error.code === 'auth/requires-recent-login') {
        toast.error('Please log out and log back in to change your password for security reasons.');
      } else {
        toast.error(error.message || 'Failed to update password.');
      }
    }
  };

  const handleForgotPassword = async () => {
    if (!user?.email) return;
    try {
      await sendPasswordResetEmail(auth, user.email);
      toast.success('Password reset email sent!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to send reset email');
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-12 pb-24 md:pb-12">
      <BackButton />
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Profile</h1>
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-8">
        <div className="p-6 border-b border-gray-200 bg-gray-50 flex items-center gap-3">
          <User className="w-6 h-6 text-green-700" />
          <h2 className="text-xl font-semibold text-gray-800">Personal Information</h2>
        </div>
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label className="text-gray-500 mb-1 block">Full Name</Label>
              <div className="flex items-center gap-2 text-gray-900 font-medium bg-gray-50 p-3 rounded-md border border-gray-100">
                <User className="w-4 h-4 text-gray-400" />
                {userData?.fullName || user?.displayName || 'Not provided'}
              </div>
            </div>
            <div>
              <Label className="text-gray-500 mb-1 block">Email Address</Label>
              <div className="flex items-center gap-2 text-gray-900 font-medium bg-gray-50 p-3 rounded-md border border-gray-100">
                <Mail className="w-4 h-4 text-gray-400" />
                {user?.email || 'Not provided'}
              </div>
            </div>
            <div>
              <Label className="text-gray-500 mb-1 block">Phone Number</Label>
              <div className="flex items-center gap-2 text-gray-900 font-medium bg-gray-50 p-3 rounded-md border border-gray-100">
                <Phone className="w-4 h-4 text-gray-400" />
                {userData?.phoneNumber || 'Not provided'}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-8">
        <div className="p-6 border-b border-gray-200 bg-gray-50 flex items-center gap-3">
          <Shield className="w-6 h-6 text-green-700" />
          <h2 className="text-xl font-semibold text-gray-800">Security</h2>
        </div>
        <div className="p-6 space-y-6">
          <form onSubmit={handlePasswordChange} className="space-y-4 max-w-md">
            <div>
              <Label htmlFor="newPassword">Change Password</Label>
              <div className="flex gap-3 mt-1">
                <Input
                  id="newPassword"
                  type="password"
                  placeholder="New password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="flex-1"
                />
                <Button type="submit" className="bg-green-700 hover:bg-green-800">Update</Button>
              </div>
            </div>
          </form>
          
          <div className="pt-4 border-t border-gray-100">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Forgot your password?</h3>
            <Button variant="outline" onClick={handleForgotPassword} className="text-gray-700">
              <Lock className="w-4 h-4 mr-2" />
              Send Reset Email
            </Button>
          </div>
        </div>
      </div>

      <div className="flex justify-center md:justify-start">
        <Button variant="destructive" onClick={handleLogout} className="w-full md:w-auto flex items-center gap-2">
          <LogOut className="w-4 h-4" />
          Log Out
        </Button>
      </div>
    </div>
  );
}
