import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../supabaseClient';
import { gamesData } from '../data/games';
import GameCard from '../components/GameCard';
import { Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const MyLibrary = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchFavorites = async () => {
      const { data, error } = await supabase
        .from('user_favorites')
        .select('game_id')
        .eq('user_id', user.id);

      if (error) {
        console.error('Error fetching favorites:', error);
      } else if (data) {
        const favoriteIds = data.map(f => f.game_id);
        const favGames = gamesData.filter(g => favoriteIds.includes(g.id));
        setFavorites(favGames);
      }
      setLoading(false);
    };

    fetchFavorites();
  }, [user, navigate]);

  return (
    <div className="container" style={{ paddingTop: '100px', minHeight: '80vh' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2rem' }}>
        <Heart size={28} className="text-primary" fill="var(--primary-color)" />
        <h1 className="text-gradient" style={{ margin: 0 }}>My Library</h1>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>Loading your collection...</div>
      ) : favorites.length === 0 ? (
        <div className="glass-panel" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
          <Heart size={48} style={{ color: 'var(--border-color)', margin: '0 auto 1rem' }} />
          <h3>Your Library is Empty</h3>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>You haven't saved any games to your library yet.</p>
          <button className="btn btn-primary" onClick={() => navigate('/games')}>
            Browse Catalog
          </button>
        </div>
      ) : (
        <div className="game-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '2rem' }}>
          {favorites.map(game => (
            <GameCard key={game.id} game={game} />
          ))}
        </div>
      )}
    </div>
  );
};

export default MyLibrary;
