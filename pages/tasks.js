import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { toast } from 'react-toastify';
import TaskCard from '../components/TaskCard';

export default function Tasks({ socket }) {
  const [tasks, setTasks] = useState([]);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [priority, setPriority] = useState('');
  const [dueDate, setDueDate] = useState('');
  const user = useSelector((state) => state.auth.user);

  const fetchTasks = async (retryCount = 0) => {
    try {
      const params = { search, status, priority, dueDate };
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/tasks`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        params,
      });
      setTasks(response.data.filter((task) => task.assignee?._id === user._id));
    } catch (err) {
      if (err.response?.status === 403) {
        toast.error('Access denied');
        return;
      }
      if (retryCount < 3) {
        setTimeout(() => fetchTasks(retryCount + 1), 1000 * (retryCount + 1));
      } else {
        toast.error(err.response?.data?.message || 'Failed to fetch tasks');
        setTasks([]);
      }
    }
  };

  useEffect(() => {
    if (user) fetchTasks();
  }, [search, status, priority, dueDate, user]);

  useEffect(() => {
    if (socket) {
      socket.on('taskDeleted', ({ taskId }) => {
        setTasks((prev) => prev.filter((task) => task._id !== taskId));
        toast.info('Task deleted');
      });
      return () => {
        socket.off('taskDeleted');
      };
    }
  }, [socket]);

  if (!user) return <div className="text-center mt-5">Loading...</div>;

  return (
    <div className="container-fluid py-5">
      <h1 className="mb-5 text-center" style={{ color: '#4F46E5' }}>My Tasks</h1>
      <div className="card shadow-lg p-4 mb-5">
        <div className="row g-3 mb-4">
          <div className="col-md-3">
            <input
              type="text"
              className="form-control"
              placeholder="Search by title or description..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="col-md-3">
            <select className="form-select" value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="">All Statuses</option>
              <option value="To Do">To Do</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
          <div className="col-md-3">
            <select className="form-select" value={priority} onChange={(e) => setPriority(e.target.value)}>
              <option value="">All Priorities</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>
          <div className="col-md-3">
            <input
              type="date"
              className="form-control"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </div>
        </div>
        <div className="row">
          {tasks.length ? (
            tasks.map((task) => (
              <TaskCard key={task._id} task={task} fetchTasks={fetchTasks} socket={socket} />
            ))
          ) : (
            <div className="col-12 text-center">No tasks assigned to you</div>
          )}
        </div>
      </div>
    </div>
  );
}