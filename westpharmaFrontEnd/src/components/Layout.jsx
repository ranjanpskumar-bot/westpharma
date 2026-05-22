import React from 'react';
import Sidebar from './Sidebar';
import { useAuth } from '../context/AuthContext';
import { User, Bell, Search } from 'lucide-react';

const Layout = ({ children }) => {
  const { user } = useAuth();

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-main)' }}>
      <Sidebar />
      <div style={{ flex: 1, marginLeft: '280px', display: 'flex', flexDirection: 'column' }}>
        {/* Top Header */}
        <header style={{ 
          height: '70px', 
          background: 'var(--header-bg)', 
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          borderBottom: '1px solid var(--border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 40px',
          position: 'sticky',
          top: 0,
          zIndex: 50
        }}>
          <div style={{ position: 'relative' }}>
            <Search style={{ position: 'absolute', left: '12px', top: '10px', color: 'var(--text-muted)' }} size={18} />
            <input 
              type="text" 
              placeholder="Quick search..." 
              style={{ 
                background: '#f1f5f9', border: 'none', 
                borderRadius: '8px', padding: '10px 10px 10px 40px', color: 'var(--text-main)',
                width: '300px', fontSize: '0.9rem'
              }}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '25px' }}>
            <div style={{ position: 'relative', cursor: 'pointer' }}>
              <Bell size={20} color="var(--text-muted)" />
              <span style={{ position: 'absolute', top: '-5px', right: '-5px', width: '8px', height: '8px', background: 'var(--accent)', borderRadius: '50%', border: '2px solid white' }}></span>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', paddingLeft: '20px', borderLeft: '1px solid var(--border)' }}>
              <div style={{ textAlign: 'right' }}>
                <p style={{ fontSize: '0.9rem', fontWeight: '700', color: 'var(--text-main)' }}>{user?.fullName}</p>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '500' }}>{user?.roles?.[0]}</p>
              </div>
              <div style={{ 
                width: '40px', height: '40px', background: 'var(--primary)', 
                borderRadius: '50%', display: 'flex', alignItems: 'center', 
                justifyContent: 'center', color: 'white'
              }}>
                <User size={20} />
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main style={{ padding: '40px' }}>
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
