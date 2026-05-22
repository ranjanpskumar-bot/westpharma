import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, ShoppingCart, Users, LogOut, PackageSearch, Plus, UserPlus, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
  const { logout, hasRole, user } = useAuth();

  const menuItems = [
    { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={20} />, roles: ['User', 'Manager', 'Admin'] },
    { name: 'Orders', path: '/orders', icon: <ShoppingCart size={20} />, roles: ['User', 'Manager', 'Admin'] },
    { name: 'Create Order', path: '/orders/create', icon: <Plus size={20} />, roles: ['User', 'Manager', 'Admin'] },
    { name: 'Users', path: '/users', icon: <Users size={20} />, roles: ['Admin'] },
    { name: 'Add User', path: '/users/create', icon: <UserPlus size={20} />, roles: ['Admin'] },
  ];

  return (
    <aside style={{ 
      width: '280px', height: '100vh', position: 'fixed', 
      left: 0, top: 0, display: 'flex', flexDirection: 'column',
      background: 'var(--sidebar-bg)', color: 'white',
      zIndex: 100,
      borderRight: '1px solid rgba(255, 255, 255, 0.05)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '35px 30px', marginBottom: '20px' }}>
        <div style={{ width: '40px', height: '40px', background: 'var(--primary)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 15px var(--primary-glow)' }}>
          <PackageSearch color="white" size={24} />
        </div>
        <h2 style={{ fontSize: '1.4rem', fontWeight: '800', letterSpacing: '-0.5px', color: 'white' }}>Westpharma</h2>
      </div>

      <nav style={{ flex: 1, padding: '0 20px' }}>
        <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.65rem', fontWeight: '800', textTransform: 'uppercase', paddingLeft: '15px', marginBottom: '20px', letterSpacing: '0.15em' }}>Navigation</p>
        {menuItems.filter(item => item.roles.some(r => hasRole(r))).map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end
            style={({ isActive }) => ({
              display: 'flex',
              alignItems: 'center',
              gap: '14px',
              padding: '14px 18px',
              borderRadius: '12px',
              textDecoration: 'none',
              color: isActive ? 'white' : 'rgba(255,255,255,0.6)',
              background: isActive ? 'linear-gradient(90deg, var(--primary), var(--secondary))' : 'transparent',
              marginBottom: '8px',
              transition: 'all 0.3s ease',
              fontWeight: isActive ? '700' : '500',
              fontSize: '0.9rem',
              boxShadow: isActive ? '0 4px 12px rgba(79, 70, 229, 0.3)' : 'none'
            })}
          >
            <span style={{ opacity: 1 }}>{item.icon}</span>
            {item.name}
          </NavLink>
        ))}
      </nav>

      <div style={{ padding: '20px', borderTop: '1px solid rgba(255,255,255,0.05)', background: 'rgba(0,0,0,0.2)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px', padding: '10px' }}>
          <div style={{ width: '40px', height: '40px', background: 'rgba(255,255,255,0.05)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Shield size={20} color="var(--primary)" />
          </div>
          <div>
            <p style={{ fontSize: '0.85rem', fontWeight: '700', marginBottom: '2px' }}>{user?.fullName}</p>
            <p style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.5)', textTransform: 'capitalize' }}>{user?.role}</p>
          </div>
        </div>
        <button 
          className="btn" 
          style={{ 
            background: 'rgba(239, 68, 68, 0.1)', 
            color: '#f87171', 
            width: '100%', 
            justifyContent: 'center',
            border: '1px solid rgba(239, 68, 68, 0.2)',
            borderRadius: '12px'
          }} 
          onClick={logout}
        >
          <LogOut size={18} /> Sign Out
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
