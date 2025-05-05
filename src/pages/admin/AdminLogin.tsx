import React, { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useSupabase } from '../../lib/supabase-provider';
import { Gamepad2, Lock } from 'lucide-react';
import Button from '../../components/Button';

const AdminLogin: React.FC = () => {
  const navigate = useNavigate();
  const { supabase, user, loading } = useSupabase();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setAuthLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;
      
      navigate('/admin');
    } catch (error: any) {
      console.error('Error signing in:', error);
      setError(error.message || 'Failed to sign in');
    } finally {
      setAuthLoading(false);
    }
  };

  // If user is already logged in, redirect to admin dashboard
  if (user && !loading) {
    return <Navigate to="/admin" replace />;
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full bg-card rounded-xl shadow-xl p-8"
      >
        <div className="text-center mb-8">
          <Gamepad2 className="w-16 h-16 text-primary mx-auto mb-4" />
          <h1 className="text-2xl font-heading font-bold gradient-text">Admin Login</h1>
          <div className="flex items-center justify-center mt-2 text-muted-foreground text-sm">
            <Lock className="w-4 h-4 mr-1" />
            <span>Secure Admin Access</span>
          </div>
        </div>
        
        {error && (
          <div className="bg-error/10 border border-error/30 text-error px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}
        
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-1">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-background border border-border focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-background border border-border focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>
          
          <Button
            type="submit"
            className="w-full"
            loading={authLoading}
          >
            Sign In
          </Button>
        </form>
        
        <div className="mt-8 text-center">
          <Button 
            href="/"
            variant="ghost"
            size="sm"
          >
            Return to Website
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminLogin;