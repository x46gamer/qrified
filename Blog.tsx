import React from 'react';
import './Page.css'; // Assuming a generic CSS file for page styling

const Blog: React.FC = () => {
  return (
    <div className="page-container">
      <header className="page-header">
        <h1>Qrified Blog</h1>
        <p className="subtitle">Insights, News, and Innovations in Secure QR Technology</p>
      </header>

      <section className="page-section">
        <h2>Latest Articles</h2>
        <div className="blog-posts-grid">
          <div className="blog-post-card">
            <img src="https://via.placeholder.com/400x200" alt="Blog Post 1" className="blog-post-image" />
            <div className="blog-post-content">
              <h3>The Future of Product Authenticity: Beyond the Barcode</h3>
              <p className="blog-post-meta">By John Doe | August 15, 2024</p>
              <p className="blog-post-excerpt">Explore how secure QR codes are revolutionizing supply chain integrity and consumer trust, offering an unbreakable shield against counterfeiting.</p>
              <a href="#" className="read-more-link">Read More</a>
            </div>
          </div>

          <div className="blog-post-card">
            <img src="https://via.placeholder.com/400x200" alt="Blog Post 2" className="blog-post-image" />
            <div className="blog-post-content">
              <h3>Enhancing Data Privacy with Encrypted QR Codes</h3>
              <p className="blog-post-meta">By Jane Smith | August 10, 2024</p>
              <p className="blog-post-excerpt">Dive deep into the cryptographic methods Qrified employs to ensure end-to-end encryption for all your QR code interactions, safeguarding sensitive information.</p>
              <a href="#" className="read-more-link">Read More</a>
            </div>
          </div>

          <div className="blog-post-card">
            <img src="https://via.placeholder.com/400x200" alt="Blog Post 3" className="blog-post-image" />
            <div className="blog-post-content">
              <h3>Dynamic QR Codes: The Ultimate Tool for Agile Marketing</h3>
              <p className="blog-post-meta">By Alex Johnson | August 5, 2024</p>
              <p className="blog-post-excerpt">Learn how dynamic QR codes provide unparalleled flexibility for marketers, allowing real-time content updates and adaptive campaigns without reprinting.</p>
              <a href="#" className="read-more-link">Read More</a>
            </div>
          </div>

          <div className="blog-post-card">
            <img src="https://via.placeholder.com/400x200" alt="Blog Post 4" className="blog-post-image" />
            <div className="blog-post-content">
              <h3>Case Study: How Qrified Helped [Client Name] Combat Counterfeits</h3>
              <p className="blog-post-meta">By Emily White | July 28, 2024</p>
              <p className="blog-post-excerpt">A detailed look at a real-world application of Qrified's anti-counterfeiting solution and its significant impact on brand protection and consumer confidence.</p>
              <a href="#" className="read-more-link">Read More</a>
            </div>
          </div>
        </div>
      </section>

      <section className="page-section">
        <h2>Categories</h2>
        <ul className="categories-list">
          <li><a href="#">Security</a></li>
          <li><a href="#">Product Authenticity</a></li>
          <li><a href="#">Marketing</a></li>
          <li><a href="#">Technology</a></li>
          <li><a href="#">Case Studies</a></li>
          <li><a href="#">News & Updates</a></li>
        </ul>
      </section>

      <section className="page-section">
        <h2>Subscribe to Our Newsletter</h2>
        <p>
          Stay up-to-date with the latest news, articles, and insights from Qrified. Subscribe to our newsletter for exclusive content and updates.
        </p>
        <form className="newsletter-form">
          <input type="email" placeholder="Enter your email address" aria-label="Email Address" required />
          <button type="submit" className="cta-button">Subscribe</button>
        </form>
      </section>

      <footer className="page-footer">
        <p>&copy; {new Date().getFullYear()} Qrified. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Blog; 