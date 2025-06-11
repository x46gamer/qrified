import React from 'react';
import './Page.css'; // Assuming a generic CSS file for page styling

const Terms: React.FC = () => {
  return (
    <div className="page-container">
      <header className="page-header">
        <h1>Terms of Service</h1>
        <p className="subtitle">Agreement for Qrified Services</p>
      </header>

      <section className="page-section">
        <h2>Introduction</h2>
        <p>
          Welcome to Qrified! These Terms of Service ("Terms") govern your access to and use of the Qrified website,
          application, and services (collectively, the "Service"). Please read these Terms carefully before using the Service.
          By accessing or using the Service, you agree to be bound by these Terms and our Privacy Policy.
          If you do not agree to these Terms, you may not use the Service.
        </p>
      </section>

      <section className="page-section">
        <h2>Acceptance of Terms</h2>
        <p>
          By creating an account, accessing, or using the Service, you signify your agreement to these Terms.
          If you are using the Service on behalf of an organization, you are agreeing to these Terms for that organization
          and promising that you have the authority to bind that organization to these Terms. In that case, "you" and "your"
          will refer to that organization.
        </p>
      </section>

      <section className="page-section">
        <h2>Changes to Terms</h2>
        <p>
          We reserve the right to modify these Terms at any time. We will notify you of any material changes by posting the new Terms on this page.
          Your continued use of the Service after such modifications constitutes your acknowledgment and agreement of the modified Terms.
          It is your responsibility to review these Terms periodically for changes.
        </p>
      </section>

      <section className="page-section">
        <h2>Account Registration and Security</h2>
        <ul className="bullet-list">
          <li>You may need to register for an account to access some features of the Service.</li>
          <li>You agree to provide accurate, current, and complete information during the registration process and to update such information to keep it accurate, current, and complete.</li>
          <li>You are responsible for safeguarding your password and for any activities or actions under your account.</li>
          <li>You agree to notify us immediately of any unauthorized use of your account.</li>
        </ul>
      </section>

      <section className="page-section">
        <h2>User Conduct</h2>
        <p>
          You agree not to use the Service for any unlawful purpose or in any way that might harm, abuse, or otherwise interfere with the Service or any third party.
          Prohibited conduct includes, but is not limited to:
        </p>
        <ul className="bullet-list">
          <li>Uploading or transmitting any content that is infringing, libelous, defamatory, obscene, pornographic, abusive, or otherwise illegal.</li>
          <li>Engaging in any activity that could damage, disable, overburden, or impair the Service.</li>
          <li>Attempting to gain unauthorized access to any part of the Service or to other users' accounts.</li>
          <li>Using the Service to send unsolicited commercial communications (spam).</li>
        </ul>
      </section>

      <section className="page-section">
        <h2>Intellectual Property Rights</h2>
        <p>
          All content, features, and functionality on the Service, including text, graphics, logos, and software, are the exclusive property of Qrified and are protected by international copyright, trademark, patent, trade secret, and other intellectual property or proprietary rights laws.
        </p>
      </section>

      <section className="page-section">
        <h2>Disclaimer of Warranties</h2>
        <p>
          The Service is provided on an "AS IS" and "AS AVAILABLE" basis. Qrified makes no warranties, express or implied,
          regarding the Service, including but not limited to, implied warranties of merchantability, fitness for a particular purpose,
          and non-infringement.
        </p>
      </section>

      <section className="page-section">
        <h2>Limitation of Liability</h2>
        <p>
          In no event shall Qrified, its affiliates, or their respective directors, employees, or agents be liable for any indirect, incidental,
          special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses,
          resulting from (i) your access to or use of or inability to access or use the Service; (ii) any conduct or content of any third party on the Service;
          (iii) any content obtained from the Service; and (iv) unauthorized access, use or alteration of your transmissions or content, whether based on warranty,
          contract, tort (including negligence) or any other legal theory, whether or not we have been informed of the possibility of such damage, and even if a remedy set forth herein is found to have failed of its essential purpose.
        </p>
      </section>

      <section className="page-section">
        <h2>Governing Law</h2>
        <p>
          These Terms shall be governed and construed in accordance with the laws of [Your Jurisdiction], without regard to its conflict of law provisions.
        </p>
      </section>

      <section className="page-section">
        <h2>Contact Us</h2>
        <p>
          If you have any questions about these Terms, please contact us at:
        </p>
        <p>Email: [Your Support Email Address]</p>
      </section>

      <footer className="page-footer">
        <p>&copy; {new Date().getFullYear()} Qrified. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Terms; 