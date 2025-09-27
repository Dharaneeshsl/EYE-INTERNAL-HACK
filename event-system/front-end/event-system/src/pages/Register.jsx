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
    <div 
      className="fixed inset-0 flex items-center justify-center bg-black z-50 overflow-hidden"
      style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh' }}
    >
      <form 
        onSubmit={handleSubmit} 
        className="bg-black border border-gray-700 rounded-3xl p-8 w-full max-w-md flex flex-col gap-6 shadow-xl text-white"
      >
        <h2 className="text-2xl font-bold text-center text-white">Create Account</h2>

        <input 
          type="text" 
          value={name} 
          onChange={e => setName(e.target.value)} 
          placeholder="Full Name" 
          className="border border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gray-500 w-full bg-black text-white" 
          required 
        />

        <input 
          type="email" 
          value={email} 
          onChange={e => setEmail(e.target.value)} 
          placeholder="Email" 
          className="border border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gray-500 w-full bg-black text-white" 
          required 
        />

        <input 
          type="password" 
          value={password} 
          onChange={e => setPassword(e.target.value)} 
          placeholder="Password" 
          className="border border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gray-500 w-full bg-black text-white" 
          required 
        />

        <input 
          type="password" 
          value={confirm} 
          onChange={e => setConfirm(e.target.value)} 
          placeholder="Confirm Password" 
          className="border border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gray-500 w-full bg-black text-white" 
          required 
        />

        <button 
          type="submit" 
          disabled={loading} 
          className="bg-white text-black rounded-lg px-4 py-3 font-semibold hover:bg-gray-200 transition-colors disabled:opacity-60 disabled:cursor-not-allowed w-full"
        >
          {loading ? 'Creating account...' : 'Create Account'}
        </button>

        <div className="flex justify-between text-sm mt-2 text-gray-300">
          <Link to="/login" className="hover:underline">Sign In</Link>
          <a href="#" className="hover:underline">Need help?</a>
        </div>
      </form>

      {error && <Toast message={error} onClose={() => setError('')} />}
      {success && <Toast message={success} onClose={() => setSuccess('')} />}
    </div>
  );
}