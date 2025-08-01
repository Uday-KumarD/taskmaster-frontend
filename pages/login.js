import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/router';
import axios from 'axios';
import { toast } from 'react-toastify';
import { setUser } from '../store/slices/authSlice';
import Link from 'next/link';
import 'bootstrap-icons/font/bootstrap-icons.css';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
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
      const errorMessage = err.response?.data?.message || err.message || 'Login failed';
      console.error('Login error:', {
        message: errorMessage,
        status: err.response?.status,
        data: err.response?.data,
        error: err.message,
        code: err.code
      });
      toast.error(errorMessage);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
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
          <div className="mb-3 position-relative">
            <label htmlFor="password" className="form-label">Password</label>
            <div className="input-group">
              <input
                type={showPassword ? 'text' : 'password'}
                className="form-control"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Enter your password"
                style={{ paddingRight: '40px' }}
              />
              <button
                type="button"
                className="btn position-absolute end-0 top-50 translate-middle-y"
                style={{ background: 'none', border: 'none', zIndex: 10 }}
                onClick={togglePasswordVisibility}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                <i className={showPassword ? 'bi bi-eye-slash' : 'bi bi-eye'} style={{ fontSize: '1.2rem', color: '#4F46E5' }}></i>
              </button>
            </div>
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