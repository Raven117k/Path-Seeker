import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { apiFetch } from '../services/api';
import { X, Lock, Mail, User, Phone, GraduationCap, Briefcase, KeyRound, Sparkles, CheckCircle2, Shield, BookOpen } from 'lucide-react';

export default function AuthModal() {
  const { authModalOpen, authMode, closeAuthModal, login } = useAuth();
  const [tab, setTab] = useState(authMode); // 'login' | 'register' | 'forgot'

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [role, setRole] = useState('student'); // 'student' | 'graduate' | 'professional'
  const [educationLevel, setEducationLevel] = useState('Undergraduate');
  const [fieldOfStudy, setFieldOfStudy] = useState('');
  const [skills, setSkills] = useState('');

  // OTP state
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [simulatedOtp, setSimulatedOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');

  // Status state
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!authModalOpen) return null;

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const data = await apiFetch('/sign-in', {
        method: 'POST',
        body: JSON.stringify({ email, password })
      });

      if (data.user) {
        login(data.user, data.token);
        closeAuthModal();
      } else {
        setErrorMsg('Login failed. Unexpected server response.');
      }
    } catch (err) {
      setErrorMsg(err.message || 'Login failed. Check credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      const data = await apiFetch('/sign-up', {
        method: 'POST',
        body: JSON.stringify({
          name,
          email,
          password,
          contact,
          role,
          educationLevel,
          fieldOfStudy,
          skills: skills ? skills.split(',').map((s) => s.trim()) : []
        })
      });

      if (data.user) {
        login(data.user, data.token);
        closeAuthModal();
      } else {
        setErrorMsg('Registration failed. Unexpected server response.');
      }
    } catch (err) {
      setErrorMsg(err.message || 'Registration failed. Email may already exist.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const res = await apiFetch('/forgot-password', {
        method: 'POST',
        body: JSON.stringify({ email })
      });

      setOtpSent(true);
      setSimulatedOtp(res.simulatedOtp || '');
      setSuccessMsg(res.simulatedOtp ? `OTP sent to ${email}. Code: ${res.simulatedOtp}` : `OTP sent to ${email}. Check your email to continue.`);
    } catch (err) {
      setErrorMsg('Failed to send OTP.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      await apiFetch('/reset-password', {
        method: 'POST',
        body: JSON.stringify({ email, otp: otpCode, newPassword })
      });

      setSuccessMsg('Password reset successfully! Please sign in.');
      setTab('login');
    } catch (err) {
      setErrorMsg('Invalid OTP code.');
    } finally {
      setLoading(false);
    }
  };

  // Pre-fill Demo Accounts Helper
  const fillDemoAccount = (demoRole) => {
    if (demoRole === 'student') {
      setEmail('alex@student.com');
      setPassword('password123');
    } else if (demoRole === 'graduate') {
      setEmail('sarah@graduate.com');
      setPassword('password123');
    } else if (demoRole === 'professional') {
      setEmail('david@pro.com');
      setPassword('password123');
    } else if (demoRole === 'admin') {
      setEmail('admin@pathseeker.com');
      setPassword('password123');
    }
  };

  return (
    <div className="modal-overlay" onClick={closeAuthModal}>
      <div
        className="glass-panel auth-modal"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '520px', width: '100%', padding: '2rem', borderRadius: 'var(--radius-lg)' }}
      >
        {/* Header */}
        <div className="auth-modal-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <div className="auth-modal-heading">
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>
              {tab === 'login' && 'Welcome Back to PathSeeker'}
              {tab === 'register' && 'Create Your Career Passport'}
              {tab === 'forgot' && 'Reset Account Password'}
            </h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              {tab === 'login' && 'Sign in to access your role dashboard & quiz results'}
              {tab === 'register' && 'Tailor your passport as a Student, Graduate, or Professional'}
              {tab === 'forgot' && 'Verify your account email with a One-Time Password'}
            </p>
          </div>
          <button onClick={closeAuthModal} className="btn-secondary auth-modal-close" aria-label="Close authentication dialog" style={{ padding: '0.4rem', borderRadius: '50%' }}>
            <X size={18} />
          </button>
        </div>

        {/* Tab Selector */}
        <div className="auth-modal-tabs" role="tablist" aria-label="Account access options" style={{ display: 'flex', background: 'var(--bg-primary)', padding: '0.25rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem' }}>
          <button
            onClick={() => setTab('login')}
            className={`auth-modal-tab${tab === 'login' ? ' active' : ''}`}
            style={{
              flex: 1,
              padding: '0.5rem',
              borderRadius: 'var(--radius-sm)',
              border: 'none',
              fontWeight: 600,
              fontSize: '0.85rem',
              cursor: 'pointer',
              background: tab === 'login' ? 'var(--bg-surface)' : 'transparent',
              color: tab === 'login' ? 'var(--accent-primary)' : 'var(--text-secondary)',
              boxShadow: tab === 'login' ? 'var(--shadow-sm)' : 'none'
            }}
          >
            Sign In
          </button>
          <button
            onClick={() => setTab('register')}
            className={`auth-modal-tab${tab === 'register' ? ' active' : ''}`}
            style={{
              flex: 1,
              padding: '0.5rem',
              borderRadius: 'var(--radius-sm)',
              border: 'none',
              fontWeight: 600,
              fontSize: '0.85rem',
              cursor: 'pointer',
              background: tab === 'register' ? 'var(--bg-surface)' : 'transparent',
              color: tab === 'register' ? 'var(--accent-primary)' : 'var(--text-secondary)',
              boxShadow: tab === 'register' ? 'var(--shadow-sm)' : 'none'
            }}
          >
            Register Passport
          </button>
        </div>

        {/* Error / Success Alerts */}
        {errorMsg && (
          <div className="auth-alert auth-alert--error" role="alert" style={{ background: 'rgba(244, 63, 94, 0.12)', border: '1px solid rgba(244, 63, 94, 0.3)', color: 'var(--accent-rose)', padding: '0.75rem', borderRadius: 'var(--radius-md)', fontSize: '0.85rem', marginBottom: '1rem' }}>
            {errorMsg}
          </div>
        )}
        {successMsg && (
          <div className="auth-alert auth-alert--success" role="status" style={{ background: 'rgba(16, 185, 129, 0.12)', border: '1px solid rgba(16, 185, 129, 0.3)', color: 'var(--accent-emerald)', padding: '0.75rem', borderRadius: 'var(--radius-md)', fontSize: '0.85rem', marginBottom: '1rem' }}>
            {successMsg}
          </div>
        )}

        {/* Quick Demo Login Preset Buttons */}
        {tab === 'login' && (
          <div className="auth-demo-panel" style={{ marginBottom: '1.25rem', background: 'rgba(99, 102, 241, 0.08)', padding: '0.85rem', borderRadius: 'var(--radius-md)', border: '1px border-glow' }}>
            <div className="auth-demo-heading" style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--accent-primary)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <Sparkles size={13} /> Quick Fill Demo Credentials:
            </div>
            <div className="auth-demo-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.4rem' }}>
              <button type="button" onClick={() => fillDemoAccount('student')} className="btn-secondary" style={{ padding: '0.35rem 0.6rem', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem', justifyContent: 'center' }}>
                <GraduationCap size={14} /> Student
              </button>
              <button type="button" onClick={() => fillDemoAccount('graduate')} className="btn-secondary" style={{ padding: '0.35rem 0.6rem', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem', justifyContent: 'center' }}>
                <BookOpen size={14} /> Graduate
              </button>
              <button type="button" onClick={() => fillDemoAccount('professional')} className="btn-secondary" style={{ padding: '0.35rem 0.6rem', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem', justifyContent: 'center' }}>
                <Briefcase size={14} /> Professional
              </button>
              <button type="button" onClick={() => fillDemoAccount('admin')} className="btn-secondary" style={{ padding: '0.35rem 0.6rem', fontSize: '0.75rem', color: 'var(--accent-amber)', display: 'flex', alignItems: 'center', gap: '0.4rem', justifyContent: 'center' }}>
                <Shield size={14} /> Admin
              </button>
            </div>
          </div>
        )}

        {/* LOGIN FORM */}
        {tab === 'login' && (
          <form onSubmit={handleLoginSubmit} className="auth-form auth-form--login" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)' }}>Email Address</label>
              <div style={{ position: 'relative', marginTop: '0.3rem' }}>
                <Mail size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@domain.com"
                  style={{ width: '100%', padding: '0.75rem 0.75rem 0.75rem 2.4rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', background: 'var(--bg-surface)', color: 'var(--text-primary)', fontSize: '0.9rem' }}
                />
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)' }}>Password</label>
                <button type="button" onClick={() => setTab('forgot')} style={{ background: 'none', border: 'none', color: 'var(--accent-primary)', fontSize: '0.8rem', cursor: 'pointer' }}>
                  Forgot Password?
                </button>
              </div>
              <div style={{ position: 'relative', marginTop: '0.3rem' }}>
                <Lock size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  style={{ width: '100%', padding: '0.75rem 0.75rem 0.75rem 2.4rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', background: 'var(--bg-surface)', color: 'var(--text-primary)', fontSize: '0.9rem' }}
                />
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-primary" style={{ justifyContent: 'center', marginTop: '0.5rem', padding: '0.85rem' }}>
              {loading ? 'Authenticating...' : 'Sign In to Passport'}
            </button>
          </form>
        )}

        {/* REGISTER FORM */}
        {tab === 'register' && (
          <form onSubmit={handleRegisterSubmit} className="auth-form auth-form--register" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxHeight: '60vh', overflowY: 'auto', paddingRight: '0.25rem' }}>
            {/* Role Selection Segment */}
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '0.4rem', display: 'block' }}>Select User Role Stage</label>
              <div className="auth-role-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => setRole('student')}
                  className={`auth-role-option${role === 'student' ? ' active' : ''}`}
                  style={{
                    padding: '0.6rem',
                    borderRadius: 'var(--radius-md)',
                    border: role === 'student' ? '2px solid var(--accent-primary)' : '1px solid var(--border-color)',
                    background: role === 'student' ? 'rgba(99, 102, 241, 0.12)' : 'var(--bg-surface)',
                    color: 'var(--text-primary)',
                    cursor: 'pointer',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    textAlign: 'center',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    justifyContent: 'center'
                  }}
                >
                  <GraduationCap size={14} /> Student
                </button>
                <button
                  type="button"
                  onClick={() => setRole('graduate')}
                  className={`auth-role-option${role === 'graduate' ? ' active' : ''}`}
                  style={{
                    padding: '0.6rem',
                    borderRadius: 'var(--radius-md)',
                    border: role === 'graduate' ? '2px solid var(--accent-primary)' : '1px solid var(--border-color)',
                    background: role === 'graduate' ? 'rgba(99, 102, 241, 0.12)' : 'var(--bg-surface)',
                    color: 'var(--text-primary)',
                    cursor: 'pointer',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    textAlign: 'center',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    justifyContent: 'center'
                  }}
                >
                  <BookOpen size={14} /> Graduate
                </button>
                <button
                  type="button"
                  onClick={() => setRole('professional')}
                  className={`auth-role-option${role === 'professional' ? ' active' : ''}`}
                  style={{
                    padding: '0.6rem',
                    borderRadius: 'var(--radius-md)',
                    border: role === 'professional' ? '2px solid var(--accent-primary)' : '1px solid var(--border-color)',
                    background: role === 'professional' ? 'rgba(99, 102, 241, 0.12)' : 'var(--bg-surface)',
                    color: 'var(--text-primary)',
                    cursor: 'pointer',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    textAlign: 'center',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    justifyContent: 'center'
                  }}
                >
                  <Briefcase size={14} /> Professional
                </button>
              </div>
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)' }}>Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Alex Johnson"
                style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', background: 'var(--bg-surface)', color: 'var(--text-primary)', fontSize: '0.9rem', marginTop: '0.2rem' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)' }}>Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="alex@example.com"
                style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', background: 'var(--bg-surface)', color: 'var(--text-primary)', fontSize: '0.9rem', marginTop: '0.2rem' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)' }}>Contact Phone</label>
              <input
                type="text"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                placeholder="+1 555 0192"
                style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', background: 'var(--bg-surface)', color: 'var(--text-primary)', fontSize: '0.9rem', marginTop: '0.2rem' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)' }}>Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', background: 'var(--bg-surface)', color: 'var(--text-primary)', fontSize: '0.9rem', marginTop: '0.2rem' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)' }}>Field of Study / Domain</label>
              <input
                type="text"
                value={fieldOfStudy}
                onChange={(e) => setFieldOfStudy(e.target.value)}
                placeholder="Computer Science, Health, Business..."
                style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', background: 'var(--bg-surface)', color: 'var(--text-primary)', fontSize: '0.9rem', marginTop: '0.2rem' }}
              />
            </div>

            <button type="submit" disabled={loading} className="btn-primary" style={{ justifyContent: 'center', marginTop: '0.5rem', padding: '0.85rem' }}>
              {loading ? 'Registering...' : `Create ${role.toUpperCase()} Passport`}
            </button>
          </form>
        )}

        {/* FORGOT PASSWORD OTP FORM */}
        {tab === 'forgot' && (
          <div>
            {!otpSent ? (
              <form onSubmit={handleForgotSubmit} className="auth-form" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)' }}>Enter Account Email</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="registered@email.com"
                    style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', background: 'var(--bg-surface)', color: 'var(--text-primary)', fontSize: '0.9rem', marginTop: '0.2rem' }}
                  />
                </div>
                <button type="submit" disabled={loading} className="btn-primary" style={{ justifyContent: 'center', padding: '0.85rem' }}>
                  {loading ? 'Sending OTP...' : 'Send Verification OTP'}
                </button>
              </form>
            ) : (
              <form onSubmit={handleResetSubmit} className="auth-form" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)' }}>One-Time Password (OTP)</label>
                  <input
                    type="text"
                    required
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                    placeholder={simulatedOtp}
                    style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', background: 'var(--bg-surface)', color: 'var(--text-primary)', fontSize: '1rem', letterSpacing: '2px', textAlign: 'center', fontWeight: 700, marginTop: '0.2rem' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)' }}>New Password</label>
                  <input
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                    style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', background: 'var(--bg-surface)', color: 'var(--text-primary)', fontSize: '0.9rem', marginTop: '0.2rem' }}
                  />
                </div>

                <button type="submit" disabled={loading} className="btn-primary" style={{ justifyContent: 'center', padding: '0.85rem' }}>
                  {loading ? 'Resetting...' : 'Reset Password'}
                </button>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
