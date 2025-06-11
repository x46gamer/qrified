import React from 'react';
import './Page.css'; // Assuming a generic CSS file for page styling

const About: React.FC = () => {
  return (
    <div className="page-container">
      <header className="page-header">
        <h1>About Qrified</h1>
        <p className="subtitle">Revolutionizing Secure QR Code Interactions</p>
      </header>

      <section className="page-section">
        <h2>Our Mission</h2>
        <p>
          At Qrified, our mission is to empower individuals and businesses with secure, efficient, and reliable QR code solutions.
          In an increasingly digital world, the need for trusted data exchange is paramount. We strive to build
          a platform that not only simplifies QR code generation and scanning but also integrates robust security measures
          to protect your information and ensure peace of mind. We believe in a future where every QR scan is a secure transaction,
          and every piece of information shared is genuinely protected.
        </p>
        <p>
          We are committed to continuous innovation, leveraging cutting-edge technology to stay ahead of emerging threats
          and provide our users with the most advanced security features available. Our dedication extends to fostering
          a community where users feel confident and supported in their digital interactions.
        </p>
      </section>

      <section className="page-section">
        <h2>Our Vision</h2>
        <p>
          Our vision is to be the global leader in secure QR code technology, setting the standard for trust and integrity
          in digital interactions. We envision a world where QR codes are not just convenient tools, but secure gateways
          to information, services, and experiences. We aim to create a seamless and secure ecosystem where data privacy
          and security are fundamental, not optional.
        </p>
        <p>
          We foresee Qrified becoming an indispensable part of daily life, from secure payments and identity verification
          to authenticated document sharing and streamlined event access. Our goal is to make security invisible yet ever-present,
          allowing users to focus on their tasks with absolute confidence in the underlying technology.
        </p>
      </section>

      <section className="page-section">
        <h2>Our Values</h2>
        <ul className="values-list">
          <li><strong>Security First:</strong> We prioritize the security and privacy of our users above all else.</li>
          <li><strong>Innovation:</strong> We are relentlessly curious and committed to pushing the boundaries of what's possible.</li>
          <li><strong>Transparency:</strong> We believe in open communication and clear policies regarding data handling.</li>
          <li><strong>User Empowerment:</strong> We design our solutions to give users control and confidence.</li>
          <li><strong>Integrity:</strong> We operate with honesty, ethics, and a strong sense of responsibility.</li>
          <li><strong>Accessibility:</strong> We strive to make secure QR technology accessible to everyone, everywhere.</li>
        </ul>
      </section>

      <section className="page-section">
        <h2>Our Team</h2>
        <p>
          Qrified is powered by a diverse team of cybersecurity experts, software engineers, designers, and business strategists
          who share a common passion for secure technology and user-centric solutions. We are united by our commitment
          to excellence and our belief in the transformative power of secure digital interactions.
        </p>
        <p>
          Each member of our team brings unique skills and perspectives, contributing to a collaborative environment
          where ideas flourish and challenges are met with innovative solutions. We are constantly learning, adapting,
          and evolving to meet the dynamic needs of the digital landscape.
        </p>
        {/* Potentially add placeholders for team members, if desired: */}
        {/*
        <div className="team-grid">
          <div className="team-member">
            <h3>John Doe</h3>
            <p>CEO & Co-founder</p>
            <p>Leading the vision and strategy of Qrified.</p>
          </div>
          <div className="team-member">
            <h3>Jane Smith</h3>
            <p>CTO</p>
            <p>Driving technological innovation and secure architecture.</p>
          </div>
        </div>
        */}
      </section>

      <section className="page-section">
        <h2>Our Journey</h2>
        <p>
          Founded in [Year], Qrified began with a simple yet powerful idea: to make QR code interactions inherently secure.
          Recognizing the growing reliance on QR codes for various applications and the increasing concerns about data security,
          our founders embarked on a mission to develop a platform that addresses these challenges head-on.
        </p>
        <p>
          Since our inception, we have rapidly grown, driven by a commitment to our users and a passion for secure innovation.
          We have overcome numerous technical hurdles, continuously refined our algorithms, and expanded our feature set
          to meet the evolving demands of the market. Our journey is a testament to our dedication to building a safer,
          more trustworthy digital future.
        </p>
      </section>

      <footer className="page-footer">
        <p>&copy; {new Date().getFullYear()} Qrified. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default About; 