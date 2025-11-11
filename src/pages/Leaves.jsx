import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
const Leaves = () => {
  const { user } = useAuth();
  const [leaves, setLeaves] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    leaveType: 'vacation',
    startDate: '',
    endDate: '',
    reason: ''
  });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchLeaves();
  }, []);

  const fetchLeaves = async () => {
    try {
      const response = await api.get('/api/leaves', { withCredentials: true });
      setLeaves(response.data);
    } catch (error) {
      console.error('Error fetching leaves:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editingId) {
        await api.put(`/api/leaves/${editingId}`, formData, { withCredentials: true });
      } else {
        await api.post('/api/leaves', formData, { withCredentials: true });
      }
      
      setShowForm(false);
      setEditingId(null);
      setFormData({
        leaveType: 'vacation',
        startDate: '',
        endDate: '',
        reason: ''
      });
      fetchLeaves();
    } catch (error) {
      console.error('Error saving leave:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (leave) => {
    if (leave.employee._id !== user.id && user.role !== 'admin' && user.role !== 'hr') {
      return;
    }
    
    setFormData({
      leaveType: leave.leaveType,
      startDate: leave.startDate.split('T')[0],
      endDate: leave.endDate.split('T')[0],
      reason: leave.reason
    });
    setEditingId(leave._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this leave request?')) return;

    try {
      await api.delete(`/api/leaves/${id}`, { withCredentials: true });
      fetchLeaves();
    } catch (error) {
      console.error('Error deleting leave:', error);
    }
  };

  const handleStatusUpdate = async (id, status, notes = '') => {
    try {
      await api.patch(`/api/leaves/${id}/status`, { status, notes }, { withCredentials: true });
      fetchLeaves();
    } catch (error) {
      console.error('Error updating leave status:', error);
    }
  };

  const cancelEdit = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData({
      leaveType: 'vacation',
      startDate: '',
      endDate: '',
      reason: ''
    });
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved': return 'fa-check-circle text-success';
      case 'rejected': return 'fa-times-circle text-danger';
      default: return 'fa-clock text-warning';
    }
  };

  const getLeaveTypeIcon = (type) => {
    switch (type) {
      case 'sick': return 'fa-procedures text-danger';
      case 'vacation': return 'fa-umbrella-beach text-primary';
      case 'personal': return 'fa-user text-info';
      case 'maternity': return 'fa-baby text-pink';
      case 'paternity': return 'fa-user-friends text-blue';
      default: return 'fa-calendar text-secondary';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'border-success';
      case 'rejected': return 'border-danger';
      default: return 'border-warning';
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
                  <i className="fas fa-calendar-alt me-2"></i>
                  Leave Management
                </h1>
                <p className="text-muted mb-0">
                  Request, track, and manage employee leave requests efficiently
                </p>
              </div>
              <div className="col-md-6 text-md-end">
                <button
                  onClick={() => setShowForm(true)}
                  className="btn btn-primary-custom"
                >
                  <i className="fas fa-plus me-2"></i>
                  Request Leave
                </button>
              </div>
            </div>
          </div>

          <div className="row">
            {/* Leaves List */}
            <div className="col-lg-8">
              <div className="dashboard-card">
                <div className="card-header bg-transparent border-bottom">
                  <h3 className="h5 mb-0">
                    <i className="fas fa-list me-2 text-primary"></i>
                    {user?.role === 'admin' || user?.role === 'hr' ? 'All Leave Requests' : 'My Leave Requests'}
                    <span className="badge bg-primary ms-2">{leaves.length}</span>
                  </h3>
                </div>
                <div className="card-body">
                  {leaves.length > 0 ? (
                    <div className="row g-4">
                      {leaves.map((leave) => (
                        <div key={leave._id} className="col-12">
                          <div className={`card border ${getStatusColor(leave.status)} hover-lift`}>
                            <div className="card-body">
                              <div className="row align-items-center">
                                <div className="col-md-8">
                                  <div className="d-flex align-items-center mb-3">
                                    <i className={`fas ${getLeaveTypeIcon(leave.leaveType)} fa-2x me-3`}></i>
                                    <div className="flex-grow-1">
                                      <h5 className="card-title mb-1 text-capitalize">
                                        {leave.leaveType} Leave
                                      </h5>
                                      <div className="d-flex flex-wrap gap-2 align-items-center">
                                        <span className={`badge status-${leave.status}`}>
                                          <i className={`fas ${getStatusIcon(leave.status)} me-1`}></i>
                                          {leave.status}
                                        </span>
                                        <small className="text-muted">
                                          {new Date(leave.startDate).toLocaleDateString()} - {new Date(leave.endDate).toLocaleDateString()}
                                        </small>
                                      </div>
                                    </div>
                                  </div>
                                  
                                  <p className="card-text mb-3">
                                    <strong>Reason:</strong> {leave.reason}
                                  </p>
                                  
                                  <div className="d-flex flex-wrap gap-3">
                                    <small className="text-muted">
                                      <i className="fas fa-user me-1"></i>
                                      By: {leave.employee.name}
                                    </small>
                                    {leave.approvedBy && (
                                      <small className="text-muted">
                                        <i className="fas fa-user-check me-1"></i>
                                        Approved by: {leave.approvedBy.name}
                                      </small>
                                    )}
                                    {leave.notes && (
                                      <small className="text-muted">
                                        <i className="fas fa-sticky-note me-1"></i>
                                        Note: {leave.notes}
                                      </small>
                                    )}
                                  </div>
                                </div>
                                
                                <div className="col-md-4 text-md-end">
                                  <div className="btn-group-vertical">
                                    {(leave.employee._id === user.id || user.role === 'admin' || user.role === 'hr') && leave.status === 'pending' && (
                                      <>
                                        <button
                                          onClick={() => handleEdit(leave)}
                                          className="btn btn-outline-primary btn-sm mb-2"
                                        >
                                          <i className="fas fa-edit me-1"></i>
                                          Edit
                                        </button>
                                        <button
                                          onClick={() => handleDelete(leave._id)}
                                          className="btn btn-outline-danger btn-sm"
                                        >
                                          <i className="fas fa-trash me-1"></i>
                                          Delete
                                        </button>
                                      </>
                                    )}
                                    
                                    {(user.role === 'admin' || user.role === 'hr') && leave.status === 'pending' && (
                                      <div className="mt-2">
                                        <button
                                          onClick={() => handleStatusUpdate(leave._id, 'approved')}
                                          className="btn btn-success btn-sm me-1"
                                        >
                                          <i className="fas fa-check me-1"></i>
                                          Approve
                                        </button>
                                        <button
                                          onClick={() => handleStatusUpdate(leave._id, 'rejected', 'Please provide more details.')}
                                          className="btn btn-danger btn-sm"
                                        >
                                          <i className="fas fa-times me-1"></i>
                                          Reject
                                        </button>
                                      </div>
                                    )}
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
                      <i className="fas fa-calendar-alt fa-4x text-muted mb-3"></i>
                      <h5 className="text-muted">No leave requests found</h5>
                      <p className="text-muted mb-3">Submit your first leave request!</p>
                      <button
                        onClick={() => setShowForm(true)}
                        className="btn btn-primary-custom"
                      >
                        <i className="fas fa-plus me-2"></i>
                        Request Leave
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Leave Form */}
            {showForm && (
              <div className="col-lg-4">
                <div className="dashboard-card sticky-top" style={{top: '100px'}}>
                  <div className="card-header bg-transparent border-bottom">
                    <h3 className="h5 mb-0">
                      <i className="fas fa-edit me-2 text-success"></i>
                      {editingId ? 'Edit Leave Request' : 'Request Leave'}
                    </h3>
                  </div>
                  <div className="card-body">
                    <form onSubmit={handleSubmit}>
                      <div className="mb-3">
                        <label className="form-label fw-medium">Leave Type</label>
                        <select
                          className="form-select"
                          value={formData.leaveType}
                          onChange={(e) => setFormData({ ...formData, leaveType: e.target.value })}
                        >
                          <option value="vacation">Vacation</option>
                          <option value="sick">Sick Leave</option>
                          <option value="personal">Personal</option>
                          <option value="maternity">Maternity</option>
                          <option value="paternity">Paternity</option>
                        </select>
                      </div>

                      <div className="row g-2 mb-3">
                        <div className="col-6">
                          <label className="form-label fw-medium">Start Date</label>
                          <input
                            type="date"
                            className="form-control"
                            required
                            value={formData.startDate}
                            onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                          />
                        </div>
                        <div className="col-6">
                          <label className="form-label fw-medium">End Date</label>
                          <input
                            type="date"
                            className="form-control"
                            required
                            value={formData.endDate}
                            onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                          />
                        </div>
                      </div>

                      <div className="mb-4">
                        <label className="form-label fw-medium">Reason</label>
                        <textarea
                          className="form-control"
                          rows="3"
                          required
                          value={formData.reason}
                          onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                          placeholder="Please provide a reason for your leave..."
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
                              <i className="fas fa-paper-plane me-2"></i>
                              {editingId ? 'Update Request' : 'Submit Request'}
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

export default Leaves;