import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Maximize, Heart } from 'lucide-react';
import { gamesData } from '../data/games';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../supabaseClient';
import './GamePlayer.css';

const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:4242';

const GamePlayer = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, plan, trialSeconds, updateTrialSeconds } = useAuth();
  const [game, setGame] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);

  useEffect(() => {
    const foundGame = gamesData.find(g => g.id === id);
    if (!foundGame) {
      navigate('/games');
      return;
    }
    
    // Auth requirements for free games
    if (foundGame.isFree && plan !== 'PRO' && !user) {
      navigate('/login');
      return;
    }

    // If not pro and not free, they can't play
    if (plan !== 'PRO' && !foundGame.isFree) {
      navigate('/pricing');
      return;
    }

    setGame(foundGame);
  }, [id, plan, user, navigate]);

  useEffect(() => {
    if (!game || plan === 'PRO' || !game.isFree || !user || trialSeconds <= 0) return;

    let isFocused = document.hasFocus();
    const onFocus = () => isFocused = true;
    const onBlur = () => isFocused = false;
    window.addEventListener('focus', onFocus);
    window.addEventListener('blur', onBlur);

    const heartbeat = async () => {
      if (!isFocused) return;
      
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;
      
      try {
        const res = await fetch(`${apiUrl}/api/heartbeat`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.access_token}`
          }
        });
        const data = await res.json();
        if (data.success) {
          updateTrialSeconds(data.trial_seconds_remaining);
          if (data.trial_seconds_remaining > 0 && data.trial_seconds_remaining <= 300 && !toastVisible) {
            setToastVisible(true);
            setTimeout(() => setToastVisible(false), 5000);
          }
        }
      } catch(err) { console.error('Heartbeat failed:', err); }
    };

    const intervalId = setInterval(heartbeat, 60000);
    
    return () => {
      clearInterval(intervalId);
      window.removeEventListener('focus', onFocus);
      window.removeEventListener('blur', onBlur);
    };
  }, [game, plan, user, trialSeconds]);

  const toggleFullscreen = () => {
    const iframe = document.getElementById('game-iframe');
    if (!document.fullscreenElement) {
      iframe.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  if (!game) return <div className="game-player-loading">Loading arcade...</div>;

  return (
    <div className="game-player-container">
      {/* Overlay Toolbar */}
      <div className="game-player-toolbar">
        <button className="btn btn-outline toolbar-btn" onClick={() => navigate(-1)}>
          <ArrowLeft size={18} /> Exit
        </button>
        <h2 className="game-player-title">{game.title}</h2>
        <div className="toolbar-actions">
          <button className="icon-btn" aria-label="Favorite">
            <Heart size={20} />
          </button>
          <button className="icon-btn" aria-label="Fullscreen" onClick={toggleFullscreen}>
            <Maximize size={20} />
          </button>
        </div>
      </div>

      {/* Visual Timer */}
      {plan !== 'PRO' && game.isFree && trialSeconds > 0 && (
        <div className="trial-timer">
          <span style={{ color: trialSeconds <= 300 ? '#ff0055' : '#00e5ff' }}>
            Free Trial: {Math.floor(trialSeconds / 60)}:{(trialSeconds % 60).toString().padStart(2, '0')}
          </span>
        </div>
      )}

      {/* Soft Warning Toast */}
      {toastVisible && (
        <div className="trial-warning-toast">
          ⚠️ Warning: 5 minutes left in your free trial!
        </div>
      )}

      {/* The Game Iframe */}
      <div className="iframe-wrapper">
        <iframe
          id="game-iframe"
          src={game.gameUrl}
          title={game.title}
          allowFullScreen
          frameBorder="0"
          className={`game-iframe ${trialSeconds <= 0 && plan !== 'PRO' ? 'blurred-iframe' : ''}`}
        ></iframe>

        {/* Paywall Overlay */}
        {trialSeconds <= 0 && plan !== 'PRO' && (
          <div className="paywall-overlay">
            <div className="paywall-content">
              <h2>Time's Up! ⏰</h2>
              <p>Your 1-hour free trial has expired.</p>
              <button className="btn btn-primary btn-lg mt-4" onClick={() => navigate('/pricing')}>
                Subscribe to Pro Gamer
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GamePlayer;
