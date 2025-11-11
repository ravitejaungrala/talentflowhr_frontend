import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
const Documents = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [documents, setDocuments] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'policy',
    accessibleTo: 'all',
    departments: [],
    roles: [],
    isConfidential: false
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const response = await api.get('/api/documents', { withCredentials: true });
      setDocuments(response.data);
    } catch (error) {
      console.error('Error fetching documents:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post('/api/documents', formData, { withCredentials: true });
      setShowForm(false);
      setFormData({
        title: '',
        description: '',
        category: 'policy',
        accessibleTo: 'all',
        departments: [],
        roles: [],
        isConfidential: false
      });
      fetchDocuments();
    } catch (error) {
      console.error('Error saving document:', error);
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
      case 'policy': return 'fa-file-contract';
      case 'handbook': return 'fa-book';
      case 'form': return 'fa-file-alt';
      case 'template': return 'fa-copy';
      case 'report': return 'fa-chart-bar';
      case 'other': return 'fa-file';
      default: return 'fa-file';
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'policy': return 'border-primary';
      case 'handbook': return 'border-success';
      case 'form': return 'border-warning';
      case 'template': return 'border-info';
      case 'report': return 'border-purple';
      case 'other': return 'border-secondary';
      default: return 'border-secondary';
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="container-fluid py-4 mt-5">
      <div className="row">
        <div className="col-12">
          <div className="dashboard-card p-4 mb-4">
            <div className="row align-items-center">
              <div className="col-md-6">
                <h1 className="h2 fw-bold text-primary mb-2">
                  <i className="fas fa-file me-2"></i>
                  Document Library
                </h1>
                <p className="text-muted mb-0">
                  Access and manage company documents and resources
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
                      Upload Document
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
            {/* Documents List */}
            <div className="col-lg-8">
              <div className="dashboard-card">
                <div className="card-header bg-transparent border-bottom">
                  <h3 className="h5 mb-0">
                    <i className="fas fa-list me-2 text-primary"></i>
                    Available Documents
                  </h3>
                </div>
                <div className="card-body">
                  {documents.length > 0 ? (
                    <div className="row g-3">
                      {documents.map((document) => (
                        <div key={document._id} className="col-12">
                          <div className={`card border ${getCategoryColor(document.category)} hover-lift`}>
                            <div className="card-body">
                              <div className="row align-items-center">
                                <div className="col-md-8">
                                  <div className="d-flex align-items-center mb-2">
                                    <i className={`fas ${getCategoryIcon(document.category)} text-primary me-2`}></i>
                                    <h5 className="card-title mb-0">{document.title}</h5>
                                    {document.isConfidential && (
                                      <span className="badge bg-danger ms-2">
                                        <i className="fas fa-lock me-1"></i>
                                        Confidential
                                      </span>
                                    )}
                                  </div>
                                  <p className="card-text text-muted mb-3">{document.description}</p>
                                  <div className="d-flex flex-wrap gap-2 mb-2">
                                    <span className="badge bg-light text-dark">
                                      <i className="fas fa-tag me-1"></i>
                                      {document.category}
                                    </span>
                                    <span className="badge bg-light text-dark">
                                      <i className="fas fa-users me-1"></i>
                                      {document.accessibleTo}
                                    </span>
                                    {document.size && (
                                      <span className="badge bg-light text-dark">
                                        <i className="fas fa-weight me-1"></i>
                                        {formatFileSize(document.size)}
                                      </span>
                                    )}
                                  </div>
                                  <div className="d-flex flex-wrap gap-3">
                                    <small className="text-muted">
                                      <i className="fas fa-user me-1"></i>
                                      Uploaded by: {document.uploadedBy.name}
                                    </small>
                                    <small className="text-muted">
                                      <i className="fas fa-calendar me-1"></i>
                                      {new Date(document.createdAt).toLocaleDateString()}
                                    </small>
                                  </div>
                                </div>
                                <div className="col-md-4 text-md-end">
                                  {document.url && (
                                    <a
                                      href={document.url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="btn btn-outline-primary"
                                    >
                                      <i className="fas fa-download me-2"></i>
                                      Download
                                    </a>
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
                      <i className="fas fa-file fa-4x text-muted mb-3"></i>
                      <h5 className="text-muted">No documents available</h5>
                      <p className="text-muted mb-3">Upload your first document to get started!</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Document Upload Form */}
            {showForm && (
              <div className="col-lg-4">
                <div className="dashboard-card sticky-top" style={{top: '100px'}}>
                  <div className="card-header bg-transparent border-bottom">
                    <h3 className="h5 mb-0">
                      <i className="fas fa-upload me-2 text-success"></i>
                      Upload Document
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
                          placeholder="Document title"
                        />
                      </div>

                      <div className="mb-3">
                        <label className="form-label fw-medium">Description</label>
                        <textarea
                          className="form-control"
                          rows="3"
                          value={formData.description}
                          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                          placeholder="Document description"
                        />
                      </div>

                      <div className="mb-3">
                        <label className="form-label fw-medium">Category</label>
                        <select
                          className="form-select"
                          value={formData.category}
                          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        >
                          <option value="policy">Policy</option>
                          <option value="handbook">Handbook</option>
                          <option value="form">Form</option>
                          <option value="template">Template</option>
                          <option value="report">Report</option>
                          <option value="other">Other</option>
                        </select>
                      </div>

                      <div className="mb-3">
                        <label className="form-label fw-medium">Access Level</label>
                        <select
                          className="form-select"
                          value={formData.accessibleTo}
                          onChange={(e) => setFormData({ ...formData, accessibleTo: e.target.value })}
                        >
                          <option value="all">All Employees</option>
                          <option value="department">Specific Department</option>
                          <option value="role">Specific Role</option>
                          <option value="specific">Specific Employees</option>
                        </select>
                      </div>

                      <div className="mb-4">
                        <div className="form-check">
                          <input
                            type="checkbox"
                            className="form-check-input"
                            id="isConfidential"
                            checked={formData.isConfidential}
                            onChange={(e) => setFormData({ ...formData, isConfidential: e.target.checked })}
                          />
                          <label className="form-check-label" htmlFor="isConfidential">
                            Confidential Document
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
                              Uploading...
                            </>
                          ) : (
                            <>
                              <i className="fas fa-upload me-2"></i>
                              Upload Document
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

export default Documents;