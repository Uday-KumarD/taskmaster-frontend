import { useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { toast } from 'react-toastify';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(password)) {
      return toast.error('Password must be 8+ characters with uppercase, lowercase, number, and special character');
    }
    if (!role) {
      return toast.error('Please select a role');
    }
    const requestBody = {
      name,
      email: email.toLowerCase().trim(),
      password: password.trim(),
      role
    };
    console.log('Register request body:', requestBody);
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, requestBody, {
        headers: { 'Content-Type': 'application/json' }
      });
      toast.success('Registration successful, please log in');
      console.log('Registration successful:', response.data);
      router.push('/login');
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Registration failed';
      console.error('Registration error:', {
        message: errorMessage,
        status: err.response?.status,
        data: err.response?.data
      });
      toast.error(errorMessage);
    }
  };

  return (
    <div className="container-fluid d-flex align-items-center justify-content-center min-vh-100 register-page">
      <div className="card shadow-lg p-4" style={{ maxWidth: '400px', width: '100%', borderRadius: '15px' }}>
        <h2 className="text-center mb-4" style={{ color: '#4F46E5' }}>Register</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="name" className="form-label">Name</label>
            <input
              type="text"
              className="form-control"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="Enter your name"
            />
          </div>
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
          <div className="mb-3">
            <label htmlFor="role" className="form-label">Role</label>
            <select
              className="form-control"
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              required
            >
              <option value="">Select a role</option>
              <option value="Admin">Admin</option>
              <option value="Manager">Manager</option>
              <option value="User">User</option>
            </select>
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
            Register
          </button>
        </form>
        <div className="text-center mt-3">
          <a href="/login" className="text-primary">Already have an account? Login</a>
        </div>
      </div>
    </div>
  );
}