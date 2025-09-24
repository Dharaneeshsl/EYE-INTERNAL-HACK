// Login.jsx

import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login as loginApi } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Toast from '../components/common/Toast';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await loginApi(email, password);
      login(res.token, res.user);
      navigate('/dashboard');
    } catch (err) {
      setError('Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <form onSubmit={handleSubmit} className="bg-white border border-black rounded-2xl shadow-lg p-10 w-full max-w-md flex flex-col gap-6">
        <h2 className="text-2xl font-bold mb-2 text-center">Admin Login</h2>
        <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" className="border border-black rounded px-4 py-2 focus:outline-none" required />
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" className="border border-black rounded px-4 py-2 focus:outline-none" required />
        <button type="submit" disabled={loading} className="bg-black text-white rounded-2xl px-4 py-2 font-semibold hover:bg-white hover:text-black border border-black transition-all">{loading ? 'Logging in...' : 'Login'}</button>
        <div className="flex justify-between text-sm mt-2">
          <Link to="/register" className="underline">Register</Link>
          <a href="#" className="underline">Forgot password?</a>
        </div>
      </form>
      {error && <Toast message={error} onClose={() => setError('')} />}
    </div>
  );
}
