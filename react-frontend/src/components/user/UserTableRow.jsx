import React from 'react';
import { Form, Badge, Dropdown } from 'react-bootstrap';

const UserTableRow = ({ user, onEdit, onDelete }) => {
  const getStatusColor = (status) => {
    return status === 'Active' ? 'success' : 'secondary';
  };

  const getRoleColor = (role) => {
    const colors = {
      'Admin': 'danger',
      'Manager': 'primary',
      'Warehouse Staff': 'info',
      'Delivery Staff': 'warning'
    };
    return colors[role] || 'secondary';
  };

  return (
    <tr>
      <td className="px-4 align-middle">
        <Form.Check type="checkbox" />
      </td>
      <td className="align-middle">
        <div className="d-flex align-items-center">
          <div 
            className="rounded-circle d-flex align-items-center justify-content-center me-3"
            style={{ 
              width: '40px', 
              height: '40px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              fontWeight: '600'
            }}
          >
            {user.avatar}
          </div>
          <div>
            <div className="fw-semibold">{user.name}</div>
            <small className="text-muted">ID: {user.id}</small>
          </div>
        </div>
      </td>
      <td className="align-middle">{user.email}</td>
      <td className="align-middle">
        <Badge 
          bg={getRoleColor(user.role)} 
          className="bg-opacity-10 px-3 py-2"
        >
          <span className={`text-${getRoleColor(user.role)}`}>
            {user.role}
          </span>
        </Badge>
      </td>
      <td className="align-middle">
        <Badge 
          bg={getStatusColor(user.status)} 
          className="bg-opacity-10 px-3 py-2"
        >
          <span className={`text-${getStatusColor(user.status)}`}>
            {user.status}
          </span>
        </Badge>
      </td>
      <td className="align-middle text-muted">{user.lastLogin}</td>
      <td className="align-middle">
        <Dropdown>
          <Dropdown.Toggle 
            variant="link" 
            className="text-dark p-0 border-0 shadow-none"
          >
            <i className="bi bi-three-dots-vertical"></i>
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item onClick={() => onEdit(user)}>
              <i className="bi bi-pencil me-2"></i>
              Edit
            </Dropdown.Item>
            <Dropdown.Item>
              <i className="bi bi-eye me-2"></i>
              View Details
            </Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Item 
              className="text-danger"
              onClick={() => onDelete(user.id)}
            >
              <i className="bi bi-trash me-2"></i>
              Delete
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </td>
    </tr>
  );
};

export default UserTableRow;