import React from 'react';
import './Page.css'; // Assuming a generic CSS file for page styling

const Features: React.FC = () => {
  return (
    <div className="page-container">
      <header className="page-header">
        <h1>Features of Qrified</h1>
        <p className="subtitle">Unlock the Power of Secure QR Codes</p>
      </header>

      <section className="page-section">
        <h2>Core Features</h2>
        <div className="features-grid">
          <div className="feature-item">
            <h3>Advanced QR Generation</h3>
            <p>Create highly customizable and secure QR codes with embedded encryption and anti-counterfeiting measures. Supports various data types including URLs, text, contact information, and more.</p>
          </div>
          <div className="feature-item">
            <h3>Dynamic QR Codes</h3>
            <p>Update the content of your QR codes in real-time without reprinting. Perfect for marketing campaigns, event management, and dynamic information sharing.</p>
          </div>
          <div className="feature-item">
            <h3>Secure Scanning & Verification</h3>
            <p>Our proprietary scanning technology verifies the authenticity of Qrified codes, protecting users from fraudulent scans and malicious redirects. Real-time threat intelligence is integrated.</p>
          </div>
          <div className="feature-item">
            <h3>Tamper-Proof Design</h3>
            <p>Utilize advanced cryptographic techniques to ensure the integrity of your QR codes, making them virtually impossible to forge or alter without detection.</p>
          </div>
          <div className="feature-item">
            <h3>Detailed Analytics & Insights</h3>
            <p>Gain valuable insights into scan activity, location data, and user engagement. Optimize your campaigns and understand your audience with comprehensive reporting.</p>
          </div>
          <div className="feature-item">
            <h3>Brand Protection & Anti-Counterfeiting</h3>
            <p>Safeguard your products and brand reputation by providing an easy way for consumers to verify authenticity, significantly reducing counterfeiting risks.</p>
          </div>
        </div>
      </section>

      <section className="page-section">
        <h2>Security Highlights</h2>
        <ul className="bullet-list">
          <li><strong>End-to-End Encryption:</strong> All data transmitted through Qrified codes is encrypted from generation to scan, ensuring maximum privacy.</li>
          <li><strong>Blockchain Integration:</strong> For select applications, we leverage blockchain technology to create an immutable ledger of QR code transactions, enhancing trust and traceability.</li>
          <li><strong>Multi-Factor Authentication (MFA):</strong> Implement MFA for accessing sensitive QR code management features, adding an extra layer of security.</li>
          <li><strong>Regular Security Audits:</strong> Our systems undergo continuous security assessments and penetration testing to identify and mitigate vulnerabilities.</li>
          <li><strong>Data Privacy Compliance:</strong> We adhere strictly to global data privacy regulations, including GDPR and CCPA, ensuring your data is handled with the utmost care.</li>
        </ul>
      </section>

      <section className="page-section">
        <h2>Integration & Customization</h2>
        <div className="features-grid">
          <div className="feature-item">
            <h3>API Access</h3>
            <p>Seamlessly integrate Qrified's powerful features into your existing applications and workflows with our well-documented API.</p>
          </div>
          <div className="feature-item">
            <h3>White-Label Solutions</h3>
            <p>Brand Qrified's scanning and generation tools with your own logo and colors for a consistent user experience.</p>
          </div>
          <div className="feature-item">
            <h3>Custom QR Code Designs</h3>
            <p>Beyond basic customization, work with our design team to create unique, branded QR codes that stand out.</p>
          </div>
        </div>
      </section>

      <section className="page-section">
        <h2>Use Cases</h2>
        <ul className="bullet-list">
          <li><strong>Product Authentication:</strong> Verify product authenticity and track supply chains.</li>
          <li><strong>Secure Document Sharing:</strong> Share sensitive documents with confidence, ensuring only authorized individuals can access them.</li>
          <li><strong>Event Ticketing:</strong> Create secure, verifiable tickets for events, reducing fraud and streamlining entry.</li>
          <li><strong>Contactless Payments:</strong> Facilitate secure and efficient mobile payments.</li>
          <li><strong>Digital Identity Verification:</strong> Use QR codes for quick and secure identity verification.</li>
          <li><strong>Interactive Marketing:</strong> Engage customers with dynamic content and personalized experiences.</li>
        </ul>
      </section>

      <footer className="page-footer">
        <p>&copy; {new Date().getFullYear()} Qrified. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Features; 