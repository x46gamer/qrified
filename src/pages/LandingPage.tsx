
import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { useAuth } from '../contexts/AuthContext';
import { 
  CheckCircle, 
  Star, 
  ShoppingCart, 
  Users, 
  Shield, 
  ShieldCheck, 
  TrendingUp,
  MessageSquare,
  FileText,
  Settings,
  CreditCard,
  Lock
} from 'lucide-react';

const LandingPage: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Redirect authenticated users to dashboard
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="fixed top-0 w-full bg-white/80 backdrop-blur-sm z-50 border-b border-gray-100">
        <div className="container mx-auto py-4 px-4 md:px-6 flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold">QR Code Authentication System</h1>
          </div>
          <div className="flex gap-4">
            {isAuthenticated ? (
              <Button asChild variant="default">
                <Link to="/dashboard">Go to Dashboard</Link>
              </Button>
            ) : (
              <>
                <Button asChild variant="outline">
                  <Link to="/login">Login</Link>
                </Button>
                <Button asChild>
                  <Link to="/signup">Get Started</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="container mx-auto text-center max-w-4xl">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Your Products Deserve Authenticity.
          </h1>
          <h2 className="text-xl md:text-2xl text-gray-600 mb-10 max-w-3xl mx-auto">
            Stop Fakes, Build Trust, and Collect Real Feedback — Instantly.
          </h2>
          <p className="text-lg text-gray-500 mb-10 max-w-2xl mx-auto">
            Launch your smart QR code authentication system in minutes. Designed for Algerian merchants. 
            Powered by modern encryption, analytics, and customer feedback tools.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Button size="lg" asChild className="px-8">
              <Link to="/product-check">Try the Demo</Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="px-8">
              <Link to="#">Watch How It Works</Link>
            </Button>
          </div>
          <div className="bg-gray-50 rounded-xl p-8 shadow-sm max-w-2xl mx-auto">
            <div className="flex flex-col items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">📱</span>
                </div>
                <div className="text-3xl">➡️</div>
                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-lg flex items-center justify-center">
                  <CheckCircle size={32} />
                </div>
                <div className="text-3xl">➡️</div>
                <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-lg flex items-center justify-center">
                  <Star size={32} />
                </div>
              </div>
              <p className="text-gray-600 mt-4">Customer scans QR code → Verification → Leaves review</p>
            </div>
          </div>
        </div>
      </section>

      {/* Who It's For */}
      <section className="py-20 bg-gray-50 px-4">
        <div className="container mx-auto text-center max-w-5xl">
          <h2 className="text-3xl md:text-4xl font-bold mb-12">Built for Smart Sellers Who Want to Stay Ahead</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShoppingCart size={32} />
              </div>
              <h3 className="font-bold text-lg mb-2">E-commerce Merchants</h3>
              <p className="text-gray-600">Add authenticity & boost conversions</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield size={32} />
              </div>
              <h3 className="font-bold text-lg mb-2">Local Brands</h3>
              <p className="text-gray-600">Protect reputation from cheap copies</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="w-16 h-16 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users size={32} />
              </div>
              <h3 className="font-bold text-lg mb-2">Wholesale Distributors</h3>
              <p className="text-gray-600">Manage large batches with ease</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp size={32} />
              </div>
              <h3 className="font-bold text-lg mb-2">Dropshippers</h3>
              <p className="text-gray-600">Give your product a professional edge</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-5xl">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">3 Simple Steps to Secure Your Products</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 relative">
              <div className="absolute -top-4 -left-4 w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold text-lg">1</div>
              <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center mb-4">
                <FileText size={32} />
              </div>
              <h3 className="font-bold text-lg mb-2">Generate Encrypted QR Codes</h3>
              <p className="text-gray-600">Customize template, quantity, and branding</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 relative">
              <div className="absolute -top-4 -left-4 w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold text-lg">2</div>
              <div className="w-16 h-16 bg-green-100 text-green-600 rounded-lg flex items-center justify-center mb-4">
                <FileText size={32} />
              </div>
              <h3 className="font-bold text-lg mb-2">Print & Attach</h3>
              <p className="text-gray-600">Your team can print in bulk — no tech skills needed</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 relative">
              <div className="absolute -top-4 -left-4 w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold text-lg">3</div>
              <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-lg flex items-center justify-center mb-4">
                <CheckCircle size={32} />
              </div>
              <h3 className="font-bold text-lg mb-2">Scan & Verify</h3>
              <p className="text-gray-600">Customers scan to verify product and leave reviews</p>
            </div>
          </div>
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-6 mt-10 text-center">
            <p className="text-blue-800 font-medium">
              "Each QR code is one-time use, AES-encrypted, and tracked with full analytics."
            </p>
          </div>
        </div>
      </section>

      {/* Features Overview */}
      <section className="py-20 bg-gray-50 px-4">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">All-in-One Platform. Packed with Smart Features.</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center mb-4">
                <FileText size={24} />
              </div>
              <h3 className="font-bold text-lg mb-2">QR Code Generator</h3>
              <ul className="text-gray-600 list-disc pl-5 space-y-1">
                <li>Create 1–100 codes at once</li>
                <li>Auto-numbering & encrypted IDs</li>
                <li>4 ready-to-use design templates + RTL Arabic layout</li>
              </ul>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center mb-4">
                <Settings size={24} />
              </div>
              <h3 className="font-bold text-lg mb-2">Admin Panel</h3>
              <ul className="text-gray-600 list-disc pl-5 space-y-1">
                <li>Track scans, reviews & feedback</li>
                <li>Enable/disable codes</li>
                <li>Customize success/failure pages</li>
                <li>Export reports</li>
              </ul>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="w-12 h-12 bg-green-100 text-green-600 rounded-lg flex items-center justify-center mb-4">
                <Users size={24} />
              </div>
              <h3 className="font-bold text-lg mb-2">Employee Panel</h3>
              <ul className="text-gray-600 list-disc pl-5 space-y-1">
                <li>Limited access</li>
                <li>QR printing only</li>
                <li>Safe for team use</li>
              </ul>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-lg flex items-center justify-center mb-4">
                <MessageSquare size={24} />
              </div>
              <h3 className="font-bold text-lg mb-2">Customer Feedback System</h3>
              <ul className="text-gray-600 list-disc pl-5 space-y-1">
                <li>Star ratings (1–5)</li>
                <li>Comments + photo uploads</li>
                <li>Linked directly to QR</li>
              </ul>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center mb-4">
                <TrendingUp size={24} />
              </div>
              <h3 className="font-bold text-lg mb-2">Analytics Dashboard</h3>
              <ul className="text-gray-600 list-disc pl-5 space-y-1">
                <li>Scan rate trends</li>
                <li>Enable/disable ratio</li>
                <li>Pie charts, bar graphs</li>
                <li>Full activity log</li>
              </ul>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center mb-4">
                <Settings size={24} />
              </div>
              <h3 className="font-bold text-lg mb-2">Custom Branding</h3>
              <ul className="text-gray-600 list-disc pl-5 space-y-1">
                <li>Add your logo</li>
                <li>Choose colors for success/failure pages</li>
                <li>Control every message the user sees</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Localized for Algeria */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">Made with Algerian Merchants in Mind</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="flex items-start gap-3">
              <div className="text-blue-600 shrink-0">
                <CheckCircle size={20} />
              </div>
              <p>Arabic (RTL) support</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="text-blue-600 shrink-0">
                <CheckCircle size={20} />
              </div>
              <p>Dinar-based pricing</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="text-blue-600 shrink-0">
                <CheckCircle size={20} />
              </div>
              <p>BaridiMob / CCP payment</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="text-blue-600 shrink-0">
                <CheckCircle size={20} />
              </div>
              <p>Local hosting + privacy compliant</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="text-blue-600 shrink-0">
                <CheckCircle size={20} />
              </div>
              <p>Fast setup, no tech skills needed</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 bg-gray-50 px-4">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">Simple, Transparent Pricing for Every Stage</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Starter Plan */}
            <div className="bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-sm transition-all hover:shadow-md">
              <div className="p-6 border-b">
                <h3 className="font-bold text-xl mb-1">Starter</h3>
                <p className="text-gray-600 mb-4">For solo entrepreneurs</p>
                <div className="flex items-end gap-1">
                  <span className="text-3xl font-bold">1,200 DZD</span>
                  <span className="text-gray-500 mb-1">/month</span>
                </div>
              </div>
              <div className="p-6 space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle size={18} className="text-green-500" />
                    <span>100 QR Codes / month</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle size={18} className="text-green-500" />
                    <span>Limited Templates</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle size={18} className="text-green-500" />
                    <span>Employee Panel</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-400">
                    <div className="text-gray-300">✕</div>
                    <span>Admin Panel</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-400">
                    <div className="text-gray-300">✕</div>
                    <span>Analytics</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-400">
                    <div className="text-gray-300">✕</div>
                    <span>Custom Pages</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-400">
                    <div className="text-gray-300">✕</div>
                    <span>Reviews</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle size={18} className="text-green-500" />
                    <span>Email Support</span>
                  </div>
                </div>
              </div>
              <div className="p-6 border-t">
                <Button className="w-full">Start Free</Button>
              </div>
            </div>

            {/* Pro Plan */}
            <div className="bg-white rounded-2xl overflow-hidden border-2 border-blue-500 shadow-md transform scale-105 relative">
              <div className="absolute -top-3 left-0 w-full flex justify-center">
                <div className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                  Most Popular
                </div>
              </div>
              <div className="p-6 border-b bg-blue-50">
                <h3 className="font-bold text-xl mb-1">Pro</h3>
                <p className="text-gray-600 mb-4">For growing businesses</p>
                <div className="flex items-end gap-1">
                  <span className="text-3xl font-bold">2,500 DZD</span>
                  <span className="text-gray-500 mb-1">/month</span>
                </div>
              </div>
              <div className="p-6 space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle size={18} className="text-green-500" />
                    <span>500 QR Codes / month</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle size={18} className="text-green-500" />
                    <span>Full Templates</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle size={18} className="text-green-500" />
                    <span>Employee Panel</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle size={18} className="text-green-500" />
                    <span>Admin Panel</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle size={18} className="text-green-500" />
                    <span>Full Analytics</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle size={18} className="text-green-500" />
                    <span>Custom Pages</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle size={18} className="text-green-500" />
                    <span>Reviews System</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle size={18} className="text-green-500" />
                    <span>Priority Support</span>
                  </div>
                </div>
              </div>
              <div className="p-6 border-t">
                <Button className="w-full">Upgrade Now</Button>
              </div>
            </div>

            {/* Lifetime Plan */}
            <div className="bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-sm transition-all hover:shadow-md">
              <div className="p-6 border-b">
                <h3 className="font-bold text-xl mb-1">Lifetime Deal</h3>
                <p className="text-gray-600 mb-4">For agencies & resellers</p>
                <div className="flex items-end gap-1">
                  <span className="text-3xl font-bold">15,000 DZD</span>
                  <span className="text-gray-500 mb-1">one-time</span>
                </div>
              </div>
              <div className="p-6 space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle size={18} className="text-green-500" />
                    <span>Unlimited QR Codes</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle size={18} className="text-green-500" />
                    <span>Full Templates</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle size={18} className="text-green-500" />
                    <span>Employee Panel</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle size={18} className="text-green-500" />
                    <span>Admin Panel</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle size={18} className="text-green-500" />
                    <span>Full Analytics</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle size={18} className="text-green-500" />
                    <span>Custom Pages</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle size={18} className="text-green-500" />
                    <span>Reviews System</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle size={18} className="text-green-500" />
                    <span>Priority Support</span>
                  </div>
                </div>
              </div>
              <div className="p-6 border-t">
                <Button variant="outline" className="w-full">Buy Lifetime Access</Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials/Social Proof */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">Merchants Already Love It</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="flex gap-2 mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} size={20} className="fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-gray-700 mb-4">
                "Since using the QR system, my returns dropped by 30%. Customers trust us more."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-200"></div>
                <div>
                  <p className="font-medium">Yasmine</p>
                  <p className="text-sm text-gray-500">Local Skincare Brand Owner</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="flex gap-2 mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} size={20} className="fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-gray-700 mb-4">
                "We use it to collect reviews with every order. Game changer."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-200"></div>
                <div>
                  <p className="font-medium">Walid</p>
                  <p className="text-sm text-gray-500">Dropshipper</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tech Stack & Security */}
      <section className="py-20 bg-gray-900 text-white px-4">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">Built with the Latest Tech, So You Don't Have to Worry</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-gray-800 p-6 rounded-xl">
              <div className="flex items-center gap-3 mb-4">
                <Lock size={24} className="text-green-400" />
                <h3 className="font-bold text-lg">AES-256 Encryption</h3>
              </div>
              <p className="text-gray-300">
                Every QR code is encrypted using industry-standard AES-256, ensuring that product data stays protected from tampering or duplication.
              </p>
            </div>
            <div className="bg-gray-800 p-6 rounded-xl">
              <div className="flex items-center gap-3 mb-4">
                <ShieldCheck size={24} className="text-green-400" />
                <h3 className="font-bold text-lg">One-Time Validation</h3>
              </div>
              <p className="text-gray-300">
                Each QR code becomes invalid after it's scanned once — preventing reuse or counterfeiting attempts.
              </p>
            </div>
            <div className="bg-gray-800 p-6 rounded-xl">
              <div className="flex items-center gap-3 mb-4">
                <Users size={24} className="text-green-400" />
                <h3 className="font-bold text-lg">Isolated Permissions</h3>
              </div>
              <p className="text-gray-300">
                Admins control settings, analytics, and feedback. Employees only access QR generation — keeping your data secure from internal leaks.
              </p>
            </div>
            <div className="bg-gray-800 p-6 rounded-xl">
              <div className="flex items-center gap-3 mb-4">
                <CreditCard size={24} className="text-green-400" />
                <h3 className="font-bold text-lg">Mobile-First Design</h3>
              </div>
              <p className="text-gray-300">
                Fully responsive and optimized for all devices, ensuring your customers have a seamless experience on any screen size.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-4 bg-gradient-to-br from-blue-500 to-purple-600 text-white">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Your Products. Verified, Protected, and Trusted.
          </h2>
          <p className="text-xl mb-10 max-w-2xl mx-auto">
            Start free. Upgrade anytime. Your brand is worth it.
          </p>
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
              <Link to="/signup">Create Your Free Account</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
              <Link to="#">Chat With Us on WhatsApp</Link>
            </Button>
            <Button asChild size="lg" variant="secondary" className="bg-blue-800 text-white hover:bg-blue-700 border-none">
              <Link to="#">Buy Lifetime Deal Now</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between mb-8">
            <div className="mb-8 md:mb-0">
              <h2 className="text-xl font-bold mb-4">QR Code Authentication System</h2>
              <p className="text-gray-400 max-w-xs">Protecting brands from counterfeiting with smart technology.</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
              <div>
                <h3 className="font-medium mb-4">Company</h3>
                <ul className="space-y-2 text-gray-400">
                  <li><a href="#" className="hover:text-white">About</a></li>
                  <li><a href="#" className="hover:text-white">FAQ</a></li>
                  <li><a href="#" className="hover:text-white">Contact</a></li>
                </ul>
              </div>
              <div>
                <h3 className="font-medium mb-4">Legal</h3>
                <ul className="space-y-2 text-gray-400">
                  <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
                  <li><a href="#" className="hover:text-white">Terms of Service</a></li>
                </ul>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">© 2025 QR Code Authentication System. All rights reserved.</p>
            <p className="text-gray-400 text-sm">Made in Algeria with passion</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
