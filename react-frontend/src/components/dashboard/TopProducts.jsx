import React from 'react';
import { Col, Card } from 'react-bootstrap';

const TopProducts = () => {
  const products = [
    {
      name: 'Wireless Headphones',
      sales: '1,245 sales',
      price: '$299',
      icon: 'bi-headphones',
      color: 'primary'
    },
    {
      name: 'Smart Watch Pro',
      sales: '987 sales',
      price: '$450',
      icon: 'bi-smartwatch',
      color: 'danger'
    },
    {
      name: 'Laptop Stand',
      sales: '856 sales',
      price: '$79',
      icon: 'bi-laptop',
      color: 'success'
    },
    {
      name: 'Mechanical Keyboard',
      sales: '654 sales',
      price: '$159',
      icon: 'bi-keyboard',
      color: 'warning'
    },
    {
      name: 'USB-C Hub',
      sales: '543 sales',
      price: '$49',
      icon: 'bi-usb-symbol',
      color: 'info'
    }
  ];

  return (
    <Col lg={4}>
      <Card className="border-0 shadow-sm h-100">
        <Card.Body className="p-4">
          <h5 className="fw-bold mb-4">Top Products</h5>
          
          {products.map((product, index) => (
            <div 
              className={`d-flex align-items-center ${index < products.length - 1 ? 'mb-4 pb-3 border-bottom' : ''}`}
              key={index}
            >
              <div 
                className={`rounded-3 bg-${product.color} bg-opacity-10 d-flex align-items-center justify-content-center me-3`}
                style={{ width: '50px', height: '50px' }}
              >
                <i className={`${product.icon} text-${product.color} fs-4`}></i>
              </div>
              <div className="flex-fill">
                <h6 className="mb-1 fw-semibold">{product.name}</h6>
                <small className="text-muted">{product.sales}</small>
              </div>
              <span className="fw-bold">{product.price}</span>
            </div>
          ))}
        </Card.Body>
      </Card>
    </Col>
  );
};

export default TopProducts;