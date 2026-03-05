import React, { useState } from 'react';
import { Modal, Nav, Tab } from 'react-bootstrap';
import UserProfileTab from './UserProfileTab';
import UserActivityTab from './UserActivityTab';
import UserPermissionsTab from './UserPermissionsTab';

const UserDetailsModal = ({ show, user, onHide }) => {
  const [activeTab, setActiveTab] = useState('profile');

  if (!user) return null;

  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton className="border-0 pb-0">
        <Modal.Title className="fw-bold">User Details</Modal.Title>
      </Modal.Header>
      <Modal.Body className="p-0">
        {/* User Header */}
        <div className="px-4 pt-3 pb-4 bg-light">
          <div className="d-flex align-items-center">
            <div 
              className="rounded-circle d-flex align-items-center justify-content-center me-3"
              style={{ 
                width: '80px', 
                height: '80px',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                fontWeight: '600',
                fontSize: '2rem'
              }}
            >
              {user.avatar}
            </div>
            <div className="flex-grow-1">
              <h4 className="fw-bold mb-1">{user.username}</h4>
              <p className="text-muted mb-2">{user.email}</p>
              <div className="d-flex gap-2 align-items-center">
                {Array.isArray(user.roles) && user.roles.map((role, index) => (
                  <span key={index} className="badge bg-primary bg-opacity-10 text-primary px-3 py-2">
                    {role}
                  </span>
                ))}
                <span className={`badge bg-${user.status === 'Active' ? 'success' : 'secondary'} bg-opacity-10 text-${user.status === 'Active' ? 'success' : 'secondary'} px-3 py-2`}>
                  {user.status}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tab.Container activeKey={activeTab} onSelect={(k) => setActiveTab(k)}>
          <Nav variant="tabs" className="px-4 border-bottom">
            <Nav.Item>
              <Nav.Link eventKey="profile" className="px-3 py-3">
                <i className="bi bi-person me-2"></i>
                Profile
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="activity" className="px-3 py-3">
                <i className="bi bi-clock-history me-2"></i>
                Activity
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              {/* <Nav.Link eventKey="permissions" className="px-3 py-3">
                <i className="bi bi-shield-check me-2"></i>
                Permissions
              </Nav.Link> */}
            </Nav.Item>
          </Nav>

          <Tab.Content className="p-4">
            <Tab.Pane eventKey="profile">
              <UserProfileTab user={user} />
            </Tab.Pane>
            <Tab.Pane eventKey="activity">
              <UserActivityTab user={user} />
            </Tab.Pane>
            {/* <Tab.Pane eventKey="permissions">
              <UserPermissionsTab user={user} />
            </Tab.Pane> */}
          </Tab.Content>
        </Tab.Container>
      </Modal.Body>
    </Modal>
  );
};

export default UserDetailsModal;