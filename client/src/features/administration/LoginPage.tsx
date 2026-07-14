import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import apiClient from '../../api/apiClient';
import './LoginPage.css';

export default function LoginPage() {
  const [apiKey, setApiKey] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!apiKey.trim()) {
      setError('Моля, въведете API ключ');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Test the key by making a request to an admin endpoint
      await apiClient.get('/api/admin/verify', {
        headers: { Authorization: `Bearer ${apiKey}` },
      });
      login(apiKey);
      navigate('/admin');
    } catch {
      setError('Невалиден API ключ. Моля, опитайте отново.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page" id="admin-login-page">
      <div className="login-card glass-card animate-fade-in-up">
        <div className="login-header">
          <div className="login-icon">🔐</div>
          <h1 className="login-title">Администраторски достъп</h1>
          <p className="login-subtitle">Въведете вашия API ключ, за да продължите</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form" id="admin-login-form">
          <div className="form-group">
            <label className="form-label" htmlFor="api-key-input">API ключ</label>
            <input
              id="api-key-input"
              type="password"
              className="form-input"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Въведете вашия API ключ"
              autoFocus
            />
            {error && <p className="form-error">{error}</p>}
          </div>

          <button
            type="submit"
            className="btn btn-primary login-btn"
            disabled={loading}
            id="admin-login-submit"
          >
            {loading ? 'Проверка...' : 'Вход'}
          </button>
        </form>
      </div>
    </div>
  );
}
