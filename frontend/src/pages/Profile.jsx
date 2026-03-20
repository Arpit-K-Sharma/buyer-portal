import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axiosInstance';

const Profile = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState({ name: '', email: '' });
  const [infoForm, setInfoForm] = useState({ name: '', email: '' });
  const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
  const [infoMsg, setInfoMsg] = useState({ text: '', type: '' });
  const [pwMsg, setPwMsg] = useState({ text: '', type: '' });
  const [deleteMsg, setDeleteMsg] = useState('');
  const [loading, setLoading] = useState(true);
  const [infoLoading, setInfoLoading] = useState(false);
  const [pwLoading, setPwLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get('/users/me');
        setProfile(res.data.user);
        setInfoForm({ name: res.data.user.name, email: res.data.user.email });
      } catch {
        // handled by axios interceptor
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleInfoChange = (e) =>
    setInfoForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handlePwChange = (e) =>
    setPwForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleInfoSubmit = async (e) => {
    e.preventDefault();
    setInfoMsg({ text: '', type: '' });
    if (!infoForm.name.trim()) {
      return setInfoMsg({ text: 'Name cannot be empty.', type: 'error' });
    }
    setInfoLoading(true);
    try {
      const res = await api.put('/users/me', { name: infoForm.name, email: infoForm.email });
      setProfile(res.data.user);
      setInfoMsg({ text: 'Profile updated successfully!', type: 'success' });
    } catch (err) {
      setInfoMsg({ text: err.response?.data?.error || 'Update failed.', type: 'error' });
    } finally {
      setInfoLoading(false);
    }
  };

  const handlePwSubmit = async (e) => {
    e.preventDefault();
    setPwMsg({ text: '', type: '' });
    if (pwForm.newPassword.length < 8) {
      return setPwMsg({ text: 'New password must be at least 8 characters.', type: 'error' });
    }
    if (pwForm.newPassword !== pwForm.confirmNewPassword) {
      return setPwMsg({ text: 'New passwords do not match.', type: 'error' });
    }
    setPwLoading(true);
    try {
      await api.put('/users/me', {
        currentPassword: pwForm.currentPassword,
        newPassword: pwForm.newPassword,
      });
      setPwMsg({ text: 'Password changed successfully!', type: 'success' });
      setPwForm({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
    } catch (err) {
      setPwMsg({ text: err.response?.data?.error || 'Password change failed.', type: 'error' });
    } finally {
      setPwLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm('Are you sure you want to delete your account? This cannot be undone.')) return;
    setDeleteLoading(true);
    try {
      await api.delete('/users/me');
      localStorage.removeItem('bp_token');
      localStorage.removeItem('bp_user');
      navigate('/login');
    } catch (err) {
      setDeleteMsg(err.response?.data?.error || 'Could not delete account.');
      setDeleteLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="page-content">
        <div className="loading-wrapper">
          <div className="spinner" />
          <span style={{ color: 'var(--text-secondary)' }}>Loading profile…</span>
        </div>
      </div>
    );
  }

  return (
    <div className="page-content">
      <div className="page-header">
        <h1 className="page-title">My Profile</h1>
        <p className="page-subtitle">Manage your account information</p>
      </div>

      <div className="profile-grid">
        {/* ─ Update info ─ */}
        <div className="profile-section">
          <h2 className="section-title">Personal Information</h2>
          {infoMsg.text && (
            <div className={`alert alert-${infoMsg.type === 'error' ? 'error' : 'success'}`}>
              {infoMsg.text}
            </div>
          )}
          <form onSubmit={handleInfoSubmit}>
            <div className="form-group">
              <label className="form-label" htmlFor="profile-name">Full Name</label>
              <input
                id="profile-name"
                type="text"
                name="name"
                className="form-input"
                value={infoForm.name}
                onChange={handleInfoChange}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="profile-email">Email Address</label>
              <input
                id="profile-email"
                type="email"
                name="email"
                className="form-input"
                value={infoForm.email}
                onChange={handleInfoChange}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary" disabled={infoLoading}>
              {infoLoading ? 'Saving…' : 'Save Changes'}
            </button>
          </form>
        </div>

        {/* ─ Change password ─ */}
        <div className="profile-section">
          <h2 className="section-title">Change Password</h2>
          {pwMsg.text && (
            <div className={`alert alert-${pwMsg.type === 'error' ? 'error' : 'success'}`}>
              {pwMsg.text}
            </div>
          )}
          <form onSubmit={handlePwSubmit}>
            <div className="form-group">
              <label className="form-label" htmlFor="current-pw">Current Password</label>
              <input
                id="current-pw"
                type="password"
                name="currentPassword"
                className="form-input"
                placeholder="Enter current password"
                value={pwForm.currentPassword}
                onChange={handlePwChange}
                required
                autoComplete="current-password"
              />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="new-pw">New Password</label>
              <input
                id="new-pw"
                type="password"
                name="newPassword"
                className="form-input"
                placeholder="At least 8 characters"
                value={pwForm.newPassword}
                onChange={handlePwChange}
                required
                autoComplete="new-password"
              />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="confirm-new-pw">Confirm New Password</label>
              <input
                id="confirm-new-pw"
                type="password"
                name="confirmNewPassword"
                className="form-input"
                placeholder="Repeat new password"
                value={pwForm.confirmNewPassword}
                onChange={handlePwChange}
                required
                autoComplete="new-password"
              />
            </div>
            <button type="submit" className="btn btn-primary" disabled={pwLoading}>
              {pwLoading ? 'Updating…' : 'Update Password'}
            </button>
          </form>
        </div>
      </div>

      {/* ─ Danger zone ─ */}
      <div className="danger-zone" style={{ marginTop: '32px', maxWidth: '960px' }}>
        <h2 className="section-title">Danger Zone</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '20px', fontSize: '0.9rem' }}>
          Permanently delete your account and all associated data. This action cannot be undone.
        </p>
        {deleteMsg && <div className="alert alert-error" style={{ marginBottom: '16px' }}>{deleteMsg}</div>}
        <button className="btn btn-danger" onClick={handleDeleteAccount} disabled={deleteLoading}>
          {deleteLoading ? 'Deleting…' : '🗑 Delete My Account'}
        </button>
      </div>
    </div>
  );
};

export default Profile;
