import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../firebase';
import { collection, query, where, onSnapshot, doc, updateDoc } from 'firebase/firestore';
import { BackButton } from '../components/BackButton';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { CheckCircle2, XCircle, FileCheck, Search, Mail, Edit, Calendar, GraduationCap, BookOpen, CreditCard } from 'lucide-react';
import { toast } from 'sonner';
import { handleFirestoreError, OperationType } from '../lib/firestore-errors';
import { useAuth } from '../contexts/AuthContext';

export default function ApplicationStatus() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<any>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
      return;
    }

    const q = query(
      collection(db, 'applications'),
      where('userId', '==', currentUser.uid)
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const apps = querySnapshot.docs.map(doc => ({ id: doc.id, ...(doc.data() as any) }));
      // Sort by submittedAt descending
      apps.sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());
      setApplications(apps);
      setLoading(false);
    }, (error: any) => {
      if (error.message?.includes('Missing or insufficient permissions')) {
        handleFirestoreError(error, OperationType.LIST, `applications`);
      }
      console.error(error);
      toast.error('Failed to load application data');
      setLoading(false);
    });

    return () => unsubscribe();
  }, [navigate, currentUser]);

  const handleOpenModal = (app: any) => {
    setSelectedApp(app);
    setEditData(app);
    setIsEditing(false);
    setIsModalOpen(true);
  };

  const handleSaveEdit = async () => {
    if (!selectedApp) return;
    
    setSaving(true);
    try {
      const docRef = doc(db, 'applications', selectedApp.id);
      await updateDoc(docRef, {
        ...editData,
        hasBeenEdited: true
      });
      
      toast.success('Application updated successfully');
      setIsEditing(false);
      
      // Update local state for immediate feedback
      setSelectedApp({ ...editData, hasBeenEdited: true });
    } catch (error: any) {
      if (error.message?.includes('Missing or insufficient permissions')) {
        handleFirestoreError(error, OperationType.UPDATE, `applications/${selectedApp.id}`);
      }
      console.error(error);
      toast.error('Failed to update application');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  if (applications.length === 0) {
    return (
      <div className="max-w-4xl mx-auto py-12 text-center">
        <h2 className="text-2xl font-bold text-slate-800 mb-4">No Application Found</h2>
        <p className="text-slate-600 mb-8">You haven't submitted a scholarship application yet.</p>
        <Button onClick={() => navigate('/apply')} className="bg-green-700 hover:bg-green-800">
          Start Application
        </Button>
      </div>
    );
  }

  const getStatusIndex = (status: string) => {
    if (status === 'Submitted') return 0;
    if (status === 'Under Review') return 1;
    if (status === 'Approved' || status === 'Denied') return 2;
    return 0;
  };

  return (
    <div className="max-w-5xl mx-auto py-8 px-4">
      <BackButton />
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Application Status</h1>
          <p className="text-slate-600">Track the real-time progress of your scholarship applications.</p>
        </div>
        <Button onClick={() => navigate('/apply')} className="bg-green-700 hover:bg-green-800">
          Submit Another Application
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {applications.map((app) => (
          <Card key={app.id} className="cursor-pointer hover:shadow-md transition-shadow border-l-4 border-l-green-600" onClick={() => handleOpenModal(app)}>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg font-bold text-slate-800">
                  {app.applicationId || 'Application'}
                </CardTitle>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  app.status === 'Approved' ? 'bg-green-100 text-green-800' :
                  app.status === 'Denied' ? 'bg-red-100 text-red-800' :
                  app.status === 'Under Review' ? 'bg-blue-100 text-blue-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {app.status}
                </span>
              </div>
              <CardDescription>
                Submitted on {new Date(app.submittedAt).toLocaleDateString()}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm text-slate-600">
                <div className="flex items-center gap-2">
                  <GraduationCap className="w-4 h-4 text-slate-400" />
                  <span>{app.preferredUniversity || 'Not specified'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-slate-400" />
                  <span>{app.courseOfInterest || 'Not specified'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-slate-400" />
                  <span>Fee: {app.amountPaid || '₦5,000'}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">Application Details: {selectedApp?.applicationId}</DialogTitle>
            <DialogDescription>
              Review your application information.
            </DialogDescription>
          </DialogHeader>

          {selectedApp && (
            <div className="mt-4">
              {/* Status Tracker */}
              <div className="mb-8 p-4 bg-slate-50 rounded-lg border">
                <h3 className="font-semibold text-slate-800 mb-4">Current Status</h3>
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4 relative">
                  <div className="hidden sm:block absolute top-1/2 left-[16.66%] right-[16.66%] h-1 bg-slate-200 -translate-y-1/2 z-0">
                    <div 
                      className="h-full bg-green-500 transition-all duration-500" 
                      style={{ width: `${(getStatusIndex(selectedApp.status) / 2) * 100}%` }}
                    />
                  </div>
                  
                  {['Submitted', 'Under Review', 'Decision'].map((stage, idx) => {
                    const statusIdx = getStatusIndex(selectedApp.status);
                    const isActive = statusIdx >= idx;
                    const isCurrent = statusIdx === idx;
                    
                    let Icon = FileCheck;
                    if (idx === 1) Icon = Search;
                    if (idx === 2) {
                      if (selectedApp.status === 'Approved') Icon = CheckCircle2;
                      else if (selectedApp.status === 'Denied') Icon = XCircle;
                      else Icon = Mail;
                    }

                    return (
                      <div key={stage} className="flex flex-col items-center relative z-10 w-full sm:w-1/3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 transition-colors duration-300 ${
                          isActive ? (idx === 2 && selectedApp.status === 'Denied' ? 'bg-red-500 text-white' : 'bg-green-500 text-white') : 
                          'bg-slate-200 text-slate-400'
                        } ${isCurrent && idx === 1 ? 'shadow-[0_0_15px_rgba(59,130,246,0.5)] scale-110 bg-blue-500' : ''}`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <h4 className={`text-sm font-bold ${isActive ? 'text-slate-800' : 'text-slate-400'}`}>{stage}</h4>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Edit Notice & Toggle */}
              <div className="flex justify-between items-center mb-6 bg-blue-50 p-4 rounded-lg border border-blue-100">
                <div>
                  <h4 className="font-semibold text-blue-800">Edit Application</h4>
                  <p className="text-sm text-blue-600">
                    {selectedApp.hasBeenEdited 
                      ? "Editing is no longer allowed. You have already edited this application once." 
                      : "You can only edit this application once."}
                  </p>
                </div>
                {!selectedApp.hasBeenEdited && (
                  <Button 
                    variant={isEditing ? "outline" : "default"}
                    className={!isEditing ? "bg-blue-600 hover:bg-blue-700" : ""}
                    onClick={() => setIsEditing(!isEditing)}
                  >
                    {isEditing ? "Cancel Edit" : (
                      <>
                        <Edit className="w-4 h-4 mr-2" />
                        Edit Details
                      </>
                    )}
                  </Button>
                )}
              </div>

              {/* Application Data */}
              <div className="space-y-6">
                {/* Personal Information */}
                <div className="border rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-slate-800 mb-4 border-b pb-2">Personal Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1 md:col-span-2">
                      <Label>Full Name</Label>
                      {isEditing ? (
                        <Input value={editData.fullName || ''} onChange={e => setEditData({...editData, fullName: e.target.value})} />
                      ) : (
                        <p className="text-slate-700 font-medium">{selectedApp.fullName}</p>
                      )}
                    </div>
                    <div className="space-y-1">
                      <Label>Email</Label>
                      {isEditing ? (
                        <Input value={editData.email || ''} onChange={e => setEditData({...editData, email: e.target.value})} />
                      ) : (
                        <p className="text-slate-700 font-medium">{selectedApp.email}</p>
                      )}
                    </div>
                    <div className="space-y-1">
                      <Label>Phone</Label>
                      {isEditing ? (
                        <Input value={editData.phone || ''} onChange={e => setEditData({...editData, phone: e.target.value})} />
                      ) : (
                        <p className="text-slate-700 font-medium">{selectedApp.phone}</p>
                      )}
                    </div>
                    <div className="space-y-1">
                      <Label>Date of Birth</Label>
                      {isEditing ? (
                        <Input type="date" value={editData.dob || ''} onChange={e => setEditData({...editData, dob: e.target.value})} />
                      ) : (
                        <p className="text-slate-700 font-medium">{selectedApp.dob}</p>
                      )}
                    </div>
                    <div className="space-y-1">
                      <Label>Gender</Label>
                      {isEditing ? (
                        <Input value={editData.gender || ''} onChange={e => setEditData({...editData, gender: e.target.value})} />
                      ) : (
                        <p className="text-slate-700 font-medium">{selectedApp.gender}</p>
                      )}
                    </div>
                    <div className="space-y-1">
                      <Label>Nationality</Label>
                      {isEditing ? (
                        <Input value={editData.nationality || ''} onChange={e => setEditData({...editData, nationality: e.target.value})} />
                      ) : (
                        <p className="text-slate-700 font-medium">{selectedApp.nationality}</p>
                      )}
                    </div>
                    <div className="space-y-1">
                      <Label>State of Origin</Label>
                      {isEditing ? (
                        <Input value={editData.stateOfOrigin || ''} onChange={e => setEditData({...editData, stateOfOrigin: e.target.value})} />
                      ) : (
                        <p className="text-slate-700 font-medium">{selectedApp.stateOfOrigin}</p>
                      )}
                    </div>
                    <div className="space-y-1">
                      <Label>NIN</Label>
                      {isEditing ? (
                        <Input value={editData.nin || ''} onChange={e => setEditData({...editData, nin: e.target.value})} />
                      ) : (
                        <p className="text-slate-700 font-medium">{selectedApp.nin}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Academic Information */}
                <div className="border rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-slate-800 mb-4 border-b pb-2">Academic Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <Label>Preferred University</Label>
                      {isEditing ? (
                        <Input value={editData.preferredUniversity || ''} onChange={e => setEditData({...editData, preferredUniversity: e.target.value})} />
                      ) : (
                        <p className="text-slate-700 font-medium">{selectedApp.preferredUniversity}</p>
                      )}
                    </div>
                    <div className="space-y-1">
                      <Label>Course of Interest</Label>
                      {isEditing ? (
                        <Input value={editData.courseOfInterest || ''} onChange={e => setEditData({...editData, courseOfInterest: e.target.value})} />
                      ) : (
                        <p className="text-slate-700 font-medium">{selectedApp.courseOfInterest}</p>
                      )}
                    </div>
                    <div className="space-y-1">
                      <Label>Degree Level</Label>
                      {isEditing ? (
                        <Input value={editData.degreeLevel || ''} onChange={e => setEditData({...editData, degreeLevel: e.target.value})} />
                      ) : (
                        <p className="text-slate-700 font-medium">{selectedApp.degreeLevel}</p>
                      )}
                    </div>
                    <div className="space-y-1">
                      <Label>Secondary School</Label>
                      {isEditing ? (
                        <Input value={editData.secondarySchool || ''} onChange={e => setEditData({...editData, secondarySchool: e.target.value})} />
                      ) : (
                        <p className="text-slate-700 font-medium">{selectedApp.secondarySchool}</p>
                      )}
                    </div>
                    <div className="space-y-1">
                      <Label>Field of Study</Label>
                      {isEditing ? (
                        <Input value={editData.fieldOfStudy || ''} onChange={e => setEditData({...editData, fieldOfStudy: e.target.value})} />
                      ) : (
                        <p className="text-slate-700 font-medium">{selectedApp.fieldOfStudy}</p>
                      )}
                    </div>
                    <div className="space-y-1">
                      <Label>Undergraduate Degree</Label>
                      {isEditing ? (
                        <Input value={editData.undergradDegree || ''} onChange={e => setEditData({...editData, undergradDegree: e.target.value})} />
                      ) : (
                        <p className="text-slate-700 font-medium">{selectedApp.undergradDegree || 'N/A'}</p>
                      )}
                    </div>
                    <div className="space-y-1">
                      <Label>GPA</Label>
                      {isEditing ? (
                        <Input value={editData.gpa || ''} onChange={e => setEditData({...editData, gpa: e.target.value})} />
                      ) : (
                        <p className="text-slate-700 font-medium">{selectedApp.gpa || 'N/A'}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Essay */}
                <div className="border rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-slate-800 mb-4 border-b pb-2">Personal Statement</h3>
                  <div className="space-y-1">
                    {isEditing ? (
                      <Textarea 
                        value={editData.personalStatement || ''} 
                        onChange={e => setEditData({...editData, personalStatement: e.target.value})} 
                        className="min-h-[150px]"
                      />
                    ) : (
                      <p className="text-slate-700 whitespace-pre-wrap text-sm">{selectedApp.personalStatement}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="mt-6">
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Close
            </Button>
            {isEditing && (
              <Button 
                onClick={handleSaveEdit} 
                className="bg-green-600 hover:bg-green-700"
                disabled={saving}
              >
                {saving ? "Saving..." : "Save Changes"}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
