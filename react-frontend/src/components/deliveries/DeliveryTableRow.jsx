import React, { useState } from 'react';
import { Form, Badge, Dropdown, Button } from 'react-bootstrap';
import DeliveryNavigationModal from '../delivery_driver/DeliveryNavigationModal';

const DeliveryTableRow = ({
  delivery,
  rowIndex = 0,
  rowCount = 0,
  onAssignDriver,
  onUnassignDriver,
  onViewDetails,
  onStatusUpdate,
  onViewOrder
}) => {
  const destinationAddress = delivery?.orderDetails?.customerAddress;

  const [showNavigationModal, setShowNavigationModal] = useState(false);

  const handleViewOnMap = () => {
    if (!destinationAddress) return;
    setShowNavigationModal(true);
  };

  const normalizedStatus = String(delivery?.status ?? '')
    .replace(/\s+/g, '')
    .replace(/_/g, '')
    .toLowerCase();
  const isLockedAssignment = normalizedStatus === 'intransit' || normalizedStatus === 'delivered';
  const isLockedStatus = normalizedStatus === 'delivered';

  const shouldDropUp = rowCount > 0 && rowIndex >= rowCount - 2;

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

  const getStatusIcon = (status) => {
    const icons = {
      'Pending': 'bi-clock-history',
      'Assigned': 'bi-person-check',
      'In Transit': 'bi-truck',
      'Delivered': 'bi-check-circle-fill',
      'Failed': 'bi-x-circle-fill'
    };
    return icons[status] || 'bi-circle';
  };

  console.log('Rendering DeliveryTableRow for delivery:', delivery.status);

  return (
    <>
      <tr>
        <td className="px-4 align-middle">
          <Form.Check type="checkbox" />
        </td>
        <td className="align-middle">
          <div>
            <div className="fw-semibold text-primary">{delivery.deliveryNumber}</div>
            <Badge 
              bg={getPriorityColor(delivery.priority)} 
              className="bg-opacity-10"
            >
              <span className={`text-${getPriorityColor(delivery.priority)}`}>
                {delivery.orderDetails.priorityLevel}
              </span>
            </Badge>
          </div>
        </td>
        <td className="align-middle">
          <a
            href="#"
            className="text-decoration-none fw-semibold"
            onClick={(e) => {
              e.preventDefault();
              onViewOrder?.(delivery.orderDetails.orderNumber);
            }}
          >
            {delivery.orderDetails.orderNumber}
          </a>
        </td>
        <td className="align-middle">
          <div>
            <div className="fw-semibold">{delivery.orderDetails.customerName}</div>
            <small className="text-muted">
              <i className="bi bi-telephone me-1"></i>
              {delivery.orderDetails.customerPhone}
            </small>
          </div>
        </td>
        <td className="align-middle">
          {delivery.driverDetails.userName ? (
            <div>
              <div className="fw-semibold">{delivery.driverDetails.userName}</div>
              <small className="text-muted">
                <i className="bi bi-car-front me-1"></i>
                {/* {delivery.driverDetails.vehicleNumber} */}
                VAN-001
              </small>
            </div>
          ) : (
            <Button 
              variant="outline-primary" 
              size="sm"
              onClick={() => onAssignDriver(delivery)}
            >
              <i className="bi bi-plus-circle me-1"></i>
              Assign Driver
            </Button>
          )}
        </td>
        <td className="align-middle">
          <div>
            <div className="fw-semibold">{delivery.orderDetails.estimatedDelivery}</div>
            <small className="text-muted">
              {/* <i className="bi bi-clock me-1"></i> */}
              {/* {delivery.scheduledTime} */}
            </small>
          </div>
          <small className="text-muted">
            <i className="bi bi-geo-alt me-1"></i>
            {delivery.orderDetails.distanceKm.toFixed(2)} km
          </small>
        </td>
        <td className="align-middle">
          {isLockedStatus ? (
            <Badge 
              bg={getStatusColor(delivery.status)} 
              className="bg-opacity-10 px-3 py-2"
            >
              <span className={`text-${getStatusColor(delivery.status)}`}>
                <i className={`${getStatusIcon(delivery.status)} me-1`}></i>
                {delivery.status}
              </span>
            </Badge>
          ) : (
            <Dropdown drop={shouldDropUp ? 'up' : 'down'}>
              <Dropdown.Toggle 
                as="div"
                className="cursor-pointer"
                style={{ cursor: 'pointer' }}
              >
                <Badge 
                  bg={getStatusColor(delivery.status)} 
                  className="bg-opacity-10 px-3 py-2"
                >
                  <span className={`text-${getStatusColor(delivery.status)}`}>
                    <i className={`${getStatusIcon(delivery.status)} me-1`}></i>
                    {delivery.status}
                  </span>
                </Badge>
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Header>Update Status</Dropdown.Header>
                <Dropdown.Item onClick={() => onStatusUpdate(delivery.id, 'Pending')}>
                  <i className="bi bi-clock-history me-2 text-warning"></i>
                  Pending
                </Dropdown.Item>
                <Dropdown.Item onClick={() => onStatusUpdate(delivery.id, 'Assigned')}>
                  <i className="bi bi-person-check me-2 text-info"></i>
                  Assigned
                </Dropdown.Item>
                <Dropdown.Item onClick={() => onStatusUpdate(delivery.id, 'In Transit')}>
                  <i className="bi bi-truck me-2 text-primary"></i>
                  In Transit
                </Dropdown.Item>
                <Dropdown.Item onClick={() => onStatusUpdate(delivery.id, 'Delivered')}>
                  <i className="bi bi-check-circle-fill me-2 text-success"></i>
                  Delivered
                </Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item onClick={() => onStatusUpdate(delivery.id, 'Failed')}>
                  <i className="bi bi-x-circle-fill me-2 text-danger"></i>
                  Failed
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          )}
        </td>
        <td className="align-middle">
          <Dropdown drop={shouldDropUp ? 'up' : 'down'} align="end">
            <Dropdown.Toggle 
              variant="link" 
              className="text-dark p-0 border-0 shadow-none"
            >
              <i className="bi bi-three-dots-vertical"></i>
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item onClick={() => onViewDetails(delivery)}>
                <i className="bi bi-eye me-2"></i>
                View Details
              </Dropdown.Item>
              {delivery.driverDetails.userName ? (
                !isLockedAssignment && (
                  <Dropdown.Item onClick={() => onUnassignDriver(delivery.id)}>
                    <i className="bi bi-person-x me-2"></i>
                    Unassign Driver
                  </Dropdown.Item>
                )
              ) : (
                <Dropdown.Item onClick={() => onAssignDriver(delivery)}>
                  <i className="bi bi-person-plus me-2"></i>
                  Assign Driver
                </Dropdown.Item>
              )}
              {/* <Dropdown.Item onClick={handleViewOnMap} disabled={!destinationAddress}>
                <i className="bi bi-geo-alt me-2"></i>
                View on Map
              </Dropdown.Item> */}
              {/* <Dropdown.Item>
                <i className="bi bi-telephone me-2"></i>
                Call Customer
              </Dropdown.Item> */}
              <Dropdown.Divider />
              <Dropdown.Item onClick={handleViewOnMap} disabled={!destinationAddress}>
                <i className="bi bi-geo-alt me-2"></i>
                View on Map
              </Dropdown.Item>
              {/* <Dropdown.Item>
                <i className="bi bi-printer me-2"></i>
                Print Manifest
              </Dropdown.Item> */}
            </Dropdown.Menu>
          </Dropdown>
        </td>
      </tr>
      <DeliveryNavigationModal
        show={showNavigationModal}
        delivery={delivery}
        onHide={() => setShowNavigationModal(false)}
      />
    </>
  );
};

export default DeliveryTableRow;