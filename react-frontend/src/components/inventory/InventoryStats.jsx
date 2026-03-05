import React from 'react';
import { Row, Col, Card } from 'react-bootstrap';

const InventoryStats = ({ products }) => {
  const totalProducts = products.length;
  const lowStockProducts = products.filter(p => p.stockQuantity <= p.reorderLevel && p.stockQuantity > 0).length;
  const outOfStockProducts = products.filter(p => p.stockQuantity === 0).length;
  const totalValue = products.reduce((sum, p) => sum + (p.price * p.stockQuantity), 0);

  const stats = [
    {
      label: 'Total Products',
      value: totalProducts,
      icon: 'bi-box-seam',
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      change: null
    },
    {
      label: 'Low Stock',
      value: lowStockProducts,
      icon: 'bi-exclamation-triangle',
      gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      change: lowStockProducts > 0 ? 'warning' : null
    },
    {
      label: 'Out of Stock',
      value: outOfStockProducts,
      icon: 'bi-x-circle',
      gradient: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%)',
      change: outOfStockProducts > 0 ? 'danger' : null
    },
    {
      label: 'Total Value',
      value: `₱${totalValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      icon: 'bi-currency-dollar',
      gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      change: null
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
                  {stat.change && (
                    <small className={`text-${stat.change}`}>
                      <i className="bi bi-exclamation-circle me-1"></i>
                      Needs attention
                    </small>
                  )}
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      ))}
    </Row>
  );
};

export default InventoryStats;