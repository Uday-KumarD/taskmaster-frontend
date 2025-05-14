import Link from 'next/link';
import { useSelector } from 'react-redux';

export default function Sidebar({ isOpen, toggleSidebar }) {
  const user = useSelector((state) => state.auth.user);

  return (
    <div
      className={`sidebar d-flex flex-column ${isOpen ? 'open' : 'closed'}`}
      style={{
        width: isOpen ? '250px' : '60px',
        transition: 'width 0.3s ease',
        position: 'fixed',
        top: '56px',
        left: 0,
        height: 'calc(100vh - 56px)',
        zIndex: 1000,
        opacity: 1,
      }}
    >
      <div className="sidebar-header p-3 d-flex justify-content-between align-items-center">
        {isOpen && <h5 className="fw-bold mb-0 text-white">TaskMaster</h5>}
        <button
          className="btn btn-link text-white"
          onClick={toggleSidebar}
        >
          <i className={`bi ${isOpen ? 'bi-x' : 'bi-list'}`} style={{ fontSize: '1.5rem' }}></i>
        </button>
      </div>
      <div className="sidebar-body p-2 p-lg-3 flex-grow-1">
        <ul className="nav flex-column">
          <li className="nav-item mb-2">
            <Link href="/" className="nav-link d-flex align-items-center">
              <i className="bi bi-house me-2" style={{ fontSize: '1.2rem' }}></i>
              {isOpen && 'Home'}
            </Link>
          </li>
          <li className="nav-item mb-2">
            <Link href="/tasks" className="nav-link d-flex align-items-center">
              <i className="bi bi-list-task me-2" style={{ fontSize: '1.2rem' }}></i>
              {isOpen && 'Tasks'}
            </Link>
          </li>
          {(user?.role === 'Admin' || user?.role === 'Manager') && (
            <li className="nav-item mb-2">
              <Link href="/assign-tasks" className="nav-link d-flex align-items-center">
                <i className="bi bi-plus-square me-2" style={{ fontSize: '1.2rem' }}></i>
                {isOpen && 'Assign Tasks'}
              </Link>
            </li>
          )}
          <li className="nav-item mb-2">
            <Link href="/profile" className="nav-link d-flex align-items-center">
              <i className="bi bi-person me-2" style={{ fontSize: '1.2rem' }}></i>
              {isOpen && 'Profile'}
            </Link>
          </li>
          {user?.role === 'Admin' && (
            <li className="nav-item mb-2">
              <Link href="/admin/users" className="nav-link d-flex align-items-center">
                <i className="bi bi-people me-2" style={{ fontSize: '1.2rem' }}></i>
                {isOpen && 'Manage Users'}
              </Link>
            </li>
          )}
          <li className="nav-item mb-2">
            <Link href="/settings" className="nav-link d-flex align-items-center">
              <i className="bi bi-gear me-2" style={{ fontSize: '1.2rem' }}></i>
              {isOpen && 'Settings'}
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}