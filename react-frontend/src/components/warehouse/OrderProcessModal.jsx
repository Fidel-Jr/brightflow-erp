import React, { useState, useEffect } from 'react';
import { Modal, Button, Row, Col, Badge, ListGroup, Form, Card, Table, Alert } from 'react-bootstrap';
import { formatSmartDateTime } from '../../helper/formatPrettyDateTime';

const OrderProcessModal = ({ show, order, currentUser, onHide, onSubmit }) => {
  const [packingCompleted, setPackingCompleted] = useState(false);
  const [qualityChecked, setQualityChecked] = useState(false);
  const [notes, setNotes] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');

  useEffect(() => {
    if (order && show) {
      setPackingCompleted(order.packingCompleted || false);
      setQualityChecked(order.qualityChecked || false);
      setNotes(order.notes || '');
      setSelectedStatus(order.status);
    }
  }, [order, show]);

  const handleSubmit = () => {
    onSubmit(order.id, selectedStatus, {
      packingCompleted,
      qualityChecked,
      notes
    });
    onHide();
  };

  if (!order) return null;

  const getStatusColor = (status) => {
    const colors = {
      'Pending': 'warning',
      'Processing': 'info',
      'Shipped': 'primary',
      'Delivered': 'success'
    };
    return colors[status] || 'secondary';
  };

  const getPriorityColor = (priority) => {
    const colors = {
      'High': 'danger',
      'Medium': 'warning',
      'Low': 'info'
    };
    return colors[priority] || 'secondary';
  };

  const forDelivery = packingCompleted && qualityChecked;

  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton className="border-0 pb-0">
        <Modal.Title className="fw-bold">Process Order</Modal.Title>
      </Modal.Header>
      <Modal.Body className="p-0">
        {/* Order Header */}
        <div className="px-4 pt-3 pb-4 bg-light border-bottom">
          <Row>
            <Col md={8}>
              <h4 className="fw-bold mb-2">{order.orderNumber}</h4>
              <div className="d-flex gap-2 mb-2">
                <Badge
                  bg={getStatusColor(order.status)}
                  className="bg-opacity-10 px-3 py-2"
                >
                  <span className={`text-${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                </Badge>
                <Badge
                  bg={getPriorityColor(order.priority)}
                  className="bg-opacity-10 px-3 py-2"
                >
                  <span className={`text-${getPriorityColor(order.priority)}`}>
                    {order.priority} Priority
                  </span>
                </Badge>
              </div>
              <p className="text-muted mb-0">
                <i className="bi bi-calendar me-2"></i>
                Created: {formatSmartDateTime(order.createdAt)}
              </p>
              <p className="text-muted mb-0">
                <i className="bi bi-truck me-2"></i>
                Expected Delivery: {order.estimatedDelivery}
              </p>
            </Col>
            <Col md={4} className="text-md-end">
              <div className="mb-2">
                <small className="text-muted d-block">Total Amount</small>
                <h4 className="fw-bold mb-0">${order.totalAmount.toFixed(2)}</h4>
              </div>
            </Col>
          </Row>
        </div>

        <div className="p-4">
          {/* Customer Information */}
          <h6 className="fw-bold mb-3 text-uppercase text-muted" style={{ fontSize: '0.75rem' }}>
            Customer Information
          </h6>
          <Card className="border-0 bg-light mb-4">
            <Card.Body className="p-3">
              <div className="mb-2">
                <i className="bi bi-person me-2 text-muted"></i>
                <span className="fw-semibold">{order.customer.name}</span>
              </div>
              <div className="mb-2">
                <i className="bi bi-telephone me-2 text-muted"></i>
                <span>{order.customer.phone}</span>
              </div>
              <div className="mb-2">
                <i className="bi bi-envelope me-2 text-muted"></i>
                <span>{order.customer.email}</span>
              </div>
              <div>
                <i className="bi bi-geo-alt me-2 text-muted"></i>
                <span>{order.customer.address}</span>
              </div>
            </Card.Body>
          </Card>

          {/* Products List */}
          <h6 className="fw-bold mb-3 text-uppercase text-muted" style={{ fontSize: '0.75rem' }}>
            Products to Pack
          </h6>
          <Table bordered className="mb-4">
            <thead className="bg-light">
              <tr>
                <th>Product</th>
                <th>SKU</th>
                <th className="text-center">Quantity</th>
                <th className="text-end">Price</th>
              </tr>
            </thead>
            <tbody>
              {order.products.map((product, index) => (
                <tr key={index}>
                  <td className="fw-semibold">{product.name}</td>
                  <td><code>{product.sku}</code></td>
                  <td className="text-center">
                    <Badge bg="primary" className="px-3">{product.quantity}</Badge>
                  </td>
                  <td className="text-end">${product.price.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </Table>

          {/* Processing Checklist */}
          <h6 className="fw-bold mb-3 text-uppercase text-muted" style={{ fontSize: '0.75rem' }}>
            Processing Checklist
          </h6>
          <Card className="border-0 bg-light mb-4">
            <Card.Body className="p-3">
              <Form.Check
                type="checkbox"
                id="packing-check"
                label={
                  <span className="fw-semibold">
                    Packing Completed
                    <small className="text-muted d-block">All items verified and packed securely</small>
                  </span>
                }
                checked={packingCompleted}
                onChange={(e) => setPackingCompleted(e.target.checked)}
                className="mb-3"
              />
              <Form.Check
                type="checkbox"
                id="quality-check"
                label={
                  <span className="fw-semibold">
                    Quality Check Passed
                    <small className="text-muted d-block">Items inspected for defects and damage</small>
                  </span>
                }
                checked={qualityChecked}
                onChange={(e) => setQualityChecked(e.target.checked)}
              />
            </Card.Body>
          </Card>

          {/* Status Update */}
          <h6 className="fw-bold mb-3 text-uppercase text-muted" style={{ fontSize: '0.75rem' }}>
            Update Status
          </h6>
          <Form.Select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="mb-4"
          >
            <option value="Pending">Pending</option>
            <option value="Processing">Processing</option>
            <option value="For Delivery" disabled={!forDelivery}>
              For Delivery {!forDelivery && '(Complete checklist first)'}
            </option>
          </Form.Select>

          {/* Alert for shipping */}
          {selectedStatus === 'Shipped' && forDelivery && (
            <Alert variant="success" className="mb-4">
              <i className="bi bi-check-circle-fill me-2"></i>
              Order is ready to be marked for delivery!
            </Alert>
          )}

          {/* Notes */}
          <h6 className="fw-bold mb-3 text-uppercase text-muted" style={{ fontSize: '0.75rem' }}>
            Processing Notes
          </h6>
          <Form.Control
            as="textarea"
            rows={3}
            placeholder="Add any notes about this order processing..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
          {order.notes && (
            <Alert variant="info" className="mt-3 mb-0">
              <small className="fw-semibold d-block mb-1">Customer Notes:</small>
              <small>{order.notes}</small>
            </Alert>
          )}
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleSubmit}>
          <i className="bi bi-check-circle me-2"></i>
          Update Order
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default OrderProcessModal;