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
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 relative">
      <div className="absolute inset-0 bg-black opacity-60 z-0"></div>
      <form onSubmit={handleSubmit} className="relative z-10 bg-white/90 border border-gray-200 rounded-3xl shadow-2xl p-12 w-full max-w-md flex flex-col gap-7 backdrop-blur-md">
        <h2 className="text-3xl font-extrabold mb-4 text-center text-gray-900 drop-shadow">Admin Login</h2>
        <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" className="border border-gray-300 rounded-lg px-5 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400 text-lg" required />
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" className="border border-gray-300 rounded-lg px-5 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400 text-lg" required />
        <button type="submit" disabled={loading} className="bg-black text-white rounded-xl px-5 py-3 font-bold hover:bg-white hover:text-black border border-black transition-all text-lg shadow-md disabled:opacity-60 disabled:cursor-not-allowed">{loading ? 'Logging in...' : 'Login'}</button>
        <div className="flex justify-between text-sm mt-2">
          <Link to="/register" className="underline text-blue-600 hover:text-blue-800">Register</Link>
          <a href="#" className="underline text-blue-600 hover:text-blue-800">Forgot password?</a>
        </div>
      </form>
      {error && <Toast message={error} onClose={() => setError('')} />}
    </div>
  );
}
