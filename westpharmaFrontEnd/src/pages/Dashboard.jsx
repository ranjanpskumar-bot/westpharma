import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';
import { useAuth } from '../context/AuthContext';
import { Plus, Check, LogOut, Package, TrendingUp, AlertCircle, ArrowRight, Activity, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

const Dashboard = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, hasRole } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await api.get('/orders');
      setOrders(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const pendingOrders = orders.filter(o => o.status === 1);
  const approvedOrders = orders.filter(o => o.status === 2);
  const totalAmount = orders.reduce((sum, o) => sum + o.amount, 0);

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
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      {/* Header Section */}
      <header style={{ marginBottom: '40px' }}>
        <h1 style={{ fontSize: '2.2rem', fontWeight: '800', color: 'var(--text-main)', letterSpacing: '-1px', marginBottom: '8px' }}>
          Welcome back, {user?.fullName.split(' ')[0]}
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', fontWeight: '500' }}>
          Here's what's happening with the Westpharma system today.
        </p>
      </header>

      {/* Analytics Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '25px', marginBottom: '40px' }}>
        <StatCard 
          title="Active Orders" 
          value={orders.length} 
          subtitle="Total submitted"
          icon={<Package size={26} />} 
          color="#6366f1" 
        />
        <StatCard 
          title="Awaiting Review" 
          value={pendingOrders.length} 
          subtitle="Pending approval"
          icon={<Clock size={26} />} 
          color="#f59e0b" 
        />
        <StatCard 
          title="Approved Value" 
          value={`$${approvedOrders.reduce((sum, o) => sum + o.amount, 0).toLocaleString()}`} 
          subtitle="Total finalized"
          icon={<Activity size={26} />} 
          color="#10b981" 
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: '30px' }}>
        {/* Quick Review Section */}
        <div className="glass-card" style={{ padding: '35px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
            <h2 style={{ fontSize: '1.4rem', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <TrendingUp size={22} color="var(--primary)" /> Recent Orders
            </h2>
            <button className="btn" style={{ fontSize: '0.8rem', padding: '6px 12px', background: 'rgba(0,0,0,0.05)' }} onClick={() => navigate('/orders')}>
              View All <ArrowRight size={14} />
            </button>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {orders.slice(0, 4).map(order => (
              <div key={order.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '15px', background: 'rgba(255,255,255,0.4)', borderRadius: '12px', border: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                  <div style={{ width: '40px', height: '40px', background: 'white', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
                    #{order.id}
                  </div>
                  <div>
                    <p style={{ fontWeight: '700', fontSize: '0.95rem' }}>{order.description}</p>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{new Date(order.createdDate).toLocaleDateString()}</p>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontWeight: '800', color: 'var(--primary)' }}>${order.amount.toLocaleString()}</p>
                  <span className={`status-badge status-${getStatusName(order.status).toLowerCase()}`} style={{ fontSize: '0.65rem' }}>
                    {getStatusName(order.status)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Actions & Alerts */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
          <div className="glass-card" style={{ padding: '35px', background: 'linear-gradient(135deg, var(--primary), var(--secondary))', color: 'white' }}>
            <h2 style={{ marginBottom: '10px', fontSize: '1.4rem', fontWeight: '800' }}>New Submission</h2>
            <p style={{ marginBottom: '25px', opacity: 0.9, fontSize: '0.95rem' }}>Need to procure equipment or services? Start a new order request here.</p>
            <button className="btn" style={{ width: '100%', background: 'white', color: 'var(--primary)', height: '50px', justifyContent: 'center' }} onClick={() => navigate('/orders/create')}>
              <Plus size={20} /> Create New Order
            </button>
          </div>

          {(hasRole('Admin') || hasRole('Manager')) && pendingOrders.length > 0 && (
            <div className="glass-card" style={{ padding: '30px', borderLeft: '6px solid var(--warning)', background: '#fffbeb' }}>
              <div style={{ display: 'flex', gap: '15px', alignItems: 'flex-start' }}>
                <AlertCircle color="var(--warning)" size={24} />
                <div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#92400e' }}>Attention Required</h3>
                  <p style={{ color: '#b45309', fontSize: '0.9rem', marginTop: '5px', lineHeight: '1.5' }}>
                    There are <strong>{pendingOrders.length}</strong> orders pending your review. 
                    Please process them to maintain system throughput.
                  </p>
                  <button className="btn" style={{ marginTop: '15px', background: '#f59e0b', color: 'white', padding: '8px 16px' }} onClick={() => navigate('/orders')}>
                    Review Now
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

const StatCard = ({ title, value, subtitle, icon, color }) => (
  <motion.div 
    whileHover={{ y: -8, scale: 1.02 }}
    className="glass-card" 
    style={{ padding: '30px', position: 'relative', overflow: 'hidden' }}
  >
    <div style={{ position: 'absolute', right: '-10px', top: '-10px', opacity: 0.03, color: color }}>
      {React.cloneElement(icon, { size: 120 })}
    </div>
    <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
      <div style={{ 
        width: '60px', height: '60px', 
        background: `linear-gradient(135deg, ${color}22, ${color}11)`, 
        borderRadius: '16px', display: 'flex', alignItems: 'center', 
        justifyContent: 'center', color: color,
        border: `1px solid ${color}33`
      }}>
        {icon}
      </div>
      <div>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '4px' }}>{title}</p>
        <h3 style={{ fontSize: '2rem', fontWeight: '800', margin: '0', color: 'var(--text-main)' }}>{value}</h3>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px', fontWeight: '500' }}>{subtitle}</p>
      </div>
    </div>
  </motion.div>
);

const getStatusName = (status) => {
  switch (status) {
    case 1: return 'Pending';
    case 2: return 'Approved';
    case 3: return 'Rejected';
    default: return 'Unknown';
  }
};

export default Dashboard;
