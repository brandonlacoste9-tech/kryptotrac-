import React, { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Play, Download, Star, ExternalLink, Share2, Heart, Lock } from 'lucide-react';
import { gamesData } from '../data/games';
import { useAuth } from '../context/AuthContext';
import SEO from './SEO';
import './GamePage.css';

const GamePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, plan, favorites, toggleFavorite } = useAuth();
  const game = gamesData.find(g => g.id === id);

  const isFavorite = favorites?.has(game?.id) || false;

  const handleSave = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    await toggleFavorite(game.id);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  if (!game) {
    return (
      <div className="container game-not-found">
        <h2>Game Not Found</h2>
        <button className="btn btn-primary" onClick={() => navigate('/')}>Return to Arcade</button>
      </div>
    );
  }

  return (
    <div className="game-page-container">
      <SEO 
        title={game.title}
        description={game.description || `Play ${game.title} on Hell Yeah Games.`}
        image={game.coverUrl}
        url={`https://hellyeah-games.com/game/${game.id}`}
        schema={{
          "@context": "https://schema.org",
          "@type": "VideoGame",
          "name": game.title,
          "description": game.description || `Play ${game.title} on Hell Yeah Games.`,
          "image": game.coverUrl,
          "genre": game.category,
          "operatingSystem": game.isWebGame ? "Web Browser" : "Windows, macOS",
          "applicationCategory": "Game"
        }}
      />
      <div className="game-page-header">
        <div className="container">
          <Link to="/" className="back-link">
            <ArrowLeft size={20} />
            Back to Arcade
          </Link>
        </div>
      </div>

      <div className="container game-content-layout">
        {/* Game Player Area */}
        <div className="game-player-section">
          <div className="game-player-wrapper glass-panel">
            {plan === 'PRO' ? (
              game.isWebGame ? (
                <iframe 
                  src={game.gameUrl} 
                  title={game.title}
                  className="game-iframe"
                  sandbox="allow-scripts allow-same-origin allow-popups"
                  allowFullScreen
                ></iframe>
              ) : (
                <div className="downloadable-prompt">
                  <img src={game.coverUrl} alt={game.title} className="prompt-bg" />
                  <div className="prompt-overlay">
                    <Download size={48} className="prompt-icon text-gradient" />
                    <h2>Available for Desktop</h2>
                    <p>Download {game.title} to play on your machine.</p>
                    <button className="btn btn-primary btn-lg">
                      <Download size={20} />
                      Download Now (Windows / Mac)
                    </button>
                  </div>
                </div>
              )
            ) : game.isFree ? (
              <div className="downloadable-prompt">
                <img src={game.coverUrl} alt={game.title} className="prompt-bg" />
                <div className="prompt-overlay">
                  <Play size={48} className="prompt-icon text-gradient" />
                  <h2>Free Trial Game</h2>
                  <p>You can play this game for free for 1 hour!</p>
                  <button className="btn btn-primary btn-lg" onClick={() => navigate(`/play/${game.id}`)}>
                    <Play size={20} fill="currentColor" />
                    Enter Theater Mode to Play
                  </button>
                </div>
              </div>
            ) : (
              <div className="downloadable-prompt paywall-prompt">
                <img src={game.coverUrl} alt={game.title} className="prompt-bg" />
                <div className="prompt-overlay">
                  <Lock size={48} className="prompt-icon" style={{ color: 'var(--text-secondary)' }} />
                  <h2>Premium Game</h2>
                  <p>You need a Pro subscription to play {game.title}.</p>
                  <button className="btn btn-primary btn-lg" onClick={() => navigate('/pricing')}>
                    <Star size={20} fill="currentColor" />
                    Subscribe to Play
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Game Info Area */}
        <div className="game-info-section glass-panel">
          <div className="game-info-header">
            <span className="category-tag">{game.category}</span>
            <h1 className="game-info-title text-gradient">{game.title}</h1>
            
            <div className="game-rating-large">
              <Star size={20} fill="#fbbf24" className="star-icon" />
              <span>{game.rating} / 5</span>
            </div>
          </div>
          
          <div className="game-info-actions">
            <button className="btn btn-outline action-btn" onClick={handleSave}>
              <Heart size={20} fill={isFavorite ? 'var(--primary-color)' : 'none'} color={isFavorite ? 'var(--primary-color)' : 'currentColor'} />
              {isFavorite ? 'Saved' : 'Save'}
            </button>
            <button className="btn btn-outline action-btn">
              <Share2 size={20} />
              Share
            </button>
            {game.isWebGame ? (
              <>
                <button className="btn btn-primary action-btn" onClick={() => navigate(`/play/${game.id}`)}>
                  <Play size={20} fill="currentColor" />
                  Theater Mode
                </button>
                {plan === 'PRO' && (
                  <a href={game.gameUrl} target="_blank" rel="noopener noreferrer" className="btn btn-outline action-btn">
                    <ExternalLink size={20} />
                    Open in New Tab
                  </a>
                )}
              </>
            ) : (
              plan === 'PRO' ? (
                <a href={game.downloadUrl} target="_blank" rel="noopener noreferrer" className="btn btn-primary action-btn">
                  <Download size={20} />
                  Visit Game Page
                </a>
              ) : (
                <button className="btn btn-primary action-btn" onClick={() => navigate('/pricing')}>
                  <Lock size={20} />
                  Subscribe to Download
                </button>
              )
            )}
          </div>

          <div className="game-description-full">
            <h3>About This Game</h3>
            <p>{game.description}</p>
            <p className="mt-4">
              Get ready to immerse yourself in the world of {game.title}. 
              Whether you are looking for a quick session or a deep dive, this game offers 
              premium entertainment right from Hell Yeah Games platform.
            </p>
          </div>
          
          <div className="game-specs">
            <div className="spec-item">
              <span className="spec-label">Platform</span>
              <span className="spec-value">{game.isWebGame ? 'Web Browser' : 'Windows, macOS'}</span>
            </div>
            <div className="spec-item">
              <span className="spec-label">Genre</span>
              <span className="spec-value">{game.category}</span>
            </div>
            <div className="spec-item">
              <span className="spec-label">Developer</span>
              <span className="spec-value">Indie Studio</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GamePage;
