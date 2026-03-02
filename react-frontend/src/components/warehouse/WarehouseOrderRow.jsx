import React from 'react';
import { Badge, Button, Form, Dropdown } from 'react-bootstrap';
import { formatRelativeTime } from '../../helper/formatPrettyDateTime';

const WarehouseOrderRow = ({ order, onProcessOrder, onStatusUpdate, onQuickUpdate, currentUser }) => {
  const getStatusColor = (status) => {
    const colors = {
      'Pending': 'warning',
      'Processing': 'info',
      'For Delivery': 'primary',
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

  const getStatusIcon = (status) => {
    const icons = {
      'Pending': 'bi-clock-history',
      'Processing': 'bi-arrow-repeat',
      'For Delivery': 'bi-truck',
      'Delivered': 'bi-check-circle-fill'
    };
    return icons[status] || 'bi-circle';
  };

  const isMyOrder = order.assignedStaff === currentUser.name;

  return (
    <tr className={`${!isMyOrder ? 'table-light' : ''} ${order.priority === 'High' ? 'border-start border-danger border-3' : ''}`}>
      <td className="px-4 align-middle">
        <div>
          <div className="fw-semibold text-primary">{order.orderNumber}</div>
          <div className="d-flex gap-1 mt-1">
            <Badge
              bg={getPriorityColor(order.priority)}
              className="bg-opacity-10"
            >
              <span className={`text-${getPriorityColor(order.priority)}`}>
                {order.priority}
              </span>
            </Badge>
            {!isMyOrder && (
              <Badge bg="secondary" className="bg-opacity-10">
                <span className="text-secondary">{order.assignedStaff}</span>
              </Badge>
            )}
          </div>
          <small className="text-muted d-block mt-1">
            {formatRelativeTime(order.createdAt)}
          </small>
        </div>
      </td>
      <td className="align-middle">
        <div>
          <div className="fw-semibold">{order.customer.name}</div>
          <small className="text-muted d-block">{order.customer.phone}</small>
          <small className="text-muted">{order.customer.address.substring(0, 30)}...</small>
        </div>
      </td>
      <td className="align-middle">
        <div>
          <div className="fw-semibold">{order.products.length} item{order.products.length > 1 ? 's' : ''}</div>
          <small className="text-muted">
            {order.products.map(p => `${p.quantity}x ${p.name}`).join(', ').substring(0, 40)}
            {order.products.map(p => `${p.quantity}x ${p.name}`).join(', ').length > 40 ? '...' : ''}
          </small>
        </div>
      </td>
      <td className="align-middle">
        <div className="fw-semibold">${order.totalAmount.toFixed(2)}</div>
      </td>
      <td className="align-middle">
        <Dropdown>
          <Dropdown.Toggle
            as="div"
            className="cursor-pointer"
            style={{ cursor: 'pointer' }}
          >
            <Badge
              bg={getStatusColor(order.status)}
              className="bg-opacity-10 px-3 py-2"
            >
              <span className={`text-${getStatusColor(order.status)}`}>
                <i className={`${getStatusIcon(order.status)} me-1`}></i>
                {order.status}
              </span>
            </Badge>
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Header>Update Status</Dropdown.Header>
            {order.status === 'Pending' && (
              <Dropdown.Item onClick={() => onStatusUpdate(order.id, 'Processing')}>
                <i className="bi bi-arrow-repeat me-2 text-info"></i>
                Start Processing
              </Dropdown.Item>
            )}
            {order.status === 'Processing' && (
              <>
                <Dropdown.Item onClick={() => onStatusUpdate(order.id, 'Shipped')}>
                  <i className="bi bi-truck me-2 text-primary"></i>
                  Mark as Shipped
                </Dropdown.Item>
                <Dropdown.Item onClick={() => onStatusUpdate(order.id, 'Pending')}>
                  <i className="bi bi-arrow-counterclockwise me-2 text-warning"></i>
                  Move to Pending
                </Dropdown.Item>
              </>
            )}
          </Dropdown.Menu>
        </Dropdown>
      </td>
      <td className="align-middle">
        <div className="d-flex flex-column gap-1">
          <Form.Check
            type="checkbox"
            label="Packing"
            checked={order.packingCompleted}
            onChange={(e) => onQuickUpdate(order.id, 'packingCompleted', e.target.checked)}
            disabled={order.status === 'Shipped' || order.status === 'Delivered'}
          />
          <Form.Check
            type="checkbox"
            label="Quality Check"
            checked={order.qualityChecked}
            onChange={(e) => onQuickUpdate(order.id, 'qualityChecked', e.target.checked)}
            disabled={order.status === 'Shipped' || order.status === 'Delivered'}
          />
        </div>
        {order.packingCompleted && order.qualityChecked && order.status === 'Processing' && (
          <Badge bg="success" className="mt-1 d-block">
            <i className="bi bi-check-circle me-1"></i>
            Ready
          </Badge>
        )}
      </td>
      <td className="align-middle">
        <div className="d-flex gap-2">
          <Button
            variant="primary"
            size="sm"
            onClick={() => onProcessOrder(order)}
          >
            <i className="bi bi-box-arrow-right me-1"></i>
            Process
          </Button>
          
          {order.status === 'Pending' && (
            <Button
              variant="success"
              size="sm"
              onClick={() => onStatusUpdate(order.id, 'Processing')}
            >
              <i className="bi bi-play-fill"></i>
            </Button>
          )}
          
          {order.status === 'Processing' && order.packingCompleted && order.qualityChecked && (
            <Button
              variant="primary"
              size="sm"
              onClick={() => onStatusUpdate(order.id, 'Shipped')}
              title="Mark for Delivery"
            >
              <i className="bi bi-truck"></i>
            </Button>
          )}
        </div>
      </td>
    </tr>
  );
};

export default WarehouseOrderRow;