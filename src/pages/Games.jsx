import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import GameGrid from '../components/GameGrid';

const Games = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  useEffect(() => {
    const sessionId = searchParams.get('session_id');
    if (sessionId) {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:4242';
      fetch(`${apiUrl}/verify-session`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId })
      })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setPaymentSuccess(true);
          searchParams.delete('session_id');
          setSearchParams(searchParams);
          setTimeout(() => window.location.reload(), 3000); 
        }
      })
      .catch(err => console.error('Verification failed', err));
    }
  }, [searchParams, setSearchParams]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div style={{ paddingTop: '80px', minHeight: '100vh' }}>
      {paymentSuccess && (
        <div style={{ background: 'rgba(0, 255, 150, 0.1)', color: '#00ff96', padding: '1rem', borderRadius: '8px', margin: '1rem auto', maxWidth: '600px', textAlign: 'center', border: '1px solid rgba(0, 255, 150, 0.3)' }}>
          Payment Successful! You are now a PRO Gamer. Reloading your account...
        </div>
      )}
      <div className="container" style={{ textAlign: 'center', paddingTop: '2rem' }}>
        <h1>Hell Yeah Games <span className="text-gradient">Catalog</span></h1>
        <p style={{ color: 'var(--text-secondary)' }}>Browse our entire collection of premium games.</p>
      </div>
      <GameGrid />
    </div>
  );
};

export default Games;
