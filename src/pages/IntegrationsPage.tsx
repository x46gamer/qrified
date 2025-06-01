import React from 'react';
import Header from './LandingPage';

const IntegrationsPage = () => (
  <>
    <Header />
    <main className="container mx-auto py-16 px-4">
      <h1 className="text-4xl font-bold mb-6">Integrations</h1>
      <p className="text-lg mb-4">Connect QRified with your existing systems and workflows. API and integration options coming soon.</p>
      <ul className="list-disc pl-6 space-y-2">
        <li>REST API (coming soon)</li>
        <li>Webhooks for real-time updates</li>
        <li>Custom integrations on request</li>
      </ul>
    </main>
  </>
);

export default IntegrationsPage; 