import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Search, Star, Plus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../supabaseClient';
import './GameGrid.css';

const CryptoGrid = () => {
  const { user } = useAuth();
  const [coins, setCoins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchCoins = async () => {
      try {
        const response = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false');
        if (!response.ok) throw new Error('Failed to fetch crypto data');
        const data = await response.json();
        setCoins(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchCoins();
    
    // Poll every 60 seconds
    const interval = setInterval(fetchCoins, 60000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return <div className="container" style={{ padding: '4rem 1.5rem', textAlign: 'center' }}>Loading live market data...</div>;
  }

  const filteredCoins = coins.filter(coin => 
    coin.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    coin.symbol.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const addCoin = async (coinId, isWatchlist) => {
    if (!user) return alert('Please log in to use this feature.');
    const amount = isWatchlist ? 0 : prompt('How many coins do you own?');
    if (!isWatchlist && (amount === null || isNaN(amount))) return;
    
    try {
      const { error } = await supabase.from('crypto_portfolio').upsert({
        user_id: user.id,
        coin_id: coinId,
        amount: isWatchlist ? 0 : Number(amount),
        is_watchlist: isWatchlist
      }, { onConflict: 'user_id, coin_id' });
      
      if (error) throw error;
      alert(`Added ${coinId} to your ${isWatchlist ? 'watchlist' : 'portfolio'}!`);
    } catch (err) {
      console.error(err);
      alert('Error saving data.');
    }
  };

  return (
    <section className="game-grid-section container" style={{ marginTop: '2rem', marginBottom: '4rem' }}>
      <div className="section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <h2 className="section-title" style={{ margin: 0 }}>Live Markets <span className="text-gradient">Top 100</span></h2>
        
        <div style={{ position: 'relative', width: '100%', maxWidth: '300px' }}>
          <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input 
            type="text" 
            placeholder="Search coins..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.5rem', borderRadius: 'var(--border-radius-sm)', border: 'var(--glass-border)', background: 'var(--surface-color-glass)', color: 'var(--text-primary)', outline: 'none', fontFamily: 'var(--font-body)' }}
          />
        </div>
      </div>
      
      <div className="game-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1.5rem', marginTop: '2rem' }}>
        {filteredCoins.length > 0 ? filteredCoins.map(coin => (
          <div key={coin.id} className="game-card glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', transition: 'transform 0.2s', cursor: 'pointer' }} onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'none'}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <img src={coin.image} alt={coin.name} style={{ width: '40px', height: '40px', borderRadius: '50%' }} />
              <div>
                <h3 style={{ fontSize: '1.2rem', margin: 0, fontFamily: 'var(--font-heading)' }}>{coin.name}</h3>
                <span style={{ color: 'var(--text-muted)', textTransform: 'uppercase', fontSize: '0.8rem', fontWeight: 'bold' }}>{coin.symbol}</span>
              </div>
            </div>
            
            <div style={{ marginTop: '0.5rem' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', fontFamily: 'var(--font-heading)' }}>${coin.current_price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 6 })}</div>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '4px',
                color: coin.price_change_percentage_24h >= 0 ? '#00e676' : '#ff2a2a',
                fontSize: '0.9rem',
                fontWeight: 'bold',
                marginTop: '0.2rem'
              }}>
                {coin.price_change_percentage_24h >= 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                {Math.abs(coin.price_change_percentage_24h).toFixed(2)}%
              </div>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.5rem', borderTop: 'var(--glass-border)', paddingTop: '0.75rem' }}>
              <span>Market Cap: <span style={{ fontWeight: 'bold' }}>${(coin.market_cap / 1000000000).toFixed(2)}B</span></span>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button onClick={(e) => { e.stopPropagation(); addCoin(coin.id, true); }} title="Add to Watchlist" style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '2px' }} onMouseEnter={e => e.currentTarget.style.color = '#fff'} onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}><Star size={16} /></button>
                <button onClick={(e) => { e.stopPropagation(); addCoin(coin.id, false); }} title="Add to Portfolio" style={{ background: 'transparent', border: 'none', color: 'var(--primary-color)', cursor: 'pointer', padding: '2px' }}><Plus size={16} /></button>
              </div>
            </div>
          </div>
        )) : (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
            No coins found matching "{searchQuery}"
          </div>
        )}
      </div>
    </section>
  );
};

export default CryptoGrid;
