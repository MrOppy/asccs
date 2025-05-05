import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';

// Pages
import Home from './pages/Home';
import Accounts from './pages/Accounts';
import AccountDetails from './pages/AccountDetails';
import Sellers from './pages/Sellers';
import SellerProfile from './pages/SellerProfile';
import Contact from './pages/Contact';
import SellAccount from './pages/SellAccount';
import NotFound from './pages/NotFound';

// Admin pages
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminAccounts from './pages/admin/AdminAccounts';
import AdminSellers from './pages/admin/AdminSellers';

// Utils
import { PrivateRoute } from './components/PrivateRoute';
import { SupabaseProvider } from './lib/supabase-provider';

function App() {
  return (
    <SupabaseProvider>
      <Router>
        <Toaster richColors position="top-right" />
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Home />} />
          <Route path="/accounts" element={<Accounts />} />
          <Route path="/accounts/:id" element={<AccountDetails />} />
          <Route path="/sellers" element={<Sellers />} />
          <Route path="/sellers/:id" element={<SellerProfile />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/sell-account" element={<SellAccount />} />
          
          {/* Admin routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<PrivateRoute><AdminDashboard /></PrivateRoute>} />
          <Route path="/admin/accounts" element={<PrivateRoute><AdminAccounts /></PrivateRoute>} />
          <Route path="/admin/sellers" element={<PrivateRoute><AdminSellers /></PrivateRoute>} />
          
          {/* 404 route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </SupabaseProvider>
  );
}

export default App;