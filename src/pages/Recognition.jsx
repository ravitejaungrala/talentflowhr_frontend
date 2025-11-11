import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
const Recognition = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [recognitions, setRecognitions] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    toEmployee: '',
    category: 'excellence',
    message: '',
    points: 10,
    isPublic: true,
    tags: []
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchRecognitions();
    fetchEmployees();
    fetchLeaderboard();
  }, []);

  const fetchRecognitions = async () => {
    try {
      const response = await api.get('/api/recognition', { withCredentials: true });
      setRecognitions(response.data);
    } catch (error) {
      console.error('Error fetching recognitions:', error);
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

  const fetchLeaderboard = async () => {
    try {
      const response = await api.get('/api/recognition/leaderboard', { withCredentials: true });
      setLeaderboard(response.data);
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post('/api/recognition', formData, { withCredentials: true });
      setShowForm(false);
      setFormData({
        toEmployee: '',
        category: 'excellence',
        message: '',
        points: 10,
        isPublic: true,
        tags: []
      });
      fetchRecognitions();
      fetchLeaderboard();
    } catch (error) {
      console.error('Error saving recognition:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'excellence': return 'fa-star';
      case 'teamwork': return 'fa-users';
      case 'innovation': return 'fa-lightbulb';
      case 'leadership': return 'fa-crown';
      case 'customer_focus': return 'fa-handshake';
      default: return 'fa-trophy';
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'excellence': return 'bg-warning text-dark';
      case 'teamwork': return 'bg-info text-white';
      case 'innovation': return 'bg-purple text-white';
      case 'leadership': return 'bg-success text-white';
      case 'customer_focus': return 'bg-primary text-white';
      default: return 'bg-secondary text-white';
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
                  <i className="fas fa-trophy me-2"></i>
                  Employee Recognition
                </h1>
                <p className="text-muted mb-0">
                  Recognize and appreciate your colleagues' achievements
                </p>
              </div>
              <div className="col-md-6 text-md-end">
                <div className="d-flex align-items-center justify-content-end gap-3">
                  <button
                    onClick={() => setShowForm(true)}
                    className="btn btn-primary-custom"
                  >
                    <i className="fas fa-plus me-2"></i>
                    Recognize Someone
                  </button>
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
            {/* Recognition List */}
            <div className="col-lg-8">
              <div className="dashboard-card mb-4">
                <div className="card-header bg-transparent border-bottom">
                  <h3 className="h5 mb-0">
                    <i className="fas fa-list me-2 text-primary"></i>
                    Recent Recognitions
                  </h3>
                </div>
                <div className="card-body">
                  {recognitions.length > 0 ? (
                    <div className="row g-3">
                      {recognitions.map((recognition) => (
                        <div key={recognition._id} className="col-12">
                          <div className="card border-0 shadow-sm hover-lift">
                            <div className="card-body">
                              <div className="row align-items-center">
                                <div className="col-md-8">
                                  <div className="d-flex align-items-center mb-2">
                                    <span className={`badge ${getCategoryColor(recognition.category)} me-2`}>
                                      <i className={`fas ${getCategoryIcon(recognition.category)} me-1`}></i>
                                      {recognition.category.replace('_', ' ')}
                                    </span>
                                    <span className="badge bg-light text-dark">
                                      <i className="fas fa-star me-1"></i>
                                      {recognition.points} points
                                    </span>
                                    {!recognition.isPublic && (
                                      <span className="badge bg-secondary ms-2">
                                        <i className="fas fa-lock me-1"></i>
                                        Private
                                      </span>
                                    )}
                                  </div>
                                  <p className="card-text mb-3">{recognition.message}</p>
                                  <div className="d-flex flex-wrap gap-3">
                                    <small className="text-muted">
                                      <i className="fas fa-user me-1"></i>
                                      From: {recognition.fromEmployee.name}
                                    </small>
                                    <small className="text-muted">
                                      <i className="fas fa-user-check me-1"></i>
                                      To: {recognition.toEmployee.name}
                                    </small>
                                    <small className="text-muted">
                                      {new Date(recognition.createdAt).toLocaleDateString()}
                                    </small>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-5">
                      <i className="fas fa-trophy fa-4x text-muted mb-3"></i>
                      <h5 className="text-muted">No recognitions yet</h5>
                      <p className="text-muted mb-3">Be the first to recognize someone's achievement!</p>
                      <button
                        onClick={() => setShowForm(true)}
                        className="btn btn-primary-custom"
                      >
                        <i className="fas fa-plus me-2"></i>
                        Give Recognition
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Leaderboard */}
            <div className="col-lg-4">
              <div className="dashboard-card">
                <div className="card-header bg-transparent border-bottom">
                  <h3 className="h5 mb-0">
                    <i className="fas fa-chart-line me-2 text-warning"></i>
                    Recognition Leaderboard
                  </h3>
                </div>
                <div className="card-body">
                  {leaderboard.length > 0 ? (
                    <div className="list-group list-group-flush">
                      {leaderboard.slice(0, 5).map((item, index) => (
                        <div key={index} className="list-group-item d-flex align-items-center border-0 py-3">
                          <div className="flex-shrink-0">
                            <div className={`rank-badge rank-${index + 1}`}>
                              {index + 1}
                            </div>
                          </div>
                          <div className="flex-grow-1 ms-3">
                            <h6 className="mb-1">{item.employee.name}</h6>
                            <small className="text-muted">{item.employee.department}</small>
                          </div>
                          <div className="flex-shrink-0 text-end">
                            <div className="fw-bold text-primary">{item.totalPoints} pts</div>
                            <small className="text-muted">{item.recognitionCount} recognitions</small>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <i className="fas fa-trophy fa-3x text-muted mb-3"></i>
                      <p className="text-muted">No leaderboard data yet</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Recognition Form */}
            {showForm && (
              <div className="col-12 mt-4">
                <div className="dashboard-card">
                  <div className="card-header bg-transparent border-bottom">
                    <h3 className="h5 mb-0">
                      <i className="fas fa-trophy me-2 text-success"></i>
                      Recognize a Colleague
                    </h3>
                  </div>
                  <div className="card-body">
                    <form onSubmit={handleSubmit}>
                      <div className="row">
                        <div className="col-md-6">
                          <div className="mb-3">
                            <label className="form-label fw-medium">Recognize</label>
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
                        </div>
                        <div className="col-md-6">
                          <div className="mb-3">
                            <label className="form-label fw-medium">Category</label>
                            <select
                              className="form-select"
                              value={formData.category}
                              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                            >
                              <option value="excellence">Excellence</option>
                              <option value="teamwork">Teamwork</option>
                              <option value="innovation">Innovation</option>
                              <option value="leadership">Leadership</option>
                              <option value="customer_focus">Customer Focus</option>
                            </select>
                          </div>
                        </div>
                      </div>

                      <div className="row">
                        <div className="col-md-6">
                          <div className="mb-3">
                            <label className="form-label fw-medium">Points</label>
                            <input
                              type="number"
                              className="form-control"
                              min="5"
                              max="50"
                              value={formData.points}
                              onChange={(e) => setFormData({ ...formData, points: parseInt(e.target.value) })}
                            />
                            <small className="text-muted">Points awarded (5-50)</small>
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="mb-3">
                            <label className="form-label fw-medium">Visibility</label>
                            <div className="form-check mt-2">
                              <input
                                type="checkbox"
                                className="form-check-input"
                                id="isPublic"
                                checked={formData.isPublic}
                                onChange={(e) => setFormData({ ...formData, isPublic: e.target.checked })}
                              />
                              <label className="form-check-label" htmlFor="isPublic">
                                Make this recognition public
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="mb-4">
                        <label className="form-label fw-medium">Recognition Message</label>
                        <textarea
                          className="form-control"
                          rows="4"
                          required
                          value={formData.message}
                          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                          placeholder="Share what they did that was exceptional and how it made a difference..."
                        />
                      </div>

                      <div className="d-flex gap-2">
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
                              <i className="fas fa-trophy me-2"></i>
                              Give Recognition
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

export default Recognition;