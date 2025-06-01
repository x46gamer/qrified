import React from 'react';
import Header from './LandingPage';

const DocumentationPage = () => (
  <>
    <Header />
    <main className="container mx-auto py-16 px-4">
      <h1 className="text-4xl font-bold mb-6">Documentation</h1>
      <p className="text-lg mb-4">Find guides, API references, and resources to help you get the most out of QRified.</p>
      <div className="bg-white/80 rounded-xl shadow p-8 text-gray-700">Documentation coming soon...</div>
    </main>
  </>
);

export default DocumentationPage; 