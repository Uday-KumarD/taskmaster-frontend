import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/router';
import axios from 'axios';
import { toast } from 'react-toastify';
import { setUser } from '../store/slices/authSlice';
import Link from 'next/link';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
        email,
        password,
      });
      localStorage.setItem('token', response.data.token);
      dispatch(setUser(response.data.user));
      toast.success('Login successful');
      router.push('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="container-fluid d-flex align-items-center justify-content-center min-vh-100 login-page">
      <div className="card shadow-lg p-4" style={{ maxWidth: '400px', width: '100%', borderRadius: '15px', background: 'linear-gradient(145deg, #ffffff, #e6e6e6)' }}>
        <h2 className="text-center mb-4" style={{ color: '#4F46E5' }}>Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">Email</label>
            <input
              type="email"
              className="form-control"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Enter your email"
            />
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Enter your password"
            />
          </div>
          <button
            type="submit"
            className="btn btn-primary w-100"
            style={{
              background: 'linear-gradient(90deg, #4F46E5, #7C3AED)',
              border: 'none',
              transition: 'transform 0.2s',
            }}
            onMouseEnter={(e) => (e.target.style.transform = 'scale(1.05)')}
            onMouseLeave={(e) => (e.target.style.transform = 'scale(1)')}
          >
            Login
          </button>
        </form>
        <p className="text-center mt-3">
          Don't have an account? <Link href="/register">Register</Link>
        </p>
      </div>
    </div>
  );
}