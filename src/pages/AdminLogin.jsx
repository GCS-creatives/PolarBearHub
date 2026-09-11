import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { initIdentity, openLogin, isAdmin } from '../lib/identity.js';
import { BearWaving } from '../components/PolarBear.jsx';
import './Admin.css';

export default function AdminLogin({ user, setUser }) {
  const [error, setError] = useState('');

  useEffect(() => {
    initIdentity({
      onLogin: (u) => setUser(u),
      onLogout: () => setUser(null),
    });
  }, [setUser]);

  if (user && isAdmin(user)) return <Navigate to="/admin/resources" replace />;

  return (
    <div className="lh-admin-login">
      <BearWaving size={100} />
      <h1 className="lh-display">Admin Login</h1>
      <p>Sign in with your invited Polar Bear Hub account.</p>
      {user && !isAdmin(user) && (
        <p className="lh-admin-login__error">
          You're signed in, but this account doesn't have admin access yet. Ask an existing admin to grant the "admin" role.
        </p>
      )}
      {error && <p className="lh-admin-login__error">{error}</p>}
      <button className="lh-admin-login__btn" onClick={() => { setError(''); openLogin(); }}>
        Sign in
      </button>
      <p className="lh-admin-login__note">
        New admins must be invited — this Hub does not allow public registration.
      </p>
    </div>
  );
}
