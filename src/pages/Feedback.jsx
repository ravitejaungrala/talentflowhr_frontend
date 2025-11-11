import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
const Feedback = () => {
  const { user } = useAuth();
  const [feedbacks, setFeedbacks] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    toEmployee: '',
    message: '',
    category: 'general',
    isAnonymous: false
  });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchFeedbacks();
    if (user?.role === 'admin' || user?.role === 'hr') {
      fetchEmployees();
    }
  }, [user]);

  const fetchFeedbacks = async () => {
    try {
      const response = await api.get('/api/feedback', { withCredentials: true });
      setFeedbacks(response.data);
    } catch (error) {
      console.error('Error fetching feedbacks:', error);
    }
  };

  const fetchEmployees = async () => {
    try {
      const response = await api.get('/api/employees', { withCredentials: true });
      setEmployees(response.data);
    } catch (error) {
      console.error('Error fetching employees:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editingId) {
        await api.put(`/api/feedback/${editingId}`, formData, { withCredentials: true });
      } else {
        await api.post('/api/feedback', formData, { withCredentials: true });
      }
      
      setShowForm(false);
      setEditingId(null);
      setFormData({
        toEmployee: '',
        message: '',
        category: 'general',
        isAnonymous: false
      });
      fetchFeedbacks();
    } catch (error) {
      console.error('Error saving feedback:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (feedback) => {
    if (feedback.fromEmployee._id !== user.id && user.role !== 'admin' && user.role !== 'hr') {
      return;
    }
    
    setFormData({
      toEmployee: feedback.toEmployee._id,
      message: feedback.message,
      category: feedback.category,
      isAnonymous: feedback.isAnonymous
    });
    setEditingId(feedback._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this feedback?')) return;

    try {
      await api.delete(`/api/feedback/${id}`, { withCredentials: true });
      fetchFeedbacks();
    } catch (error) {
      console.error('Error deleting feedback:', error);
    }
  };

  const cancelEdit = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData({
      toEmployee: '',
      message: '',
      category: 'general',
      isAnonymous: false
    });
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'positive': return 'fa-smile text-success';
      case 'constructive': return 'fa-lightbulb text-warning';
      default: return 'fa-comment text-primary';
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'positive': return 'border-success';
      case 'constructive': return 'border-warning';
      default: return 'border-primary';
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
                  <i className="fas fa-comments me-2"></i>
                  Feedback Management
                </h1>
                <p className="text-muted mb-0">
                  Give and receive constructive feedback to foster growth and collaboration
                </p>
              </div>
              <div className="col-md-6 text-md-end">
                <button
                  onClick={() => setShowForm(true)}
                  className="btn btn-primary-custom"
                >
                  <i className="fas fa-plus me-2"></i>
                  Give Feedback
                </button>
              </div>
            </div>
          </div>

          <div className="row">
            {/* Feedback List */}
            <div className="col-lg-8">
              <div className="dashboard-card">
                <div className="card-header bg-transparent border-bottom">
                  <h3 className="h5 mb-0">
                    <i className="fas fa-list me-2 text-primary"></i>
                    {user?.role === 'admin' || user?.role === 'hr' ? 'All Feedback' : 'My Feedback'}
                    <span className="badge bg-primary ms-2">{feedbacks.length}</span>
                  </h3>
                </div>
                <div className="card-body">
                  {feedbacks.length > 0 ? (
                    <div className="row g-4">
                      {feedbacks.map((feedback) => (
                        <div key={feedback._id} className="col-12">
                          <div className={`card border ${getCategoryColor(feedback.category)} hover-lift`}>
                            <div className="card-body">
                              <div className="d-flex justify-content-between align-items-start mb-3">
                                <div className="d-flex align-items-center">
                                  <i className={`fas ${getCategoryIcon(feedback.category)} fa-2x me-3`}></i>
                                  <div>
                                    <h6 className="card-title mb-1 text-capitalize">
                                      {feedback.category} Feedback
                                    </h6>
                                    <div className="d-flex flex-wrap gap-2">
                                      {feedback.isAnonymous && (
                                        <span className="badge bg-secondary">
                                          <i className="fas fa-user-secret me-1"></i>
                                          Anonymous
                                        </span>
                                      )}
                                      <small className="text-muted">
                                        {new Date(feedback.createdAt).toLocaleDateString()}
                                      </small>
                                    </div>
                                  </div>
                                </div>
                                {(feedback.fromEmployee._id === user.id || user.role === 'admin' || user.role === 'hr') && (
                                  <div className="btn-group">
                                    <button
                                      onClick={() => handleEdit(feedback)}
                                      className="btn btn-outline-primary btn-sm"
                                      title="Edit Feedback"
                                    >
                                      <i className="fas fa-edit"></i>
                                    </button>
                                    <button
                                      onClick={() => handleDelete(feedback._id)}
                                      className="btn btn-outline-danger btn-sm"
                                      title="Delete Feedback"
                                    >
                                      <i className="fas fa-trash"></i>
                                    </button>
                                  </div>
                                )}
                              </div>
                              
                              <p className="card-text mb-3">{feedback.message}</p>
                              
                              <div className="d-flex justify-content-between align-items-center">
                                <div>
                                  {!feedback.isAnonymous && (
                                    <small className="text-muted">
                                      <i className="fas fa-user me-1"></i>
                                      From: {feedback.fromEmployee.name}
                                    </small>
                                  )}
                                  <small className="text-muted ms-3">
                                    <i className="fas fa-user-check me-1"></i>
                                    To: {feedback.toEmployee.name}
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
                      <i className="fas fa-comments fa-4x text-muted mb-3"></i>
                      <h5 className="text-muted">No feedback found</h5>
                      <p className="text-muted mb-3">Be the first to share some feedback!</p>
                      <button
                        onClick={() => setShowForm(true)}
                        className="btn btn-primary-custom"
                      >
                        <i className="fas fa-plus me-2"></i>
                        Share Feedback
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Feedback Form */}
            {showForm && (
              <div className="col-lg-4">
                <div className="dashboard-card sticky-top" style={{top: '100px'}}>
                  <div className="card-header bg-transparent border-bottom">
                    <h3 className="h5 mb-0">
                      <i className="fas fa-edit me-2 text-success"></i>
                      {editingId ? 'Edit Feedback' : 'Give Feedback'}
                    </h3>
                  </div>
                  <div className="card-body">
                    <form onSubmit={handleSubmit}>
                      <div className="mb-3">
                        <label className="form-label fw-medium">To Employee</label>
                        <select
                          className="form-select"
                          required
                          value={formData.toEmployee}
                          onChange={(e) => setFormData({ ...formData, toEmployee: e.target.value })}
                        >
                          <option value="">Select Employee</option>
                          {employees.map((emp) => (
                            <option key={emp._id} value={emp._id}>
                              {emp.name} ({emp.department})
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="mb-3">
                        <label className="form-label fw-medium">Category</label>
                        <select
                          className="form-select"
                          value={formData.category}
                          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        >
                          <option value="general">General</option>
                          <option value="positive">Positive</option>
                          <option value="constructive">Constructive</option>
                        </select>
                      </div>

                      <div className="mb-3">
                        <label className="form-label fw-medium">Message</label>
                        <textarea
                          className="form-control"
                          rows="4"
                          required
                          value={formData.message}
                          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                          placeholder="Write your constructive feedback here..."
                        />
                      </div>

                      <div className="mb-4">
                        <div className="form-check">
                          <input
                            type="checkbox"
                            className="form-check-input"
                            id="isAnonymous"
                            checked={formData.isAnonymous}
                            onChange={(e) => setFormData({ ...formData, isAnonymous: e.target.checked })}
                          />
                          <label className="form-check-label" htmlFor="isAnonymous">
                            Send anonymously
                          </label>
                        </div>
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
                              Saving...
                            </>
                          ) : (
                            <>
                              <i className="fas fa-paper-plane me-2"></i>
                              {editingId ? 'Update Feedback' : 'Send Feedback'}
                            </>
                          )}
                        </button>
                        <button
                          type="button"
                          onClick={cancelEdit}
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

export default Feedback;