import React, { useState, useEffect } from 'react';
import { Play, Download, Star, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { useAuth } from '../context/AuthContext';
import './GameCard.css';

const GameCard = ({ game }) => {
  const { user, favorites, toggleFavorite } = useAuth();
  const isFavorite = favorites?.has(game.id) || false;

  const handleToggleFavorite = async (e) => {
    e.preventDefault(); // prevent routing
    e.stopPropagation();
    
    if (!user) {
      alert("Please login to save favorites!");
      return;
    }

    await toggleFavorite(game.id);
  };

  return (
    <Link to={`/game/${game.id}`} className="game-card glass-panel animate-fade-in" style={{ textDecoration: 'none', color: 'inherit' }}>
      <div className="game-card-image-wrapper">
        <img src={game.coverUrl} alt={game.title} className="game-card-image" />
        <div className="game-card-overlay">
          <Link 
            to={game.isWebGame ? `/play/${game.id}` : `/game/${game.id}`} 
            className="btn btn-primary play-btn round-btn"
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            onClick={(e) => e.stopPropagation()}
          >
            {game.isWebGame ? <Play size={24} fill="currentColor" /> : <Download size={24} />}
          </Link>
        </div>
        <div className="game-badge">{game.category}</div>
        
        {/* Heart Icon Overlay */}
        <button 
          className="icon-btn" 
          onClick={handleToggleFavorite}
          style={{ position: 'absolute', top: '10px', right: '10px', zIndex: 10, background: 'rgba(0,0,0,0.5)', padding: '0.4rem' }}
        >
          <Heart size={18} fill={isFavorite ? 'var(--primary-color)' : 'none'} color={isFavorite ? 'var(--primary-color)' : '#fff'} />
        </button>
      </div>
      
      <div className="game-card-content">
        <div className="game-card-header">
          <h3 className="game-title">{game.title}</h3>
          <div className="game-rating">
            <Star size={14} fill="currentColor" className="star-icon" />
            <span>{game.rating}</span>
          </div>
        </div>
        <p className="game-description">{game.description}</p>
        <div className="game-card-footer">
          <span className="game-type">{game.isWebGame ? 'Play in Browser' : 'Windows / Mac'}</span>
          <span className="action-link">View Details</span>
        </div>
      </div>
    </Link>
  );
};

export default GameCard;
