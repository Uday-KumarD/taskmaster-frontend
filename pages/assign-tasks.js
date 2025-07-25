import { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { toast } from 'react-toastify';
import TaskForm from '../components/TaskForm';
import TaskCard from '../components/TaskCard';
import debounce from 'lodash/debounce'; // Added for debouncing

export default function AssignTasks({ socket }) {
  const [tasks, setTasks] = useState([]);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [priority, setPriority] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [isLoading, setIsLoading] = useState(false); // Added loading state
  const user = useSelector((state) => state.auth.user);
  const isAdminOrManager = user?.role === 'Admin' || user?.role === 'Manager';

  const fetchTasks = useCallback(async (retryCount = 0) => {
    setIsLoading(true);
    try {
      const params = { search, status, priority, dueDate };
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/tasks`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        params,
      });
      // console.log('Fetched tasks:', response.data); // Debug log
      const userTasks = response.data.filter((task) => task.creator?._id === user._id);
      setTasks(userTasks);
    } catch (err) {
      // console.error('Fetch tasks error:', {
      //   status: err.response?.status,
      //   message: err.response?.data?.message,
      //   data: err.response?.data,
      // });
      if (err.response?.status === 403) {
        toast.error('Access denied');
        return;
      }
      if (retryCount < 3) {
        setTimeout(() => fetchTasks(retryCount + 1), 2000 * (retryCount + 1));
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

  // Reset filters after task creation to avoid filtering out new tasks
  const handleTaskCreated = () => {
    setSearch('');
    setStatus('');
    setPriority('');
    setDueDate('');
    fetchTasks();
  };

  useEffect(() => {
    if (user && isAdminOrManager) fetchTasks();
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
  if (!isAdminOrManager) return <div className="text-center mt-5 fade-in">Access denied</div>;

  return (
    <div className="container-fluid py-4">
      <h1 className="mt-5 text-center">Assign Tasks</h1>
      <div className="row justify-content-center mb-5">
        <div className="col-12 col-md-8 col-lg-6">
          <TaskForm fetchTasks={handleTaskCreated} />
        </div>
      </div>
      <div className="card shadow-lg p-4">
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
              <div className="col-12 text-center">No tasks created by you</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}