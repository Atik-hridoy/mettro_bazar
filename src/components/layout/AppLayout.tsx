'use client';

import React, { useState } from 'react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { Footer } from './Footer';
import { FloatingCart } from './FloatingCart';
import { AuthModal } from '@/components/common/AuthModal';
import { ProductDetailModal } from '@/components/common/ProductDetailModal';

interface AppLayoutProps {
  children: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  // Always open by default on desktop, unless user explicitly closes it
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="min-h-screen bg-white flex flex-col text-zinc-900 font-sans">
      {/* Authentic Sticky Top Header */}
      <Header
        onToggleMobileSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <div className="flex-1 flex w-full relative">
        {/* Left Side Menu (Always open by default, can be toggled by user) */}
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />

        {/* Main Content Area (Smoothly adjusts width when sidebar toggles) */}
        <main
          className={`flex-1 w-full min-w-0 bg-white transition-all duration-300 flex flex-col justify-between ${
            isSidebarOpen ? 'md:pl-56' : 'md:pl-0'
          }`}
        >
          <div className="flex-1">
            {children}
          </div>

          {/* Authentic Footer */}
          <Footer />
        </main>

        {/* Right Sticky Cart & Drawer */}
        <FloatingCart />
      </div>

      {/* Global Auth / Sign In Modal */}
      <AuthModal />

      {/* Global Product Detail & Recommendations Modal matching Chaldal 1:1 */}
      <ProductDetailModal />
    </div>
  );
};
