import React from 'react';
import { Row, Col, Card, Dropdown } from 'react-bootstrap';

const RevenueSection = () => {
  const categories = [
    { name: 'Electronics', percentage: 65, gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
    { name: 'Fashion', percentage: 48, gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' },
    { name: 'Home & Garden', percentage: 35, gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' },
    { name: 'Sports', percentage: 28, gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)' },
    { name: 'Others', percentage: 15, gradient: '' }
  ];

  return (
    <Row className="g-3 mb-4">
      <Col lg={8}>
        <Card className="border-0 shadow-sm h-100">
          <Card.Body className="p-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <div>
                <h5 className="fw-bold mb-1">Revenue Overview</h5>
                <p className="text-muted small mb-0">Monthly earnings report</p>
              </div>
              <Dropdown>
                <Dropdown.Toggle variant="outline-secondary" size="sm" className="border-0 bg-light">
                  Last 6 Months
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item>Last 3 Months</Dropdown.Item>
                  <Dropdown.Item>Last 6 Months</Dropdown.Item>
                  <Dropdown.Item>Last Year</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>
            <div 
              className="bg-light rounded-3 d-flex align-items-center justify-content-center"
              style={{ height: '300px' }}
            >
              <div className="text-center">
                <i className="bi bi-bar-chart text-muted" style={{ fontSize: '3rem' }}></i>
                <p className="text-muted mt-2 mb-0">Chart Placeholder</p>
                <small className="text-muted">Use Chart.js or Recharts</small>
              </div>
            </div>
          </Card.Body>
        </Card>
      </Col>

      <Col lg={4}>
        <Card className="border-0 shadow-sm h-100">
          <Card.Body className="p-4">
            <h5 className="fw-bold mb-4">Sales by Category</h5>
            
            {categories.map((category, index) => (
              <div className={index < categories.length - 1 ? 'mb-4' : ''} key={index}>
                <div className="d-flex justify-content-between mb-2">
                  <span className="text-muted small">{category.name}</span>
                  <span className="fw-semibold">{category.percentage}%</span>
                </div>
                <div className="progress" style={{ height: '8px' }}>
                  <div 
                    className={`progress-bar ${!category.gradient ? 'bg-secondary' : ''}`}
                    style={{ 
                      width: `${category.percentage}%`,
                      background: category.gradient || undefined
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
};

export default RevenueSection;