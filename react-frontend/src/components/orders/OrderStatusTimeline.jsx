import React from 'react';

const normalizeOrderStatus = (status) => {
  if (!status) return 'Pending';
  const normalized = String(status).replace(/\s+/g, '').replace(/_/g, '').toLowerCase();

  if (normalized === 'fordelivery') return 'ForDelivery';
  if (normalized === 'intransit') return 'InTransit';
  if (normalized === 'pending') return 'Pending';
  if (normalized === 'processing') return 'Processing';
  if (normalized === 'assigned') return 'Assigned';
  if (normalized === 'delivered') return 'Delivered';

  return status;
};

const OrderStatusTimeline = ({ order, delivery }) => {
  const currentStatus = normalizeOrderStatus(order?.status);
  const statusOrder = ['Pending', 'Processing', 'ForDelivery', 'Assigned', 'InTransit', 'Delivered'];
  const currentIndex = statusOrder.indexOf(currentStatus);

  const isAtLeast = (status) => {
    const stepIndex = statusOrder.indexOf(status);
    if (stepIndex === -1) return false;
    if (currentIndex === -1) return status === 'Pending';
    return currentIndex >= stepIndex;
  };

  const statuses = [
    {
      key: 'Pending',
      name: 'Pending',
      icon: 'bi-clock-history',
      completed: isAtLeast('Pending')
    },
    {
      key: 'Processing',
      name: 'Processing',
      icon: 'bi-arrow-repeat',
      completed: isAtLeast('Processing')
    },
    {
      key: 'ForDelivery',
      name: 'For Delivery',
      icon: 'bi-box2',
      completed: isAtLeast('ForDelivery')
    },
    {
      key: 'Assigned',
      name: 'Assigned',
      icon: 'bi-person-check',
      completed: isAtLeast('Assigned')
    },
    {
      key: 'InTransit',
      name: 'In Transit',
      icon: 'bi-truck',
      completed: isAtLeast('InTransit')
    },
    {
      key: 'Delivered',
      name: 'Delivered',
      icon: 'bi-check-circle-fill',
      completed: isAtLeast('Delivered')
    }
  ];

  return (
    <div className="position-relative">
      {statuses.map((status, index) => (
        <div key={status.name} className="d-flex mb-4 position-relative">
          {/* Timeline line */}
          {index !== statuses.length - 1 && (
            <div 
              className={`position-absolute ${status.completed ? 'bg-primary' : 'bg-light'}`}
              style={{ 
                left: '19px', 
                top: '40px', 
                width: '2px', 
                height: 'calc(100% + 16px)' 
              }}
            />
          )}

          {/* Icon */}
          <div 
            className={`rounded-circle d-flex align-items-center justify-content-center ${
              status.completed ? 'bg-primary' : 'bg-light'
            } me-3`}
            style={{ 
              width: '40px', 
              height: '40px',
              minWidth: '40px',
              position: 'relative',
              zIndex: 1
            }}
          >
            <i className={`${status.icon} ${status.completed ? 'text-white' : 'text-muted'}`}></i>
          </div>

          {/* Content */}
          <div className="flex-grow-1">
            <div className="fw-semibold mb-1">{status.name}</div>
            <small className="text-muted">
              {status.key === currentStatus
                ? currentStatus === 'Delivered'
                  ? 'Delivered successfully'
                  : 'In progress...'
                : status.completed
                  ? 'Completed'
                  : 'Pending'}
            </small>
          </div>
        </div>
      ))}
    </div>
  );
};

export default OrderStatusTimeline;