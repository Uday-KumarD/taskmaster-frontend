import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

export default function NotificationBell({ socket }) {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    socket.on('taskAssigned', ({ taskId, title, assignedBy }) => {
      setNotifications((prev) => [{ taskId, title, assignedBy }, ...prev.slice(0, 4)]);
      toast.info(`New task assigned: ${title}`);
    });
    socket.on('taskDeleted', ({ taskId }) => {
      setNotifications((prev) => prev.filter((notif) => notif.taskId !== taskId));
    });
    return () => {
      socket.off('taskAssigned');
      socket.off('taskDeleted');
    };
  }, [socket]);

  return (
    <div className="nav-item dropdown">
      <a
        className="nav-link position-relative"
        href="#"
        role="button"
        data-bs-toggle="dropdown"
        aria-expanded="false"
        style={{ pointerEvents: 'auto' }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          fill="#ffffff"
          className="bi bi-bell-fill"
          viewBox="0 0 16 16"
        >
          <path d="M8 16a2 2 0 0 0 2-2H6a2 2 0 0 0 2 2zm.995-14.901a1 1 0 1 0-1.99 0A5.002 5.002 0 0 0 3 6c0 .55.087 1.086.245 1.6L2.5 9.5a.5.5 0 0 0 .5.866l1.528-.305A5.008 5.008 0 0 0 8 11c1.38 0 2.628-.563 3.528-1.47l1.528.305a.5.5 0 0 0 .5-.866l-.745-1.9A5.008 5.008 0 0 0 13 6a5.002 5.002 0 0 0-4.005-4.901z"/>
        </svg>
        {notifications.length > 0 && (
          <span className="badge bg-danger position-absolute top-0 start-100 translate-middle rounded-pill">
            {notifications.length}
          </span>
        )}
      </a>
      <ul className="dropdown-menu dropdown-menu-end notification-dropdown" style={{ maxHeight: '300px', overflowY: 'auto', minWidth: '300px', maxWidth: '400px', right: 0, transform: 'translateX(-10px)' }}>
        {notifications.length ? (
          notifications.map((notif, index) => (
            <li key={index} className="dropdown-item">
              <strong>{notif.title}</strong><br />
              <small>Assigned by {notif.assignedBy}</small>
            </li>
          ))
        ) : (
          <li className="dropdown-item">No new notifications</li>
        )}
      </ul>
    </div>
  );
}