import { useState } from 'react';
import type { FormEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../app/store';
import { login } from '../features/auth/authSlice';
import type { User } from '../features/auth/authSlice';
import { Link, useNavigate } from 'react-router-dom';

export default function Login() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { loading, error } = useSelector((s: RootState) => s.auth);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const res = await dispatch(login({ email, password }));
    if ((res as any).meta.requestStatus === 'fulfilled') {
      const userId = (res as any).payload.user.id as User['id'];
      navigate(`/profile/${userId}`);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form onSubmit={onSubmit} className="w-full max-w-sm bg-white p-6 rounded shadow">
        <h1 className="text-2xl font-semibold mb-4">Login</h1>
        {error && <p className="text-red-600 mb-2 text-sm">{error}</p>}
        <label className="block text-sm mb-1">Email</label>
        <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" className="w-full border rounded px-3 py-2 mb-3" required />
        <label className="block text-sm mb-1">Password</label>
        <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" className="w-full border rounded px-3 py-2 mb-4" required />
        <button disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded">
          {loading ? 'Signing in...' : 'Sign In'}
        </button>
        <p className="mt-3 text-sm">
          No account? <Link to="/register" className="text-blue-600">Register</Link>
        </p>
      </form>
    </div>
  );
}

