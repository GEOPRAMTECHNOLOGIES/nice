import React, { useEffect, useState } from 'react';
import { adminAPI } from '../../api';
import { useStore } from '../../store';

function AdminOrders() {
  const { showNotification } = useStore();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: '',
    paymentStatus: '',
  });
  const [editingId, setEditingId] = useState(null);
  const [editStatus, setEditStatus] = useState('');
  const [editNotes, setEditNotes] = useState('');

  useEffect(() => {
    fetchOrders();
  }, [filters]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await adminAPI.getAllOrders(filters);
      setOrders(response.data.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
      showNotification('error', 'Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (orderId) => {
    try {
      await adminAPI.updateOrderStatus(orderId, {
        status: editStatus,
        notes: editNotes,
      });
      showNotification('success', 'Order updated successfully');
      setEditingId(null);
      fetchOrders();
    } catch (error) {
      console.error('Error updating order:', error);
      showNotification('error', 'Failed to update order');
    }
  };

  const startEdit = (order) => {
    setEditingId(order._id);
    setEditStatus(order.status);
    setEditNotes(order.notes || '');
  };

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

  return (
    <div className="container">
      <div className="page-header">
        <h1 className="page-title">Orders Management</h1>
        <p className="page-subtitle">View and manage all customer orders</p>
      </div>

      {/* Filters */}
      <div style={{ marginBottom: '2rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
        <div className="form-group">
          <label className="form-label">Filter by Status</label>
          <select
            className="form-select"
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
          >
            <option value="">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
            <option value="failed">Failed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">Filter by Payment</label>
          <select
            className="form-select"
            value={filters.paymentStatus}
            onChange={(e) => setFilters({ ...filters, paymentStatus: e.target.value })}
          >
            <option value="">All Payments</option>
            <option value="paid">Paid</option>
            <option value="unpaid">Unpaid</option>
            <option value="failed">Failed</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      {loading ? (
        <div className="loading">
          <div className="spinner"></div>
        </div>
      ) : orders.length > 0 ? (
        <div className="card">
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Service</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Payment</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
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
                        <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                          {order.user?.phone}
                        </p>
                      </div>
                    </td>
                    <td>{order.service?.name}</td>
                    <td>
                      <span style={{ fontWeight: 600, color: 'var(--primary-color)' }}>
                        KES {order.amount.toLocaleString()}
                      </span>
                    </td>
                    <td>{getStatusBadge(order.status)}</td>
                    <td>{getPaymentBadge(order.paymentStatus)}</td>
                    <td>
                      <button
                        className="btn btn-primary btn-small"
                        onClick={() => startEdit(order)}
                      >
                        Edit
                      </button>
                    </td>
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
            <h3 className="empty-state-title">No Orders Found</h3>
            <p className="empty-state-text">Adjust your filters to see orders</p>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editingId && (
        <div className="modal-overlay" onClick={() => setEditingId(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Update Order Status</h2>
              <button className="modal-close" onClick={() => setEditingId(null)}>
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label className="form-label">Order Status</label>
                <select
                  className="form-select"
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value)}
                >
                  <option value="pending">Pending</option>
                  <option value="completed">Completed</option>
                  <option value="failed">Failed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Notes</label>
                <textarea
                  className="form-textarea"
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                  placeholder="Add any notes about this order..."
                />
              </div>
            </div>
            <div className="modal-footer">
              <button
                className="btn btn-outline"
                onClick={() => setEditingId(null)}
              >
                Cancel
              </button>
              <button
                className="btn btn-primary"
                onClick={() => handleUpdateStatus(editingId)}
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminOrders;
