import React, { useEffect, useState } from 'react';
import { ordersAPI } from '../api';
import { useStore } from '../store';

function OrderHistory() {
  const { showNotification } = useStore();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await ordersAPI.getAll();
        setOrders(response.data.data);
      } catch (error) {
        console.error('Error fetching orders:', error);
        showNotification('error', 'Failed to load orders');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [showNotification]);

  const getStatusBadge = (status) => {
    const badgeClass = {
      completed: 'badge-success',
      pending: 'badge-warning',
      failed: 'badge-danger',
      cancelled: 'badge-danger',
    }[status] || 'badge-info';

    return <span className={`badge ${badgeClass}`}>{status.toUpperCase()}</span>;
  };

  const getPaymentBadge = (status) => {
    const badgeClass = {
      paid: 'badge-success',
      unpaid: 'badge-warning',
      failed: 'badge-danger',
    }[status] || 'badge-info';

    return <span className={`badge ${badgeClass}`}>{status.toUpperCase()}</span>;
  };

  const filteredOrders = orders.filter((order) => {
    if (filter === 'all') return true;
    return order.status === filter;
  });

  return (
    <div className="container">
      <div className="page-header">
        <h1 className="page-title">Order History</h1>
        <p className="page-subtitle">View and manage all your orders</p>
      </div>

      {/* Filters */}
      <div style={{ marginBottom: '2rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
        {['all', 'pending', 'completed', 'failed'].map((f) => (
          <button
            key={f}
            className={`btn ${filter === f ? 'btn-primary' : 'btn-outline'} btn-small`}
            onClick={() => setFilter(f)}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* Orders Table */}
      {loading ? (
        <div className="loading">
          <div className="spinner"></div>
        </div>
      ) : filteredOrders.length > 0 ? (
        <div className="card">
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Service</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Payment</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => (
                  <tr key={order._id}>
                    <td>
                      <span style={{ fontWeight: 600, color: 'var(--primary-color)' }}>
                        {order.orderId}
                      </span>
                    </td>
                    <td>{order.serviceDetails.name}</td>
                    <td>KES {order.amount.toLocaleString()}</td>
                    <td>{getStatusBadge(order.status)}</td>
                    <td>{getPaymentBadge(order.paymentStatus)}</td>
                    <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="card">
          <div className="empty-state">
            <div className="empty-state-icon">📭</div>
            <h3 className="empty-state-title">No Orders</h3>
            <p className="empty-state-text">You haven't placed any orders yet</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default OrderHistory;
