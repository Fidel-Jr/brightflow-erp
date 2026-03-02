import React from 'react';

const DeliveryStatusTimeline = ({ delivery }) => {
  const normalizeStatus = (status) => {
    if (!status) return 'Pending';
    const normalized = String(status).replace(/\s+/g, '').replace(/_/g, '').toLowerCase();
    if (normalized === 'intransit') return 'InTransit';
    if (normalized === 'pending') return 'Pending';
    if (normalized === 'assigned') return 'Assigned';
    if (normalized === 'delivered') return 'Delivered';
    if (normalized === 'failed') return 'Failed';
    return status;
  };

  const driverAssigned = Boolean(delivery?.driverId);
  const currentStatus = normalizeStatus(delivery?.status);

  const statusOrder = ['Pending', 'Assigned', 'InTransit', 'Delivered'];
  const currentIndex = statusOrder.indexOf(currentStatus);
  const isAtLeast = (statusKey) => {
    const stepIndex = statusOrder.indexOf(statusKey);
    if (stepIndex === -1) return false;
    if (currentIndex === -1) return statusKey === 'Pending';
    return currentIndex >= stepIndex;
  };

  const assignedDriverName =
    delivery?.driverDetails?.userName ||
    delivery?.driverDetails?.email ||
    'driver';

  const statuses = [
    {
      key: 'Pending',
      name: 'Pending',
      icon: 'bi-clock-history',
      completed: true,
      description: 'Delivery created'
    },
    {
      key: 'Assigned',
      name: 'Assigned',
      icon: 'bi-person-check',
      completed: driverAssigned,
      description: driverAssigned ? `Assigned to ${assignedDriverName}` : 'Awaiting driver assignment'
    },
    {
      key: 'InTransit',
      name: 'In Transit',
      icon: 'bi-truck',
      completed: isAtLeast('InTransit'),
      description: isAtLeast('InTransit') ? 'Out for delivery' : 'Pending pickup'
    },
    {
      key: 'Delivered',
      name: 'Delivered',
      icon: 'bi-check-circle-fill',
      completed: isAtLeast('Delivered'),
      description: isAtLeast('Delivered') ? 'Successfully delivered' : 'Pending delivery'
    }
  ];

  if (currentStatus === 'Failed') {
    statuses.push({
      key: 'Failed',
      name: 'Failed',
      icon: 'bi-x-circle-fill',
      completed: true,
      description: 'Delivery attempt failed',
      isFailed: true
    });
  }

  return (
    <div className="position-relative">
      {statuses.map((status, index) => (
        <div key={status.name} className="d-flex mb-4 position-relative">
          {/* Timeline line */}
          {index !== statuses.length - 1 && (
            <div 
              className={`position-absolute ${
                status.completed 
                  ? (status.isFailed ? 'bg-danger' : 'bg-primary') 
                  : 'bg-light'
              }`}
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
              status.completed 
                ? (status.isFailed ? 'bg-danger' : 'bg-primary')
                : 'bg-light'
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
            <small className="text-muted d-block mb-1">{status.description}</small>
            <small className="text-muted">
              {/* {status.key === currentStatus
                ? 'In progress...'
                : status.completed
                  ? 'Completed'
                  : 'Pending'} */}
            </small>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DeliveryStatusTimeline;