'use client';

import React, { useState } from 'react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { FloatingCart } from './FloatingCart';

interface AppLayoutProps {
  children: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white flex flex-col text-zinc-900 font-sans">
      {/* Slim Sticky Top Header */}
      <Header
        onToggleMobileSidebar={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
      />

      <div className="flex-1 flex w-full relative">
        {/* Flat Left Sidebar (Fixed on Desktop & Drawer on Mobile) */}
        <Sidebar
          isOpenMobile={isMobileSidebarOpen}
          onCloseMobile={() => setIsMobileSidebarOpen(false)}
        />

        {/* Main Content Area */}
        <main className="flex-1 w-full md:pl-60 min-w-0 bg-white">
          {children}
        </main>

        {/* Floating Cart & Sliding Drawer */}
        <FloatingCart />
      </div>
    </div>
  );
};
