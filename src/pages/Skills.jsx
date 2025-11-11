import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
const Skills = () => {
  const { user, logout } = useAuth();
  const [skills, setSkills] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    category: 'technical',
    proficiency: 'intermediate',
    yearsOfExperience: 1
  });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [skillNumber, setSkillNumber] = useState(1);

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    try {
      const response = await api.get('/api/skills', { withCredentials: true });
      setSkills(response.data);
      setSkillNumber(response.data.length + 1);
    } catch (error) {
      console.error('Error fetching skills:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editingId) {
        await api.put(`/api/skills/${editingId}`, formData, { withCredentials: true });
      } else {
        await api.post('/api/skills', formData, { withCredentials: true });
      }
      
      setShowForm(false);
      setEditingId(null);
      setFormData({
        name: '',
        category: 'technical',
        proficiency: 'intermediate',
        yearsOfExperience: 1
      });
      fetchSkills();
    } catch (error) {
      console.error('Error saving skill:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (skill) => {
    if (skill.employee._id !== user.id && user.role !== 'admin' && user.role !== 'hr') {
      return;
    }
    
    setFormData({
      name: skill.name,
      category: skill.category,
      proficiency: skill.proficiency,
      yearsOfExperience: skill.yearsOfExperience
    });
    setEditingId(skill._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this skill?')) return;

    try {
      await api.delete(`/api/skills/${id}`, { withCredentials: true });
      fetchSkills();
    } catch (error) {
      console.error('Error deleting skill:', error);
    }
  };

  const handleVerify = async (id) => {
    try {
      await api.patch(`/api/skills/${id}/verify`, {}, { withCredentials: true });
      fetchSkills();
    } catch (error) {
      console.error('Error verifying skill:', error);
    }
  };

  const cancelEdit = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData({
      name: '',
      category: 'technical',
      proficiency: 'intermediate',
      yearsOfExperience: 1
    });
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'technical': return 'fa-code';
      case 'soft': return 'fa-comments';
      case 'leadership': return 'fa-users';
      case 'language': return 'fa-language';
      default: return 'fa-star';
    }
  };

  const getProficiencyColor = (proficiency) => {
    switch (proficiency) {
      case 'beginner': return 'bg-danger';
      case 'intermediate': return 'bg-warning';
      case 'advanced': return 'bg-info';
      case 'expert': return 'bg-success';
      default: return 'bg-secondary';
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'technical': return 'border-primary';
      case 'soft': return 'border-success';
      case 'leadership': return 'border-warning';
      case 'language': return 'border-info';
      default: return 'border-secondary';
    }
  };

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div className="container-fluid py-4 mt-5">
      <div className="row">
        <div className="col-12">
          <div className="dashboard-card p-4 mb-4">
            <div className="row align-items-center">
              <div className="col-md-6">
                <h1 className="h2 fw-bold text-primary mb-2">
                  <i className="fas fa-rocket me-2"></i>
                  Skills Inventory
                </h1>
                <p className="text-muted mb-0">
                  Track and manage employee skills with verification system
                </p>
              </div>
              <div className="col-md-6 text-md-end">
                <div className="d-flex align-items-center justify-content-end gap-3">
                  <button
                    onClick={() => setShowForm(true)}
                    className="btn btn-primary-custom"
                  >
                    <i className="fas fa-plus me-2"></i>
                    Add New Skill
                  </button>
                  <button
                    onClick={handleLogout}
                    className="btn btn-outline-danger btn-sm logout-btn"
                    title="Logout"
                  >
                    <i className="fas fa-sign-out-alt me-1"></i>
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="row">
            {/* Skills List */}
            <div className="col-lg-8">
              <div className="dashboard-card">
                <div className="card-header bg-transparent border-bottom">
                  <h3 className="h5 mb-0">
                    <i className="fas fa-list me-2 text-primary"></i>
                    {user?.role === 'admin' || user?.role === 'hr' ? 'All Skills' : 'My Skills'} 
                    <span className="badge bg-primary ms-2">{skills.length}</span>
                  </h3>
                </div>
                <div className="card-body">
                  {skills.length > 0 ? (
                    <div className="row g-3">
                      {skills.map((skill, index) => (
                        <div key={skill._id} className="col-12">
                          <div className={`card border ${getCategoryColor(skill.category)} hover-lift`}>
                            <div className="card-body">
                              <div className="row align-items-center">
                                <div className="col-md-8">
                                  <div className="d-flex align-items-center mb-2">
                                    <span className="badge bg-light text-dark me-2">
                                      Skill #{index + 1}
                                    </span>
                                    <i className={`fas ${getCategoryIcon(skill.category)} text-primary me-2`}></i>
                                    <h5 className="card-title mb-0">{skill.name}</h5>
                                    {skill.isVerified && (
                                      <i className="fas fa-check-circle text-success ms-2" title="Verified"></i>
                                    )}
                                  </div>
                                  <div className="d-flex flex-wrap gap-2 mb-2">
                                    <span className="badge bg-light text-dark">
                                      <i className="fas fa-tag me-1"></i>
                                      {skill.category}
                                    </span>
                                    <span className={`badge ${getProficiencyColor(skill.proficiency)}`}>
                                      <i className="fas fa-chart-line me-1"></i>
                                      {skill.proficiency}
                                    </span>
                                    <span className="badge bg-secondary">
                                      <i className="fas fa-clock me-1"></i>
                                      {skill.yearsOfExperience} year(s)
                                    </span>
                                  </div>
                                  <small className="text-muted">
                                    Added by: {skill.employee.name}
                                    {skill.verifiedBy && ` • Verified by: ${skill.verifiedBy.name}`}
                                  </small>
                                </div>
                                <div className="col-md-4 text-md-end">
                                  <div className="btn-group">
                                    <button
                                      onClick={() => handleEdit(skill)}
                                      className="btn btn-outline-primary btn-sm"
                                      title="Edit Skill"
                                    >
                                      <i className="fas fa-edit"></i>
                                    </button>
                                    <button
                                      onClick={() => handleDelete(skill._id)}
                                      className="btn btn-outline-danger btn-sm"
                                      title="Delete Skill"
                                    >
                                      <i className="fas fa-trash"></i>
                                    </button>
                                    {(user.role === 'admin' || user.role === 'hr') && !skill.isVerified && (
                                      <button
                                        onClick={() => handleVerify(skill._id)}
                                        className="btn btn-outline-success btn-sm"
                                        title="Verify Skill"
                                      >
                                        <i className="fas fa-check"></i>
                                      </button>
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
                      <i className="fas fa-rocket fa-4x text-muted mb-3"></i>
                      <h5 className="text-muted">No skills found</h5>
                      <p className="text-muted mb-3">Start by adding your first skill!</p>
                      <button
                        onClick={() => setShowForm(true)}
                        className="btn btn-primary-custom"
                      >
                        <i className="fas fa-plus me-2"></i>
                        Add Your First Skill
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Skill Form */}
            {showForm && (
              <div className="col-lg-4">
                <div className="dashboard-card sticky-top" style={{top: '100px'}}>
                  <div className="card-header bg-transparent border-bottom">
                    <h3 className="h5 mb-0">
                      <i className="fas fa-plus-circle me-2 text-success"></i>
                      {editingId ? 'Edit Skill' : `Add Skill #${skillNumber}`}
                    </h3>
                  </div>
                  <div className="card-body">
                    <form onSubmit={handleSubmit}>
                      <div className="mb-3">
                        <label className="form-label fw-medium">Skill Name</label>
                        <input
                          type="text"
                          className="form-control"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="e.g., JavaScript, Project Management"
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
                          <option value="soft">Soft Skills</option>
                          <option value="leadership">Leadership</option>
                          <option value="language">Language</option>
                        </select>
                      </div>

                      <div className="mb-3">
                        <label className="form-label fw-medium">Proficiency Level</label>
                        <select
                          className="form-select"
                          value={formData.proficiency}
                          onChange={(e) => setFormData({ ...formData, proficiency: e.target.value })}
                        >
                          <option value="beginner">Beginner</option>
                          <option value="intermediate">Intermediate</option>
                          <option value="advanced">Advanced</option>
                          <option value="expert">Expert</option>
                        </select>
                      </div>

                      <div className="mb-4">
                        <label className="form-label fw-medium">
                          Years of Experience
                        </label>
                        <input
                          type="number"
                          className="form-control"
                          min="0"
                          max="50"
                          value={formData.yearsOfExperience}
                          onChange={(e) => setFormData({ ...formData, yearsOfExperience: parseInt(e.target.value) || 0 })}
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
                              {editingId ? 'Update Skill' : 'Add Skill'}
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

export default Skills;