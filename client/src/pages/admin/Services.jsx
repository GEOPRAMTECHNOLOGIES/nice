import React, { useEffect, useState } from 'react';
import { servicesAPI } from '../../api';
import { useStore } from '../../store';

function AdminServices() {
  const { showNotification } = useStore();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    duration: '',
    image: '',
  });

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    setLoading(true);
    try {
      const response = await servicesAPI.getAll();
      setServices(response.data.data);
    } catch (error) {
      console.error('Error fetching services:', error);
      showNotification('error', 'Failed to load services');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.description || !formData.price || !formData.category) {
      showNotification('error', 'Please fill in all required fields');
      return;
    }

    try {
      if (editingId) {
        await servicesAPI.update(editingId, formData);
        showNotification('success', 'Service updated successfully');
      } else {
        await servicesAPI.create(formData);
        showNotification('success', 'Service created successfully');
      }
      setShowForm(false);
      setEditingId(null);
      setFormData({
        name: '',
        description: '',
        price: '',
        category: '',
        duration: '',
        image: '',
      });
      fetchServices();
    } catch (error) {
      const message = error.response?.data?.message || 'Operation failed';
      showNotification('error', message);
    }
  };

  const startEdit = (service) => {
    setEditingId(service._id);
    setFormData({
      name: service.name,
      description: service.description,
      price: service.price,
      category: service.category,
      duration: service.duration,
      image: service.image || '',
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this service?')) {
      try {
        await servicesAPI.delete(id);
        showNotification('success', 'Service deleted successfully');
        fetchServices();
      } catch (error) {
        showNotification('error', 'Failed to delete service');
      }
    }
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData({
      name: '',
      description: '',
      price: '',
      category: '',
      duration: '',
      image: '',
    });
  };

  return (
    <div className="container">
      <div className="page-header">
        <h1 className="page-title">Services Management</h1>
        <p className="page-subtitle">Create and manage services</p>
      </div>

      {/* Add Service Button */}
      {!showForm && (
        <button className="btn btn-primary btn-large" onClick={() => setShowForm(true)} style={{ marginBottom: '2rem' }}>
          + Add New Service
        </button>
      )}

      {/* Form */}
      {showForm && (
        <div className="card" style={{ marginBottom: '2rem' }}>
          <div className="card-body">
            <h3 style={{ marginBottom: '1.5rem', fontSize: '1.25rem', fontWeight: 600 }}>
              {editingId ? 'Edit Service' : 'Create New Service'}
            </h3>
            <form onSubmit={handleSubmit} className="form">
              <div className="form-group">
                <label className="form-label">Service Name</label>
                <input
                  type="text"
                  name="name"
                  className="form-input"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Service name"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                  name="description"
                  className="form-textarea"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Service description"
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Price (KES)</label>
                  <input
                    type="number"
                    name="price"
                    className="form-input"
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="0"
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Category</label>
                  <input
                    type="text"
                    name="category"
                    className="form-input"
                    value={formData.category}
                    onChange={handleChange}
                    placeholder="e.g., Repair, Cleaning"
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Duration</label>
                  <input
                    type="text"
                    name="duration"
                    className="form-input"
                    value={formData.duration}
                    onChange={handleChange}
                    placeholder="e.g., 2-3 hours"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Image URL</label>
                  <input
                    type="url"
                    name="image"
                    className="form-input"
                    value={formData.image}
                    onChange={handleChange}
                    placeholder="https://..."
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <button type="button" className="btn btn-outline" onClick={resetForm}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingId ? 'Update Service' : 'Create Service'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Services Grid */}
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
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                  ⏱️ {service.duration}
                </p>
                <div className="service-price">KES {service.price.toLocaleString()}</div>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '0.5rem',
                    marginTop: '1rem',
                  }}
                >
                  <button className="btn btn-primary btn-small" onClick={() => startEdit(service)}>
                    Edit
                  </button>
                  <button
                    className="btn btn-danger btn-small"
                    onClick={() => handleDelete(service._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card">
          <div className="empty-state">
            <div className="empty-state-icon">📦</div>
            <h3 className="empty-state-title">No Services</h3>
            <p className="empty-state-text">Create your first service to get started</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminServices;
