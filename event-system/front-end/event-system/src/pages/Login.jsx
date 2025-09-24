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
    <div 
      className="fixed inset-0 flex items-center justify-center bg-gray-100 z-50 overflow-hidden"
      style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh' }}
    >
      <form 
        onSubmit={handleSubmit} 
        className="bg-white border border-gray-300 rounded-3xl p-8 w-full max-w-md flex flex-col gap-6 shadow-xl"
      >
        <h2 className="text-2xl font-bold text-center text-gray-900">Admin Login</h2>
        
        <input 
          type="email" 
          value={email} 
          onChange={e => setEmail(e.target.value)} 
          placeholder="Email" 
          className="border border-gray-400 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gray-700 w-full bg-gray-50 text-gray-900" 
          required 
        />

        <input 
          type="password" 
          value={password} 
          onChange={e => setPassword(e.target.value)} 
          placeholder="Password" 
          className="border border-gray-400 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gray-700 w-full bg-gray-50 text-gray-900" 
          required 
        />

        <button 
          type="submit" 
          disabled={loading} 
          className="bg-gray-900 text-white rounded-lg px-4 py-3 font-semibold hover:bg-black transition-colors disabled:opacity-60 disabled:cursor-not-allowed w-full"
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>

        <div className="flex justify-between text-sm mt-2 text-gray-700">
          <Link to="/register" className="hover:underline">Register</Link>
          <a href="#" className="hover:underline">Forgot password?</a>
        </div>
      </form>

      {error && <Toast message={error} onClose={() => setError('')} />}
    </div>
  );
}
