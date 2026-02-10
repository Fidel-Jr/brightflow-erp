import React from 'react';
import { Badge } from 'react-bootstrap';
import { formatSmartDateTime, formatRelativeTime } from '../../helper/formatPrettyDateTime';

const UserActivityTab = ({ user }) => {
  // Mock activity data - replace with real data from your API
  const activities = [
    {
      id: 1,
      type: 'login',
      description: 'Logged in to the system',
      timestamp: user.lastLoginAt || new Date().toISOString(),
      icon: 'bi-box-arrow-in-right',
      color: 'success'
    },
    {
      id: 2,
      type: 'update',
      description: 'Updated profile information',
      timestamp: new Date(Date.now() - 3600000 * 24).toISOString(),
      icon: 'bi-pencil-square',
      color: 'primary'
    },
    {
      id: 3,
      type: 'role',
      description: 'Role changed to Manager',
      timestamp: new Date(Date.now() - 3600000 * 48).toISOString(),
      icon: 'bi-shield-check',
      color: 'warning'
    },
    {
      id: 4,
      type: 'password',
      description: 'Password was changed',
      timestamp: new Date(Date.now() - 3600000 * 72).toISOString(),
      icon: 'bi-key',
      color: 'info'
    },
    {
      id: 5,
      type: 'create',
      description: 'Account created',
      timestamp: user.createdAt || new Date(Date.now() - 3600000 * 168).toISOString(),
      icon: 'bi-person-plus',
      color: 'success'
    }
  ];

  return (
    <div>
      <h6 className="fw-bold mb-3 text-uppercase text-muted" style={{ fontSize: '0.75rem' }}>
        Recent Activity
      </h6>

      <div className="position-relative">
        {activities.map((activity, index) => (
          <div key={activity.id} className="d-flex mb-4 position-relative">
            {/* Timeline line */}
            {index !== activities.length - 1 && (
              <div 
                className="position-absolute bg-light" 
                style={{ 
                  left: '19px', 
                  top: '40px', 
                  width: '2px', 
                  height: 'calc(100% + 16px)' 
                }}
              />
            )}

            {/* Icon */}
            <div 
              className={`rounded-circle d-flex align-items-center justify-content-center bg-${activity.color} bg-opacity-10 me-3`}
              style={{ 
                width: '40px', 
                height: '40px',
                minWidth: '40px',
                position: 'relative',
                zIndex: 1
              }}
            >
              <i className={`${activity.icon} text-${activity.color}`}></i>
            </div>

            {/* Content */}
            <div className="flex-grow-1">
              <div className="d-flex justify-content-between align-items-start mb-1">
                <p className="mb-0 fw-semibold">{activity.description}</p>
                <Badge bg="light" text="dark" className="ms-2">
                  {formatRelativeTime(activity.timestamp)}
                </Badge>
              </div>
              <small className="text-muted">
                {formatSmartDateTime(activity.timestamp)}
              </small>
            </div>
          </div>
        ))}
      </div>

      {/* Stats Cards */}
      <div className="mt-4">
        <h6 className="fw-bold mb-3 text-uppercase text-muted" style={{ fontSize: '0.75rem' }}>
          Activity Statistics
        </h6>
        <div className="row g-3">
          <div className="col-6">
            <div className="card border-0 bg-light">
              <div className="card-body p-3 text-center">
                <div className="display-6 fw-bold text-primary">24</div>
                <small className="text-muted">Total Logins</small>
              </div>
            </div>
          </div>
          <div className="col-6">
            <div className="card border-0 bg-light">
              <div className="card-body p-3 text-center">
                <div className="display-6 fw-bold text-success">156</div>
                <small className="text-muted">Actions</small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserActivityTab;