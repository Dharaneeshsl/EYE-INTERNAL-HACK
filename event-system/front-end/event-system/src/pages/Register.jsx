import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { register as registerApi } from '../services/api';
import Toast from '../components/common/Toast';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
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

        <div className="relative w-full">
          <input 
            type={showPassword ? 'text' : 'password'} 
            value={password} 
            onChange={e => setPassword(e.target.value)} 
            placeholder="Password" 
            className="border border-gray-600 rounded-lg px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-gray-500 w-full bg-black text-white" 
            required 
          />
          <button
            type="button"
            onClick={() => setShowPassword(v => !v)}
            className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-300 hover:text-white"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path d="M3.53 2.47a.75.75 0 0 0-1.06 1.06l18 18a.75.75 0 1 0 1.06-1.06l-3.06-3.06A11.6 11.6 0 0 0 21.75 12C20.55 8.59 16.88 6 12 6c-1.6 0-3.12.28-4.49.8L3.53 2.47zM12 7.5c4.02 0 7.05 2.15 8.25 4.5-.56 1.13-1.55 2.24-2.82 3.1l-2.05-2.05a4.5 4.5 0 0 0-5.93-5.93L7.83 6.6C9.1 6.02 10.5 7.5 12 7.5z"/>
                <path d="M14.12 15.18 8.82 9.88A3 3 0 0 0 12 15a2.98 2.98 0 0 0 2.12.18z"/>
                <path d="M4.64 5.75 6.7 7.8C5.02 8.77 3.73 10.12 3 11.99 4.2 14.35 7.23 16.5 11.25 16.5c.83 0 1.62-.09 2.36-.27l1.74 1.74A11.83 11.83 0 0 1 11.25 18C6.37 18 2.7 15.41 1.5 12c.6-1.56 1.67-2.92 3.14-3.95z"/>
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path d="M12 6c-4.88 0-8.55 2.59-9.75 6 .6 1.56 1.67 2.92 3.14 3.95C7.77 17.98 9.98 18.75 12 18.75s4.23-.77 6.61-2.8C20.33 14.92 21.4 13.56 22 12c-1.2-3.41-4.87-6-10-6zm0 9a3 3 0 1 1 0-6 3 3 0 0 1 0 6z"/>
              </svg>
            )}
          </button>
        </div>

        <div className="relative w-full">
          <input 
            type={showConfirm ? 'text' : 'password'} 
            value={confirm} 
            onChange={e => setConfirm(e.target.value)} 
            placeholder="Confirm Password" 
            className="border border-gray-600 rounded-lg px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-gray-500 w-full bg-black text-white" 
            required 
          />
          <button
            type="button"
            onClick={() => setShowConfirm(v => !v)}
            className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-300 hover:text-white"
            aria-label={showConfirm ? 'Hide password' : 'Show password'}
          >
            {showConfirm ? (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path d="M3.53 2.47a.75.75 0 0 0-1.06 1.06l18 18a.75.75 0 1 0 1.06-1.06l-3.06-3.06A11.6 11.6 0 0 0 21.75 12C20.55 8.59 16.88 6 12 6c-1.6 0-3.12.28-4.49.8L3.53 2.47zM12 7.5c4.02 0 7.05 2.15 8.25 4.5-.56 1.13-1.55 2.24-2.82 3.1l-2.05-2.05a4.5 4.5 0 0 0-5.93-5.93L7.83 6.6C9.1 6.02 10.5 7.5 12 7.5z"/>
                <path d="M14.12 15.18 8.82 9.88A3 3 0 0 0 12 15a2.98 2.98 0 0 0 2.12.18z"/>
                <path d="M4.64 5.75 6.7 7.8C5.02 8.77 3.73 10.12 3 11.99 4.2 14.35 7.23 16.5 11.25 16.5c.83 0 1.62-.09 2.36-.27l1.74 1.74A11.83 11.83 0 0 1 11.25 18C6.37 18 2.7 15.41 1.5 12c.6-1.56 1.67-2.92 3.14-3.95z"/>
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path d="M12 6c-4.88 0-8.55 2.59-9.75 6 .6 1.56 1.67 2.92 3.14 3.95C7.77 17.98 9.98 18.75 12 18.75s4.23-.77 6.61-2.8C20.33 14.92 21.4 13.56 22 12c-1.2-3.41-4.87-6-10-6zm0 9a3 3 0 1 1 0-6 3 3 0 0 1 0 6z"/>
              </svg>
            )}
          </button>
        </div>

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