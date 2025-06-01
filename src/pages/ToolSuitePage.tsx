import React from 'react';
import { Link } from 'react-router-dom';

const ToolSuitePage = () => (
  <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
    <header className="flex justify-between items-center px-8 py-6 border-b bg-white/80">
      <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">QRified</Link>
      <div className="space-x-4">
        <Link to="/login" className="text-gray-700 font-medium">Login</Link>
        <Link to="/signup" className="bg-violet-600 text-white px-4 py-2 rounded font-semibold ml-2">Sign Up</Link>
      </div>
    </header>
    <main className="container mx-auto py-16 px-4">
      <h1 className="text-4xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">Tool Suite</h1>
      <p className="text-lg mb-8">Explore the suite of tools designed to help you manage, analyze, and optimize your product authentication process.</p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-2">Batch Operations</h2>
          <p>Generate, update, or manage thousands of QR codes simultaneously with powerful batch processing capabilities.</p>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-2">Template System</h2>
          <p>Choose from diverse pre-built templates or create your own to ensure QR codes align perfectly with your branding.</p>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-2">Advanced Filtering</h2>
          <p>Easily locate specific QR codes or analyze segments of your data with robust search and filtering options.</p>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-2">Global RTL Support</h2>
          <p>Full Right-to-Left language support ensures your authentication experience is seamless for all users worldwide.</p>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-2">Data Encryption</h2>
          <p>AES encryption for QR data and unique identifiers ensures your product information and authentication process are secure.</p>
        </div>
      </div>
    </main>
  </div>
);

export default ToolSuitePage; 