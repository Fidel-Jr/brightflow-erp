import React from 'react';
import { Row, Col, Card } from 'react-bootstrap';

const QuickStats = () => {
  const stats = [
    {
      label: 'Avg. Order Value',
      value: '$186.50',
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    },
    {
      label: 'Total Customers',
      value: '12,458',
      gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
    },
    {
      label: 'Active Sessions',
      value: '2,847',
      gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
    },
    {
      label: 'Bounce Rate',
      value: '32.8%',
      gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)'
    }
  ];

  return (
    <Row className="g-3">
      {stats.map((stat, index) => (
        <Col md={6} lg={3} key={index}>
          <Card className="border-0 shadow-sm stat-card-hover">
            <Card.Body className="p-4">
              <div className="d-flex align-items-center">
                <div 
                  className="rounded-circle me-3"
                  style={{ 
                    width: '48px', 
                    height: '48px',
                    background: stat.gradient
                  }}
                ></div>
                <div>
                  <p className="text-muted small mb-1">{stat.label}</p>
                  <h5 className="fw-bold mb-0">{stat.value}</h5>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      ))}
    </Row>
  );
};

export default QuickStats;