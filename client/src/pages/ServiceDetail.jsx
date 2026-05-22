import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStore } from '../store';
import { servicesAPI, ordersAPI } from '../api';

function ServiceDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { auth, showNotification } = useStore();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [ordering, setOrdering] = useState(false);
  const [phone, setPhone] = useState(auth.user?.phone || '');
  const [showCheckout, setShowCheckout] = useState(false);

  useEffect(() => {
    const fetchService = async () => {
      try {
        const response = await servicesAPI.getById(id);
        setService(response.data.data);
      } catch (error) {
        console.error('Error fetching service:', error);
        showNotification('error', 'Failed to load service');
        navigate('/services');
      } finally {
        setLoading(false);
      }
    };

    fetchService();
  }, [id, navigate, showNotification]);

  const handleOrder = async (e) => {
    e.preventDefault();
    if (!phone.trim()) {
      showNotification('error', 'Please enter a phone number');
      return;
    }

    setOrdering(true);

    try {
      // Create order
      const orderResponse = await ordersAPI.create({
        serviceId: id,
        phone,
      });

      const orderId = orderResponse.data.data.orderId;

      // Initiate payment
      const paymentResponse = await ordersAPI.initiatePayment(orderId, { phone });

      if (paymentResponse.data.success) {
        showNotification('success', paymentResponse.data.message);
        // Redirect to order history after a short delay
        setTimeout(() => {
          navigate('/orders');
        }, 2000);
      } else {
        showNotification('error', paymentResponse.data.message || 'Payment initiation failed');
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Order failed';
      showNotification('error', message);
    } finally {
      setOrdering(false);
    }
  };

  if (loading) {
    return (
      <div className="container">
        <div className="loading">
          <div className="spinner"></div>
        </div>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="container">
        <div className="card">
          <div className="empty-state">
            <div className="empty-state-icon">❌</div>
            <h3 className="empty-state-title">Service Not Found</h3>
            <p className="empty-state-text">The service you're looking for doesn't exist</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
        {/* Service Image */}
        <div>
          <div className="service-image" style={{ height: '400px', marginBottom: '1.5rem' }}>
            {service.image ? (
              <img src={service.image} alt={service.name} />
            ) : (
              <span style={{ fontSize: '5rem' }}>🛠️</span>
            )}
          </div>
        </div>

        {/* Service Details */}
        <div>
          <span className="service-category">{service.category}</span>
          <h1 className="page-title" style={{ marginBottom: '1rem' }}>
            {service.name}
          </h1>
          <p className="page-subtitle" style={{ marginBottom: '1.5rem' }}>
            {service.description}
          </p>

          <div style={{ marginBottom: '1.5rem' }}>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Service Duration</p>
            <p style={{ fontSize: '1.125rem', fontWeight: 600 }}>⏱️ {service.duration}</p>
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Price</p>
            <p style={{ fontSize: '2.5rem', fontWeight: 700, color: 'var(--primary-color)' }}>
              KES {service.price.toLocaleString()}
            </p>
          </div>

          {!showCheckout ? (
            <button
              onClick={() => setShowCheckout(true)}
              className="btn btn-primary btn-large"
              style={{ width: '100%' }}
            >
              Order Now
            </button>
          ) : (
            <div className="card">
              <div className="card-body">
                <h3 style={{ marginBottom: '1.5rem', fontSize: '1.25rem', fontWeight: 600 }}>
                  Complete Your Order
                </h3>

                <form onSubmit={handleOrder} className="form">
                  <div className="form-group">
                    <label className="form-label">Phone Number</label>
                    <input
                      type="tel"
                      className="form-input"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="254712345678"
                      required
                    />
                  </div>

                  <div style={{ backgroundColor: 'var(--light-bg)', padding: '1rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem' }}>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>Order Total</p>
                    <p style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--primary-color)' }}>
                      KES {service.price.toLocaleString()}
                    </p>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <button
                      type="button"
                      className="btn btn-outline"
                      onClick={() => setShowCheckout(false)}
                      disabled={ordering}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={ordering}
                    >
                      {ordering ? 'Processing...' : 'Pay with M-Pesa'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ServiceDetail;
