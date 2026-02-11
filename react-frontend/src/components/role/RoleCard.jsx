import React from 'react';
import { Card, Badge, Dropdown, ListGroup } from 'react-bootstrap';

const RoleCard = ({ role, onEdit, onDelete }) => {
  const getPermissionCount = (permissions = {}) => {
    return Object.values(permissions).flat().length;
  };


  return (
    <Card className="border-0 shadow-sm h-100 role-card">
      <Card.Body className="p-4">
        <div className="d-flex justify-content-between align-items-start mb-3">
          <div className="d-flex align-items-center">
            <div 
              className={`bg-${role.color} bg-opacity-10 rounded-3 p-3 me-3`}
            >
              <i className={`bi bi-shield-check text-${role.color} fs-4`}></i>
            </div>
            <div>
              <h5 className="fw-bold mb-1">{role.name}</h5>
              <Badge 
                bg={role.color} 
                className="bg-opacity-10"
              >
                <span className={`text-${role.color}`}>
                  {role.userCount} users
                </span>
              </Badge>
            </div>
          </div>
          
          <Dropdown autoClose="outside">
            <Dropdown.Toggle 
              variant="link" 
              className="text-dark p-0 border-0 shadow-none dropdown-no-caret"
            >
              <i className="bi bi-three-dots-vertical"></i>
            </Dropdown.Toggle>
            <Dropdown.Menu align="end">
              <Dropdown.Item onClick={() => onEdit(role)}>
                <i className="bi bi-pencil me-2"></i>
                Edit
              </Dropdown.Item>
              <Dropdown.Divider />
              <Dropdown.Item 
                className="text-danger"
                onClick={() => onDelete(role.id)}
              >
                <i className="bi bi-trash me-2"></i>
                Delete
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>

        <p className="text-muted small mb-4">{role.description}</p>

        <div className="mb-3">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <small className="text-muted fw-semibold">PERMISSIONS</small>
            <Badge bg="secondary" className="bg-opacity-10">
              <span className="text-secondary">
                {getPermissionCount(role.permissions)} assigned
              </span>
            </Badge>
          </div>
          
          <ListGroup variant="flush">
            {Object.entries(role.permissions || {}).map(([module, perms]) => (
              perms.length > 0 && (
                <ListGroup.Item 
                  key={module} 
                  className="px-0 py-2 border-0 d-flex justify-content-between align-items-center"
                >
                  <small className="text-capitalize">{module}</small>
                  <small className="text-muted">
                    {perms.join(', ')}
                  </small>
                </ListGroup.Item>
              )
            ))}

          </ListGroup>
        </div>

        <div className="pt-3 border-top">
          <small className="text-muted">
            <i className="bi bi-calendar me-1"></i>
            Created {role.createdAt}
          </small>
        </div>
      </Card.Body>
    </Card>
  );
};

export default RoleCard;