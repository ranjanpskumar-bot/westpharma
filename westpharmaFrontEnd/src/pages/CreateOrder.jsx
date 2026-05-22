import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';
import { Package, FileText, DollarSign, ArrowLeft, Send, Info } from 'lucide-react';
import { motion } from 'framer-motion';
import Swal from 'sweetalert2';

const CreateOrder = () => {
  const [formData, setFormData] = useState({ description: '', amount: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/orders', { 
        description: formData.description, 
        amount: parseFloat(formData.amount) 
      });
      Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: 'Order created successfully',
        timer: 1500,
        showConfirmButton: false,
        background: 'var(--bg-card)',
        color: 'var(--text-main)'
      });
      navigate('/orders');
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: err.response?.data || 'Error creating order',
        background: 'var(--bg-card)',
        color: 'var(--text-main)',
        confirmButtonColor: 'var(--primary)'
      });
    } finally {
      setLoading(false);
    }
  };

  const amountValue = parseFloat(formData.amount) || 0;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}
    >
      <motion.button 
        whileHover={{ x: -5 }}
        onClick={() => navigate(-1)} 
        style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', marginBottom: '30px', fontSize: '0.9rem', fontWeight: '600' }}
      >
        <ArrowLeft size={18} /> Back to Dashboard
      </motion.button>

      <div className="glass-card" style={{ padding: '40px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '4px', background: 'linear-gradient(90deg, var(--primary), var(--secondary))' }} />
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '35px' }}>
          <div style={{ width: '45px', height: '45px', background: 'rgba(79, 70, 229, 0.1)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
            <Package size={24} />
          </div>
          <div>
            <h1 style={{ fontSize: '1.6rem', fontWeight: '800', color: 'var(--text-main)' }}>Submit New Order</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Fill in the details for your procurement request</p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Item Description</label>
            <div style={{ position: 'relative' }}>
              <FileText style={{ position: 'absolute', left: '14px', top: '14px', color: 'var(--text-muted)' }} size={18} />
              <textarea 
                placeholder="What are we ordering? Provide key details..." 
                style={{ paddingLeft: '45px', minHeight: '120px', background: 'rgba(255,255,255,0.5)', lineHeight: '1.6' }}
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                required
              />
            </div>
          </div>

          <div className="input-group">
            <label>Total Order Value</label>
            <div style={{ position: 'relative' }}>
              <DollarSign style={{ position: 'absolute', left: '14px', top: '14px', color: 'var(--text-muted)' }} size={18} />
              <input 
                type="number" 
                step="0.01"
                placeholder="0.00" 
                style={{ paddingLeft: '45px', background: 'rgba(255,255,255,0.5)' }}
                value={formData.amount}
                onChange={(e) => setFormData({...formData, amount: e.target.value})}
                required
              />
            </div>
            
            <motion.div 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              style={{ 
                marginTop: '15px', 
                padding: '12px 16px', 
                borderRadius: '10px', 
                background: amountValue >= 10000 ? 'rgba(245, 158, 11, 0.1)' : 'rgba(16, 185, 129, 0.1)',
                border: amountValue >= 10000 ? '1px solid rgba(245, 158, 11, 0.2)' : '1px solid rgba(16, 185, 129, 0.2)',
                display: 'flex',
                gap: '10px',
                alignItems: 'center'
              }}
            >
              <Info size={16} color={amountValue >= 10000 ? 'var(--warning)' : 'var(--success)'} />
              <p style={{ fontSize: '0.8rem', color: amountValue >= 10000 ? '#92400e' : '#065f46', fontWeight: '500' }}>
                {amountValue >= 10000 
                  ? 'High-value orders (≥ $10,000) route directly to Administrators for approval.'
                  : 'Standard orders (< $10,000) can be approved by your Department Manager.'}
              </p>
            </motion.div>
          </div>

          <button 
            type="submit" 
            className="btn btn-primary" 
            style={{ width: '100%', justifyContent: 'center', height: '55px', marginTop: '20px', fontSize: '1rem', fontWeight: '700' }} 
            disabled={loading}
          >
            {loading ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }} style={{ width: '16px', height: '16px', border: '2px solid white', borderTopColor: 'transparent', borderRadius: '50%' }} />
                Submitting...
              </div>
            ) : (
              <><Send size={18} /> Submit Request</>
            )}
          </button>
        </form>
      </div>
    </motion.div>
  );
};

export default CreateOrder;
