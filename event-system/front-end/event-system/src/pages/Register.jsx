import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { register as registerApi } from '../services/api';
import Toast from '../components/common/Toast';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (password !== confirm) {
      setError('Passwords do not match');
      return;
    }
    setLoading(true);
    try {
      await registerApi(name, email, password);
      setSuccess('Registration successful! Redirecting...');
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      setError('Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-indigo-900">
      <form 
        onSubmit={handleSubmit} 
        className="bg-white/95 rounded-xl shadow-lg p-10 w-full max-w-xl flex flex-col gap-6"
      >
        <h2 className="text-4xl font-bold text-center text-gray-800 mb-6">Create Account</h2>
        <input 
          type="text" 
          value={name} 
          onChange={e => setName(e.target.value)} 
          placeholder="Name" 
          className="w-full border border-gray-300 rounded-lg px-6 py-4 text-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors duration-200" 
          required 
        />
        <input 
          type="email" 
          value={email} 
          onChange={e => setEmail(e.target.value)} 
          placeholder="Email" 
          className="w-full border border-gray-300 rounded-lg px-6 py-4 text-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors duration-200" 
          required 
        />
        <input 
          type="password" 
          value={password} 
          onChange={e => setPassword(e.target.value)} 
          placeholder="Password" 
          className="w-full border border-gray-300 rounded-lg px-6 py-4 text-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors duration-200" 
          required 
        />
        <input 
          type="password" 
          value={confirm} 
          onChange={e => setConfirm(e.target.value)} 
          placeholder="Confirm Password" 
          className="w-full border border-gray-300 rounded-lg px-6 py-4 text-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors duration-200" 
          required 
        />
        <button 
          type="submit" 
          disabled={loading} 
          className="w-full bg-indigo-600 text-white rounded-lg px-6 py-4 text-lg font-semibold hover:bg-indigo-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Registering...' : 'Sign Up'}
        </button>
        <div className="text-center text-base mt-4">
          <Link to="/login" className="text-indigo-600 hover:text-indigo-800 transition-colors duration-200">
            Already have an account? Sign In
          </Link>
        </div>
      </form>
      {error && <Toast message={error} onClose={() => setError('')} />}
      {success && <Toast message={success} onClose={() => setSuccess('')} />}
    </div>
  );
}