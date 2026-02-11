import React from 'react';
import { Row, Col } from 'react-bootstrap';
import RoleCard from './RoleCard';

const RoleGrid = ({ roles, onEdit, onDelete, onDuplicate }) => {
  // const safeRoles = Array.isArray(roles) ? roles : [];
  console.log('Rendering RoleGrid with roles:', roles);
  return (
    <Row className="g-4">
      {roles.map((role) => (
        <Col key={role.id} xs={12} md={6} lg={4}>
          <RoleCard 
            role={role}
            onEdit={onEdit}
            onDelete={onDelete}
            onDuplicate={onDuplicate}
          />
        </Col>
      ))}
    </Row>
  );
};

export default RoleGrid;