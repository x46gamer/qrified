
import { useState } from 'react';
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
import NotFound from './pages/NotFound';
import AuthGuard from './components/AuthGuard';
import { Toaster } from 'sonner';
import { AppearanceSettingsProvider } from './contexts/AppearanceContext';

function App() {
  return (
    <AppearanceSettingsProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/faq" element={<FAQPage />} />
          <Route path="/privacy" element={<PrivacyPolicyPage />} />
          <Route path="/terms" element={<TermsOfServicePage />} />
          <Route path="/refund" element={<RefundPolicyPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/check" element={<ProductCheck />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route
            path="/dashboard"
            element={
              <AuthGuard>
                <Index />
              </AuthGuard>
            }
          />
          <Route
            path="/customize"
            element={
              <AuthGuard>
                <CustomizeApp />
              </AuthGuard>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster position="top-right" />
      </BrowserRouter>
    </AppearanceSettingsProvider>
  );
}

export default App;
