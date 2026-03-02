import React, { useState } from 'react';
import { Modal, Button, Row, Col, Form, Card, Badge, Alert } from 'react-bootstrap';
import { formatSmartDateTime } from '../../helper/formatPrettyDateTime';

const DeliveryCompleteModal = ({ show, delivery, onHide, onSubmit }) => {
  const [recipientName, setRecipientName] = useState('');
  const [deliveryNotes, setDeliveryNotes] = useState('');
  const [proofType, setProofType] = useState('photo'); // photo, signature, both
  const [photoTaken, setPhotoTaken] = useState(false);
  const [signatureTaken, setSignatureTaken] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const deliveryData = {
      recipientName: recipientName || delivery.order.customerName,
      deliveryNotes,
      proofOfDelivery: proofType,
      deliveryPhoto: photoTaken ? 'photo-captured' : null,
      recipientSignature: signatureTaken ? 'signature-captured' : null
    };

    onSubmit(deliveryData);
    
    // Reset form
    setRecipientName('');
    setDeliveryNotes('');
    setPhotoTaken(false);
    setSignatureTaken(false);
  };

  if (!delivery) return null;

  const getPriorityColor = (priority) => {
    const colors = {
      'High': 'danger',
      'Medium': 'warning',
      'Low': 'info'
    };
    return colors[priority] || 'secondary';
  };

  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton className="border-0 pb-0">
        <Modal.Title className="fw-bold">Complete Delivery</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body className="p-0">
          {/* Delivery Header */}
          <div className="px-4 pt-3 pb-4 bg-light border-bottom">
            <Row>
              <Col md={8}>
                <h5 className="fw-bold mb-2">{delivery.deliveryNumber}</h5>
                <div className="d-flex gap-2 mb-2">
                  <Badge bg="primary" className="bg-opacity-10">
                    <span className="text-primary">In Transit</span>
                  </Badge>
                  <Badge
                    bg={getPriorityColor(delivery.priority)}
                    className="bg-opacity-10"
                  >
                    <span className={`text-${getPriorityColor(delivery.priority)}`}>
                      {delivery.priority} Priority
                    </span>
                  </Badge>
                </div>
                <p className="text-muted mb-0">
                  <i className="bi bi-link-45deg me-2"></i>
                  Order: {delivery.order.orderNumber}
                </p>
              </Col>
              <Col md={4} className="text-md-end">
                <div className="mb-2">
                  <small className="text-muted d-block">Pickup Time</small>
                  <small className="fw-semibold">{formatSmartDateTime(delivery.actualPickupTime)}</small>
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
                  <span className="fw-semibold">{delivery.order.customerName}</span>
                </div>
                <div className="mb-2">
                  <i className="bi bi-telephone me-2 text-muted"></i>
                  <a href={`tel:${delivery.order.customerPhone}`} className="text-decoration-none">
                    {delivery.order.customerPhone}
                  </a>
                </div>
                <div>
                  <i className="bi bi-geo-alt me-2 text-muted"></i>
                  <span>{delivery.order.deliveryAddress}</span>
                </div>
              </Card.Body>
            </Card>

            {/* Delivery Confirmation */}
            <h6 className="fw-bold mb-3 text-uppercase text-muted" style={{ fontSize: '0.75rem' }}>
              Delivery Confirmation
            </h6>

            <Row className="g-3 mb-4">
              {/* Recipient Name */}
              <Col md={12}>
                <Form.Group>
                  <Form.Label className="fw-semibold">
                    Recipient Name <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    placeholder={`Enter recipient name (default: ${delivery.order.customerName})`}
                    value={recipientName}
                    onChange={(e) => setRecipientName(e.target.value)}
                  />
                  <Form.Text className="text-muted">
                    Leave blank if received by customer
                  </Form.Text>
                </Form.Group>
              </Col>

              {/* Proof of Delivery */}
              <Col md={12}>
                <Form.Group>
                  <Form.Label className="fw-semibold">
                    Proof of Delivery <span className="text-danger">*</span>
                  </Form.Label>
                  <div className="d-flex gap-2">
                    <Button
                      variant={photoTaken ? 'success' : 'outline-primary'}
                      className="flex-fill"
                      onClick={() => setPhotoTaken(!photoTaken)}
                    >
                      <i className={`bi ${photoTaken ? 'bi-camera-fill' : 'bi-camera'} me-2`}></i>
                      {photoTaken ? 'Photo Captured' : 'Take Photo'}
                    </Button>
                    <Button
                      variant={signatureTaken ? 'success' : 'outline-primary'}
                      className="flex-fill"
                      onClick={() => setSignatureTaken(!signatureTaken)}
                    >
                      <i className={`bi ${signatureTaken ? 'bi-pen-fill' : 'bi-pen'} me-2`}></i>
                      {signatureTaken ? 'Signature Captured' : 'Get Signature'}
                    </Button>
                  </div>
                  {!photoTaken && !signatureTaken && (
                    <Form.Text className="text-danger">
                      At least one proof is required
                    </Form.Text>
                  )}
                </Form.Group>
              </Col>

              {/* Delivery Notes */}
              <Col md={12}>
                <Form.Group>
                  <Form.Label className="fw-semibold">Delivery Notes</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    placeholder="Add any notes about the delivery (optional)..."
                    value={deliveryNotes}
                    onChange={(e) => setDeliveryNotes(e.target.value)}
                  />
                </Form.Group>
              </Col>
            </Row>

            {/* Summary */}
            <Alert variant="success" className="mb-0">
              <div className="d-flex align-items-center">
                <i className="bi bi-check-circle-fill me-2 fs-5"></i>
                <div>
                  <strong>Ready to Complete</strong>
                  <div className="small mt-1">
                    This delivery will be marked as delivered and the customer will be notified.
                  </div>
                </div>
              </div>
            </Alert>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onHide}>
            Cancel
          </Button>
          <Button 
            variant="success" 
            type="submit"
            disabled={!photoTaken && !signatureTaken}
          >
            <i className="bi bi-check-circle me-2"></i>
            Mark as Delivered
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default DeliveryCompleteModal;