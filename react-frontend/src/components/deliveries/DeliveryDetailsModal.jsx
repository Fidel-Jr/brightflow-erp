import React, { useState } from 'react';
import { Modal, Button, Row, Col, Badge, Card, ListGroup, Table } from 'react-bootstrap';
import DeliveryStatusTimeline from './DeliveryStatusTimeline';
import { formatSmartDateTime } from '../../helper/formatPrettyDateTime';
import DeliveryNavigationModal from '../delivery_driver/DeliveryNavigationModal';

const DeliveryDetailsModal = ({ show, delivery, onHide, onAssignDriver, onStatusUpdate }) => {
  if (!delivery) return null;

  const destinationAddress = delivery?.orderDetails?.customerAddress;

  const [showNavigationModal, setShowNavigationModal] = useState(false);

  const handleViewOnMap = () => {
    if (!destinationAddress) return;
    setShowNavigationModal(true);
  };

  const getStatusColor = (status) => {
    const colors = {
      'Pending': 'warning',
      'Assigned': 'info',
      'In Transit': 'primary',
      'Delivered': 'success',
      'Failed': 'danger'
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

  return (
    <Modal show={show} onHide={onHide} size="xl" centered>
      <Modal.Header closeButton className="border-0 pb-0">
        <Modal.Title className="fw-bold">Delivery Details</Modal.Title>
      </Modal.Header>
      <Modal.Body className="p-0">
        {/* Delivery Header */}
        <div className="px-4 pt-3 pb-4 bg-light border-bottom">
          <Row>
            <Col md={8}>
              <h4 className="fw-bold mb-2">{delivery.deliveryNumber}</h4>
              <div className="d-flex gap-2 mb-3">
                <Badge 
                  bg={getStatusColor(delivery.status)} 
                  className="bg-opacity-10 px-3 py-2"
                >
                  <span className={`text-${getStatusColor(delivery.status)}`}>
                    {delivery.status}
                  </span>
                </Badge>
                <Badge 
                  bg={getPriorityColor(delivery.priority)} 
                  className="bg-opacity-10 px-3 py-2"
                >
                  <span className={`text-${getPriorityColor(delivery.priority)}`}>
                    {delivery.priority} Priority
                  </span>
                </Badge>
              </div>
              <p className="text-muted mb-1">
                <i className="bi bi-link-45deg me-2"></i>
                Order: <a href="#" className="text-decoration-none">{delivery.orderDetails.orderNumber}</a>
              </p>
              <p className="text-muted mb-0">
                <i className="bi bi-calendar me-2"></i>
                Created: {formatSmartDateTime(delivery.createdAt)}
              </p>
            </Col>
            <Col md={4} className="text-md-end">
              <div className="mb-2">
                <small className="text-muted d-block">Order Amount</small>
                <h4 className="fw-bold mb-0">${delivery.orderDetails.totalAmount.toFixed(2)}</h4>
              </div>
            </Col>
          </Row>
        </div>

        <Row className="g-0">
          {/* Left Column */}
          <Col md={8} className="border-end">
            <div className="p-4">
              {/* Customer Information */}
              <h6 className="fw-bold mb-3 text-uppercase text-muted" style={{ fontSize: '0.75rem' }}>
                Customer Information
              </h6>
              <Card className="border-0 bg-light mb-4">
                <Card.Body className="p-3">
                  <div className="mb-2">
                    <i className="bi bi-person me-2 text-muted"></i>
                    <span className="fw-semibold">{delivery.orderDetails.customerName}</span>
                  </div>
                  <div className="mb-2">
                    <i className="bi bi-telephone me-2 text-muted"></i>
                    <span>{delivery.orderDetails.customerPhone}</span>
                  </div>
                  <div>
                    <i className="bi bi-geo-alt me-2 text-muted"></i>
                    <span>{delivery.orderDetails.customerAddress}</span>
                  </div>
                </Card.Body>
              </Card>

              {/* Driver Information */}
              <h6 className="fw-bold mb-3 text-uppercase text-muted" style={{ fontSize: '0.75rem' }}>
                Driver Assignment
              </h6>
              {delivery.driverDetails.email ? (
                <Card className="border-0 bg-light mb-4">
                  <Card.Body className="p-3">
                    <Row>
                      <Col md={6}>
                        <div className="mb-2">
                          <i className="bi bi-person me-2 text-muted"></i>
                          <span className="fw-semibold">{delivery.driverDetails.userName}</span>
                        </div>
                        <div className="mb-2">
                          <i className="bi bi-telephone me-2 text-muted"></i>
                          <span>{delivery.driverDetails.phoneNumber}</span>
                        </div>
                      </Col>
                      <Col md={6}>
                        <div className="mb-2">
                          <i className="bi bi-car-front me-2 text-muted"></i>
                          {/* <span className="fw-semibold">{delivery.driverDetails.vehicleNumber}</span> */}
                          <span className="fw-semibold">VN-001</span>
                        </div>
                        <div>
                          <i className="bi bi-truck me-2 text-muted"></i>
                          {/* <span>{delivery.driverDetails.vehicleType}</span> */}
                          <span>VAN</span>
                        </div>
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>
              ) : (
                <div className="text-center py-4 mb-4 border rounded bg-light">
                  <i className="bi bi-person-x display-4 text-muted d-block mb-2"></i>
                  <p className="text-muted mb-3">No driver assigned yet</p>
                  <Button 
                    variant="primary" 
                    size="sm"
                    onClick={() => onAssignDriver(delivery)}
                  >
                    <i className="bi bi-person-plus me-2"></i>
                    Assign Driver
                  </Button>
                </div>
              )}

              {/* Schedule & Route Information */}
              <h6 className="fw-bold mb-3 text-uppercase text-muted" style={{ fontSize: '0.75rem' }}>
                Schedule & Route
              </h6>
              <Row className="g-3 mb-4">
                <Col md={6}>
                  <Card className="border-0 bg-light h-100">
                    <Card.Body className="p-3">
                      <small className="text-muted d-block mb-1">Scheduled Date & Time</small>
                      <div className="fw-semibold">{delivery.orderDetails.estimatedDelivery}</div>
                      {delivery.scheduledTime && (
                        <div className="text-primary">
                          {new Date(`1970-01-01T${delivery.scheduledTime}`).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit',
                                hour12: true
                          })}
                            
                        </div>
                      )}
                      
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={6}>
                  <Card className="border-0 bg-light h-100">
                    <Card.Body className="p-3">
                      <small className="text-muted d-block mb-1">Estimated Duration</small>
                      <div className="fw-semibold">
                        <i className="bi bi-clock me-1 text-info"></i>
                        {delivery.orderDetails.durationMinutes.toFixed(2)} mins
                      </div>
                      <div className="text-muted small">Distance: {delivery.orderDetails.distanceKm.toFixed(2)}km</div>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>

              {/* Timestamps */}
              <h6 className="fw-bold mb-3 text-uppercase text-muted" style={{ fontSize: '0.75rem' }}>
                Timestamps
              </h6>
              <ListGroup variant="flush" className="mb-4">
                <ListGroup.Item className="px-0 py-3 border-bottom">
                  <Row>
                    <Col xs={5} className="text-muted">
                      <i className="bi bi-calendar-plus me-2"></i>
                      Created At
                    </Col>
                    <Col xs={7}>
                      <span className="fw-semibold">{formatSmartDateTime(delivery.createdAt)}</span>
                    </Col>
                  </Row>
                </ListGroup.Item>
                {delivery.actualPickupTime && (
                  <ListGroup.Item className="px-0 py-3 border-bottom">
                    <Row>
                      <Col xs={5} className="text-muted">
                        <i className="bi bi-box-arrow-up me-2"></i>
                        Picked Up At
                      </Col>
                      <Col xs={7}>
                        <span className="fw-semibold">{formatSmartDateTime(delivery.actualPickupTime)}</span>
                      </Col>
                    </Row>
                  </ListGroup.Item>
                )}
                {delivery.actualDeliveryTime && (
                  <ListGroup.Item className="px-0 py-3 border-bottom">
                    <Row>
                      <Col xs={5} className="text-muted">
                        <i className="bi bi-box-arrow-down me-2"></i>
                        Delivered At
                      </Col>
                      <Col xs={7}>
                        <span className="fw-semibold">{formatSmartDateTime(delivery.actualDeliveryTime)}</span>
                      </Col>
                    </Row>
                  </ListGroup.Item>
                )}
                <ListGroup.Item className="px-0 py-3">
                  <Row>
                    <Col xs={5} className="text-muted">
                      <i className="bi bi-arrow-clockwise me-2"></i>
                      Last Updated
                    </Col>
                    <Col xs={7}>
                      <span className="fw-semibold">{formatSmartDateTime(delivery.updatedDate)}</span>
                    </Col>
                  </Row>
                </ListGroup.Item>
              </ListGroup>

              {/* Notes */}
              {delivery.notes && (
                <>
                  <h6 className="fw-bold mb-3 text-uppercase text-muted" style={{ fontSize: '0.75rem' }}>
                    Delivery Notes
                  </h6>
                  <Card className="border-0 bg-light">
                    <Card.Body className="p-3">
                      <p className="mb-0 text-muted">{delivery.notes}</p>
                    </Card.Body>
                  </Card>
                </>
              )}
            </div>
          </Col>

          {/* Right Column - Timeline */}
          <Col md={4}>
            <div className="p-4">
              <h6 className="fw-bold mb-4 text-uppercase text-muted" style={{ fontSize: '0.75rem' }}>
                Delivery Timeline
              </h6>
              <DeliveryStatusTimeline delivery={delivery} />

              {/* Quick Actions */}
              <div className="mt-4">
                <h6 className="fw-bold mb-3 text-uppercase text-muted" style={{ fontSize: '0.75rem' }}>
                  Quick Actions
                </h6>
                <div className="d-grid gap-2">
                  <Button
                    variant="outline-primary"
                    size="sm"
                    onClick={handleViewOnMap}
                    disabled={!destinationAddress}
                  >
                    <i className="bi bi-geo-alt me-2"></i>
                    View on Map
                  </Button>
                  <Button variant="outline-primary" size="sm">
                    <i className="bi bi-telephone me-2"></i>
                    Call Customer
                  </Button>
                  {delivery.driverId && (
                    <Button variant="outline-primary" size="sm">
                      <i className="bi bi-chat-dots me-2"></i>
                      Contact Driver
                    </Button>
                  )}
                  <Button variant="outline-secondary" size="sm">
                    <i className="bi bi-printer me-2"></i>
                    Print Manifest
                  </Button>
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
        {!delivery.driverId && (
          <Button variant="primary" onClick={() => onAssignDriver(delivery)}>
            <i className="bi bi-person-plus me-2"></i>
            Assign Driver
          </Button>
        )}
      </Modal.Footer>

      <DeliveryNavigationModal
        show={showNavigationModal}
        delivery={delivery}
        onHide={() => setShowNavigationModal(false)}
      />
    </Modal>
  );
};

export default DeliveryDetailsModal;