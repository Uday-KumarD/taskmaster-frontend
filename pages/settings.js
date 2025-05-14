import { useSelector } from 'react-redux';

export default function Settings() {
  const user = useSelector((state) => state.auth.user);

  if (!user) return <div className="text-center mt-5 fade-in">Loading...</div>;

  return (
    <div className="container-fluid py-4">
      <h1 className="mb-4 text-center">Settings</h1>
      <div className="card shadow-lg p-4 mx-auto fade-in" style={{ maxWidth: '500px' }}>
        <h3 className="mb-4">User Settings</h3>
        <p><strong>Name:</strong> {user.name}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Role:</strong> {user.role}</p>
        <p className="text-muted">Notification preferences and other settings coming soon!</p>
      </div>
    </div>
  );
}