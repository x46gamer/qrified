
import { BrowserRouter, Route, Routes } from 'react-router-dom';
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
import Login from './pages/Login';
import Signup from './pages/Signup';
import AuthCallback from './pages/AuthCallback';
import NotFound from './pages/NotFound';
import AuthGuard from './components/AuthGuard';
import { Toaster } from 'sonner';
import { AppearanceSettingsProvider } from './contexts/AppearanceContext';
import { AuthProvider } from './contexts/AuthContext';
import AppLayout from './components/AppLayout';
import DashboardLayout from './components/DashboardLayout';
import Settings from './pages/Settings';

function App() {
  return (
    <AuthProvider>
      <AppearanceSettingsProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<AppLayout><LandingPage /></AppLayout>} />
            <Route path="/about" element={<AppLayout><AboutPage /></AppLayout>} />
            <Route path="/faq" element={<AppLayout><FAQPage /></AppLayout>} />
            <Route path="/privacy" element={<AppLayout><PrivacyPolicyPage /></AppLayout>} />
            <Route path="/terms" element={<AppLayout><TermsOfServicePage /></AppLayout>} />
            <Route path="/refund" element={<AppLayout><RefundPolicyPage /></AppLayout>} />
            <Route path="/contact" element={<AppLayout><ContactPage /></AppLayout>} />
            <Route path="/blog" element={<AppLayout><BlogPage /></AppLayout>} />
            <Route path="/check" element={<ProductCheck />} />
            <Route path="/login" element={<AppLayout><Login /></AppLayout>} />
            <Route path="/signup" element={<AppLayout><Signup /></AppLayout>} />
            <Route path="/auth/callback" element={<AuthCallback />} />
            <Route
              path="/dashboard"
              element={
                <AuthGuard>
                  <DashboardLayout>
                    <Index />
                  </DashboardLayout>
                </AuthGuard>
              }
            />
            <Route
              path="/customize"
              element={
                <AuthGuard>
                  <DashboardLayout>
                    <CustomizeApp />
                  </DashboardLayout>
                </AuthGuard>
              }
            />
            <Route
              path="/settings"
              element={
                <AuthGuard>
                  <DashboardLayout>
                    <Settings />
                  </DashboardLayout>
                </AuthGuard>
              }
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Toaster position="top-right" />
        </BrowserRouter>
      </AppearanceSettingsProvider>
    </AuthProvider>
  );
}

export default App;
