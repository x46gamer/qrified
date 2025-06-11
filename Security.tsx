import React from 'react';
import './Page.css'; // Assuming a generic CSS file for page styling

const Security: React.FC = () => {
  return (
    <div className="page-container">
      <header className="page-header">
        <h1>Security at Qrified</h1>
        <p className="subtitle">Your Trust, Our Unwavering Commitment</p>
      </header>

      <section className="page-section">
        <h2>Our Security Philosophy</h2>
        <p>
          At Qrified, security isn't just a feature; it's the foundation of everything we build. We understand the critical importance
          of protecting your data, brand, and digital interactions. Our multi-layered security framework is designed to safeguard
          your information from unauthorized access, tampering, and cyber threats, ensuring that every QR code generated and scanned
          through our platform is inherently secure and trustworthy.
        </p>
        <p>
          We are committed to continuous improvement, constantly evaluating and enhancing our security measures to stay ahead of
          evolving threats and maintain the highest standards of data protection. Our team of cybersecurity experts works tirelessly
          to ensure the integrity, confidentiality, and availability of our services.
        </p>
      </section>

      <section className="page-section">
        <h2>Core Security Measures</h2>
        <div className="features-grid">
          <div className="feature-item">
            <h3>End-to-End Encryption</h3>
            <p>All data exchanged within the Qrified ecosystem, from QR code generation to scanning, is protected with robust end-to-end encryption. This ensures that your information remains private and inaccessible to unauthorized parties.</p>
          </div>
          <div className="feature-item">
            <h3>Tamper-Proof QR Codes</h3>
            <p>Our QR codes are designed with advanced cryptographic signatures and integrity checks that make them highly resistant to tampering. Any unauthorized modification is immediately detectable, preventing counterfeiting and fraud.</p>
          </div>
          <div className="feature-item">
            <h3>Secure Infrastructure</h3>
            <p>Qrified operates on a secure cloud infrastructure, leveraging industry-leading security practices for data centers, network configurations, and server management. We employ firewalls, intrusion detection systems, and regular vulnerability scanning.</p>
          </div>
          <div className="feature-item">
            <h3>Data Minimization & Privacy by Design</h3>
            <p>We adhere to the principles of data minimization, collecting only the necessary information to provide our services. Our systems are built with privacy by design, ensuring data protection is integrated into every stage of development.</p>
          </div>
          <div className="feature-item">
            <h3>Access Control & Authentication</h3>
            <p>Strict access controls are implemented at all levels, ensuring that only authorized personnel and systems can access sensitive data. We support multi-factor authentication (MFA) for user accounts to prevent unauthorized access.</p>
          </div>
          <div className="feature-item">
            <h3>Regular Security Audits & Penetration Testing</h3>
            <p>We engage independent third-party security firms to conduct regular security audits and penetration tests. These assessments help us identify and remediate potential vulnerabilities proactively.</p>
          </div>
          <div className="feature-item">
            <h3>Incident Response Plan</h3>
            <p>Qrified has a comprehensive incident response plan in place to rapidly detect, respond to, and mitigate any security incidents. Our team is trained to handle security breaches efficiently and transparently.</p>
          </div>
          <div className="feature-item">
            <h3>Compliance with Regulations</h3>
            <p>We are committed to complying with global data protection regulations, including GDPR, CCPA, and other relevant privacy frameworks. We regularly review our practices to ensure ongoing compliance.</p>
          </div>
        </div>
      </section>

      <section className="page-section">
        <h2>User Responsibilities</h2>
        <p>
          While we implement robust security measures, your active participation is crucial for maintaining the overall security of your account and data.
          We encourage you to:
        </p>
        <ul className="bullet-list">
          <li>Use strong, unique passwords for your Qrified account.</li>
          <li>Enable Multi-Factor Authentication (MFA) for an added layer of security.</li>
          <li>Be vigilant against phishing attempts and suspicious emails.</li>
          <li>Report any suspicious activity or security concerns to our support team immediately.</li>
        </ul>
      </section>

      <section className="page-section">
        <h2>Our Commitment to Transparency</h2>
        <p>
          We believe in transparent communication about our security practices. While we cannot disclose all proprietary security details
          for obvious reasons, we are committed to providing you with clear and concise information about how we protect your data.
        </p>
      </section>

      <section className="page-section">
        <h2>Questions & Concerns</h2>
        <p>
          If you have any questions or concerns regarding the security of Qrified, please do not hesitate to contact our security team at
          [Your Security Contact Email Address].
        </p>
      </section>

      <footer className="page-footer">
        <p>&copy; {new Date().getFullYear()} Qrified. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Security; 