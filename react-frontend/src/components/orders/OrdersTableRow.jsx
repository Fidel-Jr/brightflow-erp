import React from 'react';
import { Form, Badge, Dropdown } from 'react-bootstrap';
import { formatSmartDateTime, formatRelativeTime } from '../../helper/formatPrettyDateTime';

const OrdersTableRow = ({ order, onEdit, onDelete, onViewDetails, onStatusUpdate }) => {
  const getStatusColor = (status) => {
    const colors = {
      'Pending': 'warning',
      'Processing': 'info',
      'Delivered': 'success'
    };
    return colors[status] || 'dark';
  };

  const getPriorityColor = (priority) => {
    const colors = {
      'High': 'danger',
      'Medium': 'warning',
      'Low': 'dark'
    };
    return colors[priority] || 'secondary';
  };

  const getStatusIcon = (status) => {
    const icons = {
      'Pending': 'bi-clock-history',
      'Processing': 'bi-arrow-repeat',
      'ForDelivery': 'bi-box2',
      'Assigned': 'bi-person-check',
      'InTransit': 'bi-truck',
      'Delivered': 'bi-check-circle-fill',
      'Failed': 'bi-x-circle-fill'
    };
    return icons[status] || 'bi-circle';
  };

  const handleEditClick = () => {
    onEdit(order);
  };

  const productCount = order.products?.length ?? 0;
  const productNames = order.products?.map(p => p.productName) ?? [];
  const totalAmount = Number(order.totalAmount ?? 0);

  return (
    <tr>
      <td className="px-4 align-middle">
        <Form.Check type="checkbox" />
      </td>
      <td className="align-middle">
        <div>
          <div className="fw-semibold text-primary">{order.orderNumber}</div>
          <small className="text-muted">
            <Badge 
              bg={getPriorityColor(order.priorityLevel)} 
              className="bg-opacity-10"
            >
              <span className={`text-${getPriorityColor(order.priorityLevel)}`}>
                {order.priorityLevel}
              </span>
            </Badge>
          </small>
        </div>
      </td>
      <td className="align-middle">
        <div>
          <div className="fw-semibold">{order.customer.name}</div>
          {/* <small className="text-muted">{order.customer.customerEmail}</small> */}
        </div>
      </td>
      <td className="align-middle">
        <div>
          <div className="fw-semibold">{productCount} items</div>
          <small className="text-muted">
            {productNames.join(', ').substring(0, 30)}...
          </small>
        </div>
      </td>
      <td className="align-middle fw-semibold">
        ₱{totalAmount.toFixed(2)}
      </td>
      <td className="align-middle">
        {/* <Dropdown>
          <Dropdown.Toggle 
            as="div"
            className="cursor-pointer"
            style={{ cursor: 'pointer' }}
          >
            
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Header>Update Status</Dropdown.Header>
            <Dropdown.Item onClick={() => onStatusUpdate(order.id, 'Pending')}>
              <i className="bi bi-clock-history me-2 text-warning"></i>
              Pending
            </Dropdown.Item>
            <Dropdown.Item onClick={() => onStatusUpdate(order.id, 'Processing')}>
              <i className="bi bi-arrow-repeat me-2 text-info"></i>
              Processing
            </Dropdown.Item>
            <Dropdown.Item onClick={() => onStatusUpdate(order.id, 'ForDelivery')}>
              <i className="bi bi-check-circle-fill me-2 text-success"></i>
              For Delivery
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown> */}
        <Badge 
          bg={getStatusColor(order.status)} 
          className="bg-opacity-10 px-3 py-2"
        >
          <span className={`text-${getStatusColor(order.status)}`}>
            <i className={`${getStatusIcon(order.status)} me-1`}></i>
            {order.status === 'ForDelivery' ? 'For Delivery' : order.status === 'InTransit' ? 'In Transit' : order.status === 'Delivered' ? 'Delivered' : order.status}
          </span>
        </Badge>
      </td>
      <td className="align-middle">
        <div>
          {/* <small className="text-muted d-block">Warehouse:</small> */}
          {/* <span className="fw-semibold small">{order.assignedWarehouse}</span> */}
        </div>
        <div className="mt-1">
          <small className="text-muted d-block">Staff:</small>
          <span className="fw-semibold small">{order.assignedStaffName}</span>
        </div>
      </td>
      <td className="align-middle text-muted">
        <div className="fw-semibold">{formatRelativeTime(order.createdAt)}</div>
        <small>{formatSmartDateTime(order.createdAt)}</small>
      </td>
      <td className="align-middle">
        <Dropdown>
          <Dropdown.Toggle 
            variant="link" 
            className="text-dark p-0 border-0 shadow-none"
          >
            <i className="bi bi-three-dots-vertical"></i>
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item onClick={() => onViewDetails(order)}>
              <i className="bi bi-eye me-2"></i>
              View Details
            </Dropdown.Item>
            {(order.status === 'Pending' || order.status === 'Processing') && (
              <Dropdown.Item 
                onClick={handleEditClick}
              >
                <i className="bi bi-pencil me-2"></i>
                Edit
              </Dropdown.Item>
            )}
            {/* <Dropdown.Item>
              <i className="bi bi-printer me-2"></i>
              Print Invoice
            </Dropdown.Item> */}
            {order.status === 'Pending' && (
              <>
                <Dropdown.Divider />
                <Dropdown.Item 
                  className="text-danger"
                  onClick={() => onDelete(order.id)}
                >
                  <i className="bi bi-trash me-2"></i>
                  Delete
                </Dropdown.Item>
              </>
            )}
          </Dropdown.Menu>
        </Dropdown>
      </td>
    </tr>
  );
};

export default OrdersTableRow;