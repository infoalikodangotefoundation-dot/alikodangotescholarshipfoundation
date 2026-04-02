import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ClipboardList, Clock, CheckCircle2, AlertCircle, ArrowRight, GraduationCap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Progress } from '@/components/ui/progress';

export default function ApplicationStatus() {
  const { currentUser } = useAuth();
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
          {applications.map((app) => (
            <Card key={app.id} className="border-slate-100 shadow-sm overflow-hidden">
              <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <GraduationCap className="w-4 h-4 text-green-700" />
                  <span className="text-sm font-bold text-slate-900">Application ID: {app.applicationId}</span>
                </div>
                <div className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                  app.status === 'Submitted' ? 'bg-blue-100 text-blue-700' :
                  app.status === 'Approved' ? 'bg-green-100 text-green-700' :
                  'bg-yellow-100 text-yellow-700'
                }`}>
                  {app.status}
                </div>
              </div>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <div>
                      <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Preferred University</p>
                      <p className="text-lg font-bold text-slate-900">{app.preferredUniversity}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Course of Interest</p>
                      <p className="text-slate-700">{app.courseOfInterest}</p>
                    </div>
                  </div>
                  <div className="space-y-6">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-slate-500">Application Progress</span>
                        <span className="font-bold text-green-700">60%</span>
                      </div>
                      <Progress value={60} className="h-2 bg-slate-100" />
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-1.5 text-slate-600">
                        <Clock className="w-4 h-4" />
                        <span>Submitted: {new Date(app.submittedAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

function Button({ children, className, ...props }: any) {
  return <button className={`inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-950 disabled:pointer-events-none disabled:opacity-50 text-white ${className}`} {...props}>{children}</button>;
}
