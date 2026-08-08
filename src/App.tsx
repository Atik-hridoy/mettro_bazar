import { useState } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { useIsMobile } from './hooks/useIsMobile';
import { Navbar } from './components/features/Navbar';
import { MobileNavbar } from './components/mobile/MobileNavbar';
import { AuthModal } from './components/features/AuthModal';
import { CartDrawer } from './components/features/CartDrawer';
import { HomePage } from './pages/HomePage';
import { MobileHomePage } from './components/mobile/MobileHomePage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { ProfilePage } from './pages/ProfilePage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { AuthPage } from './pages/AuthPage';

function AppLayout() {
  const isMobile = useIsMobile(768);
  const location = useLocation();
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const isAuthRoute = location.pathname === '/auth';
  const isAdminRoute = location.pathname.startsWith('/admin');
  const hideNavbar = isAuthRoute || isAdminRoute;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col">
      {/* Hide Navbar on /auth or /admin routes */}
      {!hideNavbar &&
        (isMobile ? (
          <MobileNavbar
            onOpenCart={() => setIsCartOpen(true)}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />
        ) : (
          <Navbar
            onOpenCart={() => setIsCartOpen(true)}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />
        ))}

      <main className="flex-grow w-full">
        <Routes>
          <Route
            path="/"
            element={
              isMobile ? (
                <MobileHomePage searchQuery={searchQuery} />
              ) : (
                <HomePage searchQuery={searchQuery} />
              )
            }
          />
          <Route path="/product/:id" element={<ProductDetailPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/admin" element={<AdminDashboardPage />} />
        </Routes>
      </main>

      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppLayout />
    </BrowserRouter>
  );
}
