import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User, Mail, Phone, Shield, LogOut, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export default function Profile() {
  const { currentUser, userProfile, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out successfully');
      navigate('/home');
    } catch (error) {
      toast.error('Failed to logout');
    }
  };

  if (!currentUser) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Profile Sidebar */}
        <div className="w-full md:w-1/3 space-y-6">
          <Card className="border-slate-100 shadow-sm overflow-hidden">
            <div className="h-24 bg-green-700" />
            <CardContent className="pt-0 -mt-12 text-center">
              <div className="inline-flex items-center justify-center w-24 h-24 bg-white rounded-full border-4 border-white shadow-lg mb-4">
                <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center text-slate-400">
                  <User className="w-10 h-10" />
                </div>
              </div>
              <h2 className="text-xl font-bold text-slate-900">{userProfile?.fullName || 'User'}</h2>
              <p className="text-sm text-slate-500 mb-6">{currentUser.email}</p>
              <Button 
                variant="outline" 
                className="w-full border-red-100 text-red-600 hover:bg-red-50 hover:text-red-700"
                onClick={handleLogout}
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Profile Content */}
        <div className="w-full md:w-2/3 space-y-6">
          <Card className="border-slate-100 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-bold">Personal Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <Label className="text-xs text-slate-500 uppercase tracking-wider">Full Name</Label>
                  <div className="flex items-center gap-2 text-slate-900 font-medium">
                    <User className="w-4 h-4 text-slate-400" />
                    {userProfile?.fullName}
                  </div>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-slate-500 uppercase tracking-wider">Email Address</Label>
                  <div className="flex items-center gap-2 text-slate-900 font-medium">
                    <Mail className="w-4 h-4 text-slate-400" />
                    {currentUser.email}
                  </div>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-slate-500 uppercase tracking-wider">Phone Number</Label>
                  <div className="flex items-center gap-2 text-slate-900 font-medium">
                    <Phone className="w-4 h-4 text-slate-400" />
                    {userProfile?.phoneNumber || 'Not provided'}
                  </div>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-slate-500 uppercase tracking-wider">Account Role</Label>
                  <div className="flex items-center gap-2 text-slate-900 font-medium">
                    <Shield className="w-4 h-4 text-slate-400" />
                    <span className="capitalize">{userProfile?.role || 'Applicant'}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-100 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-bold">Account Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white rounded-lg shadow-sm">
                    <Calendar className="w-4 h-4 text-slate-600" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">Email Verification</p>
                    <p className="text-xs text-slate-500">
                      {currentUser.emailVerified ? 'Your email is verified' : 'Please verify your email'}
                    </p>
                  </div>
                </div>
                <div className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${currentUser.emailVerified ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                  {currentUser.emailVerified ? 'Verified' : 'Pending'}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function Label({ children, className }: { children: React.ReactNode, className?: string }) {
  return <p className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${className}`}>{children}</p>;
}
