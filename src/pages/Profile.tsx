import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { User, Mail, Phone, Shield, LogOut, Calendar, Edit2, Save, X, Loader2, Camera, Upload, Key } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { storage, db } from '../firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { doc, updateDoc } from 'firebase/firestore';

export default function Profile() {
  const { currentUser, userProfile, logout, updateProfile, resetPassword } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [isSendingReset, setIsSendingReset] = useState(false);
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const [editData, setEditData] = useState({
    fullName: '',
    phoneNumber: ''
  });

  useEffect(() => {
    if (userProfile) {
      setEditData({
        fullName: userProfile.fullName || '',
        phoneNumber: userProfile.phoneNumber || ''
      });
    }
  }, [userProfile]);

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out successfully');
      navigate('/home');
    } catch (error) {
      toast.error('Failed to logout');
    }
  };

  const handlePasswordReset = async () => {
    if (!currentUser?.email) return;
    setIsSendingReset(true);
    try {
      await resetPassword(currentUser.email);
      toast.success('Password reset email sent! Please check your inbox.');
    } catch (error: any) {
      toast.error(error.message || 'Failed to send reset email');
    } finally {
      setIsSendingReset(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !currentUser) return;

    if (file.size > 2 * 1024 * 1024) {
      toast.error('Image size must be less than 2MB');
      return;
    }

    setIsUploading(true);
    try {
      const storageRef = ref(storage, `profile_pictures/${currentUser.uid}`);
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);
      
      await updateProfile({ photoURL: downloadURL });
      toast.success('Profile picture updated');
    } catch (error: any) {
      toast.error('Failed to upload image');
      console.error(error);
    } finally {
      setIsUploading(false);
    }
  };

  const startCamera = async () => {
    setShowCamera(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      toast.error('Could not access camera');
      setShowCamera(false);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
    }
    setShowCamera(false);
  };

  const capturePhoto = async () => {
    if (videoRef.current && canvasRef.current && currentUser) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx?.drawImage(video, 0, 0);
      
      canvas.toBlob(async (blob) => {
        if (blob) {
          setIsUploading(true);
          try {
            const storageRef = ref(storage, `profile_pictures/${currentUser.uid}`);
            await uploadBytes(storageRef, blob);
            const downloadURL = await getDownloadURL(storageRef);
            await updateProfile({ photoURL: downloadURL });
            toast.success('Photo captured and saved');
            stopCamera();
          } catch (error) {
            toast.error('Failed to save photo');
          } finally {
            setIsUploading(false);
          }
        }
      }, 'image/jpeg');
    }
  };

  const handleSave = async () => {
    if (!editData.fullName.trim()) {
      toast.error('Full name is required');
      return;
    }
    
    // Basic phone validation for Nigeria (+234 followed by 10 digits)
    const phoneRegex = /^\+234\d{10}$/;
    if (editData.phoneNumber && !phoneRegex.test(editData.phoneNumber)) {
      toast.error('Phone number must be in the format +234XXXXXXXXXX');
      return;
    }

    setIsSaving(true);
    try {
      await updateProfile(editData);
      toast.success('Profile updated successfully');
      setIsEditing(false);
    } catch (error: any) {
      toast.error(error.message || 'Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    if (userProfile) {
      setEditData({
        fullName: userProfile.fullName || '',
        phoneNumber: userProfile.phoneNumber || ''
      });
    }
    setIsEditing(false);
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
              <div className="relative inline-block group">
                <div className="inline-flex items-center justify-center w-24 h-24 bg-white rounded-full border-4 border-white shadow-lg mb-4 overflow-hidden">
                  {userProfile?.photoURL ? (
                    <img 
                      src={userProfile.photoURL} 
                      alt="Profile" 
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center text-slate-400">
                      <User className="w-10 h-10" />
                    </div>
                  )}
                  {isUploading && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center rounded-full">
                      <Loader2 className="w-6 h-6 text-white animate-spin" />
                    </div>
                  )}
                </div>
                
                <div className="absolute bottom-4 right-0 flex gap-1">
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="p-1.5 bg-white rounded-full shadow-md border border-slate-100 text-slate-600 hover:text-green-700 transition-colors"
                    title="Upload Photo"
                  >
                    <Upload className="w-3.5 h-3.5" />
                  </button>
                  <button 
                    onClick={startCamera}
                    className="p-1.5 bg-white rounded-full shadow-md border border-slate-100 text-slate-600 hover:text-green-700 transition-colors"
                    title="Take Photo"
                  >
                    <Camera className="w-3.5 h-3.5" />
                  </button>
                </div>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  className="hidden" 
                  accept="image/*"
                  onChange={handleFileUpload}
                />
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
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <CardTitle className="text-lg font-bold">Personal Information</CardTitle>
              {!isEditing ? (
                <Button variant="ghost" size="sm" onClick={() => setIsEditing(true)} className="text-green-700 hover:text-green-800 hover:bg-green-50">
                  <Edit2 className="w-4 h-4 mr-2" />
                  Edit Profile
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" onClick={handleCancel} disabled={isSaving} className="text-slate-500 hover:bg-slate-50">
                    <X className="w-4 h-4 mr-2" />
                    Cancel
                  </Button>
                  <Button size="sm" onClick={handleSave} disabled={isSaving} className="bg-green-700 hover:bg-green-800">
                    {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                    Save
                  </Button>
                </div>
              )}
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-xs text-slate-500 uppercase tracking-wider">Full Name</Label>
                  {isEditing ? (
                    <Input 
                      value={editData.fullName} 
                      onChange={(e) => setEditData(prev => ({ ...prev, fullName: e.target.value }))}
                      placeholder="Enter full name"
                      className="h-9"
                    />
                  ) : (
                    <div className="flex items-center gap-2 text-slate-900 font-medium h-9">
                      <User className="w-4 h-4 text-slate-400" />
                      {userProfile?.fullName}
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <Label className="text-xs text-slate-500 uppercase tracking-wider">Email Address</Label>
                  <div className="flex items-center gap-2 text-slate-500 font-medium h-9 bg-slate-50 px-3 rounded-md border border-slate-100 cursor-not-allowed">
                    <Mail className="w-4 h-4 text-slate-400" />
                    {currentUser.email}
                  </div>
                  {isEditing && <p className="text-[10px] text-slate-400 mt-1">Email cannot be changed from the profile page.</p>}
                </div>
                <div className="space-y-2">
                  <Label className="text-xs text-slate-500 uppercase tracking-wider">Phone Number</Label>
                  {isEditing ? (
                    <Input 
                      value={editData.phoneNumber} 
                      onChange={(e) => setEditData(prev => ({ ...prev, phoneNumber: e.target.value }))}
                      placeholder="+234XXXXXXXXXX"
                      className="h-9"
                    />
                  ) : (
                    <div className="flex items-center gap-2 text-slate-900 font-medium h-9">
                      <Phone className="w-4 h-4 text-slate-400" />
                      {userProfile?.phoneNumber || 'Not provided'}
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <Label className="text-xs text-slate-500 uppercase tracking-wider">Account Role</Label>
                  <div className="flex items-center gap-2 text-slate-900 font-medium h-9">
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

              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white rounded-lg shadow-sm">
                    <Key className="w-4 h-4 text-slate-600" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">Security</p>
                    <p className="text-xs text-slate-500">Update your account password</p>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="text-green-700 border-green-100 hover:bg-green-50"
                  onClick={handlePasswordReset}
                  disabled={isSendingReset}
                >
                  {isSendingReset ? <Loader2 className="w-3 h-3 mr-2 animate-spin" /> : null}
                  Change Password
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Camera Modal */}
          {showCamera && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
              <Card className="w-full max-w-md overflow-hidden">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Take Profile Photo</CardTitle>
                  <Button variant="ghost" size="icon" onClick={stopCamera}>
                    <X className="w-5 h-5" />
                  </Button>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="relative aspect-video bg-black">
                    <video 
                      ref={videoRef} 
                      autoPlay 
                      playsInline 
                      className="w-full h-full object-cover"
                    />
                    <canvas ref={canvasRef} className="hidden" />
                  </div>
                  <div className="p-4 flex justify-center gap-4">
                    <Button variant="outline" onClick={stopCamera}>Cancel</Button>
                    <Button 
                      className="bg-green-700 hover:bg-green-800"
                      onClick={capturePhoto}
                      disabled={isUploading}
                    >
                      {isUploading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Camera className="w-4 h-4 mr-2" />}
                      Capture & Save
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Label({ children, className }: { children: React.ReactNode, className?: string }) {
  return <p className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${className}`}>{children}</p>;
}
