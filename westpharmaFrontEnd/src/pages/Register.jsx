import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/api';
import { UserPlus, Mail, Lock, User, ShieldCheck, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import Swal from 'sweetalert2';

const Register = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    role: 'User'
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/auth/register', formData);
      Swal.fire({
        icon: 'success',
        title: 'Account Created!',
        text: 'Your registration was successful. You can now sign in.',
        background: 'var(--bg-card)',
        color: 'var(--text-main)',
        confirmButtonColor: 'var(--primary)'
      });
      navigate('/login');
    } catch (err) {
      let errorMsg = 'Registration failed. Please check your details.';
      if (err.response?.data) {
        if (Array.isArray(err.response.data)) {
          errorMsg = err.response.data.map(e => e.description || e).join('\n');
        } else if (typeof err.response.data === 'string') {
          errorMsg = err.response.data;
        } else if (err.response.data.errors) {
            errorMsg = Object.values(err.response.data.errors).flat().join('\n');
        }
      }

      Swal.fire({
        icon: 'error',
        title: 'Registration Error',
        text: errorMsg,
        background: 'var(--bg-card)',
        color: 'var(--text-main)',
        confirmButtonColor: 'var(--primary)'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '100vh', 
      width: '100vw',
      overflowX: 'hidden',
      position: 'relative',
      padding: '40px 20px'
    }}>
      {/* Decorative blobs */}
      <div style={{ 
        position: 'absolute', top: '5%', right: '10%', width: '300px', height: '300px', 
        background: 'var(--primary)', filter: 'blur(120px)', opacity: 0.1, borderRadius: '50%', zIndex: 0 
      }} />
      <div style={{ 
        position: 'absolute', bottom: '5%', left: '10%', width: '350px', height: '350px', 
        background: 'var(--secondary)', filter: 'blur(120px)', opacity: 0.1, borderRadius: '50%', zIndex: 0 
      }} />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="glass-card" 
        style={{ 
          width: '100%',
          maxWidth: '480px', 
          padding: '50px', 
          position: 'relative',
          zIndex: 1,
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.2)'
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <motion.div 
            whileHover={{ scale: 1.05 }}
            style={{ 
              width: '70px', height: '70px', background: 'linear-gradient(135deg, var(--primary), var(--secondary))', 
              borderRadius: '20px', display: 'flex', alignItems: 'center', 
              justifyContent: 'center', margin: '0 auto 20px',
              boxShadow: '0 10px 20px var(--primary-glow)'
            }}
          >
            <UserPlus color="white" size={32} />
          </motion.div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: '800', letterSpacing: '-0.5px' }}>Join Westpharma</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginTop: '8px', fontWeight: '500' }}>
            Create your procurement portal account
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Full Name</label>
            <div style={{ position: 'relative' }}>
              <User style={{ position: 'absolute', left: '14px', top: '14px', color: 'var(--text-muted)' }} size={18} />
              <input 
                type="text" 
                placeholder="e.g. Alice Smith" 
                style={{ paddingLeft: '45px', background: 'rgba(255,255,255,0.6)' }}
                value={formData.fullName}
                onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                required
              />
            </div>
          </div>

          <div className="input-group">
            <label>Work Email</label>
            <div style={{ position: 'relative' }}>
              <Mail style={{ position: 'absolute', left: '14px', top: '14px', color: 'var(--text-muted)' }} size={18} />
              <input 
                type="email" 
                placeholder="alice@westpharma.com" 
                style={{ paddingLeft: '45px', background: 'rgba(255,255,255,0.6)' }}
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                required
              />
            </div>
          </div>

          <div className="input-group">
            <label>Security Password</label>
            <div style={{ position: 'relative' }}>
              <Lock style={{ position: 'absolute', left: '14px', top: '14px', color: 'var(--text-muted)' }} size={18} />
              <input 
                type="password" 
                placeholder="Choose a strong password" 
                style={{ paddingLeft: '45px', background: 'rgba(255,255,255,0.6)' }}
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                required
              />
            </div>
          </div>

          <div className="input-group">
            <label>Organization Role</label>
            <div style={{ position: 'relative' }}>
              <ShieldCheck style={{ position: 'absolute', left: '14px', top: '14px', color: 'var(--text-muted)' }} size={18} />
              <select 
                style={{ 
                  paddingLeft: '45px', 
                  background: 'rgba(255,255,255,0.6)',
                  appearance: 'none'
                }}
                value={formData.role}
                onChange={(e) => setFormData({...formData, role: e.target.value})}
              >
                <option value="User">Standard User</option>
                <option value="Manager">Department Manager</option>
                <option value="Admin">System Administrator</option>
              </select>
            </div>
          </div>

          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit" 
            className="btn btn-primary" 
            style={{ width: '100%', justifyContent: 'center', height: '55px', fontSize: '1rem', fontWeight: '700', marginTop: '10px' }}
            disabled={loading}
          >
            {loading ? 'Creating Account...' : <><UserPlus size={18} /> Register Now</>}
          </motion.button>

          <p style={{ textAlign: 'center', marginTop: '30px', fontSize: '0.95rem', color: 'var(--text-muted)', fontWeight: '500' }}>
            Already have an account? <Link to="/login" style={{ color: 'var(--primary)', fontWeight: '700', textDecoration: 'none' }}>Sign In <ArrowRight size={14} /></Link>
          </p>
        </form>
      </motion.div>
    </div>
  );
};

export default Register;
