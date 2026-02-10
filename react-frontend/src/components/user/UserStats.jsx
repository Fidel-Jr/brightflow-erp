import React from 'react';
import { Row, Col, Card } from 'react-bootstrap';

const UserStats = ({ users }) => {
  const safeUsers = users.map(u => ({
    ...u,
    roles: Array.isArray(u.roles) ? u.roles : []
  }));
  const stats = [
    {
      label: 'Total Users',
      value: safeUsers.length,
      icon: 'bi-people',
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    },
    {
      label: 'Active Users',
      value: safeUsers.filter(u => u.status === 'Active').length,
      icon: 'bi-check-circle',
      gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
    },
    {
      label: 'Admins',
      value: safeUsers.filter(u => u.roles.includes('Admin')).length,
      icon: 'bi-shield-check',
      gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
    },
    {
      label: 'Staff',
      value: safeUsers.filter(u =>
        u.roles.some(r =>
          ['Warehouse Staff', 'Delivery Staff'].includes(r)
        )
      ).length,
      icon: 'bi-people',
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

export default UserStats;