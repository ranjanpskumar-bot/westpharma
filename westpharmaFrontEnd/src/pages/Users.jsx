import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';
import { User, Shield, Mail, Trash2, Edit2, ShieldCheck, ShieldAlert, UserCheck, UserPlus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Swal from 'sweetalert2';

const UsersList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await api.get('/auth/users');
      setUsers(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Remove User?',
      text: "This action will permanently revoke all access for this account.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: 'var(--accent)',
      cancelButtonColor: 'var(--secondary)',
      confirmButtonText: 'Yes, remove account',
      background: 'var(--bg-card)',
      color: 'var(--text-main)'
    });

    if (result.isConfirmed) {
      try {
        await api.delete(`/auth/users/${id}`);
        Swal.fire({
          title: 'Removed!',
          text: 'User access has been revoked.',
          icon: 'success',
          timer: 1500,
          showConfirmButton: false,
          background: 'var(--bg-card)',
          color: 'var(--text-main)'
        });
        fetchUsers();
      } catch (err) {
        Swal.fire({
          title: 'Access Denied',
          text: err.response?.data || 'Failed to remove user account.',
          icon: 'error',
          background: 'var(--bg-card)',
          color: 'var(--text-main)',
          confirmButtonColor: 'var(--primary)'
        });
      }
    }
  };

  const getRoleIcon = (roles) => {
    const role = roles?.[0] || 'User';
    if (role === 'Admin') return <ShieldAlert size={20} color="#ef4444" />;
    if (role === 'Manager') return <ShieldCheck size={20} color="#f59e0b" />;
    return <UserCheck size={20} color="var(--primary)" />;
  };

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
      <motion.div 
        animate={{ rotate: 360 }} 
        transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
        style={{ width: '40px', height: '40px', border: '4px solid var(--border)', borderTopColor: 'var(--primary)', borderRadius: '50%' }}
      />
    </div>
  );

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--text-main)', letterSpacing: '-0.5px' }}>User Directory</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1rem', marginTop: '5px' }}>Manage system access and permissions</p>
        </div>
        <button className="btn btn-primary" onClick={() => navigate('/users/create')}>
          <UserPlus size={18} /> Provision New User
        </button>
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '25px' }}>
        <AnimatePresence>
          {users.map((user, index) => (
            <motion.div 
              key={user.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="glass-card" 
              style={{ padding: '30px', position: 'relative' }}
            >
              <div style={{ position: 'absolute', top: '20px', right: '20px' }}>
                {getRoleIcon(user.roles)}
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '25px' }}>
                <div style={{ 
                  width: '60px', height: '60px', 
                  background: 'linear-gradient(135deg, var(--primary), var(--secondary))', 
                  borderRadius: '18px', display: 'flex', alignItems: 'center', 
                  justifyContent: 'center', boxShadow: '0 8px 16px var(--primary-glow)'
                }}>
                  <User color="white" size={28} />
                </div>
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: 'var(--text-main)', marginBottom: '4px' }}>{user.fullName}</h3>
                  <div style={{ display: 'inline-block', padding: '4px 10px', background: 'rgba(79, 70, 229, 0.1)', color: 'var(--primary)', borderRadius: '6px', fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase' }}>
                    {user.roles?.[0] || 'User'}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '25px', padding: '15px', background: 'rgba(0,0,0,0.02)', borderRadius: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                  <Mail size={16} /> 
                  <span style={{ fontWeight: '500' }}>{user.email}</span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button 
                  className="btn" 
                  style={{ flex: 1, justifyContent: 'center', background: 'white', border: '1px solid var(--border)', color: 'var(--text-main)' }}
                  onClick={() => navigate(`/users/edit/${user.id}`)}
                >
                  <Edit2 size={16} /> Edit Profile
                </button>
                <button 
                  className="btn" 
                  style={{ padding: '10px', background: 'rgba(239, 68, 68, 0.1)', color: 'var(--accent)', border: '1px solid rgba(239, 68, 68, 0.2)' }}
                  onClick={() => handleDelete(user.id)}
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default UsersList;
