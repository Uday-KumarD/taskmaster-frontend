import { useEffect, useState } from 'react';
import { Provider } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import axios from 'axios';
import io from 'socket.io-client';
import { useRouter } from 'next/router';
import store from '../store';
import { setUser } from '../store/slices/authSlice';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.css';
import '../styles/globals.css';

export default function MyApp({ Component, pageProps }) {
  const [socket, setSocket] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  useEffect(() => {
    import('bootstrap/dist/js/bootstrap.bundle.min.js');
    const newSocket = io(process.env.NEXT_PUBLIC_SOCKET_URL, { autoConnect: false });
    setSocket(newSocket);
    return () => newSocket.disconnect();
  }, []);

  useEffect(() => {
    const verifyUser = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          store.dispatch(setUser(response.data));
          setIsAuthenticated(true);
          socket?.connect();
          socket?.emit('join', response.data._id);
        } else {
          throw new Error('No token');
        }
      } catch (err) {
        localStorage.removeItem('token');
        store.dispatch(setUser(null));
        setIsAuthenticated(false);
        if (router.pathname !== '/login' && router.pathname !== '/register') {
          router.push('/login');
        }
      }
    };
    verifyUser();
  }, [socket, router]);

  if (!store) {
    return <div>Error: Redux store not initialized</div>;
  }

  return (
    <Provider store={store}>
      <div className="d-flex flex-column min-vh-100">
        {isAuthenticated && (
          <>
            <Navbar toggleSidebar={toggleSidebar} socket={socket} />
            <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
          </>
        )}
        <main
          className="flex-grow-1"
          style={{
            marginTop: isAuthenticated ? '56px' : '0',
            marginLeft: isAuthenticated ? (isSidebarOpen ? '250px' : '60px') : '0',
            transition: 'margin-left 0.3s ease',
          }}
        >
          <Component {...pageProps} socket={socket} />
        </main>
        <ToastContainer position="top-right" autoClose={3000} />
      </div>
    </Provider>
  );
}