import React from 'react';
import Header from './LandingPage';

const SecurityPage = () => (
  <>
    <Header />
    <main className="container mx-auto py-16 px-4">
      <h1 className="text-4xl font-bold mb-6">Security</h1>
      <p className="text-lg mb-4">Learn about the robust security measures that protect your products and data with QRified.</p>
      <ul className="list-disc pl-6 space-y-2">
        <li>End-to-end AES encryption for all QR data</li>
        <li>One-time scan validation logic</li>
        <li>Role-based access control</li>
        <li>Secure infrastructure powered by Supabase</li>
        <li>Continuous monitoring and updates</li>
      </ul>
    </main>
  </>
);

export default SecurityPage; 