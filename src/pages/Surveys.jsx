import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
const Surveys = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [surveys, setSurveys] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [showResponseForm, setShowResponseForm] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    questions: [{ question: '', type: 'multiple_choice', options: [''], required: false }],
    targetAudience: 'all',
    department: '',
    role: '',
    startDate: '',
    endDate: ''
  });
  const [responseData, setResponseData] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchSurveys();
  }, []);

  const fetchSurveys = async () => {
    try {
      const response = await api.get('/api/surveys', { withCredentials: true });
      setSurveys(response.data);
    } catch (error) {
      console.error('Error fetching surveys:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post('/api/surveys', formData, { withCredentials: true });
      setShowForm(false);
      setFormData({
        title: '',
        description: '',
        questions: [{ question: '', type: 'multiple_choice', options: [''], required: false }],
        targetAudience: 'all',
        department: '',
        role: '',
        startDate: '',
        endDate: ''
      });
      fetchSurveys();
    } catch (error) {
      console.error('Error saving survey:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleResponseSubmit = async (surveyId) => {
    setLoading(true);
    try {
      const answers = formData.questions.map((question, index) => responseData[index]);
      await api.post(`/api/surveys/${surveyId}/respond`, { answers }, { withCredentials: true });
      setShowResponseForm(null);
      setResponseData({});
      fetchSurveys();
    } catch (error) {
      console.error('Error submitting response:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const addQuestion = () => {
    setFormData({
      ...formData,
      questions: [...formData.questions, { question: '', type: 'multiple_choice', options: [''], required: false }]
    });
  };

  const updateQuestion = (index, field, value) => {
    const newQuestions = [...formData.questions];
    newQuestions[index][field] = value;
    setFormData({ ...formData, questions: newQuestions });
  };

  const addOption = (questionIndex) => {
    const newQuestions = [...formData.questions];
    newQuestions[questionIndex].options.push('');
    setFormData({ ...formData, questions: newQuestions });
  };

  const updateOption = (questionIndex, optionIndex, value) => {
    const newQuestions = [...formData.questions];
    newQuestions[questionIndex].options[optionIndex] = value;
    setFormData({ ...formData, questions: newQuestions });
  };

  const removeQuestion = (index) => {
    const newQuestions = formData.questions.filter((_, i) => i !== index);
    setFormData({ ...formData, questions: newQuestions });
  };

  const hasResponded = (survey) => {
    return survey.responses.some(response => response.employee._id === user.id);
  };

  const isSurveyActive = (survey) => {
    const now = new Date();
    const start = new Date(survey.startDate);
    const end = new Date(survey.endDate);
    return survey.isActive && now >= start && now <= end;
  };

  return (
    <div className="container-fluid py-4 mt-5">
      <div className="row">
        <div className="col-12">
          <div className="dashboard-card p-4 mb-4">
            <div className="row align-items-center">
              <div className="col-md-6">
                <h1 className="h2 fw-bold text-primary mb-2">
                  <i className="fas fa-chart-bar me-2"></i>
                  Employee Surveys
                </h1>
                <p className="text-muted mb-0">
                  Share your feedback through anonymous surveys
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
                      Create Survey
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
            {/* Surveys List */}
            <div className="col-lg-8">
              <div className="dashboard-card">
                <div className="card-header bg-transparent border-bottom">
                  <h3 className="h5 mb-0">
                    <i className="fas fa-list me-2 text-primary"></i>
                    Available Surveys
                  </h3>
                </div>
                <div className="card-body">
                  {surveys.length > 0 ? (
                    <div className="row g-3">
                      {surveys.map((survey) => (
                        <div key={survey._id} className="col-12">
                          <div className="card border-0 shadow-sm hover-lift">
                            <div className="card-body">
                              <div className="row align-items-center">
                                <div className="col-md-8">
                                  <div className="d-flex align-items-center mb-2">
                                    <h5 className="card-title mb-0">{survey.title}</h5>
                                    <span className={`badge ${isSurveyActive(survey) ? 'bg-success' : 'bg-secondary'} ms-2`}>
                                      {isSurveyActive(survey) ? 'Active' : 'Inactive'}
                                    </span>
                                    {hasResponded(survey) && (
                                      <span className="badge bg-info ms-2">Responded</span>
                                    )}
                                  </div>
                                  <p className="card-text text-muted mb-3">{survey.description}</p>
                                  <div className="d-flex flex-wrap gap-3 mb-3">
                                    <small className="text-muted">
                                      <i className="fas fa-users me-1"></i>
                                      {survey.responses.length} responses
                                    </small>
                                    <small className="text-muted">
                                      <i className="fas fa-calendar me-1"></i>
                                      Until: {new Date(survey.endDate).toLocaleDateString()}
                                    </small>
                                    <small className="text-muted">
                                      <i className="fas fa-question me-1"></i>
                                      {survey.questions.length} questions
                                    </small>
                                  </div>
                                </div>
                                <div className="col-md-4 text-md-end">
                                  {isSurveyActive(survey) && !hasResponded(survey) && (
                                    <button
                                      onClick={() => setShowResponseForm(survey._id)}
                                      className="btn btn-success"
                                    >
                                      <i className="fas fa-edit me-2"></i>
                                      Take Survey
                                    </button>
                                  )}
                                  {hasResponded(survey) && (
                                    <span className="badge bg-success">
                                      <i className="fas fa-check me-1"></i>
                                      Completed
                                    </span>
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
                      <i className="fas fa-chart-bar fa-4x text-muted mb-3"></i>
                      <h5 className="text-muted">No surveys available</h5>
                      <p className="text-muted mb-3">Check back later for new survey opportunities!</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Survey Response Form */}
            {showResponseForm && (
              <div className="col-lg-4">
                <div className="dashboard-card sticky-top" style={{top: '100px'}}>
                  <div className="card-header bg-transparent border-bottom">
                    <h3 className="h5 mb-0">
                      <i className="fas fa-edit me-2 text-success"></i>
                      Survey Response
                    </h3>
                  </div>
                  <div className="card-body">
                    {surveys.find(s => s._id === showResponseForm)?.questions.map((question, index) => (
                      <div key={index} className="mb-4">
                        <label className="form-label fw-medium">
                          {question.question}
                          {question.required && <span className="text-danger">*</span>}
                        </label>
                        {question.type === 'multiple_choice' ? (
                          <div>
                            {question.options.map((option, optIndex) => (
                              <div key={optIndex} className="form-check">
                                <input
                                  className="form-check-input"
                                  type="radio"
                                  name={`question-${index}`}
                                  value={option}
                                  onChange={(e) => setResponseData({
                                    ...responseData,
                                    [index]: e.target.value
                                  })}
                                />
                                <label className="form-check-label">
                                  {option}
                                </label>
                              </div>
                            ))}
                          </div>
                        ) : question.type === 'rating' ? (
                          <div>
                            {[1, 2, 3, 4, 5].map((rating) => (
                              <div key={rating} className="form-check form-check-inline">
                                <input
                                  className="form-check-input"
                                  type="radio"
                                  name={`question-${index}`}
                                  value={rating}
                                  onChange={(e) => setResponseData({
                                    ...responseData,
                                    [index]: parseInt(e.target.value)
                                  })}
                                />
                                <label className="form-check-label">{rating}</label>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <textarea
                            className="form-control"
                            rows="3"
                            onChange={(e) => setResponseData({
                              ...responseData,
                              [index]: e.target.value
                            })}
                            placeholder="Your response..."
                          />
                        )}
                      </div>
                    ))}
                    <div className="d-grid gap-2">
                      <button
                        onClick={() => handleResponseSubmit(showResponseForm)}
                        disabled={loading}
                        className="btn btn-success"
                      >
                        {loading ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                            Submitting...
                          </>
                        ) : (
                          <>
                            <i className="fas fa-paper-plane me-2"></i>
                            Submit Response
                          </>
                        )}
                      </button>
                      <button
                        onClick={() => setShowResponseForm(null)}
                        className="btn btn-outline-secondary"
                      >
                        <i className="fas fa-times me-2"></i>
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Survey Creation Form */}
            {showForm && (
              <div className="col-lg-4">
                <div className="dashboard-card sticky-top" style={{top: '100px'}}>
                  <div className="card-header bg-transparent border-bottom">
                    <h3 className="h5 mb-0">
                      <i className="fas fa-plus-circle me-2 text-success"></i>
                      Create New Survey
                    </h3>
                  </div>
                  <div className="card-body">
                    <form onSubmit={handleSubmit}>
                      <div className="mb-3">
                        <label className="form-label fw-medium">Survey Title</label>
                        <input
                          type="text"
                          className="form-control"
                          required
                          value={formData.title}
                          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                          placeholder="Enter survey title"
                        />
                      </div>

                      <div className="mb-3">
                        <label className="form-label fw-medium">Description</label>
                        <textarea
                          className="form-control"
                          rows="3"
                          value={formData.description}
                          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                          placeholder="Describe the purpose of this survey"
                        />
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

                      <div className="mb-4">
                        <label className="form-label fw-medium">Questions</label>
                        {formData.questions.map((question, index) => (
                          <div key={index} className="card mb-3">
                            <div className="card-body">
                              <div className="d-flex justify-content-between align-items-center mb-2">
                                <h6 className="mb-0">Question {index + 1}</h6>
                                {formData.questions.length > 1 && (
                                  <button
                                    type="button"
                                    className="btn btn-outline-danger btn-sm"
                                    onClick={() => removeQuestion(index)}
                                  >
                                    <i className="fas fa-times"></i>
                                  </button>
                                )}
                              </div>
                              <input
                                type="text"
                                className="form-control mb-2"
                                value={question.question}
                                onChange={(e) => updateQuestion(index, 'question', e.target.value)}
                                placeholder="Enter question"
                              />
                              <select
                                className="form-select mb-2"
                                value={question.type}
                                onChange={(e) => updateQuestion(index, 'type', e.target.value)}
                              >
                                <option value="multiple_choice">Multiple Choice</option>
                                <option value="rating">Rating (1-5)</option>
                                <option value="text">Text Response</option>
                              </select>
                              {question.type === 'multiple_choice' && (
                                <div>
                                  {question.options.map((option, optIndex) => (
                                    <div key={optIndex} className="input-group mb-1">
                                      <input
                                        type="text"
                                        className="form-control"
                                        value={option}
                                        onChange={(e) => updateOption(index, optIndex, e.target.value)}
                                        placeholder={`Option ${optIndex + 1}`}
                                      />
                                    </div>
                                  ))}
                                  <button
                                    type="button"
                                    className="btn btn-outline-secondary btn-sm"
                                    onClick={() => addOption(index)}
                                  >
                                    <i className="fas fa-plus me-1"></i>
                                    Add Option
                                  </button>
                                </div>
                              )}
                              <div className="form-check mt-2">
                                <input
                                  type="checkbox"
                                  className="form-check-input"
                                  checked={question.required}
                                  onChange={(e) => updateQuestion(index, 'required', e.target.checked)}
                                />
                                <label className="form-check-label">Required question</label>
                              </div>
                            </div>
                          </div>
                        ))}
                        <button
                          type="button"
                          className="btn btn-outline-secondary btn-sm"
                          onClick={addQuestion}
                        >
                          <i className="fas fa-plus me-1"></i>
                          Add Question
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
                              Creating...
                            </>
                          ) : (
                            <>
                              <i className="fas fa-save me-2"></i>
                              Create Survey
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

export default Surveys;