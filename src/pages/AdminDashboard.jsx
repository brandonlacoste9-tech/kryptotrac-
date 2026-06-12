import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Shield, ShieldAlert, CheckCircle, ArrowLeft } from 'lucide-react';
import { supabase } from '../supabaseClient';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [usersList, setUsersList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/');
      return;
    }

    const checkAdmin = async () => {
      const { data } = await supabase.from('profiles').select('role').eq('id', user.id).single();
      if (data && data.role === 'admin') {
        setIsAdmin(true);
        fetchUsers();
      } else {
        navigate('/'); // kick out non-admins
      }
    };
    
    checkAdmin();
  }, [user, navigate]);

  const fetchUsers = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:4242';
      const res = await fetch(`${apiUrl}/api/users`, {
        headers: {
          'Authorization': `Bearer ${session?.access_token}`
        }
      });
      const data = await res.json();
      setUsersList(data || []);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const togglePlan = async (userId, currentPlan) => {
    const newPlan = currentPlan === 'PRO' ? 'FREE' : 'PRO';
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:4242';
      const res = await fetch(`${apiUrl}/api/users/${userId}/plan`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.access_token}`
        },
        body: JSON.stringify({ plan: newPlan })
      });
      if (res.ok) {
        setUsersList(usersList.map(u => u.id === userId ? { ...u, plan: newPlan } : u));
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading || !isAdmin) return <div className="container" style={{paddingTop: '100px', textAlign: 'center'}}>Loading Secure Area...</div>;

  return (
    <div className="container admin-container" style={{ paddingTop: '100px', minHeight: '80vh' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <ShieldAlert size={32} className="text-primary" />
          <h1 className="text-gradient" style={{ margin: 0 }}>Admin Dashboard</h1>
        </div>
        <button className="btn btn-outline" onClick={() => navigate(-1)}><ArrowLeft size={16}/> Exit Admin</button>
      </div>

      <div className="admin-stats glass-panel" style={{ display: 'flex', gap: '2rem', padding: '1.5rem', marginBottom: '2rem' }}>
        <div>
          <h3 style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', textTransform: 'uppercase' }}>Total Users</h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: 0 }}>{usersList.length}</p>
        </div>
        <div>
          <h3 style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', textTransform: 'uppercase' }}>PRO Subscribers</h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: 0, color: 'var(--secondary-color)' }}>
            {usersList.filter(u => u.plan === 'PRO').length}
          </p>
        </div>
      </div>

      <div className="glass-panel" style={{ overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead style={{ background: 'rgba(0,0,0,0.2)' }}>
            <tr>
              <th style={{ padding: '1rem' }}>User ID</th>
              <th style={{ padding: '1rem' }}>Username</th>
              <th style={{ padding: '1rem' }}>Role</th>
              <th style={{ padding: '1rem' }}>Plan</th>
              <th style={{ padding: '1rem', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {usersList.map(u => (
              <tr key={u.id} style={{ borderBottom: 'var(--glass-border)' }}>
                <td style={{ padding: '1rem', fontFamily: 'monospace', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  {u.id.substring(0, 8)}...
                </td>
                <td style={{ padding: '1rem', fontWeight: 'bold' }}>{u.username || 'Anonymous'}</td>
                <td style={{ padding: '1rem' }}>
                  {u.role === 'admin' ? <span style={{ color: 'var(--primary-color)' }}><Shield size={14}/> Admin</span> : 'User'}
                </td>
                <td style={{ padding: '1rem' }}>
                  {u.plan === 'PRO' ? (
                    <span style={{ color: 'var(--secondary-color)', fontWeight: 'bold' }}>PRO</span>
                  ) : (
                    <span style={{ color: 'var(--text-muted)' }}>FREE</span>
                  )}
                </td>
                <td style={{ padding: '1rem', textAlign: 'right' }}>
                  <button 
                    className={`btn ${u.plan === 'PRO' ? 'btn-outline' : 'btn-primary'}`} 
                    style={{ padding: '0.3rem 0.8rem', fontSize: '0.8rem' }}
                    onClick={() => togglePlan(u.id, u.plan)}
                  >
                    {u.plan === 'PRO' ? 'Revoke PRO' : 'Grant PRO'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboard;
