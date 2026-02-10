import React from 'react';
import { Accordion, Badge, ListGroup } from 'react-bootstrap';

const UserPermissionsTab = ({ user }) => {
  // Mock permissions data based on user roles
  const permissionsByRole = {
    'Admin': {
      users: ['create', 'read', 'update', 'delete'],
      roles: ['create', 'read', 'update', 'delete'],
      inventory: ['create', 'read', 'update', 'delete'],
      orders: ['create', 'read', 'update', 'delete'],
      reports: ['read', 'export']
    },
    'Manager': {
      users: ['read', 'update'],
      roles: ['read'],
      inventory: ['create', 'read', 'update'],
      orders: ['create', 'read', 'update'],
      reports: ['read', 'export']
    },
    'Warehouse Staff': {
      inventory: ['read', 'update'],
      orders: ['read', 'update'],
      reports: ['read']
    },
    'Delivery Staff': {
      orders: ['read', 'update'],
      reports: ['read']
    }
  };

  // Get all permissions for user's roles
  const getAllPermissions = () => {
    const allPermissions = {};
    
    if (Array.isArray(user.roles)) {
      user.roles.forEach(role => {
        const rolePerms = permissionsByRole[role] || {};
        Object.entries(rolePerms).forEach(([module, actions]) => {
          if (!allPermissions[module]) {
            allPermissions[module] = new Set();
          }
          actions.forEach(action => allPermissions[module].add(action));
        });
      });
    }

    // Convert Sets back to arrays
    Object.keys(allPermissions).forEach(key => {
      allPermissions[key] = Array.from(allPermissions[key]);
    });

    return allPermissions;
  };

  const permissions = getAllPermissions();

  const permissionModules = [
    { name: 'users', label: 'User Management', icon: 'bi-people' },
    { name: 'roles', label: 'Role Management', icon: 'bi-shield-check' },
    { name: 'inventory', label: 'Inventory Management', icon: 'bi-box' },
    { name: 'orders', label: 'Order Management', icon: 'bi-cart' },
    { name: 'reports', label: 'Reports & Analytics', icon: 'bi-graph-up' }
  ];

  const getPermissionColor = (action) => {
    const colors = {
      'create': 'success',
      'read': 'info',
      'update': 'warning',
      'delete': 'danger',
      'export': 'primary'
    };
    return colors[action] || 'secondary';
  };

  return (
    <div>
      <h6 className="fw-bold mb-3 text-uppercase text-muted" style={{ fontSize: '0.75rem' }}>
        Permissions Overview
      </h6>

      {/* Permission Summary */}
      <div className="card bg-light border-0 mb-4">
        <div className="card-body p-3">
          <div className="row text-center">
            <div className="col-4">
              <div className="h4 fw-bold text-primary mb-1">
                {Object.keys(permissions).length}
              </div>
              <small className="text-muted">Modules</small>
            </div>
            <div className="col-4">
              <div className="h4 fw-bold text-success mb-1">
                {Object.values(permissions).flat().length}
              </div>
              <small className="text-muted">Permissions</small>
            </div>
            <div className="col-4">
              <div className="h4 fw-bold text-warning mb-1">
                {Array.isArray(user.roles) ? user.roles.length : 0}
              </div>
              <small className="text-muted">Roles</small>
            </div>
          </div>
        </div>
      </div>

      {/* Permissions by Module */}
      <h6 className="fw-bold mb-3 text-uppercase text-muted" style={{ fontSize: '0.75rem' }}>
        Permissions by Module
      </h6>

      {Object.keys(permissions).length > 0 ? (
        <Accordion defaultActiveKey="0">
          {permissionModules
            .filter(module => permissions[module.name])
            .map((module, index) => (
              <Accordion.Item key={module.name} eventKey={index.toString()}>
                <Accordion.Header>
                  <div className="d-flex align-items-center justify-content-between w-100 me-3">
                    <div className="d-flex align-items-center">
                      <i className={`${module.icon} me-2`}></i>
                      <span>{module.label}</span>
                    </div>
                    <Badge bg="primary" className="bg-opacity-10">
                      <span className="text-primary">
                        {permissions[module.name]?.length || 0} permissions
                      </span>
                    </Badge>
                  </div>
                </Accordion.Header>
                <Accordion.Body>
                  <div className="d-flex flex-wrap gap-2">
                    {permissions[module.name]?.map((action, idx) => (
                      <Badge 
                        key={idx}
                        bg={getPermissionColor(action)}
                        className="bg-opacity-10 px-3 py-2"
                      >
                        <span className={`text-${getPermissionColor(action)}`}>
                          <i className="bi bi-check-circle me-1"></i>
                          {action.charAt(0).toUpperCase() + action.slice(1)}
                        </span>
                      </Badge>
                    ))}
                  </div>
                </Accordion.Body>
              </Accordion.Item>
            ))}
        </Accordion>
      ) : (
        <div className="text-center py-4">
          <i className="bi bi-shield-x display-4 text-muted"></i>
          <p className="text-muted mt-3 mb-0">No permissions assigned</p>
        </div>
      )}

      {/* Permission Legend */}
      <div className="mt-4">
        <h6 className="fw-bold mb-3 text-uppercase text-muted" style={{ fontSize: '0.75rem' }}>
          Permission Types
        </h6>
        <div className="d-flex flex-wrap gap-2">
          <Badge bg="success" className="bg-opacity-10 px-3 py-2">
            <span className="text-success">Create</span>
          </Badge>
          <Badge bg="info" className="bg-opacity-10 px-3 py-2">
            <span className="text-info">Read</span>
          </Badge>
          <Badge bg="warning" className="bg-opacity-10 px-3 py-2">
            <span className="text-warning">Update</span>
          </Badge>
          <Badge bg="danger" className="bg-opacity-10 px-3 py-2">
            <span className="text-danger">Delete</span>
          </Badge>
          <Badge bg="primary" className="bg-opacity-10 px-3 py-2">
            <span className="text-primary">Export</span>
          </Badge>
        </div>
      </div>
    </div>
  );
};

export default UserPermissionsTab;