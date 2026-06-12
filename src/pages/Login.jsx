import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Gamepad2, Eye, EyeOff } from 'lucide-react';
import './Auth.css';

const Login = () => {
  const location = useLocation();
  const [isSignup, setIsSignup] = useState(location.pathname === '/signup');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  
  const { login, signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    try {
      if (isSignup) {
        await signup(email, password, username);
      } else {
        await login(email, password);
      }
      navigate('/');
    } catch (err) {
      setErrorMsg(err.message);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card glass-panel animate-fade-in">
        <div className="auth-header">
          <Gamepad2 className="logo-icon" size={48} />
          <h2 className="text-gradient">{isSignup ? 'Create Account' : 'Welcome Back'}</h2>
          <p>{isSignup ? 'Join Hell Yeah Games' : 'Sign in to your Hell Yeah Games account'}</p>
        </div>
        
        {errorMsg && <div style={{ color: 'red', background: 'rgba(255,0,0,0.1)', padding: '1rem', borderRadius: '8px' }}>{errorMsg}</div>}
        
        <form onSubmit={handleSubmit} className="auth-form">
          {isSignup && (
            <div className="form-group">
              <label>Username</label>
              <input 
                type="text" 
                className="form-control glass-input"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="GamerTag"
                required 
              />
            </div>
          )}
          <div className="form-group">
            <label>Email</label>
            <input 
              type="email" 
              className="form-control glass-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required 
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <div className="password-input-wrapper">
              <input 
                type={showPassword ? "text" : "password"} 
                className="form-control glass-input full-width"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required 
              />
              <button 
                type="button" 
                className="password-toggle-btn" 
                onClick={() => setShowPassword(!showPassword)}
                tabIndex="-1"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
          
          {!isSignup && (
            <div className="form-group remember-me-group">
              <label className="checkbox-label">
                <input 
                  type="checkbox" 
                  checked={rememberMe} 
                  onChange={(e) => setRememberMe(e.target.checked)} 
                  className="custom-checkbox"
                />
                Remember me
              </label>
            </div>
          )}
          
          <button type="submit" className="btn btn-primary full-width">{isSignup ? 'Sign Up' : 'Log In'}</button>
        </form>
        
        <div className="auth-footer">
          <p>
            {isSignup ? 'Already have an account?' : "Don't have an account?"}{' '}
            <span className="action-link" onClick={() => setIsSignup(!isSignup)}>
              {isSignup ? 'Log in' : 'Sign up'}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
