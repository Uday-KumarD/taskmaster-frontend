import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { toast } from 'react-toastify';
import TaskCard from '../components/TaskCard';

export default function Home({ socket }) {
  const user = useSelector((state) => state.auth.user);
  const [newTasks, setNewTasks] = useState([]);
  const [viewedTasks, setViewedTasks] = useState(() => {
    if (typeof window !== 'undefined') {
      return JSON.parse(localStorage.getItem(`viewedTasks_${user?._id}`)) || [];
    }
    return [];
  });

  const fetchNewTasks = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/tasks`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      const assignedTasks = response.data.filter((task) => task.assignee?._id === user._id);
      setNewTasks(assignedTasks.filter((task) => !viewedTasks.includes(task._id)));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to fetch tasks');
    }
  };

  useEffect(() => {
    if (user) fetchNewTasks();
  }, [user]);

  useEffect(() => {
    if (socket) {
      socket.on('taskAssigned', ({ taskId, title, assignedBy }) => {
        setNewTasks((prev) => [...prev, { _id: taskId, title, creator: { name: assignedBy } }]);
        toast.info(`New task assigned: ${title}`);
      });
      socket.on('taskDeleted', ({ taskId }) => {
        setNewTasks((prev) => prev.filter((task) => task._id !== taskId));
      });
      return () => {
        socket.off('taskAssigned');
        socket.off('taskDeleted');
      };
    }
  }, [socket]);

  useEffect(() => {
    if (newTasks.length > 0) {
      const taskIds = newTasks.map((task) => task._id);
      setViewedTasks((prev) => [...new Set([...prev, ...taskIds])]);
      localStorage.setItem(`viewedTasks_${user?._id}`, JSON.stringify([...new Set([...viewedTasks, ...taskIds])]));
    }
  }, [newTasks]);

  if (!user) return <div className="text-center mt-5 fade-in">Loading...</div>;

  return (
    <div className="container-fluid py-4">
      <h1 className="mb-4 text-center">Welcome, {user.name}</h1>
      <div className="card shadow-lg p-4">
        <h3 className="mb-4">New Assigned Tasks</h3>
        <div className="row">
          {newTasks.length ? (
            newTasks.map((task) => (
              <TaskCard key={task._id} task={task} fetchTasks={fetchNewTasks} socket={socket} />
            ))
          ) : (
            <div className="col-12 text-center">No new tasks assigned to you</div>
          )}
        </div>
      </div>
    </div>
  );
}