import React from 'react';
import './Page.css'; // Assuming a generic CSS file for page styling

const Pricing: React.FC = () => {
  return (
    <div className="page-container">
      <header className="page-header">
        <h1>Pricing Plans</h1>
        <p className="subtitle">Find the Perfect Plan for Your Secure QR Needs</p>
      </header>

      <section className="page-section">
        <h2>Simple, Transparent, and Secure Pricing</h2>
        <p>
          At Qrified, we believe in providing flexible and scalable solutions that fit your specific requirements.
          Whether you're an individual, a small business, or a large enterprise, we have a plan designed to offer
          the most secure and efficient QR code management. All our plans come with our industry-leading security features
          and dedicated support.
        </p>
      </section>

      <section className="page-section">
        <div className="pricing-grid">
          <div className="pricing-card">
            <h3>Basic Plan</h3>
            <p className="price">$9.99/month</p>
            <p className="description">Ideal for individuals and small projects requiring secure QR code generation and basic analytics.</p>
            <ul className="features-list">
              <li>Up to 100 Dynamic QR Codes</li>
              <li>Basic Analytics & Reporting</li>
              <li>Standard Security Features</li>
              <li>Email Support</li>
              <li>Customizable QR Designs</li>
            </ul>
            <button className="cta-button">Get Started</button>
          </div>

          <div className="pricing-card featured">
            <h3>Pro Plan</h3>
            <p className="price">$49.99/month</p>
            <p className="description">Perfect for growing businesses needing advanced features, extensive analytics, and priority support.</p>
            <ul className="features-list">
              <li>Up to 1,000 Dynamic QR Codes</li>
              <li>Advanced Analytics & Insights</li>
              <li>Enhanced Security & Tamper-Proofing</li>
              <li>Priority Email & Chat Support</li>
              <li>API Access</li>
              <li>White-Labeling Options</li>
            </ul>
            <button className="cta-button">Choose Pro</button>
          </div>

          <div className="pricing-card">
            <h3>Enterprise Plan</h3>
            <p className="price">Custom Quote</p>
            <p className="description">Tailored solutions for large organizations with high-volume requirements and bespoke security needs.</p>
            <ul className="features-list">
              <li>Unlimited Dynamic QR Codes</li>
              <li>Comprehensive Analytics & Custom Reports</li>
              <li>Blockchain Integration & Premium Security</li>
              <li>Dedicated Account Manager & 24/7 Support</li>
              <li>Full API Integration & Custom Development</li>
              <li>On-Premise Deployment Options</li>
            </ul>
            <button className="cta-button">Contact Sales</button>
          </div>
        </div>
      </section>

      <section className="page-section">
        <h2>Frequently Asked Questions</h2>
        <div className="faq-item">
          <h3>What is a Dynamic QR Code?</h3>
          <p>A Dynamic QR Code allows you to change the content or destination of the QR code even after it has been printed. This is incredibly useful for updating information, correcting errors, or redirecting users to new content without having to print new QR codes.</p>
        </div>
        <div className="faq-item">
          <h3>What kind of analytics do you provide?</h3>
          <p>Our analytics include total scans, unique scans, scan locations (city/country level), device types, and time of scans. Depending on your plan, you can access more detailed demographic and behavioral insights.</p>
        </div>
        <div className="faq-item">
          <h3>Is my data secure with Qrified?</h3>
          <p>Absolutely. Security is our top priority. We use end-to-end encryption, regular security audits, and comply with global data privacy regulations like GDPR to ensure your data is always protected.</p>
        </div>
        <div className="faq-item">
          <h3>Can I upgrade or downgrade my plan?</h3>
          <p>Yes, you can upgrade or downgrade your plan at any time. Changes will be prorated and applied to your next billing cycle.</p>
        </div>
      </section>

      <footer className="page-footer">
        <p>&copy; {new Date().getFullYear()} Qrified. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Pricing; 