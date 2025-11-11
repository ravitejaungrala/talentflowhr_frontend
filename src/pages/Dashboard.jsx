import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import api from '../services/api';
const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    feedbackCount: 0,
    pendingLeaves: 0,
    skillsCount: 0,
    employeesCount: 0,
    recognitionCount: 0,
    trainingCount: 0,
    goalsCount: 0,
    announcementsCount: 0
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [
        feedbackRes, 
        leavesRes, 
        skillsRes, 
        employeesRes,
        recognitionRes,
        trainingRes,
        goalsRes,
        announcementsRes,
        leaderboardRes
      ] = await Promise.all([
        api.get('/api/feedback', { withCredentials: true }),
        api.get('/api/leaves', { withCredentials: true }),
        api.get('/api/skills', { withCredentials: true }),
        user?.role === 'admin' ? api.get('/api/employees', { withCredentials: true }) : Promise.resolve({ data: [] }),
        api.get('/api/recognition', { withCredentials: true }),
        api.get('/api/training', { withCredentials: true }),
        api.get('/api/goals', { withCredentials: true }),
        api.get('/api/announcements', { withCredentials: true }),
        api.get('/api/recognition/leaderboard', { withCredentials: true })
      ]);

      const pendingLeaves = leavesRes.data.filter(leave => leave.status === 'pending').length;

      setStats({
        feedbackCount: feedbackRes.data.length,
        pendingLeaves,
        skillsCount: skillsRes.data.length,
        employeesCount: employeesRes.data.length,
        recognitionCount: recognitionRes.data.length,
        trainingCount: trainingRes.data.length,
        goalsCount: goalsRes.data.length,
        announcementsCount: announcementsRes.data.length
      });

      setLeaderboard(leaderboardRes.data.slice(0, 5));

      // Combine recent activity
      const activity = [
        ...feedbackRes.data.slice(0, 2).map(f => ({
          type: 'feedback',
          message: `New feedback from ${f.fromEmployee.name}`,
          time: f.createdAt,
          id: f._id,
          icon: 'fa-comments',
          color: 'text-primary'
        })),
        ...leavesRes.data.slice(0, 2).map(l => ({
          type: 'leave',
          message: `Leave request from ${l.employee.name}`,
          time: l.createdAt,
          id: l._id,
          icon: 'fa-calendar-alt',
          color: 'text-warning'
        })),
        ...recognitionRes.data.slice(0, 2).map(r => ({
          type: 'recognition',
          message: `${r.fromEmployee.name} recognized ${r.toEmployee.name}`,
          time: r.createdAt,
          id: r._id,
          icon: 'fa-trophy',
          color: 'text-success'
        })),
        ...announcementsRes.data.slice(0, 2).map(a => ({
          type: 'announcement',
          message: `New announcement: ${a.title}`,
          time: a.createdAt,
          id: a._id,
          icon: 'fa-bullhorn',
          color: 'text-info'
        }))
      ].sort((a, b) => new Date(b.time) - new Date(a.time)).slice(0, 6);

      setRecentActivity(activity);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const handleStatClick = (type) => {
    navigate(`/${type}`);
  };

  if (loading) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center">
        <div className="text-center">
          <div className="spinner-border text-primary" style={{width: '3rem', height: '3rem'}} role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid py-4 mt-5">
      <div className="row">
        <div className="col-12">
          {/* Welcome Section */}
          <div className="dashboard-card p-4 mb-4">
            <div className="row align-items-center">
              <div className="col-md-8">
                <h1 className="h2 fw-bold text-primary mb-2">
                  Welcome back, {user?.name}! 👋
                </h1>
                <p className="text-muted mb-0">
                  Here's what's happening in your HR dashboard today.
                </p>
              </div>
              <div className="col-md-4 text-md-end">
                <div className="d-flex align-items-center justify-content-end gap-3">
                  <div className="badge bg-primary fs-6 p-2">
                    <i className="fas fa-user-tie me-2"></i>
                    {user?.role?.toUpperCase()}
                  </div>
                  <button
                    onClick={handleLogout}
                    className="btn btn-outline-danger btn-sm"
                    title="Logout"
                  >
                    <i className="fas fa-sign-out-alt me-1"></i>
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="row g-3 mb-5">
            <div className="col-xl-3 col-md-6">
              <div 
                className="dashboard-card stats-card hover-lift cursor-pointer"
                onClick={() => handleStatClick('feedback')}
              >
                <div className="stats-icon text-primary">
                  <i className="fas fa-comments"></i>
                </div>
                <div className="stats-number">{stats.feedbackCount}</div>
                <p className="text-muted mb-0">Total Feedback</p>
                <div className="mt-2">
                  <small className="text-primary">
                    <i className="fas fa-external-link-alt me-1"></i>
                    Click to view
                  </small>
                </div>
              </div>
            </div>

            <div className="col-xl-3 col-md-6">
              <div 
                className="dashboard-card stats-card hover-lift cursor-pointer"
                onClick={() => handleStatClick('leaves')}
              >
                <div className="stats-icon text-warning">
                  <i className="fas fa-calendar-alt"></i>
                </div>
                <div className="stats-number">{stats.pendingLeaves}</div>
                <p className="text-muted mb-0">Pending Leaves</p>
                <div className="mt-2">
                  <small className="text-primary">
                    <i className="fas fa-external-link-alt me-1"></i>
                    Click to manage
                  </small>
                </div>
              </div>
            </div>

            <div className="col-xl-3 col-md-6">
              <div 
                className="dashboard-card stats-card hover-lift cursor-pointer"
                onClick={() => handleStatClick('skills')}
              >
                <div className="stats-icon text-success">
                  <i className="fas fa-rocket"></i>
                </div>
                <div className="stats-number">{stats.skillsCount}</div>
                <p className="text-muted mb-0">Skills Tracked</p>
                <div className="mt-2">
                  <small className="text-primary">
                    <i className="fas fa-external-link-alt me-1"></i>
                    Click to view
                  </small>
                </div>
              </div>
            </div>

            <div className="col-xl-3 col-md-6">
              <div 
                className="dashboard-card stats-card hover-lift cursor-pointer"
                onClick={() => handleStatClick('recognition')}
              >
                <div className="stats-icon text-info">
                  <i className="fas fa-trophy"></i>
                </div>
                <div className="stats-number">{stats.recognitionCount}</div>
                <p className="text-muted mb-0">Recognitions</p>
                <div className="mt-2">
                  <small className="text-primary">
                    <i className="fas fa-external-link-alt me-1"></i>
                    Click to view
                  </small>
                </div>
              </div>
            </div>

            {(user?.role === 'admin' || user?.role === 'hr') && (
              <div className="col-xl-3 col-md-6">
                <div 
                  className="dashboard-card stats-card hover-lift cursor-pointer"
                  onClick={() => handleStatClick('employees')}
                >
                  <div className="stats-icon text-secondary">
                    <i className="fas fa-users"></i>
                  </div>
                  <div className="stats-number">{stats.employeesCount}</div>
                  <p className="text-muted mb-0">Employees</p>
                  <div className="mt-2">
                    <small className="text-primary">
                      <i className="fas fa-external-link-alt me-1"></i>
                      Click to manage
                    </small>
                  </div>
                </div>
              </div>
            )}

            <div className="col-xl-3 col-md-6">
              <div 
                className="dashboard-card stats-card hover-lift cursor-pointer"
                onClick={() => handleStatClick('training')}
              >
                <div className="stats-icon text-purple">
                  <i className="fas fa-graduation-cap"></i>
                </div>
                <div className="stats-number">{stats.trainingCount}</div>
                <p className="text-muted mb-0">Training Programs</p>
                <div className="mt-2">
                  <small className="text-primary">
                    <i className="fas fa-external-link-alt me-1"></i>
                    Click to view
                  </small>
                </div>
              </div>
            </div>

            <div className="col-xl-3 col-md-6">
              <div 
                className="dashboard-card stats-card hover-lift cursor-pointer"
                onClick={() => handleStatClick('goals')}
              >
                <div className="stats-icon text-orange">
                  <i className="fas fa-bullseye"></i>
                </div>
                <div className="stats-number">{stats.goalsCount}</div>
                <p className="text-muted mb-0">Active Goals</p>
                <div className="mt-2">
                  <small className="text-primary">
                    <i className="fas fa-external-link-alt me-1"></i>
                    Click to view
                  </small>
                </div>
              </div>
            </div>

            <div className="col-xl-3 col-md-6">
              <div 
                className="dashboard-card stats-card hover-lift cursor-pointer"
                onClick={() => handleStatClick('announcements')}
              >
                <div className="stats-icon text-pink">
                  <i className="fas fa-bullhorn"></i>
                </div>
                <div className="stats-number">{stats.announcementsCount}</div>
                <p className="text-muted mb-0">Announcements</p>
                <div className="mt-2">
                  <small className="text-primary">
                    <i className="fas fa-external-link-alt me-1"></i>
                    Click to view
                  </small>
                </div>
              </div>
            </div>
          </div>

          <div className="row g-4">
            {/* Recent Activity */}
            <div className="col-lg-6">
              <div className="dashboard-card h-100">
                <div className="card-header bg-transparent border-bottom">
                  <h3 className="h5 mb-0">
                    <i className="fas fa-history me-2 text-primary"></i>
                    Recent Activity
                  </h3>
                </div>
                <div className="card-body">
                  {recentActivity.length > 0 ? (
                    <div className="list-group list-group-flush">
                      {recentActivity.map((activity, index) => (
                        <div key={index} className="list-group-item d-flex align-items-center border-0 py-3">
                          <div className={`flex-shrink-0 ${activity.color} me-3`}>
                            <i className={`fas ${activity.icon} fa-lg`}></i>
                          </div>
                          <div className="flex-grow-1">
                            <p className="mb-1 fw-medium">{activity.message}</p>
                            <small className="text-muted">
                              {new Date(activity.time).toLocaleDateString()} at{' '}
                              {new Date(activity.time).toLocaleTimeString()}
                            </small>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <i className="fas fa-inbox fa-3x text-muted mb-3"></i>
                      <p className="text-muted">No recent activity</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Recognition Leaderboard */}
            <div className="col-lg-6">
              <div className="dashboard-card h-100">
                <div className="card-header bg-transparent border-bottom">
                  <h3 className="h5 mb-0">
                    <i className="fas fa-trophy me-2 text-warning"></i>
                    Recognition Leaderboard
                  </h3>
                </div>
                <div className="card-body">
                  {leaderboard.length > 0 ? (
                    <div className="list-group list-group-flush">
                      {leaderboard.map((item, index) => (
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
                      <p className="text-muted">No recognition data yet</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Quick Actions & Profile */}
            <div className="col-lg-6">
              <div className="dashboard-card h-100">
                <div className="card-header bg-transparent border-bottom">
                  <h3 className="h5 mb-0">
                    <i className="fas fa-bolt me-2 text-success"></i>
                    Quick Actions
                  </h3>
                </div>
                <div className="card-body">
                  <div className="row g-2">
                    <div className="col-6">
                      <Link to="/feedback" className="btn btn-outline-primary w-100 text-start">
                        <i className="fas fa-comment me-2"></i>
                        Give Feedback
                      </Link>
                    </div>
                    <div className="col-6">
                      <Link to="/leaves" className="btn btn-outline-warning w-100 text-start">
                        <i className="fas fa-calendar-plus me-2"></i>
                        Request Leave
                      </Link>
                    </div>
                    <div className="col-6">
                      <Link to="/skills" className="btn btn-outline-success w-100 text-start">
                        <i className="fas fa-plus-circle me-2"></i>
                        Add Skills
                      </Link>
                    </div>
                    <div className="col-6">
                      <Link to="/recognition" className="btn btn-outline-info w-100 text-start">
                        <i className="fas fa-trophy me-2"></i>
                        Recognize Peer
                      </Link>
                    </div>
                    <div className="col-6">
                      <Link to="/training" className="btn btn-outline-purple w-100 text-start">
                        <i className="fas fa-graduation-cap me-2"></i>
                        Browse Training
                      </Link>
                    </div>
                    <div className="col-6">
                      <Link to="/goals" className="btn btn-outline-orange w-100 text-start">
                        <i className="fas fa-bullseye me-2"></i>
                        Set Goals
                      </Link>
                    </div>
                    {(user?.role === 'admin' || user?.role === 'hr') && (
                      <>
                        <div className="col-6">
                          <Link to="/employees" className="btn btn-outline-secondary w-100 text-start">
                            <i className="fas fa-users me-2"></i>
                            Manage Employees
                          </Link>
                        </div>
                        <div className="col-6">
                          <Link to="/announcements" className="btn btn-outline-pink w-100 text-start">
                            <i className="fas fa-bullhorn me-2"></i>
                            Post Announcement
                          </Link>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* User Profile Card */}
            <div className="col-lg-6">
              <div className="dashboard-card h-100">
                <div className="card-header bg-transparent border-bottom">
                  <h3 className="h5 mb-0">
                    <i className="fas fa-user-circle me-2 text-info"></i>
                    Your Profile
                  </h3>
                </div>
                <div className="card-body">
                  <div className="text-center mb-3">
                    <div className="bg-primary rounded-circle d-inline-flex align-items-center justify-content-center" 
                         style={{width: '80px', height: '80px'}}>
                      <i className="fas fa-user fa-2x text-white"></i>
                    </div>
                  </div>
                  <div className="row g-2">
                    <div className="col-5 text-muted">Name:</div>
                    <div className="col-7 fw-medium">{user?.name}</div>
                    
                    <div className="col-5 text-muted">Role:</div>
                    <div className="col-7">
                      <span className="badge bg-primary text-capitalize">{user?.role}</span>
                    </div>
                    
                    <div className="col-5 text-muted">Department:</div>
                    <div className="col-7">{user?.department || 'Not set'}</div>
                    
                    <div className="col-5 text-muted">Position:</div>
                    <div className="col-7">{user?.position || 'Not set'}</div>
                    
                    <div className="col-5 text-muted">Email:</div>
                    <div className="col-7 text-truncate">{user?.email}</div>
                  </div>
                  
                  {/* Logout Button in Profile Card */}
                  <div className="mt-4 pt-3 border-top">
                    <button
                      onClick={handleLogout}
                      className="btn btn-outline-danger w-100"
                    >
                      <i className="fas fa-sign-out-alt me-2"></i>
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;