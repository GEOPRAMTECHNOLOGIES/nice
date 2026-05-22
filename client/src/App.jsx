import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useStore } from './store';
import { authAPI } from './api';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Services from './pages/Services';
import ServiceDetail from './pages/ServiceDetail';
import Checkout from './pages/Checkout';
import OrderHistory from './pages/OrderHistory';
import AdminDashboard from './pages/admin/Dashboard';
import AdminOrders from './pages/admin/Orders';
import AdminServices from './pages/admin/Services';
import NotFound from './pages/NotFound';

// Components
import Navbar from './components/Navbar';
import Notification from './components/Notification';

// Styles
import './styles/main.css';

const PrivateRoute = ({ children }) => {
  const { auth } = useStore();
  return auth.isAuthenticated ? children : <Navigate to="/login" />;
};

const AdminRoute = ({ children }) => {
  const { auth } = useStore();
  if (!auth.isAuthenticated) return <Navigate to="/login" />;
  if (auth.user?.role !== 'admin') return <Navigate to="/home" />;
  return children;
};

function App() {
  const { setUser, setAuthLoading } = useStore();
  const { auth } = useStore();

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        setAuthLoading(true);
        try {
          const response = await authAPI.getMe();
          setUser(response.data.data, token);
        } catch (error) {
          console.error('Auth error:', error);
          localStorage.removeItem('token');
        } finally {
          setAuthLoading(false);
        }
      }
    };

    initAuth();
  }, [setUser, setAuthLoading]);

  return (
    <BrowserRouter>
      {auth.isAuthenticated && <Navbar />}
      <Notification />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/"
          element={
            <PrivateRoute>
              <Home />
            </PrivateRoute>
          }
        />
        <Route
          path="/home"
          element={
            <PrivateRoute>
              <Home />
            </PrivateRoute>
          }
        />
        <Route
          path="/services"
          element={
            <PrivateRoute>
              <Services />
            </PrivateRoute>
          }
        />
        <Route
          path="/services/:id"
          element={
            <PrivateRoute>
              <ServiceDetail />
            </PrivateRoute>
          }
        />
        <Route
          path="/checkout/:serviceId"
          element={
            <PrivateRoute>
              <Checkout />
            </PrivateRoute>
          }
        />
        <Route
          path="/orders"
          element={
            <PrivateRoute>
              <OrderHistory />
            </PrivateRoute>
          }
        />

        {/* Admin Routes */}
        <Route
          path="/admin/dashboard"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/orders"
          element={
            <AdminRoute>
              <AdminOrders />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/services"
          element={
            <AdminRoute>
              <AdminServices />
            </AdminRoute>
          }
        />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
