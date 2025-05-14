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
    <div className="container-fluid py-4">
      <h1 className="mb-4 text-center">Manage Users</h1>
      <div className="card shadow-lg p-4">
        <h3 className="mb-4">Registered Users</h3>
        {/* Table for larger screens */}
        <div className="table-responsive d-none d-md-block">
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
        {/* Card layout for mobile */}
        <div className="d-md-none">
          {users.length ? (
            users.map((user) => (
              <div key={user._id} className="card shadow-lg p-3 mb-3 fade-in">
                <h5>{user.name}</h5>
                <p className="mb-1"><strong>Email:</strong> {user.email}</p>
                <p className="mb-2"><strong>Role:</strong> {user.role}</p>
                {user.role === 'User' && (
                  <button
                    className="btn btn-primary w-100"
                    onClick={() => handlePromote(user._id)}
                  >
                    Promote to Manager
                  </button>
                )}
              </div>
            ))
          ) : (
            <div className="text-center">No users found</div>
          )}
        </div>
      </div>
    </div>
  );
}