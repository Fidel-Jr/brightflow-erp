import React, { useEffect, useState } from 'react';
import { Modal, Button, Row, Col, Badge, ListGroup, Table, Card } from 'react-bootstrap';
import OrderStatusTimeline from './OrderStatusTimeline';
import { formatSmartDateTime } from '../../helper/formatPrettyDateTime';
import { getDeliveries } from '../../api/delivery-api';

const OrderDetailsModal = ({ show, order, onHide, onEdit, onStatusUpdate }) => {
  if (!order) return null;

  const [assignedDriver, setAssignedDriver] = useState(null);
  const [linkedDelivery, setLinkedDelivery] = useState(null);

  useEffect(() => {
    if (!show || !order?.orderNumber) {
      setAssignedDriver(null);
      setLinkedDelivery(null);
      return;
    }

    let isCancelled = false;

    (async () => {
      try {
        const response = await getDeliveries();
        const deliveries = response?.data ?? [];
        const matchedDelivery = deliveries.find(
          (d) => d?.orderDetails?.orderNumber === order.orderNumber
        );

        if (isCancelled) return;

        setLinkedDelivery(matchedDelivery ?? null);

        const normalizedStatus = String(order.status ?? '')
          .replace(/\s+/g, '')
          .replace(/_/g, '')
          .toLowerCase();
        const isAssignedOrBeyond = ['assigned', 'intransit', 'delivered'].includes(normalizedStatus);

        const driverDetails = isAssignedOrBeyond ? (matchedDelivery?.driverDetails ?? null) : null;
        setAssignedDriver(driverDetails);
      } catch (error) {
        if (!isCancelled) {
          console.error('Failed to lookup assigned driver:', error);
          setAssignedDriver(null);
          setLinkedDelivery(null);
        }
      }
    })();

    return () => {
      isCancelled = true;
    };
  }, [show, order?.orderNumber, order?.status]);

  const getStatusColor = (status) => {
    const colors = {
      'Pending': 'warning',
      'Processing': 'info',
      'For Delivery': 'success',
      'ForDelivery': 'success',
      'Assigned': 'info',
      'In Transit': 'primary',
      'InTransit': 'primary',
      'Delivered': 'success'
    };
    return colors[status] || 'secondary'; 
  };

  const getPriorityColor = (priority) => {
    const colors = {
      'High': 'danger',
      'Medium': 'warning',
      'Low': 'dark'
    };
    return colors[priority] || 'secondary';
  };

  return (
    <Modal show={show} onHide={onHide} size="xl" centered>
      <Modal.Header closeButton className="border-0 p-4">
        <Modal.Title className="fw-bold">Order Details</Modal.Title>
      </Modal.Header>
      <Modal.Body className="p-0">
        {/* Order Header */}
        <div className="px-4 pt-3 pb-4 bg-light border-bottom">
          <Row>
            <Col md={8}>
              <h4 className="fw-bold mb-2">{order.orderNumber}</h4>
              <div className="d-flex gap-2 mb-3">
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
                  <span className={`text-${getPriorityColor(order.priorityLevel)}`}>
                    {order.priorityLevel} Priority
                  </span>
                </Badge>
              </div>
              <p className="text-muted mb-0">
                <i className="bi bi-calendar me-2"></i>
                Created: {formatSmartDateTime(order.createdAt)}
              </p>
              {order.estimatedDelivery && (
                <p className="text-muted mb-0">
                  <i className="bi bi-truck me-2"></i>
                  Expected Delivery: {order.estimatedDelivery}
                </p>
              )}
              {order.customer.distanceKm && (
                <p className="text-muted mb-0">
                  <i className="bi bi-geo-alt me-2"></i>
                  Distance: {order.customer.distanceKm.toFixed(2)}km
                </p>
              )}
              {order.customer.durationMinutes && (
                <p className="text-muted mb-0">
                  <i className="bi bi-clock me-2"></i>
                  Duration: {order.customer.durationMinutes.toFixed(0)} mins
                </p>
              )}
            </Col>
            <Col md={4} className="text-md-end">
              <div className="mb-2">
                <small className="text-muted d-block">Total Amount</small>
                <h3 className="fw-bold text-success mb-0">₱{order.totalAmount.toFixed(2)}</h3>
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
                    <span className="fw-semibold">{order.customer.name}</span>
                  </div>
                  <div className="mb-2">
                    <i className="bi bi-envelope me-2 text-muted"></i>
                    <span>{order.customer.email}</span>
                  </div>
                  <div className="mb-2">
                    <i className="bi bi-telephone me-2 text-muted"></i>
                    <span>{order.customer.phone}</span>
                  </div>
                  <div>
                    <i className="bi bi-geo-alt me-2 text-muted"></i>
                    <span>{order.customer.address}</span>
                  </div>
                </Card.Body>
              </Card>

              {/* Products */}
              <h6 className="fw-bold mb-3 text-uppercase text-muted" style={{ fontSize: '0.75rem' }}>
                Order Items
              </h6>
              <Table bordered className="mb-4">
                <thead className="bg-light">
                  <tr>
                    <th>Product</th>
                    <th>SKU</th>
                    <th className="text-center">Quantity</th>
                    <th className="text-end">Price</th>
                    <th className="text-end">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {(order.products ?? []).map((product, index) => (
                    <tr key={index}>
                      <td>{product.productName}</td>
                      <td><code>{product.sku}</code></td>
                      <td className="text-center">{product.quantity}</td>
                      <td className="text-end">₱{product.price.toFixed(2)}</td>
                      <td className="text-end fw-semibold">₱{(product.price * product.quantity).toFixed(2)}</td>
                    </tr>
                  ))}
                  <tr className="bg-light">
                    <td colSpan="4" className="text-end fw-bold">Subtotal:</td>
                    <td className="text-end fw-bold">₱{order.totalAmount.toFixed(2)}</td>
                  </tr>
                  {/* <tr className="bg-light">
                    <td colSpan="4" className="text-end fw-bold">Tax (0%):</td>
                    <td className="text-end fw-bold">$0.00</td>
                  </tr> */}
                  <tr className="table-success">
                    <td colSpan="4" className="text-end fw-bold">Total:</td>
                    <td className="text-end fw-bold text-success">₱{order.totalAmount.toFixed(2)}</td>
                  </tr>
                </tbody>
              </Table>

              {/* Assignment Details */}
              <h6 className="fw-bold mb-3 text-uppercase text-muted" style={{ fontSize: '0.75rem' }}>
                Assignment Details
              </h6>
              <ListGroup variant="flush" className="mb-4">
                {/* <ListGroup.Item className="px-0 py-3 border-bottom">
                  <Row>
                    <Col xs={4} className="text-muted">
                      <i className="bi bi-building me-2"></i>
                      Warehouse
                    </Col>
                    <Col xs={8}>
                      <span className="fw-semibold">{order.assignedWarehouse}</span>
                    </Col>
                  </Row>
                </ListGroup.Item> */}
                <ListGroup.Item className="px-0 py-3 border-bottom">
                  <Row>
                    <Col xs={4} className="text-muted">
                      <i className="bi bi-person-badge me-2"></i>
                      Assigned Staff:
                    </Col>
                    <Col xs={8}>
                      <span className="fw-semibold">{order.assignedStaffName}</span>
                    </Col>
                  </Row>
                </ListGroup.Item>

                {order.status === 'Assigned' && (
                  <ListGroup.Item className="px-0 py-3 border-bottom">
                    <Row>
                      <Col xs={4} className="text-muted">
                        <i className="bi bi-truck me-2"></i>
                        Assigned Driver:
                      </Col>
                      <Col xs={8}>
                        <span className="fw-semibold">
                          {assignedDriver?.userName || 'Unassigned'}
                        </span>
                      </Col>
                    </Row>
                  </ListGroup.Item>
                )}
                {order.deliveryStaff && (
                  <ListGroup.Item className="px-0 py-3">
                    <Row>
                      <Col xs={4} className="text-muted">
                        <i className="bi bi-truck me-2"></i>
                        Delivery Staff
                      </Col>
                      <Col xs={8}>
                        <span className="fw-semibold">{order.deliveryStaff}</span>
                      </Col>
                    </Row>
                  </ListGroup.Item>
                )}
              </ListGroup>

              {/* Notes */}
              {order.notes && (
                <>
                  <h6 className="fw-bold mb-3 text-uppercase text-muted" style={{ fontSize: '0.75rem' }}>
                    Notes
                  </h6>
                  <Card className="border-0 bg-light">
                    <Card.Body className="p-3">
                      <p className="mb-0 text-muted">{order.notes}</p>
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
                Order Timeline
              </h6>
              <OrderStatusTimeline order={order} delivery={linkedDelivery} />
            </div>
          </Col>
        </Row>
      </Modal.Body>
      <Modal.Footer>
        {/* <Button variant="outline-primary">
          <i className="bi bi-printer me-2"></i>
          Print Invoice
        </Button> */}
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>

        {typeof onEdit === 'function' &&
          !['fordelivery'].includes(
            String(order?.status ?? '')
              .replace(/\s+/g, '')
              .replace(/_/g, '')
              .toLowerCase()
          ) && (
          <Button variant="primary" onClick={() => onEdit(order)}>
            <i className="bi bi-pencil me-2"></i>
            Edit Order
          </Button>
        )}
      </Modal.Footer>
    </Modal>
  );
};

export default OrderDetailsModal;