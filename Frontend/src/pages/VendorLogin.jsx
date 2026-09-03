import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Phone, ArrowRight, User, MapPin, ChevronLeft, Store } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './Login.css';

const STEPS = { PHONE: 'phone', OTP: 'otp', REGISTER: 'register' };

export default function VendorLogin() {
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
        login({ ...existing, role: 'vendor' });
        navigate('/vendor-dashboard');
      } else {
        setStep(STEPS.REGISTER);
      }
    }, 1200);
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    setError('');
    if (!name.trim()) { setError('Please enter your name.'); return; }
    if (!address.trim()) { setError('Please enter your area.'); return; }
    setLoading(true);
    setTimeout(() => {
      const newUser = registerUser({ mobile, name: name.trim(), address: address.trim(), role: 'vendor' });
      login(newUser);
      navigate('/vendor-dashboard');
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
          <span>🏪</span>
          <span>Vendor<span style={{ color: 'var(--accent-orange)' }}>Panel</span></span>
        </div>

        {step === STEPS.PHONE && (
          <form className="login-form" onSubmit={handleMobileSubmit}>
            <div className="login-header">
              <h1 className="login-title">Vendor Login</h1>
              <p className="login-subtitle">Enter your mobile to manage orders</p>
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
            <button type="submit" className="btn-primary login-btn" disabled={loading}>
              {loading ? <span className="spinner" /> : <>Continue <ArrowRight size={16} /></>}
            </button>
            <p className="login-hint">OTP will be sent for verification.</p>
          </form>
        )}

        {step === STEPS.OTP && (
          <form className="login-form" onSubmit={handleOtpSubmit}>
            <button type="button" className="back-step-btn" onClick={() => setStep(STEPS.PHONE)}>
              <ChevronLeft size={16} /> Back
            </button>
            <div className="login-header">
              <h1 className="login-title">Enter OTP</h1>
              <p className="login-subtitle">Sent to +91 {mobile}</p>
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
                  className="otp-input"
                />
              ))}
            </div>
            {error && <div className="form-error">{error}</div>}
            <button type="submit" className="btn-primary login-btn" disabled={loading}>
              {loading ? <span className="spinner" /> : <>Verify OTP <ArrowRight size={16} /></>}
            </button>
          </form>
        )}

        {step === STEPS.REGISTER && (
          <form className="login-form" onSubmit={handleRegisterSubmit}>
            <div className="login-header">
              <div className="new-user-badge">🏪 New Vendor</div>
              <h1 className="login-title">Vendor Profile</h1>
              <p className="login-subtitle">Setup your vendor account</p>
            </div>
            <div className="form-group">
              <label htmlFor="name-input" className="form-label">Vendor/Stall Name</label>
              <div className="input-icon-wrap">
                <Store size={16} className="input-icon" />
                <input
                  id="name-input"
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Raju Vada Pav"
                  className="form-input with-icon"
                  required
                  autoFocus
                />
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="address-input" className="form-label">Location/Area</label>
              <div className="input-icon-wrap">
                <MapPin size={16} className="input-icon" />
                <input
                  id="address-input"
                  type="text"
                  value={address}
                  onChange={e => setAddress(e.target.value)}
                  placeholder="Paud Road, Kothrud"
                  className="form-input with-icon"
                  required
                />
              </div>
            </div>
            {error && <div className="form-error">{error}</div>}
            <button type="submit" className="btn-primary login-btn" disabled={loading}>
              {loading ? <span className="spinner" /> : <>Create Vendor Account <ArrowRight size={16} /></>}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

