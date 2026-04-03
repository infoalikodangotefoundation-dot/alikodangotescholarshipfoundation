/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Benefits from './pages/Benefits';
import FAQ from './pages/FAQ';
import HowToApply from './pages/HowToApply';
import UniversityDetail from './pages/UniversityDetail';
import AdminDashboard from './pages/AdminDashboard';
import ApplicationForm from './pages/ApplicationForm';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import ForgotPassword from './pages/ForgotPassword';
import ApplicationSelection from './pages/ApplicationSelection';
import Profile from './pages/Profile';
import ResetPassword from './pages/ResetPassword';
import ApplicationStatus from './pages/ApplicationStatus';
import Notifications from './pages/Notifications';
import Legal from './pages/Legal';
import Support from './pages/Support';
import { Toaster } from 'sonner';
import { ErrorBoundary } from './components/ErrorBoundary';
import { AuthProvider, useAuth } from './contexts/AuthContext';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { currentUser, loading } = useAuth();
  if (loading) return null;
  if (!currentUser) return <Navigate to="/login" />;
  return <>{children}</>;
};

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <Router>
          <Toaster position="top-center" />
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Navigate to="/home" replace />} />
              <Route path="home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
              <Route path="benefits" element={<ProtectedRoute><Benefits /></ProtectedRoute>} />
              <Route path="faq" element={<ProtectedRoute><FAQ /></ProtectedRoute>} />
              <Route path="how-to-apply" element={<ProtectedRoute><HowToApply /></ProtectedRoute>} />
              <Route path="university/:id" element={<ProtectedRoute><UniversityDetail /></ProtectedRoute>} />
              <Route path="admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
              <Route path="apply-selection" element={<ProtectedRoute><ApplicationSelection /></ProtectedRoute>} />
              <Route path="apply" element={<ProtectedRoute><ApplicationForm /></ProtectedRoute>} />
              <Route path="login" element={<Login />} />
              <Route path="signup" element={<SignUp />} />
              <Route path="forgot-password" element={<ForgotPassword />} />
              <Route path="reset-password" element={<ResetPassword />} />
              <Route path="profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
              <Route path="status" element={<ProtectedRoute><ApplicationStatus /></ProtectedRoute>} />
              <Route path="notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
              <Route path="privacy" element={<ProtectedRoute><Legal type="privacy" /></ProtectedRoute>} />
              <Route path="terms" element={<ProtectedRoute><Legal type="terms" /></ProtectedRoute>} />
              <Route path="refund" element={<ProtectedRoute><Legal type="refund" /></ProtectedRoute>} />
              <Route path="support" element={<ProtectedRoute><Support /></ProtectedRoute>} />
            </Route>
          </Routes>
        </Router>
      </AuthProvider>
    </ErrorBoundary>
  );
}
