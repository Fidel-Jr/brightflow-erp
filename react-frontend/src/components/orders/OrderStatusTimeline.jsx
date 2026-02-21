import React from 'react';

const OrderStatusTimeline = ({ order }) => {
  const statuses = [
    {
      name: 'Pending',
      icon: 'bi-clock-history',
      date: order.createdAt,
      completed: true
    },
    {
      name: 'Processing',
      icon: 'bi-arrow-repeat',
      date: order.status !== 'Pending' ? order.updatedAt : null,
      completed: ['Processing', 'Shipped', 'Delivered'].includes(order.status)
    },
    {
      name: 'Shipped',
      icon: 'bi-truck',
      date: order.shippedAt,
      completed: ['Shipped', 'Delivered'].includes(order.status)
    },
    {
      name: 'Delivered',
      icon: 'bi-check-circle-fill',
      date: order.deliveredAt,
      completed: order.status === 'Delivered'
    }
  ];

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

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
            {status.date && (
              <small className="text-muted">{formatDate(status.date)}</small>
            )}
            {!status.date && status.completed && (
              <small className="text-muted">In progress...</small>
            )}
            {!status.completed && (
              <small className="text-muted">Pending</small>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default OrderStatusTimeline;