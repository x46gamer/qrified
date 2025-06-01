import React from 'react';
import { Link } from 'react-router-dom';

const CoreFeaturesPage = () => (
  <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
    <header className="flex justify-between items-center px-8 py-6 border-b bg-white/80">
      <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">QRified</Link>
      <div className="space-x-4">
        <Link to="/login" className="text-gray-700 font-medium">Login</Link>
        <Link to="/signup" className="bg-violet-600 text-white px-4 py-2 rounded font-semibold ml-2">Sign Up</Link>
      </div>
    </header>
    <main className="container mx-auto py-16 px-4">
      <h1 className="text-4xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">Core Features</h1>
      <p className="text-lg mb-8">Discover the essential features that make QRified a powerful solution for secure product authentication and customer engagement.</p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-2">Secure QR Code Generation</h2>
          <p>Generate unique, encrypted QR codes for every product, ensuring authenticity and traceability.</p>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-2">One-Time Scan Logic</h2>
          <p>Prevent counterfeiting with QR codes that can only be verified once, providing instant authenticity feedback.</p>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-2">Customizable Verification Pages</h2>
          <p>Brand your verification experience with custom logos, colors, and messages for your customers.</p>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-2">Integrated Feedback System</h2>
          <p>Collect customer reviews and feedback directly from the verification process.</p>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-2">Comprehensive Analytics</h2>
          <p>Monitor scan activity, customer engagement, and product performance with real-time analytics.</p>
        </div>
      </div>
    </main>
  </div>
);

export default CoreFeaturesPage; 