import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

export default function UserList() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/users`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setUsers(response.data);
      } catch (err) {
        toast.error('Failed to fetch users');
      }
    };
    fetchUsers();
  }, []);

  return (
    <div className="container-fluid py-4">
      <h3 className="mb-4 text-center">Users</h3>
      <div className="row g-3">
        {users.length ? (
          users.map((user) => (
            <div key={user._id} className="col-12 col-md-6 col-lg-4 fade-in">
              <div className="card shadow-lg p-3">
                <h5>{user.name}</h5>
                <p className="mb-1"><strong>Role:</strong> {user.role}</p>
                <p className="mb-0"><strong>Email:</strong> {user.email}</p>
              </div>
            </div>
          ))
        ) : (
          <div className="col-12 text-center">No users found</div>
        )}
      </div>
    </div>
  );
}