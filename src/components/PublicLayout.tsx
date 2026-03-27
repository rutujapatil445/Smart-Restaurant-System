import React from 'react';
import NewNavbar from '../components/NewNavbar';
import ModernFooter from '../components/ModernFooter';

const PublicLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-stone-950 transition-colors duration-300">
      <NewNavbar />
      <main className="flex-grow">
        {children}
      </main>
      <ModernFooter />
    </div>
  );
};

export default PublicLayout;
