import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../supabaseClient';
import { TrendingUp, TrendingDown, Trash2 } from 'lucide-react';
import SEO from '../components/SEO';

const PortfolioDashboard = () => {
  const { user } = useAuth();
  const [portfolio, setPortfolio] = useState([]);
  const [liveData, setLiveData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }
    
    const fetchPortfolio = async () => {
      try {
        const { data, error } = await supabase
          .from('crypto_portfolio')
          .select('*')
          .eq('user_id', user.id);
          
        if (error) throw error;
        setPortfolio(data || []);
        
        // If they have coins, fetch live prices
        if (data && data.length > 0) {
          const coinIds = data.map(item => item.coin_id).join('%2C');
          const res = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${coinIds}&vs_currencies=usd&include_24hr_change=true`);
          if (res.ok) {
            const prices = await res.json();
            setLiveData(prices);
          }
        }
      } catch (err) {
        console.error("Error fetching portfolio:", err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchPortfolio();
    
    // Poll every 60 seconds
    const interval = setInterval(fetchPortfolio, 60000);
    return () => clearInterval(interval);
  }, [user]);

  const removeCoin = async (coinId) => {
    try {
      await supabase.from('crypto_portfolio').delete().match({ user_id: user.id, coin_id: coinId });
      setPortfolio(prev => prev.filter(p => p.coin_id !== coinId));
    } catch (err) {
      console.error(err);
    }
  };

  if (!user) return <div className="container" style={{ padding: '8rem 1.5rem', textAlign: 'center' }}>Please log in to view your portfolio.</div>;
  if (loading) return <div className="container" style={{ padding: '8rem 1.5rem', textAlign: 'center' }}>Loading your secure portfolio...</div>;

  const ownedCoins = portfolio.filter(p => !p.is_watchlist);
  const watchlistCoins = portfolio.filter(p => p.is_watchlist);
  
  // Calculate Net Worth
  const totalNetWorth = ownedCoins.reduce((total, item) => {
    const price = liveData[item.coin_id]?.usd || 0;
    return total + (Number(item.amount) * price);
  }, 0);

  return (
    <div className="container animate-fade-in" style={{ padding: '8rem 1.5rem 4rem', minHeight: '80vh' }}>
      <SEO title="My Portfolio | Kryptotrac" description="Track your personal cryptocurrency net worth in real-time." />
      
      <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
        <h1 style={{ fontFamily: 'var(--font-heading)', color: 'var(--text-muted)', fontSize: '1.2rem', textTransform: 'uppercase', letterSpacing: '2px' }}>Total Net Worth</h1>
        <div style={{ 
          fontSize: '4rem', 
          fontWeight: '900', 
          fontFamily: 'var(--font-heading)',
          background: 'linear-gradient(135deg, #ff2a2a, #ff8a8a)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          filter: 'drop-shadow(0 0 20px rgba(255, 42, 42, 0.4))'
        }}>
          ${totalNetWorth.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </div>
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
        {/* Owned Assets */}
        <div className="glass-panel" style={{ padding: '2rem', borderRadius: '1rem' }}>
          <h2 style={{ fontFamily: 'var(--font-heading)', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>My Assets</h2>
          {ownedCoins.length === 0 ? (
            <p style={{ color: 'var(--text-muted)' }}>No assets added yet. Browse the markets to add coins!</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {ownedCoins.map(item => {
                const price = liveData[item.coin_id]?.usd || 0;
                const change = liveData[item.coin_id]?.usd_24h_change || 0;
                const value = Number(item.amount) * price;
                return (
                  <div key={item.coin_id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: 'var(--surface-color)', borderRadius: '0.5rem' }}>
                    <div>
                      <h3 style={{ textTransform: 'capitalize', margin: 0 }}>{item.coin_id}</h3>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{item.amount} owned</span>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontWeight: 'bold' }}>${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '4px', fontSize: '0.8rem', color: change >= 0 ? '#00e676' : '#ff2a2a' }}>
                        {change >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                        {Math.abs(change).toFixed(2)}%
                      </div>
                    </div>
                    <button onClick={() => removeCoin(item.coin_id)} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '0.5rem' }}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
        
        {/* Watchlist */}
        <div className="glass-panel" style={{ padding: '2rem', borderRadius: '1rem' }}>
          <h2 style={{ fontFamily: 'var(--font-heading)', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>Watchlist ⭐️</h2>
          {watchlistCoins.length === 0 ? (
            <p style={{ color: 'var(--text-muted)' }}>Watchlist is empty. Star coins on the home page!</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {watchlistCoins.map(item => {
                const price = liveData[item.coin_id]?.usd || 0;
                const change = liveData[item.coin_id]?.usd_24h_change || 0;
                return (
                  <div key={item.coin_id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: 'var(--surface-color)', borderRadius: '0.5rem' }}>
                    <h3 style={{ textTransform: 'capitalize', margin: 0 }}>{item.coin_id}</h3>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontWeight: 'bold' }}>${price.toLocaleString()}</div>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '4px', fontSize: '0.8rem', color: change >= 0 ? '#00e676' : '#ff2a2a' }}>
                        {change >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                        {Math.abs(change).toFixed(2)}%
                      </div>
                    </div>
                    <button onClick={() => removeCoin(item.coin_id)} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '0.5rem' }}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PortfolioDashboard;
