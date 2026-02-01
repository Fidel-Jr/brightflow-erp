import React from 'react';
import { Col, Card, Table } from 'react-bootstrap';

const RecentOrders = () => {
  const orders = [
    {
      id: '#ORD-2024-001',
      customer: { name: 'John Doe', initials: 'JD', color: 'primary' },
      product: 'Wireless Headphones',
      amount: '$299.00',
      status: { label: 'Delivered', variant: 'success' }
    },
    {
      id: '#ORD-2024-002',
      customer: { name: 'Sarah Anderson', initials: 'SA', color: 'danger' },
      product: 'Smart Watch Pro',
      amount: '$450.00',
      status: { label: 'Pending', variant: 'warning' }
    },
    {
      id: '#ORD-2024-003',
      customer: { name: 'Mike Johnson', initials: 'MJ', color: 'info' },
      product: 'Laptop Stand',
      amount: '$79.99',
      status: { label: 'Processing', variant: 'info' }
    },
    {
      id: '#ORD-2024-004',
      customer: { name: 'Emily Wilson', initials: 'EW', color: 'success' },
      product: 'Mechanical Keyboard',
      amount: '$159.00',
      status: { label: 'Delivered', variant: 'success' }
    },
    {
      id: '#ORD-2024-005',
      customer: { name: 'David Brown', initials: 'DB', color: 'warning' },
      product: 'USB-C Hub',
      amount: '$49.99',
      status: { label: 'Processing', variant: 'info' }
    }
  ];

  return (
    <Col lg={8}>
      <Card className="border-0 shadow-sm">
        <Card.Body className="p-4">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h5 className="fw-bold mb-0">Recent Orders</h5>
            <a href="#" className="text-decoration-none small">View All</a>
          </div>
          
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
        </Card.Body>
      </Card>
    </Col>
  );
};

export default RecentOrders;