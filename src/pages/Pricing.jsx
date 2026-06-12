import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../supabaseClient';
import { Check, Star, Tag, CheckCircle, XCircle } from 'lucide-react';
import './Pricing.css';

import './Pricing.css';

const Pricing = () => {
  const { user, plan } = useAuth();
  const navigate = useNavigate();
  const [promoCode, setPromoCode] = useState('');
  const [promoStatus, setPromoStatus] = useState(null); // null | 'success' | 'error'
  const [promoMessage, setPromoMessage] = useState('');

  const handleSubscribe = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:4242';
      const response = await fetch(`${apiUrl}/create-checkout-session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          email: user.email
        }),
      });

      const { url, error } = await response.json();
      
      if (error) {
        console.error('Stripe Error:', error);
        return;
      }
      
      // Redirect to Stripe Checkout
      if (url) {
        window.location.href = url;
      }
    } catch (err) {
      console.error('Failed to create checkout session:', err);
    }
  };

  const handlePromoApply = async () => {
    const code = promoCode.trim().toUpperCase();
    if (!user) {
      navigate('/login');
      return;
    }
    
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:4242';
      
      const res = await fetch(`${apiUrl}/api/redeem-promo`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.access_token}`
        },
        body: JSON.stringify({ code })
      });
      
      const data = await res.json();
      
      if (res.ok) {
        setPromoStatus('success');
        setPromoMessage(data.message);
        setTimeout(() => window.location.reload(), 1500);
      } else {
        setPromoStatus('error');
        setPromoMessage(data.error || 'Invalid promo code.');
      }
    } catch (err) {
      setPromoStatus('error');
      setPromoMessage('An error occurred. Please try again.');
    }
  };

  return (
    <div className="pricing-container container">
      <div className="pricing-header text-center animate-fade-in">
        <h1 className="pricing-title">Unlock <span className="text-gradient">Premium</span> Gaming</h1>
        <p className="pricing-subtitle">Choose the plan that fits your play style.</p>
      </div>

      {/* Promo Code Section */}
      <div className="promo-section glass-panel animate-fade-in" style={{ animationDelay: '0.1s' }}>
        <div className="promo-header">
          <Tag size={20} style={{ color: 'var(--primary-color)' }} />
          <span>Have a promo code?</span>
        </div>
        <div className="promo-input-row">
          <input
            type="text"
            className="glass-input promo-input"
            placeholder="Enter promo code..."
            value={promoCode}
            onChange={(e) => { setPromoCode(e.target.value); setPromoStatus(null); }}
            onKeyDown={(e) => e.key === 'Enter' && handlePromoApply()}
            disabled={plan === 'PRO'}
          />
          <button
            className="btn btn-primary"
            onClick={handlePromoApply}
            disabled={!promoCode.trim() || plan === 'PRO'}
          >
            Apply
          </button>
        </div>
        {promoStatus === 'success' && (
          <div className="promo-feedback promo-success">
            <CheckCircle size={16} />
            {promoMessage}
          </div>
        )}
        {promoStatus === 'error' && (
          <div className="promo-feedback promo-error">
            <XCircle size={16} />
            {promoMessage}
          </div>
        )}
        {plan === 'PRO' && promoStatus !== 'success' && (
          <div className="promo-feedback promo-success">
            <CheckCircle size={16} />
            You already have an active Pro subscription!
          </div>
        )}
      </div>

      <div className="pricing-grid animate-fade-in" style={{ animationDelay: '0.2s' }}>
        {/* Free Tier */}
        <div className="pricing-card glass-panel">
          <div className="pricing-card-header">
            <h3>Explorer</h3>
            <div className="price">
              <span className="amount">$0</span>
              <span className="period">/forever</span>
            </div>
            <p>Browse the catalog and view details.</p>
          </div>
          <ul className="pricing-features">
            <li><Check size={16} className="text-primary" /> View all 288+ games</li>
            <li><Check size={16} className="text-primary" /> Read reviews & details</li>
            <li className="disabled-feature">Play HTML5 Games</li>
            <li className="disabled-feature">Download Desktop Games</li>
          </ul>
          <button className="btn btn-outline full-width" disabled={plan === 'FREE'}>
            {plan === 'FREE' ? 'Current Plan' : 'Free'}
          </button>
        </div>

        {/* Pro Tier */}
        <div className="pricing-card glass-panel pro-card">
          <div className="pro-badge">
            <Star size={14} fill="currentColor" />
            Most Popular
          </div>
          <div className="pricing-card-header">
            <h3 className="text-gradient">Pro Gamer</h3>
            <div className="price">
              <span className="amount">$9.99</span>
              <span className="period">/month</span>
            </div>
            <p>Full unlimited access to Hell Yeah Games.</p>
          </div>
          <ul className="pricing-features">
            <li><Check size={16} className="text-primary" /> View all 288+ games</li>
            <li><Check size={16} className="text-primary" /> Read reviews & details</li>
            <li><Check size={16} className="text-primary" /> Play all HTML5 Games</li>
            <li><Check size={16} className="text-primary" /> Download Desktop Games</li>
            <li><Check size={16} className="text-primary" /> Ad-free experience</li>
          </ul>
          <button 
            className="btn btn-primary full-width" 
            onClick={handleSubscribe}
            disabled={plan === 'PRO'}
          >
            {plan === 'PRO' ? 'Active Subscription ✓' : 'Subscribe Now'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
