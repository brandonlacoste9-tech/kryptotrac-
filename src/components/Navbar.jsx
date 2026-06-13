import React, { useState, useEffect } from 'react';
import { Gamepad2, Menu, X, Search, User, Globe, Sun, Moon } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useTranslation } from 'react-i18next';
import './Navbar.css';

const Navbar = () => {
  const { t, i18n } = useTranslation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, plan, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (user) {
      const checkAdmin = async () => {
        const { supabase } = await import('../supabaseClient');
        const { data } = await supabase.from('profiles').select('role').eq('id', user.id).single();
        if (data && data.role === 'admin') setIsAdmin(true);
      };
      checkAdmin();
    } else {
      setIsAdmin(false);
    }
  }, [user]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`navbar ${scrolled ? 'navbar-scrolled glass-panel' : ''}`}>
      <div className="container navbar-container">
        <Link to="/" className="navbar-logo" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <span className="logo-text" style={{
            fontFamily: 'var(--font-heading)',
            fontWeight: 900,
            fontSize: '1.4rem',
            letterSpacing: '-0.5px',
            lineHeight: 1,
            background: 'linear-gradient(135deg, #ff2a2a, #ff4d4d, #8d99ae)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            textTransform: 'uppercase',
            filter: 'drop-shadow(0 0 12px rgba(255, 42, 42, 0.5))',
          }}>
            KRYPTO<br/>
            <span style={{ fontSize: '0.75rem', letterSpacing: '4px', opacity: 0.9 }}>TRAC</span>
          </span>
        </Link>

        <div className="navbar-links desktop-only">
          <Link to="/" className="nav-link active">{t('nav.home')}</Link>
          <Link to="/games" className="nav-link">Arcade</Link>
          <Link to="/categories" className="nav-link">{t('nav.categories')}</Link>
          {user && <Link to="/portfolio" className="nav-link" style={{ color: 'var(--primary-color)', fontWeight: 'bold' }}>My Portfolio</Link>}
          <Link to="/about" className="nav-link">{t('nav.about')}</Link>
        </div>

        <div className="navbar-actions desktop-only">
          <div className="lang-switcher" style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-secondary)' }}>
            <Globe size={16} />
            <select 
              onChange={(e) => i18n.changeLanguage(e.target.value)}
              value={i18n.language || 'en'}
              style={{ background: 'transparent', color: 'inherit', border: 'none', outline: 'none', cursor: 'pointer' }}
            >
              <option value="en">EN</option>
              <option value="es">ES</option>
              <option value="fr">FR</option>
              <option value="pt">PT</option>
              <option value="it">IT</option>
              <option value="hi">HI</option>
              <option value="pa">PA</option>
            </select>
          </div>
          <button className="icon-btn" aria-label="Search">
            <Search size={20} />
          </button>
          <button className="icon-btn" aria-label="Toggle Theme" onClick={toggleTheme}>
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <span className="user-greeting" style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <User size={16} />
                {user.user_metadata?.username || user.email}
                {plan === 'PRO' && <span style={{ background: 'var(--accent-gradient)', color: '#fff', fontSize: '0.7rem', padding: '0.1rem 0.4rem', borderRadius: '10px', fontWeight: 'bold' }}>PRO</span>}
                {isAdmin && <Link to="/admin" style={{ marginLeft: '0.5rem', background: 'var(--primary-color)', color: '#000', fontSize: '0.7rem', padding: '0.1rem 0.4rem', borderRadius: '10px', fontWeight: 'bold', textDecoration: 'none' }}>ADMIN</Link>}
              </span>
              <button className="btn btn-outline" onClick={logout}>{t('nav.logout')}</button>
              {plan === 'FREE' && <button className="btn btn-primary" onClick={() => window.location.href=`${import.meta.env.VITE_ARCADE_URL || 'http://localhost:5173'}/pricing`}>{t('nav.gopro')}</button>}
            </div>
          ) : (
            <>
              <button className="btn btn-outline" onClick={() => navigate('/login')}>{t('nav.login')}</button>
              <button className="btn btn-primary" onClick={() => navigate('/signup')}>{t('nav.signup')}</button>
            </>
          )}
        </div>

        <button 
          className="mobile-menu-btn mobile-only"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="mobile-menu glass-panel animate-fade-in">
          <Link to="/" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>{t('nav.home')}</Link>
          <Link to="/games" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>Arcade</Link>
          <Link to="/categories" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>{t('nav.categories')}</Link>
          {user && <Link to="/portfolio" className="mobile-nav-link" style={{ color: 'var(--primary-color)', fontWeight: 'bold' }} onClick={() => setMobileMenuOpen(false)}>My Portfolio</Link>}
          <div className="mobile-nav-link" style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'inherit' }}>
            <Globe size={18} />
            <select 
              onChange={(e) => i18n.changeLanguage(e.target.value)}
              value={i18n.language || 'en'}
              style={{ background: 'transparent', color: 'inherit', border: '1px solid var(--border-color)', borderRadius: '4px', padding: '4px 8px', outline: 'none', cursor: 'pointer', flex: 1 }}
            >
              <option value="en">English</option>
              <option value="es">Español</option>
              <option value="fr">Français</option>
              <option value="pt">Português</option>
              <option value="it">Italiano</option>
              <option value="hi">हिंदी</option>
              <option value="pa">ਪੰਜਾਬੀ</option>
            </select>
          </div>
          <button className="mobile-nav-link" style={{ background: 'transparent', border: 'none', textAlign: 'left', cursor: 'pointer', color: 'inherit' }} onClick={toggleTheme}>
            {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
          </button>
          <hr className="menu-divider" />
          {user ? (
            <>
              <div style={{ padding: '0.5rem 0', color: 'var(--primary-color)' }}>{t('nav.hello')}, {user.user_metadata?.username || user.email}</div>
              <button className="btn btn-outline full-width" onClick={() => { logout(); setMobileMenuOpen(false); }}>{t('nav.logout')}</button>
              {plan === 'FREE' && <button className="btn btn-primary full-width" onClick={() => { window.location.href=`${import.meta.env.VITE_ARCADE_URL || 'http://localhost:5173'}/pricing`; }}>{t('nav.gopro')}</button>}
            </>
          ) : (
            <>
              <button className="btn btn-outline full-width" onClick={() => { navigate('/login'); setMobileMenuOpen(false); }}>{t('nav.login')}</button>
              <button className="btn btn-primary full-width" onClick={() => { navigate('/signup'); setMobileMenuOpen(false); }}>{t('nav.signup')}</button>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
