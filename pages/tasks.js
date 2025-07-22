import { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { toast } from 'react-toastify';
import TaskCard from '../components/TaskCard';
import debounce from 'lodash/debounce'; // Added for debouncing

export default function Tasks({ socket }) {
  const [tasks, setTasks] = useState([]);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [priority, setPriority] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [isLoading, setIsLoading] = useState(false); // Added loading state
  const user = useSelector((state) => state.auth.user);

  const fetchTasks = useCallback(async (retryCount = 0) => {
    setIsLoading(true);
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
    } finally {
      setIsLoading(false);
    }
  }, [search, status, priority, dueDate, user]);

  // Debounced input handlers
  const debouncedSetSearch = useCallback(debounce((value) => setSearch(value), 300), []);
  const debouncedSetStatus = useCallback(debounce((value) => setStatus(value), 300), []);
  const debouncedSetPriority = useCallback(debounce((value) => setPriority(value), 300), []);
  const debouncedSetDueDate = useCallback(debounce((value) => setDueDate(value), 300), []);

  useEffect(() => {
    if (user) fetchTasks();
  }, [fetchTasks, user]);

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

  if (!user) return <div className="text-center mt-5 fade-in">Loading...</div>;

  return (
    <div className="container-fluid py-4">
      <h1 className="mt-5 text-center">My Tasks</h1>
      <div className="card shadow-lg p-4 mb-5">
        <div className="row g-3 mb-4">
          <div className="col-12 col-md-6 col-lg-3">
            <input
              type="text"
              className="form-control"
              placeholder="Search by title or description..."
              value={search}
              onChange={(e) => debouncedSetSearch(e.target.value)}
            />
          </div>
          <div className="col-12 col-md-6 col-lg-3">
            <select className="form-select" value={status} onChange={(e) => debouncedSetStatus(e.target.value)}>
              <option value="">All Statuses</option>
              <option value="To Do">To Do</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
          <div className="col-12 col-md-6 col-lg-3">
            <select className="form-select" value={priority} onChange={(e) => debouncedSetPriority(e.target.value)}>
              <option value="">All Priorities</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>
          <div className="col-12 col-md-6 col-lg-3">
            <input
              type="date"
              className="form-control"
              value={dueDate}
              onChange={(e) => debouncedSetDueDate(e.target.value)}
            />
          </div>
        </div>
        {isLoading ? (
          <div className="text-center">Loading tasks...</div>
        ) : (
          <div className="row">
            {tasks.length ? (
              tasks.map((task) => (
                <TaskCard key={task._id} task={task} fetchTasks={fetchTasks} socket={socket} />
              ))
            ) : (
              <div className="col-12 text-center">No tasks assigned to you</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}