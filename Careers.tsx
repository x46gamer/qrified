import React from 'react';
import './Page.css'; // Assuming a generic CSS file for page styling

const Careers: React.FC = () => {
  return (
    <div className="page-container">
      <header className="page-header">
        <h1>Careers at Qrified</h1>
        <p className="subtitle">Join Our Mission to Secure the Digital World</p>
      </header>

      <section className="page-section">
        <h2>Why Join Qrified?</h2>
        <p>
          At Qrified, we are building the future of secure digital interactions. We are a fast-growing, innovative company
          at the forefront of QR code security and anti-counterfeiting technology. Joining our team means being part of a mission
          to protect brands, empower users, and ensure trust in an increasingly interconnected world.
        </p>
        <ul className="bullet-list">
          <li><strong>Impactful Work:</strong> Contribute to solutions that have a real-world impact on security and trust.</li>
          <li><strong>Innovation & Growth:</strong> Work with cutting-edge technologies and continuously learn and grow in a dynamic environment.</li>
          <li><strong>Collaborative Culture:</strong> Be part of a diverse and inclusive team that values collaboration, respect, and mutual support.</li>
          <li><strong>Professional Development:</strong> We invest in our employees' growth through training, mentorship, and opportunities for advancement.</li>
          <li><strong>Competitive Benefits:</strong> Enjoy a comprehensive benefits package, including health, dental, vision, and retirement plans.</li>
        </ul>
      </section>

      <section className="page-section">
        <h2>Our Culture</h2>
        <p>
          Our culture at Qrified is built on a foundation of innovation, integrity, and collaboration. We believe that great ideas
          can come from anywhere, and we encourage open communication and creative problem-solving. We foster an environment where
          every team member feels valued, heard, and empowered to make a difference.
        </p>
        <p>
          We are passionate about what we do and are driven by a shared commitment to excellence. We celebrate successes, learn from challenges,
          and continuously strive to exceed expectations. We believe in work-life balance and offer flexible arrangements to support
          our employees' well-being.
        </p>
      </section>

      <section className="page-section">
        <h2>Open Positions</h2>
        <p>
          We are always looking for talented and passionate individuals to join our team. If you don't see a role that matches your skills
          below, we still encourage you to submit your resume, as new opportunities arise frequently.
        </p>
        <div className="job-listings">
          <div className="job-card">
            <h3>Senior Cybersecurity Engineer</h3>
            <p className="location">San Francisco, CA | Full-time</p>
            <p className="description">Develop and implement advanced security protocols for our QR code platform, conduct vulnerability assessments, and ensure compliance with industry standards.</p>
            <a href="#" className="apply-button">Apply Now</a>
          </div>
          <div className="job-card">
            <h3>Full-Stack Developer (React/Node.js)</h3>
            <p className="location">Remote | Full-time</p>
            <p className="description">Design, develop, and maintain both front-end and back-end components of our web application, focusing on scalability and user experience.</p>
            <a href="#" className="apply-button">Apply Now</a>
          </div>
          <div className="job-card">
            <h3>Product Manager - QR Solutions</h3>
            <p className="location">San Francisco, CA | Full-time</p>
            <p className="description">Define product strategy, roadmap, and requirements for new QR code features and enhancements, working closely with engineering and design teams.</p>
            <a href="#" className="apply-button">Apply Now</a>
          </div>
          <div className="job-card">
            <h3>UX/UI Designer</h3>
            <p className="location">Remote | Full-time</p>
            <p className="description">Create intuitive and engaging user experiences for Qrified products, from wireframes and prototypes to final visual designs.</p>
            <a href="#" className="apply-button">Apply Now</a>
          </div>
        </div>
      </section>

      <section className="page-section">
        <h2>How to Apply</h2>
        <p>
          To apply for an open position, please click on the "Apply Now" button next to the job listing. You will be asked to submit your resume
          and a cover letter. If you have any questions, please contact our HR team at [Your HR Email Address].
        </p>
      </section>

      <footer className="page-footer">
        <p>&copy; {new Date().getFullYear()} Qrified. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Careers; 