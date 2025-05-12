import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { User } from '@supabase/supabase-js';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        console.error('Sign in error:', error.message);
        return { error };
      }

      return { error: null };
    } catch (err) {
      console.error('Unexpected sign in error:', err);
      return { error: err as Error };
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      // First, attempt to sign up
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            email_confirmed: true
          }
        }
      });

      if (error) {
        console.error('Sign up error:', error.message);
        return { error };
      }

      // If signup successful, attempt immediate sign in
      const { error: signInError } = await signIn(email, password);
      if (signInError) {
        console.error('Post-signup sign in error:', signInError);
        return { error: signInError };
      }

      return { error: null };
    } catch (err) {
      console.error('Unexpected sign up error:', err);
      return { error: err as Error };
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Sign out error:', error.message);
      }
      return { error };
    } catch (err) {
      console.error('Unexpected sign out error:', err);
      return { error: err as Error };
    }
  };

  return { user, loading, signIn, signUp, signOut };
}