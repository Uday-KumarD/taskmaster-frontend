import { useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { toast } from 'react-toastify';

export default function TaskCard({ task, fetchTasks, socket }) {
  const user = useSelector((state) => state.auth.user);
  const isAdminOrManager = user?.role === 'Admin' || user?.role === 'Manager';
  const isAssignee = task.assignee?._id === user?._id;
  const [status, setStatus] = useState(task.status);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [editDescription, setEditDescription] = useState(task.description || '');
  const [editDueDate, setEditDueDate] = useState(new Date(task.dueDate).toISOString().split('T')[0]);
  const [editPriority, setEditPriority] = useState(task.priority);

  const handleStatusChange = async (newStatus) => {
    try {
      await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/tasks/${task._id}`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      setStatus(newStatus);
      toast.success('Task status updated');
      fetchTasks();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update status');
    }
  };

  const handleEdit = async () => {
    try {
      await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/tasks/${task._id}`,
        {
          title: editTitle,
          description: editDescription,
          dueDate: editDueDate,
          priority: editPriority,
        },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      toast.success('Task updated successfully');
      setIsEditing(false);
      fetchTasks();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update task');
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this task?')) return;
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/tasks/${task._id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      toast.success('Task deleted successfully');
      fetchTasks();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete task');
    }
  };

  return (
    <div className="col-md-4 mb-4">
      <div className="card shadow-lg h-100" style={{ borderRadius: '15px', background: 'linear-gradient(145deg, #ffffff, #e6e6e6)' }}>
        <div className="card-body">
          {isEditing ? (
            <>
              <div className="mb-3">
                <label htmlFor={`editTitle-${task._id}`} className="form-label">Title</label>
                <input
                  type="text"
                  className="form-control"
                  id={`editTitle-${task._id}`}
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor={`editDescription-${task._id}`} className="form-label">Description</label>
                <textarea
                  className="form-control"
                  id={`editDescription-${task._id}`}
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  rows="3"
                ></textarea>
              </div>
              <div className="mb-3">
                <label htmlFor={`editDueDate-${task._id}`} className="form-label">Due Date</label>
                <input
                  type="date"
                  className="form-control"
                  id={`editDueDate-${task._id}`}
                  value={editDueDate}
                  onChange={(e) => setEditDueDate(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor={`editPriority-${task._id}`} className="form-label">Priority</label>
                <select
                  className="form-select"
                  id={`editPriority-${task._id}`}
                  value={editPriority}
                  onChange={(e) => setEditPriority(e.target.value)}
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>
              <div className="d-flex gap-2">
                <button
                  className="btn btn-primary"
                  style={{
                    background: 'linear-gradient(90deg, #4F46E5, #7C3AED)',
                    border: 'none',
                  }}
                  onClick={handleEdit}
                >
                  Save
                </button>
                <button
                  className="btn btn-secondary"
                  style={{
                    background: 'linear-gradient(90deg, #6B7280, #9CA3AF)',
                    border: 'none',
                  }}
                  onClick={() => setIsEditing(false)}
                >
                  Cancel
                </button>
              </div>
            </>
          ) : (
            <>
              <h5 className="card-title" style={{ color: '#4F46E5' }}>{task.title}</h5>
              <p className="card-text">{task.description || 'No description'}</p>
              <p><strong>Due:</strong> {new Date(task.dueDate).toLocaleDateString()}</p>
              <p><strong>Priority:</strong> <span className={`badge ${task.priority === 'High' ? 'bg-danger' : task.priority === 'Medium' ? 'bg-warning' : 'bg-success'}`}>{task.priority}</span></p>
              <p><strong>Status:</strong> <span className={`badge ${status === 'Completed' ? 'bg-success' : status === 'In Progress' ? 'bg-info' : 'bg-secondary'}`}>{status}</span></p>
              <p><strong>Assigned To:</strong> {task.assignee?.name || 'Unassigned'}</p>
              <p><strong>Assigned By:</strong> {task.creator?.name || 'Unknown'}</p>
              {(isAssignee || isAdminOrManager) && (
                <div className="mb-3">
                  <label htmlFor={`status-${task._id}`} className="form-label">Update Status</label>
                  <select
                    className="form-select"
                    id={`status-${task._id}`}
                    value={status}
                    onChange={(e) => handleStatusChange(e.target.value)}
                  >
                    <option value="To Do">To Do</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
              )}
              {isAdminOrManager && (
                <div className="d-flex gap-2">
                  <button
                    className="btn btn-primary"
                    style={{
                      background: 'linear-gradient(90deg, #4F46E5, #7C3AED)',
                      border: 'none',
                      transition: 'transform 0.2s',
                    }}
                    onMouseEnter={(e) => (e.target.style.transform = 'scale(1.05)')}
                    onMouseLeave={(e) => (e.target.style.transform = 'scale(1)')}
                    onClick={() => setIsEditing(true)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-danger"
                    style={{
                      background: 'linear-gradient(90deg, #EF4444, #F87171)',
                      border: 'none',
                      transition: 'transform 0.2s',
                    }}
                    onMouseEnter={(e) => (e.target.style.transform = 'scale(1.05)')}
                    onMouseLeave={(e) => (e.target.style.transform = 'scale(1)')}
                    onClick={handleDelete}
                  >
                    Delete
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}