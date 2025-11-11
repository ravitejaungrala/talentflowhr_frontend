import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
const Goals = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [goals, setGoals] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'performance',
    targetDate: '',
    progress: 0,
    keyResults: ['']
  });
  const [assignTo, setAssignTo] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchGoals();
    if (user?.role === 'admin' || user?.role === 'hr') {
      fetchEmployees();
    }
  }, [user]);

  const fetchGoals = async () => {
    try {
      const response = await api.get('/api/goals', { withCredentials: true });
      setGoals(response.data);
    } catch (error) {
      console.error('Error fetching goals:', error);
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
      const goalData = {
        ...formData,
        keyResults: formData.keyResults.filter(kr => kr.trim() !== '').map(kr => ({ description: kr })),
        employee: assignTo || user.id
      };

      await api.post('/api/goals', goalData, { withCredentials: true });
      setShowForm(false);
      setFormData({
        title: '',
        description: '',
        category: 'performance',
        targetDate: '',
        progress: 0,
        keyResults: ['']
      });
      setAssignTo('');
      fetchGoals();
    } catch (error) {
      console.error('Error saving goal:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleProgressUpdate = async (goalId, progress) => {
    try {
      await api.patch(`/api/goals/${goalId}/progress`, { progress }, { withCredentials: true });
      fetchGoals();
    } catch (error) {
      console.error('Error updating progress:', error);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const addKeyResult = () => {
    setFormData({
      ...formData,
      keyResults: [...formData.keyResults, '']
    });
  };

  const updateKeyResult = (index, value) => {
    const newKeyResults = [...formData.keyResults];
    newKeyResults[index] = value;
    setFormData({ ...formData, keyResults: newKeyResults });
  };

  const removeKeyResult = (index) => {
    const newKeyResults = formData.keyResults.filter((_, i) => i !== index);
    setFormData({ ...formData, keyResults: newKeyResults });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-success';
      case 'in_progress': return 'bg-primary';
      case 'not_started': return 'bg-secondary';
      case 'cancelled': return 'bg-danger';
      default: return 'bg-secondary';
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'performance': return 'fa-chart-line';
      case 'development': return 'fa-user-graduate';
      case 'project': return 'fa-project-diagram';
      case 'personal': return 'fa-user';
      default: return 'fa-bullseye';
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
                  <i className="fas fa-bullseye me-2"></i>
                  Goals & Objectives
                </h1>
                <p className="text-muted mb-0">
                  Set and track your professional goals and key results
                </p>
              </div>
              <div className="col-md-6 text-md-end">
                <div className="d-flex align-items-center justify-content-end gap-3">
                  <button
                    onClick={() => setShowForm(true)}
                    className="btn btn-primary-custom"
                  >
                    <i className="fas fa-plus me-2"></i>
                    Set New Goal
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
            {/* Goals List */}
            <div className="col-lg-8">
              <div className="dashboard-card">
                <div className="card-header bg-transparent border-bottom">
                  <h3 className="h5 mb-0">
                    <i className="fas fa-list me-2 text-primary"></i>
                    {user?.role === 'admin' || user?.role === 'hr' ? 'All Goals' : 'My Goals'}
                  </h3>
                </div>
                <div className="card-body">
                  {goals.length > 0 ? (
                    <div className="row g-3">
                      {goals.map((goal) => (
                        <div key={goal._id} className="col-12">
                          <div className="card border-0 shadow-sm hover-lift">
                            <div className="card-body">
                              <div className="row align-items-center">
                                <div className="col-md-8">
                                  <div className="d-flex align-items-center mb-2">
                                    <i className={`fas ${getCategoryIcon(goal.category)} text-primary me-2`}></i>
                                    <h5 className="card-title mb-0">{goal.title}</h5>
                                    <span className={`badge ${getStatusColor(goal.status)} ms-2`}>
                                      {goal.status.replace('_', ' ')}
                                    </span>
                                  </div>
                                  <p className="card-text text-muted mb-3">{goal.description}</p>
                                  
                                  {/* Progress Bar */}
                                  <div className="mb-3">
                                    <div className="d-flex justify-content-between align-items-center mb-1">
                                      <small className="text-muted">Progress</small>
                                      <small className="text-muted">{goal.progress}%</small>
                                    </div>
                                    <div className="progress" style={{ height: '8px' }}>
                                      <div 
                                        className="progress-bar bg-success" 
                                        style={{ width: `${goal.progress}%` }}
                                      ></div>
                                    </div>
                                  </div>

                                  {/* Key Results */}
                                  {goal.keyResults && goal.keyResults.length > 0 && (
                                    <div className="mb-3">
                                      <h6 className="fw-medium mb-2">Key Results:</h6>
                                      <ul className="list-unstyled mb-0">
                                        {goal.keyResults.map((kr, index) => (
                                          <li key={index} className="d-flex align-items-center mb-1">
                                            <i className="fas fa-circle text-success me-2" style={{ fontSize: '6px' }}></i>
                                            <span>{kr.description}</span>
                                          </li>
                                        ))}
                                      </ul>
                                    </div>
                                  )}

                                  <div className="d-flex flex-wrap gap-3">
                                    <small className="text-muted">
                                      <i className="fas fa-user me-1"></i>
                                      {goal.employee.name}
                                    </small>
                                    <small className="text-muted">
                                      <i className="fas fa-calendar me-1"></i>
                                      Due: {goal.targetDate ? new Date(goal.targetDate).toLocaleDateString() : 'No deadline'}
                                    </small>
                                    {goal.assignedBy && (
                                      <small className="text-muted">
                                        <i className="fas fa-user-check me-1"></i>
                                        Assigned by: {goal.assignedBy.name}
                                      </small>
                                    )}
                                  </div>
                                </div>
                                <div className="col-md-4 text-md-end">
                                  {goal.employee._id === user.id && goal.status !== 'completed' && (
                                    <div className="btn-group-vertical">
                                      <button
                                        onClick={() => handleProgressUpdate(goal._id, Math.min(goal.progress + 25, 100))}
                                        className="btn btn-outline-primary btn-sm mb-2"
                                      >
                                        Update Progress
                                      </button>
                                      {goal.progress >= 100 && (
                                        <button
                                          onClick={() => handleProgressUpdate(goal._id, 100, 'completed')}
                                          className="btn btn-success btn-sm"
                                        >
                                          Mark Complete
                                        </button>
                                      )}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-5">
                      <i className="fas fa-bullseye fa-4x text-muted mb-3"></i>
                      <h5 className="text-muted">No goals set yet</h5>
                      <p className="text-muted mb-3">Start by setting your first goal to track your progress!</p>
                      <button
                        onClick={() => setShowForm(true)}
                        className="btn btn-primary-custom"
                      >
                        <i className="fas fa-plus me-2"></i>
                        Set Your First Goal
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Goal Form */}
            {showForm && (
              <div className="col-lg-4">
                <div className="dashboard-card sticky-top" style={{top: '100px'}}>
                  <div className="card-header bg-transparent border-bottom">
                    <h3 className="h5 mb-0">
                      <i className="fas fa-plus-circle me-2 text-success"></i>
                      Set New Goal
                    </h3>
                  </div>
                  <div className="card-body">
                    <form onSubmit={handleSubmit}>
                      <div className="mb-3">
                        <label className="form-label fw-medium">Goal Title</label>
                        <input
                          type="text"
                          className="form-control"
                          required
                          value={formData.title}
                          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                          placeholder="What do you want to achieve?"
                        />
                      </div>

                      <div className="mb-3">
                        <label className="form-label fw-medium">Description</label>
                        <textarea
                          className="form-control"
                          rows="3"
                          value={formData.description}
                          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                          placeholder="Describe your goal in detail..."
                        />
                      </div>

                      <div className="mb-3">
                        <label className="form-label fw-medium">Category</label>
                        <select
                          className="form-select"
                          value={formData.category}
                          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        >
                          <option value="performance">Performance</option>
                          <option value="development">Development</option>
                          <option value="project">Project</option>
                          <option value="personal">Personal</option>
                        </select>
                      </div>

                      {(user?.role === 'admin' || user?.role === 'hr') && (
                        <div className="mb-3">
                          <label className="form-label fw-medium">Assign To</label>
                          <select
                            className="form-select"
                            value={assignTo}
                            onChange={(e) => setAssignTo(e.target.value)}
                          >
                            <option value="">Myself</option>
                            {employees.map((emp) => (
                              <option key={emp._id} value={emp._id}>
                                {emp.name} ({emp.department})
                              </option>
                            ))}
                          </select>
                        </div>
                      )}

                      <div className="mb-3">
                        <label className="form-label fw-medium">Target Date</label>
                        <input
                          type="date"
                          className="form-control"
                          value={formData.targetDate}
                          onChange={(e) => setFormData({ ...formData, targetDate: e.target.value })}
                        />
                      </div>

                      <div className="mb-4">
                        <label className="form-label fw-medium">Key Results</label>
                        {formData.keyResults.map((kr, index) => (
                          <div key={index} className="input-group mb-2">
                            <input
                              type="text"
                              className="form-control"
                              value={kr}
                              onChange={(e) => updateKeyResult(index, e.target.value)}
                              placeholder={`Key result ${index + 1}`}
                            />
                            {formData.keyResults.length > 1 && (
                              <button
                                type="button"
                                className="btn btn-outline-danger"
                                onClick={() => removeKeyResult(index)}
                              >
                                <i className="fas fa-times"></i>
                              </button>
                            )}
                          </div>
                        ))}
                        <button
                          type="button"
                          className="btn btn-outline-secondary btn-sm"
                          onClick={addKeyResult}
                        >
                          <i className="fas fa-plus me-1"></i>
                          Add Key Result
                        </button>
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
                              <i className="fas fa-bullseye me-2"></i>
                              Set Goal
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

export default Goals;