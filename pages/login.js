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
    const requestBody = {
      email: email.toLowerCase().trim(),
      password: password.trim()
    };
    // console.log('Login request body:', requestBody);
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, requestBody, {
        headers: { 'Content-Type': 'application/json' }
      });
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      dispatch(setUser(user));
      toast.success('Login successful');
      // console.log('Login successful:', { token, user });
      router.push('/');
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Login failed';
      // console.error('Login error:', {
      //   message: errorMessage,
      //   status: err.response?.status,
      //   data: err.response?.data
      // });
      toast.error(errorMessage);
    }
  };

  return (
    <div className="container-fluid d-flex align-items-center justify-content-center min-vh-100 login-page">
      <div className="card shadow-lg p-4" style={{ maxWidth: '400px', width: '100%', borderRadius: '15px' }}>
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
              transition: 'transform 0.2s'
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