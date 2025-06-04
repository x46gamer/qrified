import React, { useState, useRef } from 'react';
import { motion, useScroll, useTransform, easeInOut } from 'framer-motion';
import { QrCode, Menu, X } from 'lucide-react';

export const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });

  // Interpolate width based on scroll with easeInOut easing
  const width = useTransform(scrollYProgress, [0, 0.5], ['1200px', '950px'], { ease: easeInOut });

  const scrollToSection = (id: string) => {
    if (id === 'testimonials') {
      const testimonialSection = document.querySelector('.animate-marquee'); // Assuming .animate-marquee is on the testimonials section
      if (testimonialSection) {
        const yOffset = -100; // Adjust offset as needed
        const y = testimonialSection.getBoundingClientRect().top + window.pageYOffset + yOffset;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    } else {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
    setIsOpen(false); // Close mobile menu after clicking a link
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <header ref={ref} className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 backdrop-filter backdrop-blur-md bg-gray-100 bg-opacity-70 rounded-[100px] overflow-hidden">
      <motion.div style={{ width }} className="mx-auto px-4 sm:px-6 lg:px-8 py-2">
        <div className="flex items-center justify-between">
          <a href="#" className="flex items-center" onClick={() => scrollToSection('')}>
            <QrCode className="h-8 w-8 text-primary-600 mr-2" />
            <span className="font-bold text-xl text-gray-900">Qrified</span>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <a href="#why" className="text-gray-700 hover:text-primary-600 transition-colors" onClick={() => scrollToSection('why')}>
              Why Qrified
            </a>
            <a href="#security" className="text-gray-700 hover:text-primary-600 transition-colors" onClick={() => scrollToSection('security')}>
              Security
            </a>
            <a href="#product" className="text-gray-700 hover:text-primary-600 transition-colors" onClick={() => scrollToSection('product')}>
              How It Works
            </a>
            <a href="#dashboard" className="text-gray-700 hover:text-primary-600 transition-colors" onClick={() => scrollToSection('dashboard')}>
              Dashboard
            </a>
            <a href="#pricing" className="text-gray-700 hover:text-primary-600 transition-colors" onClick={() => scrollToSection('pricing')}>
              Pricing
            </a>
          </nav>

          <div className="hidden md:block">
            <a
              href="#cta"
              className="inline-flex items-center justify-center px-5 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 transition-colors"
              onClick={() => scrollToSection('cta')}
            >
              Get Started
            </a>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden text-gray-700 focus:outline-none"
            onClick={toggleMenu}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </motion.div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden bg-white">
          <div className="px-4 pt-2 pb-4 space-y-4">
            <a
              href="#why"
              className="block text-gray-700 hover:text-primary-600 transition-colors"
              onClick={() => scrollToSection('why')}
            >
              Why Qrified
            </a>
            <a
              href="#security"
              className="block text-gray-700 hover:text-primary-600 transition-colors"
              onClick={() => scrollToSection('security')}
            >
              Security
            </a>
            <a
              href="#product"
              className="block text-gray-700 hover:text-primary-600 transition-colors"
              onClick={() => scrollToSection('product')}
            >
              How It Works
            </a>
            <a
              href="#dashboard"
              className="block text-gray-700 hover:text-primary-600 transition-colors"
              onClick={() => scrollToSection('dashboard')}
            >
              Dashboard
            </a>
            <a
              href="#pricing"
              className="block text-gray-700 hover:text-primary-600 transition-colors"
              onClick={() => scrollToSection('pricing')}
            >
              Pricing
            </a>
            <a
              href="#cta"
              className="block w-full text-center px-5 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 transition-colors"
              onClick={() => scrollToSection('cta')}
            >
              Request Demo
            </a>
          </div>
        </div>
      )}
    </header>
  );
};