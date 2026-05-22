import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { servicesAPI } from '../api';

function Services() {
  const [services, setServices] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [categories, setCategories] = useState(['All']);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await servicesAPI.getAll();
        const data = response.data.data;
        setServices(data);
        setFilteredServices(data);

        // Extract unique categories
        const cats = ['All', ...new Set(data.map((s) => s.category))];
        setCategories(cats);
      } catch (error) {
        console.error('Error fetching services:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  useEffect(() => {
    let filtered = services;

    // Filter by category
    if (selectedCategory !== 'All') {
      filtered = filtered.filter((s) => s.category === selectedCategory);
    }

    // Filter by search term
    if (searchTerm.trim()) {
      filtered = filtered.filter(
        (s) =>
          s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          s.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredServices(filtered);
  }, [selectedCategory, searchTerm, services]);

  return (
    <div className="container">
      <div className="page-header">
        <h1 className="page-title">Our Services</h1>
        <p className="page-subtitle">Browse and order from our collection of professional services</p>
      </div>

      {/* Filters */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ marginBottom: '1.5rem' }}>
          <input
            type="text"
            className="form-input"
            placeholder="Search services..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {categories.map((cat) => (
            <button
              key={cat}
              className={`btn ${selectedCategory === cat ? 'btn-primary' : 'btn-outline'} btn-small`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Services Grid */}
      {loading ? (
        <div className="loading">
          <div className="spinner"></div>
        </div>
      ) : filteredServices.length > 0 ? (
        <div className="grid grid-3">
          {filteredServices.map((service) => (
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
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                  ⏱️ {service.duration}
                </p>
                <div className="service-footer">
                  <span className="service-price">KES {service.price.toLocaleString()}</span>
                  <Link to={`/services/${service._id}`} className="btn btn-primary btn-small">
                    Order Now
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card">
          <div className="empty-state">
            <div className="empty-state-icon">🔍</div>
            <h3 className="empty-state-title">No Services Found</h3>
            <p className="empty-state-text">Try adjusting your filters or search term</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default Services;
