import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
const Announcements = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [announcements, setAnnouncements] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    priority: 'medium',
    targetAudience: 'all',
    department: '',
    role: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      const response = await api.get('/api/announcements', { withCredentials: true });
      setAnnouncements(response.data);
    } catch (error) {
      console.error('Error fetching announcements:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post('/api/announcements', formData, { withCredentials: true });
      setShowForm(false);
      setFormData({
        title: '',
        content: '',
        priority: 'medium',
        targetAudience: 'all',
        department: '',
        role: ''
      });
      fetchAnnouncements();
    } catch (error) {
      console.error('Error saving announcement:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent': return 'bg-danger';
      case 'high': return 'bg-warning';
      case 'medium': return 'bg-info';
      case 'low': return 'bg-secondary';
      default: return 'bg-secondary';
    }
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'urgent': return 'fa-exclamation-circle';
      case 'high': return 'fa-exclamation-triangle';
      case 'medium': return 'fa-info-circle';
      case 'low': return 'fa-bell';
      default: return 'fa-bullhorn';
    }
  };

  return (
    <div className="container-fluid py-4 mt-5">
      <div className="row">
        <div className="col-12">
          <div className="dashboard-card p-4 mb-4">
            <div className="row align-items-center">
              <div className="col-md-6">
                <h1 className="h2 fw-bold text-primary mb-2">
                  <i className="fas fa-bullhorn me-2"></i>
                  Company Announcements
                </h1>
                <p className="text-muted mb-0">
                  Stay updated with the latest company news and updates
                </p>
              </div>
              <div className="col-md-6 text-md-end">
                <div className="d-flex align-items-center justify-content-end gap-3">
                  {(user?.role === 'admin' || user?.role === 'hr') && (
                    <button
                      onClick={() => setShowForm(true)}
                      className="btn btn-primary-custom"
                    >
                      <i className="fas fa-plus me-2"></i>
                      New Announcement
                    </button>
                  )}
                  <button
                    onClick={handleLogout}
                    className="btn btn-outline-danger btn-sm logout-btn"
                  >
                    <i className="fas fa-sign-out-alt me-1"></i>
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="row">
            {/* Announcements List */}
            <div className="col-lg-8">
              <div className="dashboard-card">
                <div className="card-header bg-transparent border-bottom">
                  <h3 className="h5 mb-0">
                    <i className="fas fa-list me-2 text-primary"></i>
                    Recent Announcements
                  </h3>
                </div>
                <div className="card-body">
                  {announcements.length > 0 ? (
                    <div className="row g-3">
                      {announcements.map((announcement) => (
                        <div key={announcement._id} className="col-12">
                          <div className="card border-0 shadow-sm hover-lift">
                            <div className="card-body">
                              <div className="d-flex align-items-start mb-3">
                                <div className={`badge ${getPriorityColor(announcement.priority)} me-3`}>
                                  <i className={`fas ${getPriorityIcon(announcement.priority)} me-1`}></i>
                                  {announcement.priority}
                                </div>
                                <div className="flex-grow-1">
                                  <h5 className="card-title mb-2">{announcement.title}</h5>
                                  <p className="card-text">{announcement.content}</p>
                                </div>
                              </div>
                              <div className="d-flex flex-wrap gap-3 justify-content-between">
                                <div>
                                  <small className="text-muted">
                                    <i className="fas fa-user me-1"></i>
                                    By: {announcement.author.name}
                                  </small>
                                  <small className="text-muted ms-3">
                                    <i className="fas fa-calendar me-1"></i>
                                    {new Date(announcement.createdAt).toLocaleDateString()}
                                  </small>
                                </div>
                                <div>
                                  <small className="text-muted">
                                    <i className="fas fa-users me-1"></i>
                                    Target: {announcement.targetAudience}
                                  </small>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-5">
                      <i className="fas fa-bullhorn fa-4x text-muted mb-3"></i>
                      <h5 className="text-muted">No announcements yet</h5>
                      <p className="text-muted mb-3">Check back later for company updates!</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Announcement Form */}
            {showForm && (
              <div className="col-lg-4">
                <div className="dashboard-card sticky-top" style={{top: '100px'}}>
                  <div className="card-header bg-transparent border-bottom">
                    <h3 className="h5 mb-0">
                      <i className="fas fa-plus-circle me-2 text-success"></i>
                      Create Announcement
                    </h3>
                  </div>
                  <div className="card-body">
                    <form onSubmit={handleSubmit}>
                      <div className="mb-3">
                        <label className="form-label fw-medium">Title</label>
                        <input
                          type="text"
                          className="form-control"
                          required
                          value={formData.title}
                          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                          placeholder="Announcement title"
                        />
                      </div>

                      <div className="mb-3">
                        <label className="form-label fw-medium">Content</label>
                        <textarea
                          className="form-control"
                          rows="4"
                          required
                          value={formData.content}
                          onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                          placeholder="Announcement content..."
                        />
                      </div>

                      <div className="mb-3">
                        <label className="form-label fw-medium">Priority</label>
                        <select
                          className="form-select"
                          value={formData.priority}
                          onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                        >
                          <option value="low">Low</option>
                          <option value="medium">Medium</option>
                          <option value="high">High</option>
                          <option value="urgent">Urgent</option>
                        </select>
                      </div>

                      <div className="mb-3">
                        <label className="form-label fw-medium">Target Audience</label>
                        <select
                          className="form-select"
                          value={formData.targetAudience}
                          onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value })}
                        >
                          <option value="all">All Employees</option>
                          <option value="department">Specific Department</option>
                          <option value="role">Specific Role</option>
                        </select>
                      </div>

                      <div className="d-grid gap-2">
                        <button
                          type="submit"
                          disabled={loading}
                          className="btn btn-success"
                        >
                          {loading ? (
                            <>
                              <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                              Publishing...
                            </>
                          ) : (
                            <>
                              <i className="fas fa-paper-plane me-2"></i>
                              Publish Announcement
                            </>
                          )}
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowForm(false)}
                          className="btn btn-outline-secondary"
                        >
                          <i className="fas fa-times me-2"></i>
                          Cancel
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Announcements;