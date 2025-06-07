import React from 'react';
import { motion } from 'framer-motion';
import { QrCode, Mail, Phone, MapPin, Github, Twitter, Linkedin, Instagram, Sun, Moon } from 'lucide-react';

const Footer = () => {
  const [isDark, setIsDark] = React.useState(true);

  React.useEffect(() => {
    document.documentElement.classList.toggle('light-mode', !isDark);
  }, [isDark]);

  const footerLinks = [
    {
      title: "Product",
      links: [
        { name: "Features", href: "#" },
        { name: "Pricing", href: "#pricing" },
        { name: "Security", href: "#security" },
        { name: "Dashboard", href: "#dashboard" },
        { name: "API", href: "#" },
      ]
    },
    {
      title: "Company",
      links: [
        { name: "About", href: "#" },
        { name: "Careers", href: "#" },
        { name: "Blog", href: "#" },
        { name: "Press", href: "#" },
        { name: "Partners", href: "#" },
      ]
    },
    {
      title: "Resources",
      links: [
        { name: "Documentation", href: "#" },
        { name: "Help Center", href: "#" },
        { name: "Guides", href: "#" },
        { name: "Events", href: "#" },
        { name: "Webinars", href: "#" },
      ]
    },
    {
      title: "Legal",
      links: [
        { name: "Privacy", href: "#" },
        { name: "Terms", href: "#" },
        { name: "Cookie Policy", href: "#" },
        { name: "GDPR", href: "#" },
        { name: "Accessibility", href: "#" },
      ]
    }
  ];

  const socialLinks = [
    { icon: <Twitter className="h-5 w-5" />, href: "#", name: "Twitter" },
    { icon: <Linkedin className="h-5 w-5" />, href: "#", name: "LinkedIn" },
    { icon: <Github className="h-5 w-5" />, href: "#", name: "GitHub" },
    { icon: <Instagram className="h-5 w-5" />, href: "#", name: "Instagram" }
  ];

  const contactInfo = [
    { icon: <Mail className="h-5 w-5" />, text: "contact@qrified.com" },
    { icon: <Phone className="h-5 w-5" />, text: "+1 (555) 123-4567" },
    { icon: <MapPin className="h-5 w-5" />, text: "San Francisco, CA" }
  ];

  return (
    <footer className="relative bg-neutral-950 dark:bg-neutral-950 light:bg-white border-t border-neutral-900 dark:border-neutral-900 light:border-neutral-200 pt-16 pb-8 transition-colors duration-300">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 md:gap-12 mb-12">
          <div className="md:col-span-2">
            <motion.a 
              href="#" 
              className="flex items-center gap-2 text-neutral-900 dark:text-white light:text-neutral-900 mb-6"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <QrCode className="h-8 w-8 text-primary-500" />
              <span className="font-mono text-xl font-bold tracking-tighter">QRIFIED</span>
            </motion.a>
            <p className="text-neutral-600 dark:text-neutral-400 light:text-neutral-600 mb-6 max-w-md">
              The gold standard for product authenticity and anti-counterfeiting through
              secure, dynamic QR codes. Protect your brand, verify your products, and
              connect with your customers.
            </p>
            <div className="space-y-3">
              {contactInfo.map((item, index) => (
                <div key={index} className="flex items-center text-neutral-600 dark:text-neutral-400 light:text-neutral-600">
                  <div className="mr-3 text-primary-500">{item.icon}</div>
                  <span>{item.text}</span>
                </div>
              ))}
            </div>
          </div>

          {footerLinks.map((column, columnIndex) => (
            <div key={columnIndex}>
              <h3 className="font-bold text-neutral-900 dark:text-white light:text-neutral-900 mb-4">{column.title}</h3>
              <ul className="space-y-3">
                {column.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <motion.a
                      href={link.href}
                      className="text-neutral-600 dark:text-neutral-400 light:text-neutral-600 hover:text-neutral-900 dark:hover:text-white light:hover:text-neutral-900 transition-colors"
                      whileHover={{ x: 2 }}
                    >
                      {link.name}
                    </motion.a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-neutral-900 dark:border-neutral-900 light:border-neutral-200 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-neutral-500 text-sm mb-4 md:mb-0">
            © 2025 Qrified. All rights reserved.
          </p>
          <div className="flex items-center space-x-4">
            <motion.button
              onClick={() => setIsDark(!isDark)}
              className="p-2 rounded-full bg-neutral-900 dark:bg-neutral-800 light:bg-neutral-100 text-neutral-400 dark:text-neutral-400 light:text-neutral-600 hover:text-primary-500 transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              aria-label="Toggle theme"
            >
              {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </motion.button>
            {socialLinks.map((link, index) => (
              <motion.a
                key={index}
                href={link.href}
                className="text-neutral-500 hover:text-neutral-900 dark:hover:text-white light:hover:text-neutral-900 transition-colors"
                whileHover={{ y: -2 }}
                aria-label={link.name}
              >
                {link.icon}
              </motion.a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
