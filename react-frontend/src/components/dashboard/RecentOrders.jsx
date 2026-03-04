import React, { useEffect, useState } from 'react';
import { Col, Card, Table, Spinner, Alert } from 'react-bootstrap';
import { getDashboardSummary } from '../../api/report-api';

const RecentOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Helper function to get customer initials
  const getInitials = (name) => {
    const safeName = (name ?? '').toString().trim();
    if (!safeName) return 'NA';

    return safeName
      .split(' ')
      .filter(Boolean)
      .map(word => word.charAt(0).toUpperCase())
      .slice(0, 2)
      .join('');
  };

  // Helper function to get random color for avatar
  const getRandomColor = (index) => {
    const colors = ['primary', 'danger', 'info', 'success', 'warning'];
    return colors[index % colors.length];
  };

  // Helper function to map status to badge variant
  const getStatusVariant = (status) => {
    const statusMap = {
      'Pending': { label: 'Pending', variant: 'warning' },
      'Processing': { label: 'Processing', variant: 'info' },
      'Delivered': { label: 'Delivered', variant: 'success' },
      'Cancelled': { label: 'Cancelled', variant: 'danger' },
      'Shipped': { label: 'Shipped', variant: 'primary' }
    };
    return statusMap[status] || { label: status, variant: 'secondary' };
  };

  // Format product description
  const formatProduct = (productCount, firstProductName) => {
    if (productCount === 1 && firstProductName) {
      return firstProductName;
    } else if (productCount > 1 && firstProductName) {
      return `${firstProductName} +${productCount - 1} more`;
    }
    return 'N/A';
  };

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const res = await getDashboardSummary();
        const data = res?.data ?? res;
        const recentOrders = Array.isArray(data?.recentOrders) ? data.recentOrders : [];
        
        // Transform API data to component format
        const transformedOrders = recentOrders.map((order, index) => {
          const customerName = order?.customerName ?? 'Unknown';
          const totalAmount = Number(order?.totalAmount);

          return {
          id: order.orderNumber,
          customer: {
            name: customerName,
            initials: getInitials(customerName),
            color: getRandomColor(index)
          },
          product: formatProduct(order?.productCount ?? 0, order?.firstProductName ?? ''),
          amount: Number.isFinite(totalAmount) ? `$${totalAmount.toFixed(2)}` : 'N/A',
          status: getStatusVariant(order?.status)
          };
        });

        setOrders(transformedOrders);
        setError(null);
      } catch (err) {
        console.error('Error fetching dashboard summary:', err);
        setError('Failed to load recent orders. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  return (
    <Col lg={8}>
      <Card className="border-0 shadow-sm">
        <Card.Body className="p-4">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h5 className="fw-bold mb-0">Recent Orders</h5>
            <a href="/orders" className="text-decoration-none small">View All</a>
          </div>
          
          {loading ? (
            <div className="text-center py-5">
              <Spinner animation="border" role="status" variant="primary">
                <span className="visually-hidden">Loading...</span>
              </Spinner>
            </div>
          ) : error ? (
            <Alert variant="danger" className="mb-0">
              {error}
            </Alert>
          ) : orders.length === 0 ? (
            <Alert variant="info" className="mb-0">
              No recent orders found.
            </Alert>
          ) : (
            <div className="table-responsive">
              <Table hover className="align-middle mb-0">
                <thead className="bg-light">
                  <tr>
                    <th className="border-0 text-muted small fw-semibold">ORDER ID</th>
                    <th className="border-0 text-muted small fw-semibold">CUSTOMER</th>
                    <th className="border-0 text-muted small fw-semibold">PRODUCT</th>
                    <th className="border-0 text-muted small fw-semibold">AMOUNT</th>
                    <th className="border-0 text-muted small fw-semibold">STATUS</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order, index) => (
                    <tr key={index}>
                      <td className="fw-semibold">{order.id}</td>
                      <td>
                        <div className="d-flex align-items-center">
                          <div 
                            className={`rounded-circle bg-${order.customer.color} bg-opacity-10 text-${order.customer.color} d-flex align-items-center justify-content-center me-2`}
                            style={{ width: '32px', height: '32px', fontSize: '0.8rem' }}
                          >
                            {order.customer.initials}
                          </div>
                          <span>{order.customer.name}</span>
                        </div>
                      </td>
                      <td>{order.product}</td>
                      <td className="fw-semibold">{order.amount}</td>
                      <td>
                        <span className={`badge bg-${order.status.variant} bg-opacity-10 text-${order.status.variant} px-3 py-2`}>
                          {order.status.label}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          )}
        </Card.Body>
      </Card>
    </Col>
  );
};

export default RecentOrders;