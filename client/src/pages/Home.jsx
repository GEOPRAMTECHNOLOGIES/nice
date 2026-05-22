import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../store';
import { servicesAPI } from '../api';

function Home() {
  const { auth } = useStore();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await servicesAPI.getAll();
        setServices(response.data.data.slice(0, 6)); // Show first 6 services
      } catch (error) {
        console.error('Error fetching services:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  return (
    <div className="container">
      {/* Hero Section */}
      <div style={{ marginBottom: '4rem' }}>
        <h1 className="page-title">Welcome back, {auth.user?.name}! 👋</h1>
        <p className="page-subtitle">
          Browse and order professional services from our trusted providers
        </p>
      </div>

      {/* Quick Stats */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon primary">📊</div>
          <div className="stat-content">
            <h3>Browse Services</h3>
            <p>Explore our collection</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon success">💳</div>
          <div className="stat-content">
            <h3>Secure Payments</h3>
            <p>M-Pesa integration</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon warning">🎯</div>
          <div className="stat-content">
            <h3>Track Orders</h3>
            <p>Real-time updates</p>
          </div>
        </div>
      </div>

      {/* Featured Services */}
      <div>
        <div className="page-header">
          <h2 className="page-title" style={{ fontSize: '1.75rem' }}>
            Featured Services
          </h2>
          <Link to="/services" className="btn btn-outline btn-small">
            View All →
          </Link>
        </div>

        {loading ? (
          <div className="loading">
            <div className="spinner"></div>
          </div>
        ) : services.length > 0 ? (
          <div className="grid grid-3">
            {services.map((service) => (
              <div key={service._id} className="service-card">
                <div className="service-image">
                  {service.image ? (
                    <img src={service.image} alt={service.name} />
                  ) : (
                    <span>🛠️</span>
                  )}
                </div>
                <div className="service-content">
                  <span className="service-category">{service.category}</span>
                  <h3 className="service-name">{service.name}</h3>
                  <p className="service-description">{service.description}</p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span className="service-price">KES {service.price.toLocaleString()}</span>
                    <Link to={`/services/${service._id}`} className="btn btn-primary btn-small">
                      View
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="card">
            <div className="empty-state">
              <div className="empty-state-icon">📦</div>
              <h3 className="empty-state-title">No Services Available</h3>
              <p className="empty-state-text">Check back soon for new services</p>
            </div>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div style={{ marginTop: '4rem', textAlign: 'center' }}>
        <h3 className="page-title" style={{ fontSize: '1.25rem', marginBottom: '1.5rem' }}>
          Ready to get started?
        </h3>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/services" className="btn btn-primary btn-large">
            Browse Services
          </Link>
          <Link to="/orders" className="btn btn-outline btn-large">
            View My Orders
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Home;
