import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { Mail, Phone, MessageSquare, Send, CheckCircle2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { toast } from 'sonner';
import { auth, db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';

export default function Support() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  useEffect(() => {
    if (submitted) {
      const timer = setTimeout(() => {
        navigate('/status');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [submitted, navigate]);

  const generateTicketId = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = 'TKT-';
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  const handleFirestoreError = (error: any, operationType: string, path: string | null) => {
    const errInfo = {
      error: error instanceof Error ? error.message : String(error),
      authInfo: {
        userId: auth.currentUser?.uid,
        email: auth.currentUser?.email,
        emailVerified: auth.currentUser?.emailVerified,
        isAnonymous: auth.currentUser?.isAnonymous,
        tenantId: auth.currentUser?.tenantId,
        providerInfo: auth.currentUser?.providerData.map(provider => ({
          providerId: provider.providerId,
          displayName: provider.displayName,
          email: provider.email,
          photoUrl: provider.photoURL
        })) || []
      },
      operationType,
      path
    };
    console.error('Firestore Error: ', JSON.stringify(errInfo));
    throw new Error(JSON.stringify(errInfo));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const ticketId = generateTicketId();
      const path = 'support_tickets';
      try {
        await addDoc(collection(db, path), {
          ...formData,
          ticketId,
          userId: currentUser?.uid || 'anonymous',
          status: 'open',
          createdAt: serverTimestamp()
        });
      } catch (error) {
        handleFirestoreError(error, 'create', path);
      }

      setSubmitted(true);
    } catch (error) {
      console.error('Error submitting ticket:', error);
      toast.error('Failed to submit ticket. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative">
      {submitted && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="bg-red-600 text-white p-8 rounded-2xl shadow-2xl max-w-sm w-full text-center relative overflow-hidden border border-red-500"
          >
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                <CheckCircle2 className="w-10 h-10 text-white" />
              </div>
            </div>
            <h3 className="text-2xl font-bold mb-4">Success!</h3>
            <p className="text-white text-lg leading-relaxed mb-6">
              Your ticket has been submitted successfully. Pay attention to your email for response. Our team will respond to you within 24 to 48 hours.
            </p>
            <div className="absolute bottom-0 left-0 h-1.5 bg-white/30 w-full">
              <motion.div 
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 5, ease: "linear" }}
                className="h-full bg-white"
              />
            </div>
          </motion.div>
        </div>
      )}

      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-slate-900 mb-4">Help & Support</h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          Have questions or concerns? We're here to help. Submit a ticket and our team will assist you.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <Card className="border-slate-100 shadow-sm">
            <CardHeader>
              <CardTitle className="text-xl">Contact Information</CardTitle>
              <CardDescription>Direct ways to reach us</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-primary-50 rounded-lg">
                  <Mail className="w-5 h-5 text-primary-700" />
                </div>
                <div>
                  <p className="font-bold text-slate-900">Email</p>
                  <a 
                    href="mailto:info.alikodangotefoundation@gmail.com" 
                    className="text-sm text-slate-600 hover:text-primary-700 transition-colors underline decoration-dotted underline-offset-4 break-all"
                  >
                    info.alikodangotefoundation@gmail.com
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="p-2 bg-primary-50 rounded-lg">
                  <Phone className="w-5 h-5 text-primary-700" />
                </div>
                <div>
                  <p className="font-bold text-slate-900">Phone</p>
                  <a 
                    href="tel:+234800DANGOTE" 
                    className="text-sm text-slate-600 hover:text-primary-700 transition-colors underline decoration-dotted underline-offset-4"
                  >
                    +234 800 DANGOTE
                  </a>
                </div>
              </div>
              <div 
                className="flex items-start gap-4 cursor-pointer group"
                onClick={() => window.dispatchEvent(new CustomEvent('open-chatbot'))}
              >
                <div className="p-2 bg-primary-50 rounded-lg group-hover:bg-primary-100 transition-colors">
                  <MessageSquare className="w-5 h-5 text-primary-700" />
                </div>
                <div>
                  <p className="font-bold text-slate-900">Live Chat</p>
                  <p className="text-sm text-slate-600 group-hover:text-primary-700 transition-colors underline decoration-dotted underline-offset-4">
                    Available 24/7 via our chatbot
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-primary-700 text-white border-none shadow-lg">
            <CardContent className="p-6">
              <AlertCircle className="w-8 h-8 mb-4 opacity-80" />
              <h3 className="text-xl font-bold mb-2">Urgent Matters?</h3>
              <p className="text-primary-50 text-sm mb-4">
                For immediate assistance regarding payment verification or technical issues, please include your Ticket ID in the message.
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <Card className="border-slate-100 shadow-sm">
            <CardHeader>
              <CardTitle className="text-2xl">Submit a Ticket</CardTitle>
              <CardDescription>Fill out the form below and we'll respond within 24 hours.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input 
                      id="name" 
                      placeholder="Enter your full name" 
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      placeholder="Enter your email" 
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input 
                    id="subject" 
                    placeholder="What is your concern about?" 
                    required
                    value={formData.subject}
                    onChange={(e) => setFormData({...formData, subject: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea 
                    id="message" 
                    placeholder="Describe your issue in detail..." 
                    className="min-h-[150px]" 
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full bg-primary-700 hover:bg-primary-800 h-12 text-lg"
                  disabled={loading}
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <motion.div 
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                      />
                      Submitting...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Send className="w-5 h-5" />
                      Submit Ticket
                    </span>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
