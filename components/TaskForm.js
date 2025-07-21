import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { toast } from 'react-toastify';

export default function TaskForm({ fetchTasks }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [assignee, setAssignee] = useState('');
  const [users, setUsers] = useState([]);
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/users`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setUsers(response.data);
      } catch (err) {
        console.error('Fetch users error:', {
          status: err.response?.status,
          message: err.response?.data?.message,
        });
        toast.error(err.response?.data?.message || 'Failed to fetch users');
      }
    };
    fetchUsers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/tasks`,
        { title, description, dueDate, priority, assignee },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      // console.log('Task created:', response.data); // Debug log
      toast.success('Task created successfully');
      setTitle('');
      setDescription('');
      setDueDate('');
      setPriority('Medium');
      setAssignee('');
      fetchTasks(); // Call handleTaskCreated to reset filters and fetch tasks
    } catch (err) {
      // console.error('Create task error:', {
      //   status: err.response?.status,
      //   message: err.response?.data?.message,
      //   data: err.response?.data,
      // });
      toast.error(err.response?.data?.message || 'Failed to create task');
    }
  };

  return (
    <div className="card shadow-lg p-4 mx-auto fade-in" style={{ maxWidth: '500px' }}>
      <h3 className="card-title text-center mb-4">Create Task</h3>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="title" className="form-label">Title</label>
          <input
            type="text"
            className="form-control"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            placeholder="Enter task title"
          />
        </div>
        <div className="mb-3">
          <label htmlFor="description" className="form-label">Description</label>
          <textarea
            className="form-control"
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter task description"
            rows="4"
          ></textarea>
        </div>
        <div className="mb-3">
          <label htmlFor="dueDate" className="form-label">Due Date</label>
          <input
            type="date"
            className="form-control"
            id="dueDate"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            required
            min={new Date().toISOString().split('T')[0]}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="priority" className="form-label">Priority</label>
          <select
            className="form-select"
            id="priority"
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>
        <div className="mb-3">
          <label htmlFor="assignee" className="form-label">Assignee</label>
          <select
            className="form-select"
            id="assignee"
            value={assignee}
            onChange={(e) => setAssignee(e.target.value)}
          >
            <option value="">Unassigned</option>
            {users.length > 0 ? (
              users
                .filter((u) => u._id !== user?._id)
                .map((u) => (
                  <option key={u._id} value={u._id}>{u.name} ({u.role})</option>
                ))
            ) : (
              <option disabled>No users available</option>
            )}
          </select>
        </div>
        <button
          type="submit"
          className="btn btn-primary w-100"
        >
          Create Task
        </button>
      </form>
    </div>
  );
}