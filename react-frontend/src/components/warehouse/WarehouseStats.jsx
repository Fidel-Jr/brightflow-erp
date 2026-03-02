import React from 'react';
import { Row, Col, Card } from 'react-bootstrap';

const WarehouseStats = ({ orders, currentUser }) => {
  const myOrders = orders.filter(o => o.assignedStaff === currentUser.name);
  const pendingOrders = orders.filter(o => o.status === 'Pending').length;
  const processingOrders = orders.filter(o => o.status === 'Processing').length;
  const readyToShip = orders.filter(o => 
    o.status === 'Processing' && 
    o.packingCompleted && 
    o.qualityChecked
  ).length;

  const stats = [
    {
      label: 'My Orders Today',
      value: myOrders.length,
      icon: 'bi-person-check',
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      subtext: 'Assigned to me'
    },
    {
      label: 'Pending',
      value: pendingOrders,
      icon: 'bi-clock-history',
      gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      subtext: 'Need to start',
      alert: pendingOrders > 0
    },
    {
      label: 'Processing',
      value: processingOrders,
      icon: 'bi-arrow-repeat',
      gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      subtext: 'In progress'
    },
    {
      label: 'Ready to Ship',
      value: readyToShip,
      icon: 'bi-box-seam',
      gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
      subtext: 'Quality checked'
    }
  ];

  return (
    <Row className="g-3 mb-4">
      {stats.map((stat, index) => (
        <Col xs={12} sm={6} lg={3} key={index}>
          <Card className={`border-0 shadow-sm h-100 ${stat.alert ? 'border-warning border-2' : ''}`}>
            <Card.Body className="p-3">
              <div className="d-flex align-items-center">
                <div
                  className="rounded-3 p-3 me-3"
                  style={{ background: stat.gradient }}
                >
                  <i className={`${stat.icon} text-white fs-4`}></i>
                </div>
                <div className="flex-grow-1">
                  <p className="text-muted small mb-1">{stat.label}</p>
                  <h4 className="fw-bold mb-0">{stat.value}</h4>
                  <small className="text-muted">{stat.subtext}</small>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      ))}
    </Row>
  );
};

export default WarehouseStats;