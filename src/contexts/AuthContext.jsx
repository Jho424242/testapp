import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUserProfile = async (user) => {
    if (!user) return null;
    // Ensure user_metadata exists and has a subscription property
    user.user_metadata = user.user_metadata || {};
    user.user_metadata.subscription = user.user_metadata.subscription || 'free';
    return user;
  };

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      const userWithProfile = await fetchUserProfile(session?.user);
      setUser(userWithProfile);
      setLoading(false);
    };

    getSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        const userWithProfile = await fetchUserProfile(session?.user);
        setUser(userWithProfile);
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const updateSubscription = async (newSubscription) => {
    const originalUser = user;
    const optimisticUser = {
      ...user,
      user_metadata: { ...user.user_metadata, subscription: newSubscription },
    };
    setUser(optimisticUser);

    const { data: authData, error: authError } = await supabase.auth.updateUser({
      data: { subscription: newSubscription },
    });

    if (authError) {
      console.error('Error updating user auth data:', authError);
      setUser(originalUser);
    }
  };

  const value = {
    signUp: (data) => supabase.auth.signUp(data),
    signIn: async (data) => {
      const { data: sessionData, error } = await supabase.auth.signInWithPassword(data);
      if (sessionData.user) {
        const userWithProfile = await fetchUserProfile(sessionData.user);
        setUser(userWithProfile);
      }
      return { data: sessionData, error };
    },
    signOut: () => supabase.auth.signOut(),
    user,
    setUser,
    updateSubscription,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
