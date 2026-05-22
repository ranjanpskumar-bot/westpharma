import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/api';
import { LogIn, Lock, Mail, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await api.post('/auth/login', { email, password });
      login(response.data.user, response.data.token);
      navigate('/dashboard');
    } catch (err) {
      setError('Invalid email or password. Please try again.');
    }
  };

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
      width: '100vw',
      overflow: 'hidden',
      position: 'relative'
    }}>
      {/* Decorative blobs */}
      <div style={{ 
        position: 'absolute', top: '10%', left: '10%', width: '300px', height: '300px', 
        background: 'var(--primary)', filter: 'blur(120px)', opacity: 0.15, borderRadius: '50%', zIndex: 0 
      }} />
      <div style={{ 
        position: 'absolute', bottom: '10%', right: '10%', width: '350px', height: '350px', 
        background: 'var(--secondary)', filter: 'blur(120px)', opacity: 0.15, borderRadius: '50%', zIndex: 0 
      }} />

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="glass-card" 
        style={{ 
          width: '100%',
          maxWidth: '440px', 
          padding: '50px', 
          position: 'relative',
          zIndex: 1,
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <motion.div 
            whileHover={{ rotate: 10, scale: 1.05 }}
            style={{ 
              width: '70px', height: '70px', background: 'linear-gradient(135deg, var(--primary), var(--secondary))', 
              borderRadius: '20px', display: 'flex', alignItems: 'center', 
              justifyContent: 'center', margin: '0 auto 20px',
              boxShadow: '0 10px 20px var(--primary-glow)'
            }}
          >
            <LogIn color="white" size={32} />
          </motion.div>
          <h2 style={{ fontSize: '2rem', fontWeight: '800', letterSpacing: '-0.5px' }}>Welcome Back</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginTop: '8px', fontWeight: '500' }}>
            Access the Westpharma Order Portal
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Email Address</label>
            <div style={{ position: 'relative' }}>
              <Mail style={{ position: 'absolute', left: '14px', top: '14px', color: 'var(--text-muted)' }} size={18} />
              <input 
                type="email" 
                placeholder="Enter your email" 
                style={{ paddingLeft: '45px', background: 'rgba(255,255,255,0.6)' }}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="input-group">
            <label>Password</label>
            <div style={{ position: 'relative' }}>
              <Lock style={{ position: 'absolute', left: '14px', top: '14px', color: 'var(--text-muted)' }} size={18} />
              <input 
                type="password" 
                placeholder="Enter your password" 
                style={{ paddingLeft: '45px', background: 'rgba(255,255,255,0.6)' }}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          {error && (
            <motion.div 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              style={{ 
                color: 'var(--accent)', 
                fontSize: '0.85rem', 
                marginBottom: '20px', 
                background: 'rgba(239, 68, 68, 0.1)', 
                padding: '10px 15px', 
                borderRadius: '8px',
                border: '1px solid rgba(239, 68, 68, 0.2)',
                fontWeight: '500'
              }}
            >
              {error}
            </motion.div>
          )}

          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit" 
            className="btn btn-primary" 
            style={{ width: '100%', justifyContent: 'center', height: '55px', fontSize: '1rem', fontWeight: '700' }}
          >
            Sign In <ArrowRight size={18} />
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
};

export default Login;
