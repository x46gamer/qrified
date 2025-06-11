import React from 'react';
import './Page.css'; // Assuming a generic CSS file for page styling

const Privacy: React.FC = () => {
  return (
    <div className="page-container">
      <header className="page-header">
        <h1>Privacy Policy</h1>
        <p className="subtitle">Your Trust, Our Priority</p>
      </header>

      <section className="page-section">
        <h2>Introduction</h2>
        <p>
          At Qrified, we are deeply committed to protecting your privacy. This Privacy Policy explains how we collect,
          use, disclose, and safeguard your information when you use our Qrified application and services.
          We urge you to read this policy carefully to understand our practices regarding your data.
          By accessing or using Qrified, you acknowledge that you have read, understood, and agree to be bound by all the terms of this Privacy Policy.
          If you do not agree with the terms of this Privacy Policy, please do not access the application.
        </p>
      </section>

      <section className="page-section">
        <h2>Information We Collect</h2>
        <p>
          We may collect information about you in a variety of ways. The information we may collect via the Application depends on the content and materials you use,
          and includes:
        </p>
        <h3>Personal Data</h3>
        <p>
          Personally identifiable information, such as your name, shipping address, email address, and telephone number, and demographic information,
          such as your age, gender, hometown, and interests, that you voluntarily give to us when you register with the Application
          or when you choose to participate in various activities related to the Application, such as online chat and message boards.
          You are under no obligation to provide us with personal information of any kind, however, your refusal to do so may prevent you from using certain features of the Application.
        </p>
        <h3>Derivative Data</h3>
        <p>
          Information our servers automatically collect when you access the Application, such as your IP address, your browser type,
          your operating system, your access times, and the pages you have viewed directly before and after accessing the Application.
        </p>
        <h3>Financial Data</h3>
        <p>
          Financial information, such as data related to your payment method (e.g., valid credit card number, card brand, expiration date)
          that we may collect when you purchase, order, return, exchange, or request information about our services from the Application.
          We store only very limited, if any, financial information that we collect. Otherwise, all financial information is stored by our payment processor,
          [Payment Processor Name, e.g., Stripe, PayPal], and you are encouraged to review their privacy policy.
        </p>
        <h3>Data From Contests, Giveaways, and Surveys</h3>
        <p>
          Personal and other information you may provide when entering contests or giveaways and/or responding to surveys.
        </p>
      </section>

      <section className="page-section">
        <h2>How We Use Your Information</h2>
        <p>
          Having accurate information about you permits us to provide you with a smooth, efficient, and customized experience.
          Specifically, we may use information collected about you via the Application to:
        </p>
        <ul className="bullet-list">
          <li>Create and manage your account.</li>
          <li>Enable user-to-user communications.</li>
          <li>Fulfill and manage purchases, orders, payments, and other transactions related to the Application.</li>
          <li>Generate a personal profile about you to make your visit to the Application more personalized.</li>
          <li>Increase the efficiency and operation of the Application.</li>
          <li>Monitor and analyze usage and trends to improve your experience with the Application.</li>
          <li>Notify you of updates to the Application.</li>
          <li>Offer new products, services, mobile applications, and/or recommendations to you.</li>
          <li>Perform other business activities as needed.</li>
          <li>Prevent fraudulent transactions, monitor against theft, and protect against criminal activity.</li>
          <li>Process payments and refunds.</li>
          <li>Request feedback and contact you about your use of the Application.</li>
          <li>Resolve disputes and troubleshoot problems.</li>
          <li>Respond to product and customer service requests.</li>
          <li>Send you a newsletter or other updates.</li>
        </ul>
      </section>

      <section className="page-section">
        <h2>Disclosure of Your Information</h2>
        <p>
          We may share information we have collected about you in certain situations. Your information may be disclosed as follows:
        </p>
        <h3>By Law or to Protect Rights</h3>
        <p>
          If we believe the release of information about you is necessary to respond to legal process, to investigate or remedy potential violations of our policies, or to protect the rights, property, or safety of others, we may share your information as permitted or required by any applicable law, rule, or regulation.
        </p>
        <h3>Third-Party Service Providers</h3>
        <p>
          We may share your information with third parties that perform services for us or on our behalf, including data analysis, email delivery, hosting services,
          customer service, and marketing assistance. We do not sell, rent, or trade your personal information to third parties.
        </p>
        <h3>Marketing Communications</h3>
        <p>
          With your consent, or with an opportunity for you to withdraw consent, we may share your information with third parties for marketing purposes, as permitted by law.
        </p>
        <h3>Affiliates</h3>
        <p>
          We may share your information with our affiliates, in which case we will require those affiliates to honor this Privacy Policy.
          Affiliates include our parent company and any subsidiaries, joint venture partners, or other companies that we control or that are under common control with us.
        </p>
        <h3>Business Partners</h3>
        <p>
          We may share your information with our business partners to offer you certain products, services, or promotions.
        </p>
        <h3>Other Third Parties</h3>
        <p>
          We may share your information with advertisers and investors for the purpose of conducting general business analysis.
          We may also share your information with such third parties for marketing purposes, as permitted by law.
        </p>
      </section>

      <section className="page-section">
        <h2>Security of Your Information</h2>
        <p>
          We use administrative, technical, and physical security measures to help protect your personal information.
          While we have taken reasonable steps to secure the personal information you provide to us, please be aware that despite our efforts,
          no security measures are perfect or impenetrable, and no method of data transmission can be guaranteed against any interception or other type of misuse.
        </p>
      </section>

      <section className="page-section">
        <h2>Policy for Children</h2>
        <p>
          We do not knowingly solicit information from or market to children under the age of 13. If you become aware of any data we have collected from children under age 13,
          please contact us using the contact information provided below.
        </p>
      </section>

      <section className="page-section">
        <h2>Changes to This Privacy Policy</h2>
        <p>
          We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page.
          You are advised to review this Privacy Policy periodically for any changes.
          Changes to this Privacy Policy are effective when they are posted on this page.
        </p>
      </section>

      <section className="page-section">
        <h2>Contact Us</h2>
        <p>
          If you have any questions about this Privacy Policy, please contact us at:
        </p>
        <p>Email: [Your Support Email Address]</p>
        <p>Address: [Your Company Address]</p>
      </section>

      <footer className="page-footer">
        <p>&copy; {new Date().getFullYear()} Qrified. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Privacy; 