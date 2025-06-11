import React from 'react';
import './Page.css'; // Assuming a generic CSS file for page styling

const CookiePolicy: React.FC = () => {
  return (
    <div className="page-container">
      <header className="page-header">
        <h1>Cookie Policy</h1>
        <p className="subtitle">Understanding Our Use of Cookies</p>
      </header>

      <section className="page-section">
        <h2>What Are Cookies?</h2>
        <p>
          Cookies are small text files that are placed on your computer or mobile device when you visit a website.
          They are widely used to make websites work more efficiently, as well as to provide information to the owners of the site.
          Cookies allow a website to recognize your device and remember information about your past visits, such as your preferences,
          login details, or items added to a shopping cart.
        </p>
      </section>

      <section className="page-section">
        <h2>How We Use Cookies</h2>
        <p>
          At Qrified, we use cookies for various purposes, including:
        </p>
        <ul className="bullet-list">
          <li><strong>Essential Cookies:</strong> These cookies are strictly necessary for the operation of our website.
          They enable you to navigate around the site and use its features, such as accessing secure areas. Without these cookies,
          services like shopping carts or e-billing cannot be provided.</li>
          <li><strong>Performance and Analytics Cookies:</strong> These cookies collect information about how you use our website,
          for instance, which pages you visit most often, and if you experience any error messages from web pages.
          These cookies do not collect information that identifies you. All information these cookies collect is aggregated
          and therefore anonymous. It is only used to improve how our website works.</li>
          <li><strong>Functionality Cookies:</strong> These cookies allow our website to remember choices you make (such as your user name, language, or the region you are in)
          and provide enhanced, more personal features. For instance, a website may be able to provide you with local weather reports
          or traffic news by storing in a cookie the region in which you are currently located. These cookies can also be used to remember changes
          you have made to text size, fonts, and other parts of web pages that you can customize. They may also be used to provide services you have asked for,
          such as watching a video or commenting on a blog. The information these cookies collect may be anonymized, and they cannot track your browsing activity
          on other websites.</li>
          <li><strong>Targeting and Advertising Cookies:</strong> These cookies are used to deliver advertisements more relevant to you
          and your interests. They are also used to limit the number of times you see an advertisement as well as help measure the effectiveness
          of the advertising campaign. They are usually placed by advertising networks with the website operator's permission.
          They remember that you have visited a website and this information is shared with other organizations such as advertisers.
          Quite often, targeting or advertising cookies will be linked to site functionality provided by the other organization.</li>
        </ul>
      </section>

      <section className="page-section">
        <h2>Third-Party Cookies</h2>
        <p>
          In addition to our own cookies, we may also use various third-parties cookies to report usage statistics of the Service,
          deliver advertisements on and through the Service, and so on.
        </p>
      </section>

      <section className="page-section">
        <h2>Your Choices Regarding Cookies</h2>
        <p>
          You have the ability to accept or decline cookies. Most web browsers automatically accept cookies, but you can usually modify your browser setting to decline cookies if you prefer.
          If you choose to decline cookies, you may not be able to fully experience the interactive features of our website and services.
        </p>
        <p>
          You can typically find these settings in the "options" or "preferences" menu of your browser.
          To understand these settings, the following links may be helpful, or you can use the "Help" option in your browser for more details:
        </p>
        <ul className="bullet-list">
          <li><a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer">Cookie settings in Chrome</a></li>
          <li><a href="https://support.mozilla.org/en-US/kb/enable-and-disable-cookies-website-preferences" target="_blank" rel="noopener noreferrer">Cookie settings in Firefox</a></li>
          <li><a href="https://support.microsoft.com/en-us/topic/delete-and-manage-cookies-168dab11-0753-043d-7c16-ede5947fc64d" target="_blank" rel="noopener noreferrer">Cookie settings in Edge</a></li>
          <li><a href="https://support.apple.com/guide/safari/manage-cookies-and-website-data-sfri11471/mac" target="_blank" rel="noopener noreferrer">Cookie settings in Safari</a></li>
        </ul>
        <p>
          You can also opt-out of some third-party cookies through the Network Advertising Initiative's Opt-Out Tool or the Digital Advertising Alliance's Opt-Out Tool.
        </p>
      </section>

      <section className="page-section">
        <h2>More Information</h2>
        <p>
          If you have any questions about our use of cookies or other technologies, please email us at [Your Support Email Address].
        </p>
      </section>

      <footer className="page-footer">
        <p>&copy; {new Date().getFullYear()} Qrified. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default CookiePolicy; 