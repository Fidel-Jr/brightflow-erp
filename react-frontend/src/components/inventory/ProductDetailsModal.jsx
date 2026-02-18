import React from 'react';
import { Modal, Button, Row, Col, Badge, ListGroup } from 'react-bootstrap';

const ProductDetailsModal = ({ show, product, onHide, onEdit }) => {
  if (!product) return null;

  const getStockStatus = (product) => {
    if (product.quantity === 0) {
      return { label: 'Out of Stock', variant: 'danger' };
    } else if (product.quantity <= product.lowStockThreshold) {
      return { label: 'Low Stock', variant: 'warning' };
    } else {
      return { label: 'In Stock', variant: 'success' };
    }
  };

  const status = getStockStatus(product);
  const totalValue = (product.price * product.stockQuantity).toFixed(2);
  const API_BASE = "https://localhost:7071";

  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton className="border-0 pb-0">
        <Modal.Title className="fw-bold">Product Details</Modal.Title>
      </Modal.Header>
      <Modal.Body className="p-0">
        {/* Product Header */}
        <div className="px-4 pt-3 pb-4 bg-light">
          <Row>
            <Col md={3} className="text-center">
              <div 
                className="rounded bg-white d-flex align-items-center justify-content-center mx-auto"
                style={{ 
                  width: '120px', 
                  height: '120px'
                }}
              >
                {product.imageUrl ? (
                  <img 
                    src={`${API_BASE}${product.imageUrl}`} 
                    alt={product.name} 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                    className="rounded"
                  />
                ) : (
                  <i className="bi bi-box-seam text-muted" style={{ fontSize: '4rem' }}></i>
                )}
              </div>
            </Col>
            <Col md={9}>
              <div className="d-flex justify-content-between align-items-start mb-2">
                <div>
                  <h4 className="fw-bold mb-1">{product.name}</h4>
                  <p className="text-muted mb-2">{product.description}</p>
                </div>
                <Badge 
                  bg={status.variant} 
                  className="bg-opacity-10 px-3 py-2"
                >
                  <span className={`text-${status.variant}`}>
                    {status.label}
                  </span>
                </Badge>
              </div>
              <div className="d-flex gap-2">
                <Badge bg="secondary" className="bg-opacity-10 px-3 py-2">
                  <span className="text-secondary">
                    <i className="bi bi-tag me-1"></i>
                    {product.category?.name}
                  </span>
                </Badge>
                <Badge bg="primary" className="bg-opacity-10 px-3 py-2">
                  <span className="text-primary">
                    <i className="bi bi-upc me-1"></i>
                    {product.sku}
                  </span>
                </Badge>
              </div>
            </Col>
          </Row>
        </div>

        {/* Product Info */}
        <div className="p-4">
          <h6 className="fw-bold mb-3 text-uppercase text-muted" style={{ fontSize: '0.75rem' }}>
            Product Information
          </h6>
          
          <Row className="g-3 mb-4">
            <Col md={6}>
              <div className="card bg-light border-0">
                <div className="card-body p-3">
                  <small className="text-muted d-block mb-1">Current Stock</small>
                  <div className="d-flex align-items-baseline">
                    <h3 className="fw-bold mb-0 me-2">{product.stockQuantity}</h3>
                    <span className="text-muted">units</span>
                  </div>
                  {product.stockQuantity <= product.reorderLevel && (
                    <small className="text-warning">
                      <i className="bi bi-exclamation-triangle me-1"></i>
                      Below threshold ({product.reorderLevel} units)
                    </small>
                  )}
                  {product.stockQuantity > product.reorderLevel && (
                    <small className="text-success">
                      <i className="bi bi-check-circle me-1"></i>
                      Above threshold ({product.reorderLevel} units)
                    </small>
                  )}
                </div>
              </div>
            </Col>
            <Col md={6}>
              <div className="card bg-light border-0">
                <div className="card-body p-3">
                  <small className="text-muted d-block mb-1">Total Value</small>
                  <div className="d-flex align-items-baseline">
                    <h3 className="fw-bold mb-0 text-success">${totalValue}</h3>
                  </div>
                  <small className="text-muted">
                    ${product.price.toFixed(2)} per unit
                  </small>
                </div>
              </div>
            </Col>
          </Row>

          <ListGroup variant="flush">
            <ListGroup.Item className="px-0 py-3 border-bottom">
              <Row>
                <Col xs={5} className="d-flex align-items-center">
                  <i className="bi bi-currency-dollar me-2 text-muted"></i>
                  <span className="text-muted">Unit Price</span>
                </Col>
                <Col xs={7}>
                  <span className="fw-semibold">${product.price.toFixed(2)}</span>
                </Col>
              </Row>
            </ListGroup.Item>

            <ListGroup.Item className="px-0 py-3 border-bottom">
              <Row>
                <Col xs={5} className="d-flex align-items-center">
                  <i className="bi bi-building me-2 text-muted"></i>
                  <span className="text-muted">Supplier</span>
                </Col>
                <Col xs={7}>
                  <span className="fw-semibold">{product.supplier || 'Not specified'}</span>
                </Col>
              </Row>
            </ListGroup.Item>

            <ListGroup.Item className="px-0 py-3 border-bottom">
              <Row>
                <Col xs={5} className="d-flex align-items-center">
                  <i className="bi bi-geo-alt me-2 text-muted"></i>
                  <span className="text-muted">Location</span>
                </Col>
                <Col xs={7}>
                  <span className="fw-semibold">{product.location?.name || 'Not specified'}</span>
                </Col>
              </Row>
            </ListGroup.Item>

            <ListGroup.Item className="px-0 py-3 border-bottom">
              <Row>
                <Col xs={5} className="d-flex align-items-center">
                  <i className="bi bi-arrow-clockwise me-2 text-muted"></i>
                  <span className="text-muted">Last Restocked</span>
                </Col>
                <Col xs={7}>
                  <span className="fw-semibold">{product.lastRestocked}</span>
                </Col>
              </Row>
            </ListGroup.Item>

            <ListGroup.Item className="px-0 py-3">
              <Row>
                <Col xs={5} className="d-flex align-items-center">
                  <i className="bi bi-bell me-2 text-muted"></i>
                  <span className="text-muted">Low Stock Alert</span>
                </Col>
                <Col xs={7}>
                  <span className="fw-semibold">{product.reorderLevel} units</span>
                </Col>
              </Row>
            </ListGroup.Item>
          </ListGroup>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
        <Button variant="primary" onClick={() => onEdit(product)}>
          <i className="bi bi-pencil me-2"></i>
          Edit Product
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ProductDetailsModal;