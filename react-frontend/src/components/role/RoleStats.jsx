import React from 'react';
import { Row, Col, Card } from 'react-bootstrap';

const RoleStats = ({ roles, permissionModules }) => {
  const stats = [
    {
      label: 'Total Roles',
      value: roles.length,
      icon: 'bi-shield-check',
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    },
    {
      label: 'Assigned Users',
      value: roles.reduce((sum, role) => sum + role.userCount, 0),
      icon: 'bi-people',
      gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
    },
    {
      label: 'Permissions',
      value: permissionModules.reduce((sum, mod) => sum + mod.actions.length, 0),
      icon: 'bi-key',
      gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
    },
    {
      label: 'Active Roles',
      value: 4,
      icon: 'bi-lightning',
      gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)'
    }
  ];

  return (
    <Row className="g-3 mb-4">
      {stats.map((stat, index) => (
        <Col xs={12} sm={6} lg={3} key={index}>
          <Card className="border-0 shadow-sm">
            <Card.Body className="p-3">
              <div className="d-flex align-items-center">
                <div 
                  className="rounded-3 p-3 me-3"
                  style={{ background: stat.gradient }}
                >
                  <i className={`${stat.icon} text-white fs-4`}></i>
                </div>
                <div>
                  <p className="text-muted small mb-1">{stat.label}</p>
                  <h4 className="fw-bold mb-0">{stat.value}</h4>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      ))}
    </Row>
  );
};

export default RoleStats;