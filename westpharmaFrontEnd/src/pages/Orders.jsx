import React, { useState, useEffect } from 'react';
import api from '../api/api';
import { useAuth } from '../context/AuthContext';
import { Search, Filter, MoreVertical, Edit2, Trash2, CheckCircle, XCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Swal from 'sweetalert2';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const { user, hasRole } = useAuth();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await api.get('/orders');
      setOrders(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: 'var(--primary)',
      cancelButtonColor: 'var(--accent)',
      confirmButtonText: 'Yes, delete it!',
      background: 'var(--bg-card)',
      color: 'var(--text-main)'
    });

    if (result.isConfirmed) {
      try {
        await api.delete(`/orders/${id}`);
        Swal.fire({
          title: 'Deleted!',
          text: 'Your order has been deleted.',
          icon: 'success',
          timer: 1500,
          showConfirmButton: false,
          background: 'var(--bg-card)',
          color: 'var(--text-main)'
        });
        fetchOrders();
      } catch (err) {
        Swal.fire({
          title: 'Error!',
          text: err.response?.data || 'Delete failed',
          icon: 'error',
          background: 'var(--bg-card)',
          color: 'var(--text-main)'
        });
      }
    }
  };

  const handleApprove = async (id, rowVersion) => {
    const result = await Swal.fire({
      title: 'Approve Order?',
      text: "Are you sure you want to approve this order?",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: 'var(--primary)',
      cancelButtonColor: 'var(--secondary)',
      confirmButtonText: 'Yes, approve it!',
      background: 'var(--bg-card)',
      color: 'var(--text-main)'
    });

    if (result.isConfirmed) {
      try {
        await api.post(`/orders/${id}/approve`, { id, rowVersion });
        Swal.fire({
          title: 'Approved!',
          text: 'The order has been approved.',
          icon: 'success',
          timer: 1500,
          showConfirmButton: false,
          background: 'var(--bg-card)',
          color: 'var(--text-main)'
        });
        fetchOrders();
      } catch (err) {
        const errorMsg = typeof err.response?.data === 'string' ? err.response.data : (err.response?.data?.message || 'Approval failed');
        Swal.fire({
          title: 'Error!',
          text: errorMsg,
          icon: 'error',
          background: 'var(--bg-card)',
          color: 'var(--text-main)'
        });
      }
    }
  };

  const handleReject = async (id) => {
    const result = await Swal.fire({
      title: 'Reject Order?',
      text: "Are you sure you want to reject this order?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: 'var(--accent)',
      cancelButtonColor: 'var(--secondary)',
      confirmButtonText: 'Yes, reject it!',
      background: 'var(--bg-card)',
      color: 'var(--text-main)'
    });

    if (result.isConfirmed) {
      try {
        await api.post(`/orders/${id}/reject`);
        Swal.fire({
          title: 'Rejected!',
          text: 'The order has been rejected.',
          icon: 'success',
          timer: 1500,
          showConfirmButton: false,
          background: 'var(--bg-card)',
          color: 'var(--text-main)'
        });
        fetchOrders();
      } catch (err) {
        const errorMsg = typeof err.response?.data === 'string' ? err.response.data : (err.response?.data?.message || 'Rejection failed');
        Swal.fire({
          title: 'Error!',
          text: errorMsg,
          icon: 'error',
          background: 'var(--bg-card)',
          color: 'var(--text-main)'
        });
      }
    }
  };

  const filteredOrders = orders.filter(o => {
    const matchesFilter = filter === 'All' || getStatusName(o.status) === filter;
    const matchesSearch = (o.description?.toLowerCase() || '').includes(searchTerm.toLowerCase()) || 
                          o.id.toString().includes(searchTerm);
    return matchesFilter && matchesSearch;
  });

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: '800' }}>Orders Management</h1>
        <div style={{ display: 'flex', gap: '10px' }}>
          <div style={{ position: 'relative' }}>
            <Search style={{ position: 'absolute', left: '12px', top: '10px', color: 'var(--text-muted)' }} size={18} />
            <input 
              type="text" 
              placeholder="Search orders..." 
              style={{ 
                background: 'white', border: '1px solid var(--border)', 
                borderRadius: '8px', padding: '10px 10px 10px 40px', color: 'var(--text-main)',
                width: '250px'
              }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select 
            style={{ 
              background: 'white', border: '1px solid var(--border)', 
              borderRadius: '8px', padding: '0 15px', color: 'var(--text-main)'
            }}
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option>All</option>
            <option>Pending</option>
            <option>Approved</option>
            <option>Rejected</option>
          </select>
        </div>
      </div>

      <div className="glass-card" style={{ padding: '0', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ padding: '15px 20px', textAlign: 'left' }}>ORDER</th>
              <th style={{ padding: '15px 20px', textAlign: 'left' }}>DATE</th>
              <th style={{ padding: '15px 20px', textAlign: 'left' }}>AMOUNT</th>
              <th style={{ padding: '15px 20px', textAlign: 'left' }}>STATUS</th>
              <th style={{ padding: '15px 20px', textAlign: 'right' }}>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence>
              {filteredOrders.map((order) => (
                <motion.tr 
                  key={order.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  style={{ transition: 'background 0.2s' }}
                  onMouseEnter={(e) => e.currentTarget.style.background = '#f8fafc'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                >
                  <td style={{ padding: '15px 20px' }}>
                    <div style={{ fontWeight: '700', fontSize: '0.95rem' }}>#{order.id}</div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{order.description}</div>
                  </td>
                  <td style={{ padding: '15px 20px', fontSize: '0.9rem' }}>
                    {new Date(order.createdDate).toLocaleDateString()}
                  </td>
                  <td style={{ padding: '15px 20px', fontWeight: '700', color: 'var(--primary)' }}>
                    ${order.amount.toLocaleString()}
                  </td>
                  <td style={{ padding: '15px 20px' }}>
                    <span className={`status-badge status-${getStatusName(order.status).toLowerCase()}`}>
                      {getStatusName(order.status)}
                    </span>
                  </td>
                  <td style={{ padding: '15px 20px', textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                      {order.status === 1 && order.createdById === (user?.id || user?.Id) && (
                        <>
                          <button 
                            className="btn" 
                            style={{ padding: '8px', background: '#f1f5f9', color: 'var(--text-main)', border: '1px solid var(--border)' }}
                            onClick={() => window.location.href = `/orders/edit/${order.id}`}
                          >
                            <Edit2 size={16} />
                          </button>
                          <button 
                            className="btn" 
                            style={{ padding: '8px', background: '#fee2e2', color: 'var(--accent)', border: '1px solid #fecaca' }} 
                            onClick={() => handleDelete(order.id)}
                          >
                            <Trash2 size={16} />
                          </button>
                        </>
                      )}
                      {order.status === 1 && (hasRole('Admin') || hasRole('Manager')) && order.createdById !== (user?.id || user?.Id) && (
                        <>
                          {(hasRole('Admin') || (hasRole('Manager') && order.amount < 10000)) ? (
                            <button 
                              className="btn" 
                              style={{ padding: '8px', background: '#dcfce7', color: 'var(--success)', border: '1px solid #bbf7d0' }}
                              onClick={() => handleApprove(order.id, order.rowVersion)}
                              title="Approve Order"
                            >
                              <CheckCircle size={16} />
                            </button>
                          ) : hasRole('Manager') ? (
                            <button 
                              className="btn" 
                              style={{ padding: '8px', background: '#f1f5f9', color: 'var(--text-muted)', border: '1px solid var(--border)', cursor: 'not-allowed' }}
                              disabled
                              title="Managers can only approve orders below $10,000"
                            >
                              <CheckCircle size={16} />
                            </button>
                          ) : null}
                          <button 
                            className="btn" 
                            style={{ padding: '8px', background: '#fee2e2', color: 'var(--accent)', border: '1px solid #fecaca' }}
                            onClick={() => handleReject(order.id)}
                            title="Reject Order"
                          >
                            <XCircle size={16} />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

const getStatusName = (status) => {
  switch (status) {
    case 1: return 'Pending';
    case 2: return 'Approved';
    case 3: return 'Rejected';
    default: return 'Unknown';
  }
};

export default Orders;
