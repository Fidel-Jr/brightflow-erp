import React from 'react';
import { Row, Col, Card } from 'react-bootstrap';

const DeliveryStats = ({ deliveries, drivers }) => {
  const totalDeliveries = deliveries.length;
  const pendingDeliveries = deliveries.filter(d => d.status === 'Pending').length;
  const inTransitDeliveries = deliveries.filter(d => d.status === 'In Transit').length;
  const deliveredToday = deliveries.filter(d => {
    if (d.status === 'Delivered' && d.actualDeliveryTime) {
      const deliveryDate = new Date(d.actualDeliveryTime);
      const today = new Date();
      return deliveryDate.toDateString() === today.toDateString();
    }
    return false;
  }).length;
  const activeDrivers = drivers.filter(d => d.status === 'Available' || d.status === 'On Delivery').length;

  const stats = [
    {
      label: 'Total Deliveries',
      value: totalDeliveries,
      icon: 'bi-truck',
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      subtext: 'All time'
    },
    {
      label: 'Pending',
      value: pendingDeliveries,
      icon: 'bi-clock-history',
      gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      subtext: 'Awaiting assignment'
    },
    {
      label: 'In Transit',
      value: inTransitDeliveries,
      icon: 'bi-arrow-repeat',
      gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      subtext: 'Out for delivery'
    },
    {
      label: 'Active Drivers',
      value: activeDrivers,
      icon: 'bi-person-check',
      gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
      subtext: `${drivers.length} total drivers`
    }
  ];

  return (
    <Row className="g-3 mb-4">
      {stats.map((stat, index) => (
        <Col xs={12} sm={6} lg={3} key={index}>
          <Card className="border-0 shadow-sm h-100">
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

export default DeliveryStats;