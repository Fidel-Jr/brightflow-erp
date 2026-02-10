import React from 'react';
import { Row, Col, ListGroup, Badge } from 'react-bootstrap';
import { formatSmartDateTime } from '../../helper/formatPrettyDateTime';

const UserProfileTab = ({ user }) => {
  const profileData = [
    {
      icon: 'bi-person',
      label: 'Username',
      value: user.username
    },
    {
      icon: 'bi-envelope',
      label: 'Email Address',
      value: user.email
    },
    {
      icon: 'bi-telephone',
      label: 'Phone Number',
      value: user.phone || 'Not provided'
    },
    {
      icon: 'bi-briefcase',
      label: 'Department',
      value: user.department || 'Not assigned'
    },
    {
      icon: 'bi-geo-alt',
      label: 'Location',
      value: user.location || 'Not specified'
    },
    {
      icon: 'bi-calendar-plus',
      label: 'Join Date',
      value: user.createdAt ? formatSmartDateTime(user.createdAt) : 'Unknown'
    },
    {
      icon: 'bi-clock',
      label: 'Last Login',
      value: user.lastLoginAt ? formatSmartDateTime(user.lastLoginAt) : 'Never'
    },
    {
      icon: 'bi-shield-check',
      label: 'Account Status',
      value: (
        <Badge bg={user.status === 'Active' ? 'success' : 'secondary'} className="bg-opacity-10">
          <span className={`text-${user.status === 'Active' ? 'success' : 'secondary'}`}>
            {user.status}
          </span>
        </Badge>
      )
    }
  ];

  return (
    <div>
      <h6 className="fw-bold mb-3 text-uppercase text-muted" style={{ fontSize: '0.75rem' }}>
        Personal Information
      </h6>
      
      <ListGroup variant="flush">
        {profileData.map((item, index) => (
          <ListGroup.Item key={index} className="px-0 py-3 border-bottom">
            <Row>
              <Col xs={5} className="d-flex align-items-center">
                <i className={`${item.icon} me-2 text-muted`}></i>
                <span className="text-muted">{item.label}</span>
              </Col>
              <Col xs={7}>
                <span className="fw-semibold">
                  {typeof item.value === 'string' ? item.value : item.value}
                </span>
              </Col>
            </Row>
          </ListGroup.Item>
        ))}
      </ListGroup>

      {/* Roles Section */}
      <div className="mt-4">
        <h6 className="fw-bold mb-3 text-uppercase text-muted" style={{ fontSize: '0.75rem' }}>
          Assigned Roles
        </h6>
        <div className="d-flex flex-wrap gap-2">
          {Array.isArray(user.roles) && user.roles.length > 0 ? (
            user.roles.map((role, index) => (
              <Badge key={index} bg="primary" className="bg-opacity-10 px-3 py-2">
                <span className="text-primary">
                  <i className="bi bi-shield-fill me-1"></i>
                  {role}
                </span>
              </Badge>
            ))
          ) : (
            <span className="text-muted">No roles assigned</span>
          )}
        </div>
      </div>

      {/* Bio/Notes Section */}
      {user.bio && (
        <div className="mt-4">
          <h6 className="fw-bold mb-3 text-uppercase text-muted" style={{ fontSize: '0.75rem' }}>
            Bio / Notes
          </h6>
          <p className="text-muted mb-0">{user.bio}</p>
        </div>
      )}
    </div>
  );
};

export default UserProfileTab;