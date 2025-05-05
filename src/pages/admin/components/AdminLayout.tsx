import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSupabase } from '../../../lib/supabase-provider';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { Menu, X, LayoutDashboard, ShoppingBag, Users, LogOut, Gamepad2 } from 'lucide-react';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { supabase } = useSupabase();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      toast.success('Signed out successfully');
      navigate('/admin/login');
    } catch (error) {
      console.error('Error signing out:', error);
      toast.error('Failed to sign out');
    }
  };

  const navItems = [
    {
      label: 'Dashboard',
      icon: <LayoutDashboard className="w-5 h-5" />,
      path: '/admin'
    },
    {
      label: 'Accounts',
      icon: <ShoppingBag className="w-5 h-5" />,
      path: '/admin/accounts'
    },
    {
      label: 'Sellers',
      icon: <Users className="w-5 h-5" />,
      path: '/admin/sellers'
    }
  ];

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row">
      {/* Mobile header */}
      <header className="md:hidden bg-card border-b border-border p-4 flex items-center justify-between">
        <Link to="/admin" className="flex items-center space-x-2">
          <Gamepad2 className="w-6 h-6 text-primary" />
          <span className="text-lg font-heading font-bold gradient-text">FF Admin</span>
        </Link>
        
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 text-muted-foreground hover:text-foreground"
        >
          {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </header>
      
      {/* Sidebar */}
      <aside 
        className={`
          fixed md:sticky top-0 left-0 z-40 h-screen w-64 transition-transform 
          border-r border-border bg-card md:translate-x-0
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <div className="h-full flex flex-col justify-between p-4">
          <div>
            <Link to="/admin" className="flex items-center space-x-2 mb-8 py-2">
              <Gamepad2 className="w-8 h-8 text-primary" />
              <span className="text-xl font-heading font-bold gradient-text">FF Admin</span>
            </Link>
            
            <nav className="space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`
                    flex items-center space-x-3 px-4 py-3 rounded-lg
                    ${isActive(item.path) 
                      ? 'bg-primary/10 text-primary font-medium' 
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'}
                  `}
                  onClick={() => setSidebarOpen(false)}
                >
                  {item.icon}
                  <span>{item.label}</span>
                  {isActive(item.path) && (
                    <motion.div
                      layoutId="sidebar-highlight"
                      className="absolute left-0 w-1 h-8 bg-primary rounded-r-full"
                    />
                  )}
                </Link>
              ))}
            </nav>
          </div>
          
          <div>
            <button
              onClick={handleSignOut}
              className="flex items-center space-x-3 px-4 py-3 w-full rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              <LogOut className="w-5 h-5" />
              <span>Sign Out</span>
            </button>
            
            <Link
              to="/"
              className="flex items-center justify-center mt-4 text-xs text-muted-foreground hover:text-foreground"
            >
              View Public Site
            </Link>
          </div>
        </div>
      </aside>
      
      {/* Page content */}
      <main className="flex-1">
        <div className="p-6 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
      
      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}
    </div>
  );
};

export default AdminLayout;