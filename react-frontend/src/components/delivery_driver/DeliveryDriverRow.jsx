import React from 'react';
import { Badge, Button, Dropdown } from 'react-bootstrap';

const DriverDeliveryRow = ({ 
  delivery, 
  stopNumber,
  onStartDelivery, 
  onCompleteDelivery, 
  onNavigate,
  onMarkFailed
}) => {
  const getStatusColor = (status) => {
    const colors = {
      'Assigned': 'warning',
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
      'Assigned': 'bi-clock-history',
      'In Transit': 'bi-truck',
      'Delivered': 'bi-check-circle-fill',
      'Failed': 'bi-x-circle-fill'
    };
    return icons[status] || 'bi-circle';
  };

  return (
    <tr className={`
      ${delivery.status === 'In Transit' ? 'table-primary bg-opacity-10' : ''}
      ${delivery.status === 'Delivered' ? 'table-success bg-opacity-10' : ''}
      ${delivery.priority === 'High' ? 'border-start border-danger border-3' : ''}
    `}>
      <td className="px-4 align-middle">
        <div
          className={`rounded-circle d-flex align-items-center justify-content-center mx-auto fw-bold ${
            delivery.status === 'In Transit' 
              ? 'bg-primary text-white' 
              : delivery.status === 'Delivered'
              ? 'bg-success text-white'
              : 'bg-light text-dark'
          }`}
          style={{ width: '36px', height: '36px' }}
        >
          {stopNumber}
        </div>
      </td>
      <td className="align-middle">
        <div>
          <div className="fw-semibold text-primary">{delivery.deliveryNumber}</div>
          <small className="text-muted d-block">Order: {delivery.order.orderNumber}</small>
          <div className="mt-1">
            <Badge
              bg={getPriorityColor(delivery.priority)}
              className="bg-opacity-10"
            >
              <span className={`text-${getPriorityColor(delivery.priority)}`}>
                {delivery.priority}
              </span>
            </Badge>
          </div>
        </div>
      </td>
      <td className="align-middle">
        <div>
          <div className="fw-semibold">{delivery.order.customerName}</div>
          <small className="text-muted">
            <i className="bi bi-telephone me-1"></i>
            <a href={`tel:${delivery.order.customerPhone}`} className="text-decoration-none">
              {delivery.order.customerPhone}
            </a>
          </small>
        </div>
      </td>
      <td className="align-middle">
        <div>
          <div className="fw-semibold">{delivery.order.deliveryAddress}</div>
          <small className="text-muted">
            <i className="bi bi-geo-alt me-1"></i>
            {delivery.distance}
          </small>
        </div>
      </td>
      <td className="align-middle">
        <div>
          <div className="fw-semibold">{delivery.scheduledTime}</div>
          <small className="text-muted d-block">{delivery.scheduledDate}</small>
          <small className="text-muted">
            <i className="bi bi-clock me-1"></i>
            {delivery.estimatedDuration}
          </small>
        </div>
      </td>
      <td className="align-middle">
        <Badge
          bg={getStatusColor(delivery.status)}
          className="bg-opacity-10 px-3 py-2"
        >
          <span className={`text-${getStatusColor(delivery.status)}`}>
            <i className={`${getStatusIcon(delivery.status)} me-1`}></i>
            {delivery.status}
          </span>
        </Badge>
      </td>
      <td className="align-middle">
        <div className="d-flex gap-2">
          {delivery.status === 'Assigned' && (
            <>
              <Button
                variant="success"
                size="sm"
                onClick={() => onStartDelivery(delivery)}
              >
                <i className="bi bi-play-fill me-1"></i>
                Start
              </Button>
              <Button
                variant="outline-primary"
                size="sm"
                onClick={() => onNavigate(delivery)}
              >
                <i className="bi bi-geo-alt"></i>
              </Button>
            </>
          )}

          {delivery.status === 'In Transit' && (
            <>
              <Button
                variant="primary"
                size="sm"
                onClick={() => onCompleteDelivery(delivery)}
              >
                <i className="bi bi-check-circle me-1"></i>
                Complete
              </Button>
              <Button
                variant="outline-primary"
                size="sm"
                onClick={() => onNavigate(delivery)}
              >
                <i className="bi bi-geo-alt"></i>
              </Button>
            </>
          )}

          {delivery.status === 'Delivered' && (
            <Badge bg="success" className="px-3 py-2">
              <i className="bi bi-check-circle-fill me-1"></i>
              Done
            </Badge>
          )}

          <Dropdown>
            <Dropdown.Toggle
              variant="link"
              className="text-dark p-0 border-0 shadow-none"
              size="sm"
            >
              <i className="bi bi-three-dots-vertical"></i>
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item onClick={() => onNavigate(delivery)}>
                <i className="bi bi-geo-alt me-2"></i>
                Navigate
              </Dropdown.Item>
              <Dropdown.Item href={`tel:${delivery.order.customerPhone}`}>
                <i className="bi bi-telephone me-2"></i>
                Call Customer
              </Dropdown.Item>
              {delivery.notes && (
                <>
                  <Dropdown.Divider />
                  <Dropdown.Header>
                    <small className="text-muted">Notes: {delivery.notes}</small>
                  </Dropdown.Header>
                </>
              )}
              {(delivery.status === 'Assigned' || delivery.status === 'In Transit') && (
                <>
                  <Dropdown.Divider />
                  <Dropdown.Item 
                    className="text-danger"
                    onClick={() => {
                      const reason = prompt('Why did the delivery fail?');
                      if (reason) onMarkFailed(delivery.id, reason);
                    }}
                  >
                    <i className="bi bi-x-circle me-2"></i>
                    Mark as Failed
                  </Dropdown.Item>
                </>
              )}
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </td>
    </tr>
  );
};

export default DriverDeliveryRow;