import { useSelector } from 'react-redux';

export default function Profile() {
  const user = useSelector((state) => state.auth.user);

  if (!user) return <div className="text-center mt-5">Loading...</div>;

  return (
    <div className="container-fluid py-5">
      <h1 className="mb-5 text-center" style={{ color: '#4F46E5' }}>Profile</h1>
      <div className="card shadow-lg p-4 mx-auto" style={{ maxWidth: '500px', borderRadius: '15px', background: 'linear-gradient(145deg, #ffffff, #e6e6e6)' }}>
        <h3 className="mb-4">User Profile</h3>
        <p><strong>Name:</strong> {user.name}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Role:</strong> {user.role}</p>
      </div>
    </div>
  );
}