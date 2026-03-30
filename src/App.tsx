/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Benefits from './pages/Benefits';
import UniversityDetail from './pages/UniversityDetail';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import AdminDashboard from './pages/AdminDashboard';
import ApplicationForm from './pages/ApplicationForm';
import ApplicationStatus from './pages/ApplicationStatus';
import Profile from './pages/Profile';
import Notifications from './pages/Notifications';
import Legal from './pages/Legal';
import { Toaster } from 'sonner';
import { ErrorBoundary } from './components/ErrorBoundary';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <Router>
          <Toaster position="top-center" />
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              } />
              <Route path="login" element={<Login />} />
              <Route path="signup" element={<SignUp />} />
              <Route path="benefits" element={<Benefits />} />
              <Route path="university/:id" element={<UniversityDetail />} />
              <Route path="application-status" element={
                <ProtectedRoute>
                  <ApplicationStatus />
                </ProtectedRoute>
              } />
              <Route path="profile" element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } />
              <Route path="notifications" element={
                <ProtectedRoute>
                  <Notifications />
                </ProtectedRoute>
              } />
              <Route path="admin" element={
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              } />
              <Route path="apply" element={
                <ProtectedRoute>
                  <ApplicationForm />
                </ProtectedRoute>
              } />
              <Route path="privacy" element={<Legal type="privacy" />} />
              <Route path="terms" element={<Legal type="terms" />} />
              <Route path="refund" element={<Legal type="refund" />} />
            </Route>
          </Routes>
        </Router>
      </AuthProvider>
    </ErrorBoundary>
  );
}
