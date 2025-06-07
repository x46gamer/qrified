import React from 'react';
import Header from './Header';
import Footer from './Footer';

const AppLayout: React.FC<{ children: React.ReactNode; showFooter?: boolean }> = ({ children, showFooter = true }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        {children}
      </main>
      {showFooter && <Footer />}
    </div>
  );
};

export default AppLayout;
