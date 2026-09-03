import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Phone, ArrowRight, User, MapPin, ChevronLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './Login.css';

const STEPS = { PHONE: 'phone', OTP: 'otp', REGISTER: 'register' };

export default function Login() {
  const [step, setStep] = useState(STEPS.PHONE);
  const [mobile, setMobile] = useState('');
  const [otp, setOtp] = useState(['', '', '', '']);
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, isRegistered, registerUser } = useAuth();
  const navigate = useNavigate();

  const handleMobileSubmit = (e) => {
    e.preventDefault();
    setError('');
    if (mobile.length !== 10 || !/^\d+$/.test(mobile)) {
      setError('Please enter a valid 10-digit mobile number.');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep(STEPS.OTP);
    }, 1000);
  };

  const handleOtpChange = (val, idx) => {
    if (!/^\d?$/.test(val)) return;
    const next = [...otp];
    next[idx] = val;
    setOtp(next);
    if (val && idx < 3) document.getElementById(`otp-${idx + 1}`)?.focus();
  };

  const handleOtpSubmit = (e) => {
    e.preventDefault();
    setError('');
    const enteredOtp = otp.join('');
    if (enteredOtp.length !== 4) { setError('Enter the 4-digit OTP.'); return; }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      const existing = isRegistered(mobile);
      if (existing) {
        login(existing);
        navigate('/dashboard');
      } else {
        setStep(STEPS.REGISTER);
      }
    }, 1200);
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    setError('');
    if (!name.trim()) { setError('Please enter your name.'); return; }
    if (!address.trim()) { setError('Please enter your area/address.'); return; }
    setLoading(true);
    setTimeout(() => {
      const newUser = registerUser({ mobile, name: name.trim(), address: address.trim() });
      login(newUser);
      navigate('/dashboard');
    }, 800);
  };

  return (
    <div className="login-page">
      <div className="login-bg">
        <div className="login-orb orb-a" />
        <div className="login-orb orb-b" />
      </div>

      <div className="login-card">
        {/* Logo */}
        <div className="login-logo">
          <span>🍽️</span>
          <span>Street<span style={{ color: 'var(--accent-orange)' }}>Bite</span></span>
        </div>

        {step === STEPS.PHONE && (
          <form className="login-form" onSubmit={handleMobileSubmit}>
            <div className="login-header">
              <h1 className="login-title">Welcome back!</h1>
              <p className="login-subtitle">Enter your mobile number to continue</p>
            </div>
            <div className="form-group">
              <label htmlFor="mobile-input" className="form-label">Mobile Number</label>
              <div className="phone-input-wrap">
                <span className="phone-prefix">+91</span>
                <input
                  id="mobile-input"
                  type="tel"
                  maxLength={10}
                  value={mobile}
                  onChange={e => setMobile(e.target.value.replace(/\D/g, ''))}
                  placeholder="98765 43210"
                  className="form-input"
                  required
                  autoFocus
                />
              </div>
            </div>
            {error && <div className="form-error">{error}</div>}
            <button type="submit" className="btn-primary login-btn" id="mobile-submit-btn" disabled={loading}>
              {loading ? <span className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }} /> : <>Continue <ArrowRight size={16} /></>}
            </button>
            <p className="login-hint">We'll send a 4-digit OTP to verify your number.</p>
          </form>
        )}

        {step === STEPS.OTP && (
          <form className="login-form" onSubmit={handleOtpSubmit}>
            <button type="button" className="back-step-btn" onClick={() => setStep(STEPS.PHONE)}>
              <ChevronLeft size={16} /> Back
            </button>
            <div className="login-header">
              <h1 className="login-title">Enter OTP</h1>
              <p className="login-subtitle">Sent to +91 {mobile}. (Use any 4 digits)</p>
            </div>
            <div className="otp-boxes">
              {otp.map((digit, i) => (
                <input
                  key={i}
                  id={`otp-${i}`}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={e => handleOtpChange(e.target.value, i)}
                  onKeyDown={e => {
                    if (e.key === 'Backspace' && !digit && i > 0)
                      document.getElementById(`otp-${i - 1}`)?.focus();
                  }}
                  className="otp-input"
                />
              ))}
            </div>
            {error && <div className="form-error">{error}</div>}
            <button type="submit" className="btn-primary login-btn" id="otp-submit-btn" disabled={loading}>
              {loading ? <span className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }} /> : <>Verify OTP <ArrowRight size={16} /></>}
            </button>
          </form>
        )}

        {step === STEPS.REGISTER && (
          <form className="login-form" onSubmit={handleRegisterSubmit}>
            <div className="login-header">
              <div className="new-user-badge">🎉 New User</div>
              <h1 className="login-title">Create Profile</h1>
              <p className="login-subtitle">Just a few details to get you started!</p>
            </div>
            <div className="form-group">
              <label htmlFor="name-input" className="form-label">Your Name</label>
              <div className="input-icon-wrap">
                <User size={16} className="input-icon" />
                <input
                  id="name-input"
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Rahul Sharma"
                  className="form-input with-icon"
                  required
                  autoFocus
                />
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="address-input" className="form-label">Your Area</label>
              <div className="input-icon-wrap">
                <MapPin size={16} className="input-icon" />
                <input
                  id="address-input"
                  type="text"
                  value={address}
                  onChange={e => setAddress(e.target.value)}
                  placeholder="Kothrud, Pune"
                  className="form-input with-icon"
                  required
                />
              </div>
            </div>
            {error && <div className="form-error">{error}</div>}
            <button type="submit" className="btn-primary login-btn" id="register-submit-btn" disabled={loading}>
              {loading ? <span className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }} /> : <>Create Account <ArrowRight size={16} /></>}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
