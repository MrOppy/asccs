import React, { createContext, useContext, useEffect, useState } from 'react';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Database } from '../types/supabase';

// Initialize Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

type SupabaseContext = {
  supabase: SupabaseClient<Database>;
  user: any;
  loading: boolean;
};

const Context = createContext<SupabaseContext | undefined>(undefined);

export const SupabaseProvider: React.FC<{ children: React.ReactNode }> = ({ 
  children 
}) => {
  const [supabase] = useState(() => createClient<Database>(supabaseUrl, supabaseAnonKey));
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    // Initial check
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase]);

  const value = {
    supabase,
    user,
    loading,
  };

  return <Context.Provider value={value}>{children}</Context.Provider>;
};

export const useSupabase = () => {
  const context = useContext(Context);
  if (context === undefined) {
    throw new Error('useSupabase must be used inside SupabaseProvider');
  }
  return context;
};