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
    <div className="card p-4 shadow">
      <h3>Users</h3>
      <ul className="list-group">
        {users.map((user) => (
          <li key={user._id} className="list-group-item">{user.name} ({user.role}) - {user.email}</li>
        ))}
      </ul>
    </div>
  );
}