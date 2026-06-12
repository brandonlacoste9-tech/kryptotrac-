import { Play, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './HeroSection.css';

const HeroSection = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <section className="hero">
      <div className="hero-background"></div>
      <div className="hero-particles"></div>
      
      <div className="container hero-container">
        <div className="hero-content animate-fade-in">

          <p className="hero-subtitle">
            TRACK 10,000+ OF YOUR FAVOURITE COINS. ALL IN ONE PLACE. ANYTIME. EVERYWHERE. FREE ACCOUNT. INSTANT INSIGHTS.
          </p>
          
          <div className="hero-actions">
            <button className="btn btn-primary btn-lg" onClick={() => navigate('/dashboard')} style={{ background: 'linear-gradient(135deg, #ff2a2a, #8d99ae)', border: 'none' }}>
              <Play size={20} fill="currentColor" />
              JOIN THE CRYPTO ECONOMY.
            </button>
            <button className="btn btn-outline btn-lg" onClick={() => window.scrollTo({ top: 800, behavior: 'smooth' })}>
              Browse Catalog
              <ArrowRight size={20} />
            </button>
          </div>
          
          <div className="hero-stats glass-panel">
            <div className="stat-item">
              <span className="stat-value" style={{ color: '#ff2a2a' }}>860+</span>
              <span className="stat-label">Games</span>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <span className="stat-value" style={{ color: '#ff4d4d' }}>500+</span>
              <span className="stat-label">Browser Games</span>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <span className="stat-value" style={{ color: '#8d99ae' }}>$9.99</span>
              <span className="stat-label">/ Month Unlimited</span>
            </div>
          </div>
        </div>
        
        <div className="hero-visual animate-fade-in" style={{ animationDelay: '0.2s' }}>
          {/* Decorative elements */}
          <div className="glow-orb orb-1"></div>
          <div className="glow-orb orb-2"></div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
