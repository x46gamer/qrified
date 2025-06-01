import React from 'react';
import Header from './LandingPage';

const PricingPage = () => (
  <>
    <Header />
    <main className="container mx-auto py-16 px-4">
      <h1 className="text-4xl font-bold mb-6">Pricing</h1>
      <p className="text-lg mb-4">Choose a plan that fits your business needs. Simple, transparent, and scalable pricing for every stage.</p>
      <ul className="list-disc pl-6 space-y-2">
        <li>Starter: $29/mo - Up to 1,000 QR codes, basic analytics, email support</li>
        <li>Pro: $79/mo - Up to 10,000 QR codes, advanced analytics, priority support</li>
        <li>Enterprise: Custom pricing - Unlimited codes, full API access, dedicated manager</li>
      </ul>
    </main>
  </>
);

export default PricingPage; 