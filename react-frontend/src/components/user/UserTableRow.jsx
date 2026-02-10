import React from 'react';
import { Form, Badge, Dropdown } from 'react-bootstrap';
import { formatSmartDateTime, formatRelativeTime } from '../../helper/formatPrettyDateTime';

const UserTableRow = ({ user, index, onEdit, onDelete, onViewDetails }) => {
  const getStatusColor = (status) => {
    return status === 'Active' ? 'success' : 'secondary';
  };

  const roles = Array.isArray(user.roles) ? user.roles : [];

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
            <div className="fw-semibold">{user.username}</div>
            <small className="text-muted">#{index + 1}</small>
          </div>
        </div>
      </td>
      <td className="align-middle">{user.email}</td>
      <td className="align-middle">
        <div className="d-flex flex-wrap gap-2">
          {roles.map((role, index) => (
            <Badge
              key={index}
              bg={getRoleColor(role)}
              className="bg-opacity-10 px-3 py-2"
            >
              <span className={`text-${getRoleColor(role)}`}>
                {role}
              </span>
            </Badge>
          ))}
        </div>
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
      <td className="align-middle text-muted">
  {user.lastLoginAt ? (
    <>
      {formatRelativeTime(user.lastLoginAt) && (
        <span className="fw-semibold">
          {formatRelativeTime(user.lastLoginAt)} ·{' '}
        </span>
      )}
      {formatSmartDateTime(user.lastLoginAt)}
    </>
  ) : (
    'Never'
  )}
</td>
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
            <Dropdown.Item onClick={() => onViewDetails(user)}>
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