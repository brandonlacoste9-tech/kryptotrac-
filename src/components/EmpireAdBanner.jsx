import React, { useState, useEffect } from 'react';

// Use standard window.fetch if Supabase client isn't globally available in the host app
// But we'll try to use the host's supabase client if possible, or fallback to REST API
// Actually, it's safer to just fetch directly from Supabase REST API to avoid dependency hell across 7 repos
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://eurrfbiavliahmhdxybp.supabase.co';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV1cnJmYmlhdmxpYWhtaGR4eWJwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODEyMDYyMTUsImV4cCI6MjA5Njc4MjIxNX0.hW7E5Z-02WTBiezSjUzjIBjfMc3OgYexFlvzlgJO3p0';

const EmpireAdBanner = () => {
  const [ad, setAd] = useState(null);

  useEffect(() => {
    // 1. Fetch a random active ad from the ad_campaigns table
    const fetchAd = async () => {
      try {
        const response = await fetch(`${SUPABASE_URL}/rest/v1/ad_campaigns?active=eq.true&select=*`, {
          headers: {
            'apikey': SUPABASE_ANON_KEY,
            'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
          }
        });
        const ads = await response.json();
        
        if (ads && ads.length > 0) {
          // Pick a random ad
          const selectedAd = ads[Math.floor(Math.random() * ads.length)];
          setAd(selectedAd);
          
          // 2. Track Impression
          fetch(`${SUPABASE_URL}/rest/v1/rpc/track_ad_event`, {
            method: 'POST',
            headers: {
              'apikey': SUPABASE_ANON_KEY,
              'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ ad_id: selectedAd.id, event_type: 'impression' })
          }).catch(console.error);
        }
      } catch (err) {
        console.error('Failed to load Empire Ad:', err);
      }
    };

    fetchAd();
  }, []);

  if (!ad) return null;

  const handleClick = () => {
    // 3. Track Click
    fetch(`${SUPABASE_URL}/rest/v1/rpc/track_ad_event`, {
      method: 'POST',
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ ad_id: ad.id, event_type: 'click' })
    }).catch(console.error);
  };

  return (
    <div style={{
      width: '100%',
      maxWidth: '728px',
      margin: '2rem auto',
      background: '#111',
      border: '1px solid #333',
      borderRadius: '8px',
      overflow: 'hidden',
      position: 'relative',
      fontFamily: 'sans-serif'
    }}>
      <div style={{
        position: 'absolute',
        top: 0, right: 0,
        background: 'rgba(0,0,0,0.7)',
        color: '#888',
        fontSize: '10px',
        padding: '2px 6px',
        borderBottomLeftRadius: '4px',
        textTransform: 'uppercase',
        zIndex: 10
      }}>
        Sponsored by The Empire
      </div>
      
      <a 
        href={ad.target_url} 
        target="_blank" 
        rel="noopener noreferrer" 
        onClick={handleClick}
        style={{ display: 'flex', textDecoration: 'none', color: 'inherit', alignItems: 'center' }}
      >
        <img 
          src={ad.image_url} 
          alt={ad.title} 
          style={{ width: '120px', height: '90px', objectFit: 'cover' }} 
        />
        <div style={{ padding: '0 20px', flex: 1 }}>
          <h3 style={{ margin: '0 0 5px 0', color: '#fff', fontSize: '1.2rem' }}>{ad.title}</h3>
          <p style={{ margin: 0, color: '#aaa', fontSize: '0.9rem' }}>Click here to experience the next evolution in digital entertainment.</p>
        </div>
        <div style={{ padding: '0 20px' }}>
          <button style={{
            background: '#ff003c',
            color: '#fff',
            border: 'none',
            padding: '8px 16px',
            borderRadius: '4px',
            fontWeight: 'bold',
            cursor: 'pointer'
          }}>
            PLAY NOW
          </button>
        </div>
      </a>
    </div>
  );
};

export default EmpireAdBanner;
