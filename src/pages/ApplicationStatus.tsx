import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ClipboardList, Clock, CheckCircle2, AlertCircle, ArrowRight, GraduationCap, Edit3, Calendar, Banknote } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { useApplicationStore } from '../store/useStore';

export default function ApplicationStatus() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const { updateData, setStep } = useApplicationStore();
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplications = async () => {
      if (!currentUser) return;
      try {
        const q = query(collection(db, 'applications'), where('email', '==', currentUser.email));
        const querySnapshot = await getDocs(q);
        const apps = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setApplications(apps);
      } catch (error) {
        console.error("Error fetching applications:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, [currentUser]);

  const canEdit = (submittedAt: string) => {
    const submissionDate = new Date(submittedAt);
    const now = new Date();
    const diffInDays = (now.getTime() - submissionDate.getTime()) / (1000 * 3600 * 24);
    return diffInDays <= 5;
  };

  const handleEdit = (app: any) => {
    updateData(app);
    setStep(1);
    navigate('/apply');
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-2 bg-green-100 rounded-xl">
          <ClipboardList className="w-6 h-6 text-green-700" />
        </div>
        <h1 className="text-3xl font-bold text-slate-900">Application Status</h1>
      </div>

      {applications.length === 0 ? (
        <Card className="border-slate-100 shadow-sm p-12 text-center">
          <div className="mx-auto h-16 w-16 bg-slate-50 rounded-full flex items-center justify-center mb-6">
            <ClipboardList className="h-8 w-8 text-slate-300" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">No Applications Found</h2>
          <p className="text-slate-500 mb-8 max-w-md mx-auto">
            You haven't submitted any scholarship applications yet. Start your journey today!
          </p>
          <Link to="/apply">
            <Button className="bg-green-700 hover:bg-green-800">
              Apply Now
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </Card>
      ) : (
        <div className="space-y-6">
          {applications.map((app) => {
            const editable = canEdit(app.submittedAt);
            const submissionDate = new Date(app.submittedAt);
            
            return (
              <Card key={app.id} className="border-slate-100 shadow-sm overflow-hidden">
                <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <GraduationCap className="w-4 h-4 text-green-700" />
                    <span className="text-sm font-bold text-slate-900 tracking-tight">TICKET ID: {app.applicationId}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                      app.status === 'Submitted' ? 'bg-blue-100 text-blue-700' :
                      app.status === 'Approved' ? 'bg-green-100 text-green-700' :
                      'bg-yellow-100 text-yellow-700'
                    }`}>
                      {app.status}
                    </div>
                    {editable && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="h-7 text-[10px] gap-1 px-2 border-green-200 text-green-700 hover:bg-green-50"
                        onClick={() => handleEdit(app)}
                      >
                        <Edit3 className="w-3 h-3" />
                        Edit
                      </Button>
                    )}
                  </div>
                </div>
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">University</p>
                        <p className="text-sm font-bold text-slate-900 line-clamp-1">{app.preferredUniversity}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Course</p>
                        <p className="text-sm font-medium text-slate-700 line-clamp-1">{app.courseOfInterest}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Fee Paid</p>
                        <p className="text-sm font-bold text-green-700">{app.amountPaid || '₦5,000'}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Submission Date</p>
                        <p className="text-sm text-slate-700">{submissionDate.toLocaleDateString()}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Submission Time</p>
                        <p className="text-sm text-slate-700">{submissionDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                      </div>
                    </div>
                    <div className="space-y-6 flex flex-col justify-center">
                      <div>
                        <div className="flex justify-between text-xs mb-2">
                          <span className="text-slate-500 font-medium">Application Progress</span>
                          <span className="font-bold text-green-700">
                            {app.status === 'Submitted' ? '60%' : app.status === 'Approved' ? '100%' : '40%'}
                          </span>
                        </div>
                        <Progress 
                          value={app.status === 'Submitted' ? 60 : app.status === 'Approved' ? 100 : 40} 
                          className="h-1.5 bg-slate-100" 
                        />
                      </div>
                      {!editable && (
                        <div className="flex items-center gap-2 text-[10px] text-slate-400 bg-slate-50 p-2 rounded border border-dashed">
                          <AlertCircle className="w-3 h-3" />
                          <span>Editing window closed (5 days passed)</span>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
