import React from 'react';
import { Modal, Button, ListGroup, Badge } from 'react-bootstrap';

const DeliveryNavigationModal = ({ show, delivery, onHide }) => {
  if (!delivery) return null;

  const order = delivery.order ?? delivery.orderDetails ?? {};
  const destinationAddress = order.deliveryAddress ?? order.customerAddress ?? '';
  const customerName = order.customerName ?? '';
  const customerPhone = order.customerPhone ?? '';
  const distanceLabel =
    typeof delivery.distance === 'string'
      ? delivery.distance
      : typeof order.distanceKm === 'number'
        ? `${order.distanceKm.toFixed(2)} km`
        : '';

  const handleOpenMaps = (type) => {
    const address = encodeURIComponent(destinationAddress);
    let url = '';

    switch (type) {
      case 'google':
        url = `https://www.google.com/maps/dir/?api=1&destination=${address}`;
        break;
      case 'apple':
        url = `http://maps.apple.com/?daddr=${address}`;
        break;
      case 'waze':
        url = `https://waze.com/ul?q=${address}&navigate=yes`;
        break;
      default:
        url = `https://www.google.com/maps/dir/?api=1&destination=${address}`;
    }

    window.open(url, '_blank', 'noopener,noreferrer');
    onHide();
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title className="fw-bold">
          <i className="bi bi-geo-alt me-2"></i>
          Navigate to Delivery
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="mb-3">
          <h6 className="fw-semibold mb-2">{customerName}</h6>
          <p className="text-muted mb-2">
            <i className="bi bi-geo-alt me-2"></i>
            {destinationAddress}
          </p>
          {distanceLabel && (
            <Badge bg="info" className="bg-opacity-10">
              <span className="text-info">
                <i className="bi bi-arrow-left-right me-1"></i>
                {distanceLabel}
              </span>
            </Badge>
          )}
        </div>

        <h6 className="fw-semibold mb-2 small text-uppercase text-muted">
          Choose Navigation App
        </h6>
        <ListGroup>
          <ListGroup.Item 
            action 
            onClick={() => handleOpenMaps('google')}
            className="d-flex align-items-center"
          >
            <div 
              className="rounded bg-danger bg-opacity-10 p-2 me-3"
              style={{ width: '40px', height: '40px' }}
            >
              <i className="bi bi-google text-danger fs-5"></i>
            </div>
            <div>
              <div className="fw-semibold">Google Maps</div>
              <small className="text-muted">Open in Google Maps</small>
            </div>
            <i className="bi bi-chevron-right ms-auto"></i>
          </ListGroup.Item>

          <ListGroup.Item 
            action 
            onClick={() => handleOpenMaps('apple')}
            className="d-flex align-items-center"
          >
            <div 
              className="rounded bg-primary bg-opacity-10 p-2 me-3"
              style={{ width: '40px', height: '40px' }}
            >
              <i className="bi bi-apple text-primary fs-5"></i>
            </div>
            <div>
              <div className="fw-semibold">Apple Maps</div>
              <small className="text-muted">Open in Apple Maps</small>
            </div>
            <i className="bi bi-chevron-right ms-auto"></i>
          </ListGroup.Item>

          <ListGroup.Item 
            action 
            onClick={() => handleOpenMaps('waze')}
            className="d-flex align-items-center"
          >
            <div 
              className="rounded bg-info bg-opacity-10 p-2 me-3"
              style={{ width: '40px', height: '40px' }}
            >
              <i className="bi bi-pin-map text-info fs-5"></i>
            </div>
            <div>
              <div className="fw-semibold">Waze</div>
              <small className="text-muted">Open in Waze</small>
            </div>
            <i className="bi bi-chevron-right ms-auto"></i>
          </ListGroup.Item>
        </ListGroup>

        <div className="mt-3">
          <Button 
            variant="outline-secondary" 
            size="sm" 
            className="w-100"
            href={`tel:${customerPhone}`}
            disabled={!customerPhone}
          >
            <i className="bi bi-telephone me-2"></i>
            Call Customer
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default DeliveryNavigationModal;