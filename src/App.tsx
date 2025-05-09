
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
            
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            
            {/* Allow product-check without login */}
            <Route path="/product-check" element={
              <>
                <Header />
                <ProductCheck />
              </>
            } />
            
            <Route path="/dashboard" element={
              <AuthGuard>
                <>
                  <Header />
                  <Index />
                </>
              </AuthGuard>
            } />
            
            <Route path="/admin/feedback" element={
              <AuthGuard requiredRole="admin">
                <>
                  <Header />
                  <AdminFeedback />
                </>
              </AuthGuard>
            } />
            
            {/* Redirect to login if not authenticated */}
            <Route path="*" element={
              <AuthGuard>
                <>
                  <Header />
                  <NotFound />
                </>
              </AuthGuard>
            } />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
