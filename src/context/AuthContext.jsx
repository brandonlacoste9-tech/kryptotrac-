import React, { createContext, useState, useContext, useEffect } from 'react';
import { supabase } from '../supabaseClient';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); 
  const [plan, setPlan] = useState('FREE'); 
  const [trialSeconds, setTrialSeconds] = useState(3600);
  const [favorites, setFavorites] = useState(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check active sessions and sets the user
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
      } else {
        setLoading(false);
      }
    });

    // Listen for changes on auth state (logged in, signed out, etc.)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
      } else {
        setPlan('FREE');
        setFavorites(new Set());
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchProfile = async (userId) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('plan, trial_seconds_remaining')
      .eq('id', userId)
      .single();
    
    if (data) {
      setPlan(data.plan);
      setTrialSeconds(data.trial_seconds_remaining ?? 3600);
    }
    
    const { data: favs } = await supabase
      .from('user_favorites')
      .select('game_id')
      .eq('user_id', userId);
      
    if (favs) {
      setFavorites(new Set(favs.map(f => f.game_id)));
    }

    setLoading(false);
  };

  const login = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data;
  };

  const signup = async (email, password, username) => {
    const { data, error } = await supabase.auth.signUp({ 
      email, 
      password,
      options: {
        data: { username }
      }
    });
    if (error) throw error;
    return data;
  };

  const logout = async () => {
    await supabase.auth.signOut();
  };

  const toggleFavorite = async (gameId) => {
    if (!user) return false;
    
    const isFav = favorites.has(gameId);
    if (isFav) {
      await supabase.from('user_favorites').delete().eq('user_id', user.id).eq('game_id', gameId);
      setFavorites(prev => {
        const next = new Set(prev);
        next.delete(gameId);
        return next;
      });
    } else {
      await supabase.from('user_favorites').insert([{ user_id: user.id, game_id: gameId }]);
      setFavorites(prev => {
        const next = new Set(prev);
        next.add(gameId);
        return next;
      });
    }
    return !isFav;
  };

  return (
    <AuthContext.Provider value={{ user, plan, trialSeconds, updateTrialSeconds: setTrialSeconds, loading, login, signup, logout, favorites, toggleFavorite }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
