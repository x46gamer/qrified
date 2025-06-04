import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Index from './pages/Index';
import CustomizeApp from './pages/CustomizeApp';
import AboutPage from './pages/AboutPage';
import FAQPage from './pages/FAQPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import TermsOfServicePage from './pages/TermsOfServicePage';
import RefundPolicyPage from './pages/RefundPolicyPage';
import ContactPage from './pages/ContactPage';
import BlogPage from './pages/BlogPage';
import ProductCheck from './pages/ProductCheck';
import Login from './pages/login';
import Signup from './pages/Signup';
import ForgotPassword from './pages/ForgotPassword';
import NotFound from './pages/NotFound';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import AuthGuard from './components/AuthGuard';
import { Toaster } from 'sonner';
import { AppearanceSettingsProvider } from './contexts/AppearanceContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import AppLayout from './components/AppLayout';
import DashboardLayout from './components/DashboardLayout';
import AdminLayout from './components/AdminLayout';
import { SidebarProvider } from './components/ui/sidebar';
import DomainSettings from './pages/DomainSettings';
import Settings from './pages/Settings';
import AdminFeedback from './pages/AdminFeedback';
import ScanLogs from './pages/ScanLogs';

// Public Pages
const CookiePolicyPage = lazy(() => import('./pages/CookiePolicyPage'));
const CareersPage = lazy(() => import('./pages/CareersPage'));
const DocumentationPage = lazy(() => import('./pages/DocumentationPage'));
const SupportCenterPage = lazy(() => import('./pages/SupportCenterPage'));
const CaseStudiesPage = lazy(() => import('./pages/CaseStudiesPage'));
const CommunityForumPage = lazy(() => import('./pages/CommunityForumPage'));
const PartnersPage = lazy(() => import('./pages/PartnersPage'));

function App() {
  return (
    <AuthProvider>
      <AppearanceSettingsProvider>
        <BrowserRouter>
          <Routes>
            {/* Public routes - accessible to all users */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/about" element={<AppLayout><AboutPage /></AppLayout>} />
            <Route path="/faq" element={<AppLayout><FAQPage /></AppLayout>} />
            <Route path="/privacy" element={<AppLayout><PrivacyPolicyPage /></AppLayout>} />
            <Route path="/terms" element={<AppLayout><TermsOfServicePage /></AppLayout>} />
            <Route path="/refund" element={<AppLayout><RefundPolicyPage /></AppLayout>} />
            <Route path="/contact" element={<AppLayout><ContactPage /></AppLayout>} />
            <Route path="/blog" element={<AppLayout><BlogPage /></AppLayout>} />
            <Route path="/check" element={<ProductCheck />} />
            
            {/* Authentication routes - only for non-authenticated users */}
            <Route path="/login" element={<AppLayout><Login /></AppLayout>} />
            <Route path="/signup" element={<AppLayout><Signup /></AppLayout>} />
            <Route path="/forgot-password" element={<AppLayout><ForgotPassword /></AppLayout>} />
            
            {/* Admin routes - completely separated auth system */}
            <Route path="/admin" element={<AdminLogin />} />
            <Route
              path="/admin/dashboard"
              element={
                <AuthGuard requiredRole="admin">
                  <AdminLayout>
                    <AdminDashboard />
                  </AdminLayout>
                </AuthGuard>
              }
            />
            
            {/* Dashboard routes - for authenticated users */}
            <Route
              path="/dashboard"
              element={
                <AuthGuard>
                  <SidebarProvider>
                    <DashboardLayout>
                      <Index />
                    </DashboardLayout>
                  </SidebarProvider>
                </AuthGuard>
              }
            />
            <Route
              path="/customize"
              element={
                <AuthGuard>
                  <SidebarProvider>
                    <DashboardLayout>
                      <CustomizeApp />
                    </DashboardLayout>
                  </SidebarProvider>
                </AuthGuard>
              }
            />
            <Route
              path="/settings"
              element={
                <AuthGuard>
                  <SidebarProvider>
                    <DashboardLayout>
                      <Settings />
                    </DashboardLayout>
                  </SidebarProvider>
                </AuthGuard>
              }
            />
            <Route
              path="/domains"
              element={
                <AuthGuard>
                  <SidebarProvider>
                    <DashboardLayout>
                      <DomainSettings />
                    </DashboardLayout>
                  </SidebarProvider>
                </AuthGuard>
              }
            />
            <Route
              path="/feedback"
              element={
                <AuthGuard>
                  <SidebarProvider>
                    <DashboardLayout>
                      <AdminFeedback />
                    </DashboardLayout>
                  </SidebarProvider>
                </AuthGuard>
              }
            />
            <Route
              path="/scanlogs"
              element={
                <AuthGuard>
                  <SidebarProvider>
                    <DashboardLayout>
                      <ScanLogs />
                    </DashboardLayout>
                  </SidebarProvider>
                </AuthGuard>
              }
            />
            <Route path="/cookie-policy" element={<CookiePolicyPage />} />
            <Route path="/careers" element={<CareersPage />} />
            <Route path="/docs" element={<DocumentationPage />} />
            <Route path="/support" element={<SupportCenterPage />} />
            <Route path="/case-studies" element={<CaseStudiesPage />} />
            <Route path="/community" element={<CommunityForumPage />} />
            <Route path="/partners" element={<PartnersPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Toaster position="top-right" />
        </BrowserRouter>
      </AppearanceSettingsProvider>
    </AuthProvider>
  );
}

const PrivateRoute = ({ children }: { children: JSX.Element }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    // Optionally return a loading spinner or null while checking auth status
    return <div className="flex items-center justify-center min-h-screen"><div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div></div>; // Example loading spinner
  }

  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

export default App;
