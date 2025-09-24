// Register.jsx

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
    <div className="flex items-center justify-center min-h-screen bg-white">
      <form onSubmit={handleSubmit} className="bg-white border border-black rounded-2xl shadow-lg p-10 w-full max-w-md flex flex-col gap-6">
        <h2 className="text-2xl font-bold mb-2 text-center">Register</h2>
        <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Name" className="border border-black rounded px-4 py-2 focus:outline-none" required />
        <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" className="border border-black rounded px-4 py-2 focus:outline-none" required />
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" className="border border-black rounded px-4 py-2 focus:outline-none" required />
        <input type="password" value={confirm} onChange={e => setConfirm(e.target.value)} placeholder="Confirm Password" className="border border-black rounded px-4 py-2 focus:outline-none" required />
        <button type="submit" disabled={loading} className="bg-black text-white rounded-2xl px-4 py-2 font-semibold hover:bg-white hover:text-black border border-black transition-all">{loading ? 'Registering...' : 'Sign Up'}</button>
        <div className="flex justify-between text-sm mt-2">
          <Link to="/login" className="underline">Back to Login</Link>
        </div>
      </form>
      {error && <Toast message={error} onClose={() => setError('')} />}
      {success && <Toast message={success} onClose={() => setSuccess('')} />}
    </div>
  );
}
