import React, { useState, useEffect } from 'react';
import { Modal, Form, Button, Row, Col, Badge, ListGroup, Spinner } from 'react-bootstrap';

const AssignDriverModal = ({ show, delivery, drivers, onHide, onSubmit }) => {
  const [selectedDriver, setSelectedDriver] = useState('');
  const [scheduledDate, setScheduledDate] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (delivery && show) {
      setSelectedDriver(delivery.driverId || '');
      setScheduledDate(delivery.scheduledDate || '');
      setScheduledTime(delivery.scheduledTime || '');
      setNotes(delivery.notes || '');
    }
  }, [delivery, show]);

  useEffect(() => {
    if (!show) {
      setIsSubmitting(false);
    }
  }, [show]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      await onSubmit(selectedDriver, scheduledDate, scheduledTime, notes);
      resetForm();
    } catch (error) {
      console.error('Error assigning driver:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setSelectedDriver('');
    setScheduledDate('');
    setScheduledTime('');
    setNotes('');
  };

  if (!delivery) return null;

  const availableDrivers = drivers.filter(d => d.status === 'Available' || d.status === 'On Delivery');
  const selectedDriverData = drivers.find(d => d.id === selectedDriver);

  return (
    <Modal
      show={show}
      onHide={onHide}
      centered
      size="lg"
      backdrop={isSubmitting ? 'static' : true}
      keyboard={!isSubmitting}
    >
      <Modal.Header closeButton>
        <Modal.Title className="fw-bold">Assign Driver to Delivery</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body className="p-4">
          {/* Delivery Information */}
          <div className="mb-4 p-3 bg-light rounded">
            <Row>
              <Col md={6}>
                <small className="text-muted d-block">Delivery Number</small>
                <div className="fw-semibold text-primary mb-2">{delivery.deliveryNumber}</div>
                <small className="text-muted d-block">Order Number</small>
                <div className="fw-semibold mb-2">{delivery.orderDetails.orderNumber}</div>
              </Col>
              <Col md={6}>
                <small className="text-muted d-block">Customer</small>
                <div className="fw-semibold mb-2">{delivery.orderDetails.customerName}</div>
                <small className="text-muted d-block">Delivery Address</small>
                <div className="fw-semibold">{delivery.orderDetails.customerAddress}</div>
              </Col>
            </Row>
          </div>

          <Row className="g-3">
            {/* Driver Selection */}
            <Col md={12}>
              <Form.Group>
                <Form.Label className="fw-semibold">
                  Select Driver <span className="text-danger">*</span>
                </Form.Label>
                <Form.Select
                  value={selectedDriver}
                  onChange={(e) => setSelectedDriver(e.target.value)}
                  required
                  disabled={isSubmitting}
                >
                  <option value="">Choose a driver...</option>
                  {availableDrivers.map(driver => (
                    <option key={driver.id} value={driver.id}>
                      {driver.name} - {driver.status}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>

            {/* Driver Details Card */}
            {selectedDriverData && (
              <Col md={12}>
                <div className="p-3 border rounded bg-light">
                  <h6 className="fw-bold mb-3">Driver Details</h6>
                  <Row>
                    <Col md={6}>
                      <div className="mb-2">
                        <i className="bi bi-person me-2 text-muted"></i>
                        <span className="fw-semibold">{selectedDriverData.name}</span>
                      </div>
                      <div className="mb-2">
                        <i className="bi bi-telephone me-2 text-muted"></i>
                        <span>{selectedDriverData.phone}</span>
                      </div>
                    </Col>
                    <Col md={6}>
                      <div className="mb-2">
                        <i className="bi bi-car-front me-2 text-muted"></i>
                        {/* <span className="fw-semibold">{selectedDriverData.vehicleNumber}</span> */}
                        <span className="fw-semibold">VN-001</span>
                      </div>
                      <div className="mb-2">
                        <i className="bi bi-truck me-2 text-muted"></i>
                        {/* <span>{selectedDriverData.vehicleType}</span> */}
                        <span className="fw-semibold">VAN</span>
                      </div>
                    </Col>
                  </Row>
                  <Badge 
                    bg={selectedDriverData.status === 'Available' ? 'success' : 'primary'} 
                    className="mt-2"
                  >
                    {selectedDriverData.status}
                  </Badge>
                </div>
              </Col>
            )}

            {/* Schedule */}
            <Col md={6}>
              <Form.Group>
                <Form.Label className="fw-semibold">
                  Scheduled Date <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  type="date"
                  value={scheduledDate}
                  onChange={(e) => setScheduledDate(e.target.value)}
                  required
                  disabled={isSubmitting}
                />
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group>
                <Form.Label className="fw-semibold">
                  Scheduled Time <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  type="time"
                  value={scheduledTime}
                  onChange={(e) => setScheduledTime(e.target.value)}
                  required
                  disabled={isSubmitting}
                />
              </Form.Group>
            </Col>

            {/* Delivery Info */}
            <Col md={12}>
              <div className="p-3 border rounded">
                <Row>
                  <Col md={4}>
                    <small className="text-muted d-block">Distance</small>
                    <div className="fw-semibold">
                      <i className="bi bi-geo-alt me-1 text-primary"></i>
                      {delivery.orderDetails.distanceKm.toFixed(2)}km
                    </div>
                  </Col>
                  <Col md={4}>
                    <small className="text-muted d-block">Estimated Duration</small>
                    <div className="fw-semibold">
                      <i className="bi bi-clock me-1 text-info"></i>
                      {delivery.orderDetails.durationMinutes.toFixed(2)} mins
                    </div>
                  </Col>
                  <Col md={4}>
                    <small className="text-muted d-block">Priority</small>
                    <Badge bg={delivery.orderDetails.priorityLevel === 'High' ? 'danger' : delivery.orderDetails.priorityLevel === 'Medium' ? 'warning' : 'info'}>
                      {delivery.orderDetails.priorityLevel}
                    </Badge>
                  </Col>
                </Row>
              </div>
            </Col>

            {/* Notes */}
            <Col md={12}>
              <Form.Group>
                <Form.Label className="fw-semibold">Delivery Notes</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  placeholder="Add special instructions or notes for the driver..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  disabled={isSubmitting}
                />
              </Form.Group>
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onHide} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button variant="primary" type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                  className="me-2"
                />
                Assigning...
              </>
            ) : (
              <>
                <i className="bi bi-person-check me-2"></i>
                Assign Driver
              </>
            )}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default AssignDriverModal;