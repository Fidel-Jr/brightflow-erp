import React from 'react';
import { Row, Col, Card } from 'react-bootstrap';

const DeliveryDriverStats = ({ deliveries, currentDriver }) => {
  const totalDeliveries = deliveries.length;
  const assignedDeliveries = deliveries.filter(d => d.status === 'Assigned').length;
  const inTransitDeliveries = deliveries.filter(d => d.status === 'In Transit').length;
  const completedDeliveries = deliveries.filter(d => d.status === 'Delivered').length;

  const stats = [
    {
      label: 'Total Stops',
      value: totalDeliveries,
      icon: 'bi-geo-alt',
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      subtext: 'All deliveries'
    },
    {
      label: 'Pending',
      value: assignedDeliveries,
      icon: 'bi-clock-history',
      gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      subtext: 'Not started',
      alert: assignedDeliveries > 0
    },
    {
      label: 'In Transit',
      value: inTransitDeliveries,
      icon: 'bi-truck',
      gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      subtext: 'On the way',
      pulse: inTransitDeliveries > 0
    },
    {
      label: 'Completed',
      value: completedDeliveries,
      icon: 'bi-check-circle',
      gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
      subtext: 'Delivered today'
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
                  className={`rounded-3 p-3 me-3 ${stat.pulse ? 'pulse-animation' : ''}`}
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

export default DeliveryDriverStats;