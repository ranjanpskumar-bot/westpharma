import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api/api';
import { UserPlus, Mail, Lock, User, ShieldCheck, ArrowLeft, Save, Shield } from 'lucide-react';
import { motion } from 'framer-motion';
import Swal from 'sweetalert2';

const CreateUser = () => {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    role: 'User'
  });
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const navigate = useNavigate();

  React.useEffect(() => {
    if (id) {
      fetchUser();
    }
  }, [id]);

  const fetchUser = async () => {
    setFetching(true);
    try {
      const res = await api.get(`/auth/users/${id}`);
      setFormData({
        fullName: res.data.fullName,
        email: res.data.email,
        password: '', // Don't show password
        role: res.data.roles[0] || 'User'
      });
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to fetch user data',
        background: 'var(--bg-card)',
        color: 'var(--text-main)',
        confirmButtonColor: 'var(--primary)'
      });
      navigate('/users');
    } finally {
      setFetching(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (id) {
        await api.put(`/auth/users/${id}`, formData);
        Swal.fire({
          icon: 'success',
          title: 'Updated!',
          text: 'User account has been updated.',
          timer: 1500,
          showConfirmButton: false,
          background: 'var(--bg-card)',
          color: 'var(--text-main)'
        });
      } else {
        // Use the Admin-only users endpoint instead of public register
        await api.post('/users', formData);
        Swal.fire({
          icon: 'success',
          title: 'Created!',
          text: 'New user account created successfully.',
          timer: 1500,
          showConfirmButton: false,
          background: 'var(--bg-card)',
          color: 'var(--text-main)'
        });
      }
      navigate('/users');
    } catch (err) {
      // Robust error handling for Identity errors (array of objects) or string errors
      let errorMsg = 'An unexpected error occurred.';
      if (err.response?.data) {
        if (Array.isArray(err.response.data)) {
          errorMsg = err.response.data.map(e => e.description || e).join('\n');
        } else if (typeof err.response.data === 'string') {
          errorMsg = err.response.data;
        } else if (err.response.data.errors) {
            // Handle validation errors from ASP.NET Core
            errorMsg = Object.values(err.response.data.errors).flat().join('\n');
        }
      }

      Swal.fire({
        icon: 'error',
        title: 'Operation Failed',
        text: errorMsg,
        background: 'var(--bg-card)',
        color: 'var(--text-main)',
        confirmButtonColor: 'var(--primary)'
      });
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
      <motion.div 
        animate={{ rotate: 360 }} 
        transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
        style={{ width: '40px', height: '40px', border: '4px solid var(--border)', borderTopColor: 'var(--primary)', borderRadius: '50%' }}
      />
    </div>
  );

  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }} 
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}
    >
      <motion.button 
        whileHover={{ x: -5 }}
        onClick={() => navigate('/users')} 
        style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', marginBottom: '30px', fontSize: '0.9rem', fontWeight: '600' }}
      >
        <ArrowLeft size={18} /> Back to Directory
      </motion.button>

      <div className="glass-card" style={{ padding: '40px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '4px', background: 'linear-gradient(90deg, var(--primary), var(--secondary))' }} />
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '35px' }}>
          <div style={{ width: '50px', height: '50px', background: 'rgba(79, 70, 229, 0.1)', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
            {id ? <User size={26} /> : <UserPlus size={26} />}
          </div>
          <div>
            <h1 style={{ fontSize: '1.6rem', fontWeight: '800', color: 'var(--text-main)' }}>{id ? 'Manage Profile' : 'Add System User'}</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Configure access and identity details</p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Legal Full Name</label>
            <div style={{ position: 'relative' }}>
              <User style={{ position: 'absolute', left: '14px', top: '14px', color: 'var(--text-muted)' }} size={18} />
              <input 
                type="text" 
                placeholder="e.g. John Doe" 
                style={{ paddingLeft: '45px', background: 'rgba(255,255,255,0.5)' }}
                value={formData.fullName}
                onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                required
              />
            </div>
          </div>

          <div className="input-group">
            <label>Corporate Email Address</label>
            <div style={{ position: 'relative' }}>
              <Mail style={{ position: 'absolute', left: '14px', top: '14px', color: 'var(--text-muted)' }} size={18} />
              <input 
                type="email" 
                placeholder="name@westpharma.com" 
                style={{ paddingLeft: '45px', background: 'rgba(255,255,255,0.5)' }}
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                required
              />
            </div>
          </div>

          <div className="input-group">
            <label>{id ? 'Update Password (Optional)' : 'Security Password'}</label>
            <div style={{ position: 'relative' }}>
              <Lock style={{ position: 'absolute', left: '14px', top: '14px', color: 'var(--text-muted)' }} size={18} />
              <input 
                type="password" 
                placeholder={id ? "••••••••" : "Choose a secure password"} 
                style={{ paddingLeft: '45px', background: 'rgba(255,255,255,0.5)' }}
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                required={!id}
              />
            </div>
          </div>

          <div className="input-group">
            <label>System Authorization Level</label>
            <div style={{ position: 'relative' }}>
              <Shield style={{ position: 'absolute', left: '14px', top: '14px', color: 'var(--text-muted)' }} size={18} />
              <select 
                style={{ 
                  paddingLeft: '45px', 
                  background: 'rgba(255,255,255,0.5)',
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

          <button 
            type="submit" 
            className="btn btn-primary" 
            style={{ width: '100%', justifyContent: 'center', height: '55px', marginTop: '20px' }} 
            disabled={loading}
          >
            {loading ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }} style={{ width: '16px', height: '16px', border: '2px solid white', borderTopColor: 'transparent', borderRadius: '50%' }} />
                Processing...
              </div>
            ) : (
              <>{id ? <Save size={20} /> : <UserPlus size={20} />} {id ? 'Save Changes' : 'Provision Account'}</>
            )}
          </button>
        </form>
      </div>
    </motion.div>
  );
};

export default CreateUser;
