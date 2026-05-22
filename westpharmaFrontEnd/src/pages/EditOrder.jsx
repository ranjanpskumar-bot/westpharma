import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api/api';
import { Package, DollarSign, FileText, Save, ArrowLeft, Info } from 'lucide-react';
import { motion } from 'framer-motion';
import Swal from 'sweetalert2';

const EditOrder = () => {
  const { id } = useParams();
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrder();
  }, []);

  const fetchOrder = async () => {
    try {
      const res = await api.get(`/orders/${id}`);
      setDescription(res.data.description);
      setAmount(res.data.amount);
      setLoading(false);
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: 'Failed to fetch order details',
        background: 'var(--bg-card)',
        color: 'var(--text-main)',
        confirmButtonColor: 'var(--primary)'
      });
      navigate('/orders');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/orders/${id}`, {
        description,
        amount: parseFloat(amount)
      });
      Swal.fire({
        icon: 'success',
        title: 'Updated!',
        text: 'Order updated successfully',
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
        text: err.response?.data || 'Update failed',
        background: 'var(--bg-card)',
        color: 'var(--text-main)',
        confirmButtonColor: 'var(--primary)'
      });
    }
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
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}
    >
      <motion.button 
        whileHover={{ x: -5 }}
        onClick={() => navigate('/orders')}
        style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', marginBottom: '30px', fontSize: '0.9rem', fontWeight: '600' }}
      >
        <ArrowLeft size={18} /> Back to Dashboard
      </motion.button>

      <div className="glass-card" style={{ padding: '40px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '4px', background: 'linear-gradient(90deg, var(--primary), var(--secondary))' }} />
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '30px' }}>
          <div style={{ width: '45px', height: '45px', background: 'rgba(79, 70, 229, 0.1)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
            <Package size={24} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.6rem', fontWeight: '800', color: 'var(--text-main)' }}>Edit Order #{id}</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Review and update order details below</p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Item Description</label>
            <div style={{ position: 'relative' }}>
              <FileText style={{ position: 'absolute', left: '14px', top: '14px', color: 'var(--text-muted)' }} size={18} />
              <input 
                type="text" 
                required 
                placeholder="What are we ordering?"
                style={{ paddingLeft: '45px', background: 'rgba(255,255,255,0.5)' }}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          </div>

          <div className="input-group">
            <label>Order Amount</label>
            <div style={{ position: 'relative' }}>
              <DollarSign style={{ position: 'absolute', left: '14px', top: '14px', color: 'var(--text-muted)' }} size={18} />
              <input 
                type="number" 
                required 
                step="0.01"
                placeholder="0.00"
                style={{ paddingLeft: '45px', background: 'rgba(255,255,255,0.5)' }}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>
            
            <motion.div 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              style={{ 
                marginTop: '15px', 
                padding: '12px 16px', 
                borderRadius: '10px', 
                background: amount >= 10000 ? 'rgba(245, 158, 11, 0.1)' : 'rgba(16, 185, 129, 0.1)',
                border: amount >= 10000 ? '1px solid rgba(245, 158, 11, 0.2)' : '1px solid rgba(16, 185, 129, 0.2)',
                display: 'flex',
                gap: '10px',
                alignItems: 'center'
              }}
            >
              <Info size={16} color={amount >= 10000 ? 'var(--warning)' : 'var(--success)'} />
              <p style={{ fontSize: '0.8rem', color: amount >= 10000 ? '#92400e' : '#065f46', fontWeight: '500' }}>
                {amount >= 10000 
                  ? 'This order will require Administrative approval due to the high amount.'
                  : 'This order can be approved by your Department Manager.'}
              </p>
            </motion.div>
          </div>

          <button className="btn btn-primary" type="submit" style={{ width: '100%', justifyContent: 'center', height: '55px', marginTop: '30px', fontSize: '1rem' }}>
            <Save size={20} /> Save Changes
          </button>
        </form>
      </div>
    </motion.div>
  );
};

export default EditOrder;
