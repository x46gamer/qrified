
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import ProductCheck from "./pages/ProductCheck";
import AdminFeedback from "./pages/AdminFeedback";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Settings from "./pages/Settings";
import { AuthProvider } from "./contexts/AuthContext";
import AuthGuard from "./components/AuthGuard";
import Header from "./components/Header";
import LandingPage from "./pages/LandingPage";
import AboutPage from "./pages/AboutPage";
import FAQPage from "./pages/FAQPage";
import ContactPage from "./pages/ContactPage";
import PrivacyPolicyPage from "./pages/PrivacyPolicyPage";
import TermsOfServicePage from "./pages/TermsOfServicePage";
import RefundPolicyPage from "./pages/RefundPolicyPage";
import BlogPage from "./pages/BlogPage";
import SupportPage from "./pages/SupportPage";
import Sidebar from "./components/Sidebar";
import AppLayout from "./components/AppLayout";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Landing page as the default route */}
            <Route path="/" element={<LandingPage />} />
            
            {/* Login and signup routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            
            {/* Footer pages */}
            <Route path="/about" element={<AboutPage />} />
            <Route path="/faq" element={<FAQPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
            <Route path="/terms-of-service" element={<TermsOfServicePage />} />
            <Route path="/refund-policy" element={<RefundPolicyPage />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/support" element={<SupportPage />} />
            
            {/* Allow product-check without login */}
            <Route path="/product-check" element={
              <AppLayout>
                <ProductCheck />
              </AppLayout>
            } />
            
            <Route path="/dashboard" element={
              <AuthGuard>
                <div className="flex h-screen overflow-hidden">
                  <Sidebar />
                  <div className="flex-1 overflow-y-auto bg-gradient-to-br from-gray-50 to-blue-50">
                    <Index />
                  </div>
                </div>
              </AuthGuard>
            } />
            
            <Route path="/admin/feedback" element={
              <AuthGuard requiredRole="admin">
                <div className="flex h-screen overflow-hidden">
                  <Sidebar />
                  <div className="flex-1 overflow-y-auto bg-gradient-to-br from-gray-50 to-blue-50">
                    <AdminFeedback />
                  </div>
                </div>
              </AuthGuard>
            } />
            
            {/* Redirect to login if not authenticated */}
            <Route path="*" element={
              <AuthGuard>
                <div className="flex h-screen overflow-hidden">
                  <Sidebar />
                  <div className="flex-1 overflow-y-auto bg-gradient-to-br from-gray-50 to-blue-50">
                    <NotFound />
                  </div>
                </div>
              </AuthGuard>
            } />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
