import { useSelector, useDispatch } from 'react-redux';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import { setUser } from '../store/slices/authSlice';
import { useState, useEffect } from 'react';

export default function Navbar({ toggleSidebar, socket }) {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const router = useRouter();
  const [notificationCount, setNotificationCount] = useState(0);

  useEffect(() => {
    if (socket && user) {
      socket.on('newNotification', () => {
        setNotificationCount((prev) => prev + 1);
      });
      return () => {
        socket.off('newNotification');
      };
    }
  }, [socket, user]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    dispatch(setUser(null));
    socket.disconnect();
    toast.success('Logged out successfully');
    router.push('/login');
    setNotificationCount(0);
  };

  return (
    <nav className="navbar navbar-dark fixed-top shadow-sm">
      <div className="container-fluid">
        <div className="d-flex align-items-center">
          <button
            className="navbar-toggler me-2"
            type="button"
            onClick={toggleSidebar}
          >
            <span className="navbar-toggler-icon" style={{ filter: 'invert(1)' }}></span>
          </button>
          <Link href="/" className="navbar-brand fw-bold">
            TaskMaster
          </Link>
        </div>
        {user && (
          <ul className="navbar-nav d-flex flex-row align-items-center">
            <li className="nav-item me-3">
              <span className="nav-link fw-bold" style={{ textTransform: 'capitalize' }}>
                {user.name}
              </span>
            </li>
            <li className="nav-item me-3 position-relative">
              <i className="bi bi-bell" style={{ fontSize: '1.2rem', color: '#ffffff' }}></i>
              {notificationCount > 0 && (
                <span className="badge bg-danger rounded-circle position-absolute top-0 start-100 translate-middle">
                  {notificationCount}
                </span>
              )}
            </li>
            <li className="nav-item">
              <button
                className="btn btn-outline-light btn-sm"
                onClick={handleLogout}
              >
                Logout
              </button>
            </li>
          </ul>
        )}
      </div>
    </nav>
  );
}