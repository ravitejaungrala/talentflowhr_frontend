import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
const Training = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [trainings, setTrainings] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'technical',
    instructor: '',
    duration: 1,
    resources: []
  });
  const [loading, setLoading] = useState(false);
  const [enrolling, setEnrolling] = useState(null);

  useEffect(() => {
    fetchTrainings();
  }, []);

  const fetchTrainings = async () => {
    try {
      const response = await api.get('/api/training', { withCredentials: true });
      setTrainings(response.data);
    } catch (error) {
      console.error('Error fetching trainings:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post('/api/training', formData, { withCredentials: true });
      setShowForm(false);
      setFormData({
        title: '',
        description: '',
        category: 'technical',
        instructor: '',
        duration: 1,
        resources: []
      });
      fetchTrainings();
    } catch (error) {
      console.error('Error saving training:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async (trainingId) => {
    setEnrolling(trainingId);
    try {
      await api.post(`/api/training/${trainingId}/enroll`, {}, { withCredentials: true });
      fetchTrainings();
    } catch (error) {
      console.error('Error enrolling in training:', error);
    } finally {
      setEnrolling(null);
    }
  };

  const handleProgressUpdate = async (trainingId, progress) => {
    try {
      await api.patch(`/api/training/${trainingId}/progress`, { progress }, { withCredentials: true });
      fetchTrainings();
    } catch (error) {
      console.error('Error updating progress:', error);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'technical': return 'fa-code';
      case 'soft_skills': return 'fa-comments';
      case 'leadership': return 'fa-users';
      case 'compliance': return 'fa-shield-alt';
      case 'product_knowledge': return 'fa-box';
      default: return 'fa-graduation-cap';
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'technical': return 'border-primary';
      case 'soft_skills': return 'border-success';
      case 'leadership': return 'border-warning';
      case 'compliance': return 'border-danger';
      case 'product_knowledge': return 'border-info';
      default: return 'border-secondary';
    }
  };

  const isEnrolled = (training) => {
    return training.enrolledEmployees.some(enrollment => 
      enrollment.employee._id === user.id
    );
  };

  const getEnrollment = (training) => {
    return training.enrolledEmployees.find(enrollment => 
      enrollment.employee._id === user.id
    );
  };

  return (
    <div className="container-fluid py-4 mt-5">
      <div className="row">
        <div className="col-12">
          <div className="dashboard-card p-4 mb-4">
            <div className="row align-items-center">
              <div className="col-md-6">
                <h1 className="h2 fw-bold text-primary mb-2">
                  <i className="fas fa-graduation-cap me-2"></i>
                  Training & Development
                </h1>
                <p className="text-muted mb-0">
                  Enhance your skills with our comprehensive training programs
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
                      Add Training
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
            {/* Training List */}
            <div className="col-lg-8">
              <div className="dashboard-card">
                <div className="card-header bg-transparent border-bottom">
                  <h3 className="h5 mb-0">
                    <i className="fas fa-list me-2 text-primary"></i>
                    Available Training Programs
                  </h3>
                </div>
                <div className="card-body">
                  {trainings.length > 0 ? (
                    <div className="row g-3">
                      {trainings.map((training) => (
                        <div key={training._id} className="col-12">
                          <div className={`card border ${getCategoryColor(training.category)} hover-lift`}>
                            <div className="card-body">
                              <div className="row align-items-center">
                                <div className="col-md-8">
                                  <div className="d-flex align-items-center mb-2">
                                    <i className={`fas ${getCategoryIcon(training.category)} text-primary me-2`}></i>
                                    <h5 className="card-title mb-0">{training.title}</h5>
                                    {!training.isActive && (
                                      <span className="badge bg-secondary ms-2">Inactive</span>
                                    )}
                                  </div>
                                  <p className="card-text text-muted mb-2">{training.description}</p>
                                  <div className="d-flex flex-wrap gap-2 mb-3">
                                    <span className="badge bg-light text-dark">
                                      <i className="fas fa-user me-1"></i>
                                      {training.instructor}
                                    </span>
                                    <span className="badge bg-light text-dark">
                                      <i className="fas fa-clock me-1"></i>
                                      {training.duration} hours
                                    </span>
                                    <span className="badge bg-light text-dark">
                                      <i className="fas fa-users me-1"></i>
                                      {training.enrolledEmployees.length} enrolled
                                    </span>
                                  </div>

                                  {/* Progress for enrolled users */}
                                  {isEnrolled(training) && (
                                    <div className="mb-3">
                                      <div className="d-flex justify-content-between align-items-center mb-1">
                                        <small className="text-muted">Your Progress</small>
                                        <small className="text-muted">
                                          {getEnrollment(training).progress}%
                                        </small>
                                      </div>
                                      <div className="progress" style={{ height: '6px' }}>
                                        <div 
                                          className="progress-bar bg-success" 
                                          style={{ width: `${getEnrollment(training).progress}%` }}
                                        ></div>
                                      </div>
                                      {getEnrollment(training).progress < 100 && (
                                        <div className="mt-2">
                                          <button
                                            onClick={() => handleProgressUpdate(training._id, getEnrollment(training).progress + 25)}
                                            className="btn btn-outline-success btn-sm"
                                          >
                                            Update Progress
                                          </button>
                                        </div>
                                      )}
                                      {getEnrollment(training).completed && (
                                        <span className="badge bg-success">
                                          <i className="fas fa-check me-1"></i>
                                          Completed
                                        </span>
                                      )}
                                    </div>
                                  )}
                                </div>
                                <div className="col-md-4 text-md-end">
                                  {!isEnrolled(training) && training.isActive ? (
                                    <button
                                      onClick={() => handleEnroll(training._id)}
                                      disabled={enrolling === training._id}
                                      className="btn btn-success"
                                    >
                                      {enrolling === training._id ? (
                                        <>
                                          <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                                          Enrolling...
                                        </>
                                      ) : (
                                        <>
                                          <i className="fas fa-plus me-2"></i>
                                          Enroll
                                        </>
                                      )}
                                    </button>
                                  ) : isEnrolled(training) ? (
                                    <span className="badge bg-success">
                                      <i className="fas fa-check me-1"></i>
                                      Enrolled
                                    </span>
                                  ) : null}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-5">
                      <i className="fas fa-graduation-cap fa-4x text-muted mb-3"></i>
                      <h5 className="text-muted">No training programs available</h5>
                      <p className="text-muted mb-3">Check back later for new training opportunities!</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Training Form */}
            {showForm && (
              <div className="col-lg-4">
                <div className="dashboard-card sticky-top" style={{top: '100px'}}>
                  <div className="card-header bg-transparent border-bottom">
                    <h3 className="h5 mb-0">
                      <i className="fas fa-plus-circle me-2 text-success"></i>
                      Add Training Program
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
                          placeholder="Enter training title"
                        />
                      </div>

                      <div className="mb-3">
                        <label className="form-label fw-medium">Description</label>
                        <textarea
                          className="form-control"
                          rows="3"
                          value={formData.description}
                          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                          placeholder="Describe the training program"
                        />
                      </div>

                      <div className="mb-3">
                        <label className="form-label fw-medium">Category</label>
                        <select
                          className="form-select"
                          value={formData.category}
                          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        >
                          <option value="technical">Technical</option>
                          <option value="soft_skills">Soft Skills</option>
                          <option value="leadership">Leadership</option>
                          <option value="compliance">Compliance</option>
                          <option value="product_knowledge">Product Knowledge</option>
                        </select>
                      </div>

                      <div className="mb-3">
                        <label className="form-label fw-medium">Instructor</label>
                        <input
                          type="text"
                          className="form-control"
                          value={formData.instructor}
                          onChange={(e) => setFormData({ ...formData, instructor: e.target.value })}
                          placeholder="Instructor name"
                        />
                      </div>

                      <div className="mb-4">
                        <label className="form-label fw-medium">Duration (hours)</label>
                        <input
                          type="number"
                          className="form-control"
                          min="1"
                          max="100"
                          value={formData.duration}
                          onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
                        />
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
                              <i className="fas fa-save me-2"></i>
                              Add Training
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

export default Training;