import React from 'react';
import { Row, Col, Card } from 'react-bootstrap';

const OrdersStats = ({ orders }) => {
  const totalOrders = orders.length;
  const pendingOrders = orders.filter(o => o.status === 'Pending').length;
  // const processingOrders = orders.filter(o => o.status === 'Processing').length;
  const shippedOrders = orders.filter(o => o.status === 'InTransit').length;
  const deliveredOrders = orders.filter(o => o.status === 'Delivered').length;
  const totalRevenue = orders.reduce((sum, o) => sum + o.totalAmount, 0);

  const stats = [
    {
      label: 'Total Orders',
      value: totalOrders,
      icon: 'bi-cart',
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      subtext: `$${totalRevenue.toFixed(2)} revenue`
    },
    {
      label: 'Pending',
      value: pendingOrders,
      icon: 'bi-clock-history',
      gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      subtext: 'Awaiting processing'
    },
    {
      label: 'In Transit',
      value: shippedOrders,
      icon: 'bi-truck',
      gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      subtext: 'Out for delivery'
    },
    {
      label: 'Delivered',
      value: deliveredOrders,
      icon: 'bi-check-circle',
      gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
      subtext: 'Successfully completed'
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

export default OrdersStats;