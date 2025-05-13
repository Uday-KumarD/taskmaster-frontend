import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/users`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setUsers(response.data);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to fetch users');
    }
  };

  const handlePromote = async (userId) => {
    if (!confirm('Promote this user to Manager?')) return;
    try {
      await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/users/${userId}/promote`,
        {},
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      toast.success('User promoted to Manager');
      fetchUsers();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to promote user');
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="container-fluid py-5">
      <h1 className="mb-5 text-center" style={{ color: '#4F46E5' }}>Manage Users</h1>
      <div className="card shadow-lg p-4">
        <h3 className="mb-4">Registered Users</h3>
        <div className="table-responsive">
          <table className="table table-hover">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.length ? (
                users.map((user) => (
                  <tr key={user._id}>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.role}</td>
                    <td>
                      {user.role === 'User' && (
                        <button
                          className="btn btn-primary btn-sm"
                          style={{
                            background: 'linear-gradient(90deg, #4F46E5, #7C3AED)',
                            border: 'none',
                          }}
                          onClick={() => handlePromote(user._id)}
                        >
                          Promote to Manager
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="4" className="text-center">No users found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}