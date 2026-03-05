import React from 'react';
import { Row, Col } from 'react-bootstrap';
import RoleCard from './RoleCard';

const RoleGrid = ({ roles, onEdit, onDelete, onDuplicate, canManage = false }) => {
  // const safeRoles = Array.isArray(roles) ? roles : [];
  return (
    <Row className="g-4">
      {roles.map((role) => (
        <Col key={role.id} xs={12} md={6} lg={4}>
          <RoleCard 
            role={role}
            onEdit={onEdit}
            onDelete={onDelete}
            onDuplicate={onDuplicate}
            canManage={canManage}
          />
        </Col>
      ))}
    </Row>
  );
};

export default RoleGrid;