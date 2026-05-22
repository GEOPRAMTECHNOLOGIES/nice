import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { adminAPI } from '../../api';
import { useStore } from '../../store';

function AdminDashboard() {
  const { showNotification } = useStore();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await adminAPI.getDashboardStats();
        setStats(response.data.data);
      } catch (error) {
        console.error('Error fetching stats:', error);
        showNotification('error', 'Failed to load dashboard stats');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [showNotification]);

  if (loading) {
    return (
      <div className="container">
        <div className="loading">
          <div className="spinner"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="page-header">
        <h1 className="page-title">Admin Dashboard</h1>
        <p className="page-subtitle">Manage orders and services</p>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon primary">📋</div>
            <div className="stat-content">
              <h3>Total Orders</h3>
              <p>{stats.totalOrders}</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon success">✅</div>
            <div className="stat-content">
              <h3>Completed</h3>
              <p>{stats.completedOrders}</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon warning">💳</div>
            <div className="stat-content">
              <h3>Paid Orders</h3>
              <p>{stats.paidOrders}</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon danger">❌</div>
            <div className="stat-content">
              <h3>Failed</h3>
              <p>{stats.failedOrders}</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon primary">💰</div>
            <div className="stat-content">
              <h3>Total Revenue</h3>
              <p>KES {stats.totalRevenue.toLocaleString()}</p>
            </div>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div style={{ marginBottom: '2rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
        <Link to="/admin/orders" className="btn btn-primary btn-large">
          View All Orders
        </Link>
        <Link to="/admin/services" className="btn btn-secondary btn-large">
          Manage Services
        </Link>
      </div>

      {/* Recent Orders */}
      {stats && stats.recentOrders && (
        <div className="card">
          <div className="card-header">
            <h3 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Recent Orders</h3>
          </div>
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Service</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentOrders.map((order) => (
                  <tr key={order._id}>
                    <td>
                      <span style={{ fontWeight: 600, color: 'var(--primary-color)' }}>
                        {order.orderId}
                      </span>
                    </td>
                    <td>
                      <div>
                        <p style={{ fontWeight: 600 }}>{order.user?.name}</p>
                        <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                          {order.user?.email}
                        </p>
                      </div>
                    </td>
                    <td>{order.service?.name}</td>
                    <td>KES {order.amount.toLocaleString()}</td>
                    <td>
                      <span
                        className={`badge ${
                          order.status === 'completed'
                            ? 'badge-success'
                            : order.status === 'pending'
                            ? 'badge-warning'
                            : 'badge-danger'
                        }`}
                      >
                        {order.status.toUpperCase()}
                      </span>
                    </td>
                    <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;
