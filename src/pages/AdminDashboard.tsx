import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../firebase';
import { collection, onSnapshot, doc, updateDoc } from 'firebase/firestore';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import { BackButton } from '../components/BackButton';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Download, Search, CheckCircle, XCircle, Eye } from 'lucide-react';
import { toast } from 'sonner';
import { handleFirestoreError, OperationType } from '../lib/firestore-errors';

export default function AdminDashboard() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { currentUser, userProfile, loading: authLoading } = useAuth();
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedApp, setSelectedApp] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (authLoading) return;

    if (!currentUser || userProfile?.role !== 'admin') {
      navigate('/');
      return;
    }

    const unsubscribe = onSnapshot(collection(db, 'applications'), (querySnapshot) => {
      const appsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setApplications(appsData);
      setLoading(false);
    }, (error: any) => {
      if (error.message?.includes('Missing or insufficient permissions')) {
        handleFirestoreError(error, OperationType.LIST, 'applications');
      }
      console.error(error);
      toast.error('Failed to load applications');
      setLoading(false);
    });

    return () => unsubscribe();
  }, [navigate, currentUser, userProfile, authLoading]);

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      const docRef = doc(db, 'applications', id);
      await updateDoc(docRef, { status: newStatus });
      setApplications(apps => apps.map(app => app.id === id ? { ...app, status: newStatus } : app));
      toast.success(`Application status updated to ${newStatus}`);
    } catch (error: any) {
      if (error.message?.includes('Missing or insufficient permissions')) {
        handleFirestoreError(error, OperationType.UPDATE, `applications/${id}`);
      }
      console.error(error);
      toast.error('Failed to update status');
    }
  };

  const exportToCSV = () => {
    if (applications.length === 0) return;
    
    const headers = ['App ID', 'Full Name', 'Email', 'Phone', 'NIN', 'State', 'University', 'Course', 'Degree', 'Status', 'Amount Paid'];
    const csvData = applications.map(app => [
      app.applicationId || app.id, app.fullName || '', app.email, app.phone, app.nin, app.stateOfOrigin,
      app.preferredUniversity, app.courseOfInterest, app.degreeLevel, app.status, app.amountPaid || '₦5,000'
    ]);
    
    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.map(cell => `"${cell || ''}"`).join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'applications_export.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredApplications = applications.filter(app => {
    const fullName = (app.fullName || '').toLowerCase();
    const matchesSearch = fullName.includes(searchTerm.toLowerCase()) || 
                          app.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          app.applicationId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          app.nin?.includes(searchTerm);
    const matchesStatus = statusFilter === 'All' || app.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto py-8">
      <BackButton />
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Admin Dashboard</h1>
          <p className="text-slate-600">Manage all scholarship applications.</p>
        </div>
        <Button onClick={exportToCSV} className="bg-green-700 hover:bg-green-800">
          <Download className="w-4 h-4 mr-2" />
          Export CSV
        </Button>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200 mb-6 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
          <Input 
            placeholder="Search by name, email, or NIN..." 
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All Statuses</SelectItem>
            <SelectItem value="Submitted">Submitted</SelectItem>
            <SelectItem value="Under Review">Under Review</SelectItem>
            <SelectItem value="Approved">Approved</SelectItem>
            <SelectItem value="Denied">Denied</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50">
            <TableRow>
              <TableHead>App ID</TableHead>
              <TableHead>Applicant</TableHead>
              <TableHead>University & Course</TableHead>
              <TableHead>State & NIN</TableHead>
              <TableHead>Payment</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredApplications.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-slate-500">
                  No applications found matching your criteria.
                </TableCell>
              </TableRow>
            ) : (
              filteredApplications.map((app) => (
                <TableRow key={app.id}>
                  <TableCell className="font-medium text-slate-900">{app.applicationId || app.id.substring(0, 8)}</TableCell>
                  <TableCell>
                    <div className="font-medium text-slate-900">{app.fullName}</div>
                    <div className="text-xs text-slate-500">{app.email}</div>
                    <div className="text-xs text-slate-500">{app.phone}</div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium text-slate-900">{app.preferredUniversity}</div>
                    <div className="text-xs text-slate-500">{app.courseOfInterest}</div>
                    <div className="text-xs text-slate-500">{app.degreeLevel}</div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium text-slate-900">{app.stateOfOrigin}</div>
                    <div className="text-xs text-slate-500 font-mono">{app.nin}</div>
                  </TableCell>
                  <TableCell>
                    <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      {app.paymentStatus === 'pending_verification' ? 'Pending' : 'Paid'}
                    </div>
                    {app.paymentReference && (
                      <div className="text-xs text-slate-400 mt-1">
                        Ref: {app.paymentReference}
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      app.status === 'Approved' ? 'bg-green-100 text-green-800' :
                      app.status === 'Denied' ? 'bg-red-100 text-red-800' :
                      app.status === 'Under Review' ? 'bg-blue-100 text-blue-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {app.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button 
                        variant="outline" 
                        size="icon" 
                        title="View Details"
                        onClick={() => {
                          setSelectedApp(app);
                          setIsModalOpen(true);
                        }}
                      >
                        <Eye className="w-4 h-4 text-slate-600" />
                      </Button>
                      {app.status === 'Submitted' && (
                        <Button 
                          variant="outline" 
                          size="icon" 
                          className="border-blue-200 hover:bg-blue-50 hover:text-blue-700"
                          title="Mark as Received (Under Review)"
                          onClick={() => handleStatusChange(app.id, 'Under Review')}
                        >
                          <Search className="w-4 h-4 text-blue-600" />
                        </Button>
                      )}
                      <Button 
                        variant="outline" 
                        size="icon" 
                        className="border-green-200 hover:bg-green-50 hover:text-green-700"
                        title="Approve"
                        onClick={() => handleStatusChange(app.id, 'Approved')}
                        disabled={app.status === 'Approved'}
                      >
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="icon"
                        className="border-red-200 hover:bg-red-50 hover:text-red-700"
                        title="Deny"
                        onClick={() => handleStatusChange(app.id, 'Denied')}
                        disabled={app.status === 'Denied'}
                      >
                        <XCircle className="w-4 h-4 text-red-600" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Review Application: {selectedApp?.applicationId}</DialogTitle>
            <DialogDescription>
              Review the applicant's details.
            </DialogDescription>
          </DialogHeader>

          {selectedApp && (
            <div className="space-y-6 mt-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div><span className="font-semibold">Name:</span> {selectedApp.fullName}</div>
                <div><span className="font-semibold">Email:</span> {selectedApp.email}</div>
                <div><span className="font-semibold">Phone:</span> {selectedApp.phone}</div>
                <div><span className="font-semibold">NIN:</span> {selectedApp.nin}</div>
                <div><span className="font-semibold">University:</span> {selectedApp.preferredUniversity}</div>
                <div><span className="font-semibold">Course:</span> {selectedApp.courseOfInterest}</div>
                <div><span className="font-semibold">GPA:</span> {selectedApp.gpa || 'N/A'}</div>
                <div><span className="font-semibold">Payment Ref:</span> {selectedApp.paymentReference}</div>
              </div>

              <div className="space-y-2">
                <h4 className="font-semibold border-b pb-1">Documents</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedApp.passportUrl && <a href={selectedApp.passportUrl} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline text-sm">Passport</a>}
                  {selectedApp.waecResultUrl && <a href={selectedApp.waecResultUrl} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline text-sm">WAEC Result</a>}
                  {selectedApp.academicCertUrl && <a href={selectedApp.academicCertUrl} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline text-sm">Academic Cert</a>}
                  {selectedApp.recommendationUrl && <a href={selectedApp.recommendationUrl} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline text-sm">Recommendation</a>}
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-semibold border-b pb-1">Personal Statement</h4>
                <p className="text-sm whitespace-pre-wrap bg-slate-50 p-3 rounded">{selectedApp.personalStatement}</p>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
