import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { auth, db } from '../firebase';
import { collection, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ClipboardList, Clock, CheckCircle2, AlertCircle, ArrowRight, GraduationCap, Edit3, Calendar, Banknote, Trash2, MessageSquare } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { useApplicationStore } from '../store/useStore';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function ApplicationStatus() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const { updateData, setStep } = useApplicationStore();
  const [applications, setApplications] = useState<any[]>([]);
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<any>(null);
  const [deleteType, setDeleteType] = useState<'application' | 'ticket'>('application');
  const [deleting, setDeleting] = useState(false);

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

  const fetchData = async () => {
    if (!currentUser) return;
    setLoading(true);
    try {
      // Fetch Applications
      const appPath = 'applications';
      try {
        const appQ = query(collection(db, appPath), where('email', '==', currentUser.email));
        const appSnapshot = await getDocs(appQ);
        const apps = appSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data(), type: 'application' }));
        setApplications(apps);
      } catch (error) {
        handleFirestoreError(error, 'list', appPath);
      }

      // Fetch Support Tickets
      const ticketPath = 'support_tickets';
      try {
        const ticketQ = query(collection(db, ticketPath), where('userId', '==', currentUser.uid));
        const ticketSnapshot = await getDocs(ticketQ);
        const tks = ticketSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data(), type: 'ticket' }));
        setTickets(tks);
      } catch (error) {
        handleFirestoreError(error, 'list', ticketPath);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [currentUser]);

  const canEdit = (submittedAt: any) => {
    if (!submittedAt) return false;
    const submissionDate = submittedAt.toDate ? submittedAt.toDate() : new Date(submittedAt);
    const now = new Date();
    const diffInDays = (now.getTime() - submissionDate.getTime()) / (1000 * 3600 * 24);
    return diffInDays <= 5;
  };

  const handleEdit = (app: any) => {
    updateData(app);
    setStep(1);
    navigate('/apply');
  };

  const handleDeleteClick = (item: any, type: 'application' | 'ticket') => {
    setItemToDelete(item);
    setDeleteType(type);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!itemToDelete) return;
    setDeleting(true);
    try {
      const collectionName = deleteType === 'application' ? 'applications' : 'support_tickets';
      const path = `${collectionName}/${itemToDelete.id}`;
      try {
        await deleteDoc(doc(db, collectionName, itemToDelete.id));
      } catch (error) {
        handleFirestoreError(error, 'delete', path);
      }
      
      const idLabel = deleteType === 'application' ? itemToDelete.applicationId : itemToDelete.ticketId;
      toast.success(`${deleteType === 'application' ? 'Application' : 'Ticket'} ${idLabel} deleted successfully`);
      
      if (deleteType === 'application') {
        setApplications(prev => prev.filter(a => a.id !== itemToDelete.id));
      } else {
        setTickets(prev => prev.filter(t => t.id !== itemToDelete.id));
      }
      setDeleteDialogOpen(false);
    } catch (error) {
      console.error(`Error deleting ${deleteType}:`, error);
      toast.error(`Failed to delete ${deleteType}`);
    } finally {
      setDeleting(false);
      setItemToDelete(null);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-2 bg-green-100 rounded-xl">
          <ClipboardList className="w-6 h-6 text-green-700" />
        </div>
        <h1 className="text-3xl font-bold text-slate-900">Status Dashboard</h1>
      </div>

      {/* Scholarship Applications Section */}
      <div className="mb-12">
        <div className="flex items-center gap-2 mb-6">
          <GraduationCap className="w-5 h-5 text-green-700" />
          <h2 className="text-xl font-bold text-slate-800">Scholarship Applications</h2>
        </div>

        {applications.length === 0 ? (
          <Card className="border-slate-100 shadow-sm p-8 text-center bg-white">
            <p className="text-slate-500 mb-4">No scholarship applications yet.</p>
            <Link to="/apply">
              <Button variant="outline" className="border-green-600 text-green-700 hover:bg-green-50">
                Apply Now
              </Button>
            </Link>
          </Card>
        ) : (
          <div className="space-y-6">
            {applications.map((app) => {
              const editable = canEdit(app.createdAt || app.submittedAt);
              const submissionDate = app.createdAt?.toDate ? app.createdAt.toDate() : new Date(app.submittedAt || Date.now());
              
              return (
                <Card key={app.id} className="border-slate-100 shadow-sm overflow-hidden">
                  <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-slate-900 tracking-tight uppercase">APP ID: {app.applicationId}</span>
                    </div>
                      <div className="flex items-center gap-3">
                        <div className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                          app.status === 'Submitted' ? 'bg-blue-100 text-blue-700' :
                          app.status === 'Approved' ? 'bg-green-100 text-green-700' :
                          'bg-yellow-100 text-yellow-700'
                        }`}>
                          {app.status}
                        </div>
                        <div className="flex items-center gap-2">
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
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="h-7 text-[10px] gap-1 px-2 border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300"
                            onClick={() => handleDeleteClick(app, 'application')}
                          >
                            <Trash2 className="w-3 h-3" />
                            Delete
                          </Button>
                        </div>
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
                          <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Date</p>
                          <p className="text-sm text-slate-700">{submissionDate.toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="space-y-6 flex flex-col justify-center">
                        <div>
                          <div className="flex justify-between text-xs mb-2">
                            <span className="text-slate-500 font-medium">Progress</span>
                            <span className="font-bold text-green-700">
                              {app.status === 'Submitted' ? '60%' : app.status === 'Approved' ? '100%' : '40%'}
                            </span>
                          </div>
                          <Progress 
                            value={app.status === 'Submitted' ? 60 : app.status === 'Approved' ? 100 : 40} 
                            className="h-1.5 bg-slate-100" 
                          />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Support Tickets Section */}
      <div>
        <div className="flex items-center gap-2 mb-6">
          <MessageSquare className="w-5 h-5 text-green-700" />
          <h2 className="text-xl font-bold text-slate-800">Support Tickets</h2>
        </div>

        {tickets.length === 0 ? (
          <Card className="border-slate-100 shadow-sm p-8 text-center bg-white">
            <p className="text-slate-500 mb-4">No support tickets yet.</p>
            <Link to="/support">
              <Button variant="outline" className="border-green-600 text-green-700 hover:bg-green-50">
                Contact Support
              </Button>
            </Link>
          </Card>
        ) : (
          <div className="space-y-6">
            {tickets.map((ticket) => {
              const submissionDate = ticket.createdAt?.toDate ? ticket.createdAt.toDate() : new Date();
              
              return (
                <Card key={ticket.id} className="border-slate-100 shadow-sm overflow-hidden">
                  <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-slate-900 tracking-tight uppercase">TICKET ID: {ticket.ticketId}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                        ticket.status === 'open' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'
                      }`}>
                        {ticket.status}
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="h-7 text-[10px] gap-1 px-2 border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300"
                        onClick={() => handleDeleteClick(ticket, 'ticket')}
                      >
                        <Trash2 className="w-3 h-3" />
                        Delete
                      </Button>
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Subject</p>
                          <p className="text-sm font-bold text-slate-900">{ticket.subject}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Submitted On</p>
                          <p className="text-sm text-slate-700">{submissionDate.toLocaleDateString()} {submissionDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Message</p>
                        <p className="text-sm text-slate-700 bg-slate-50 p-3 rounded-lg border border-slate-100 italic">
                          "{ticket.message}"
                        </p>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                        <div className="space-y-1">
                          <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Name Provided</p>
                          <p className="text-xs text-slate-600">{ticket.name}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Email Provided</p>
                          <p className="text-xs text-slate-600">{ticket.email}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-red-600 flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              Confirm Deletion
            </DialogTitle>
            <DialogDescription className="pt-2">
              Are you sure you want to delete {deleteType === 'application' ? 'application' : 'ticket'} <span className="font-bold text-slate-900">{deleteType === 'application' ? itemToDelete?.applicationId : itemToDelete?.ticketId}</span>? 
              <br /><br />
              This action is <span className="font-bold text-red-600">permanent</span> and cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4 gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
              disabled={deleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
              disabled={deleting}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {deleting ? "Deleting..." : `Yes, Delete ${deleteType === 'application' ? 'Application' : 'Ticket'}`}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
