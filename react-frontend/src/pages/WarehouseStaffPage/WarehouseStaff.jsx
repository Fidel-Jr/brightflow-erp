import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, InputGroup, Card, Button, ButtonGroup } from 'react-bootstrap';
import Sidebar from '../../components/sidebar/Sidebar';
import TopNavbar from '../../components/navbar/TopNavbar';
import WarehouseStats from '../../components/warehouse/WarehouseStats';
import WarehouseOrdersTable from '../../components/warehouse/WarehouseOrdersTable';
import OrderProcessModal from '../../components/warehouse/OrderProcessModal';

const WarehouseStaffPage = () => {
  const [showSidebar, setShowSidebar] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showProcessModal, setShowProcessModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('active'); // active shows: Pending, Processing, Shipped

  // Mock current user (warehouse staff)
  const currentUser = {
    id: 1,
    name: 'Sarah Wilson',
    role: 'Warehouse Staff',
    warehouse: 'Warehouse A'
  };

  // Mock orders data
  const [orders, setOrders] = useState([
    {
      id: 1,
      orderNumber: 'ORD-2024-001',
      customer: {
        name: 'John Doe',
        email: 'john.doe@example.com',
        phone: '+1 234 567 8900',
        address: '123 Main St, New York, NY 10001'
      },
      products: [
        { id: 1, name: 'Wireless Mouse', sku: 'WM-001', quantity: 2, price: 29.99 },
        { id: 2, name: 'USB-C Cable', sku: 'UC-002', quantity: 3, price: 12.99 }
      ],
      status: 'Pending',
      priority: 'High',
      totalAmount: 98.95,
      assignedWarehouse: 'Warehouse A',
      assignedStaff: 'Sarah Wilson',
      deliveryStaff: null,
      createdAt: '2024-02-18T10:30:00',
      updatedAt: '2024-02-18T10:30:00',
      estimatedDelivery: '2024-02-22',
      notes: 'Customer requested gift wrapping',
      packingCompleted: false,
      qualityChecked: false
    },
    {
      id: 2,
      orderNumber: 'ORD-2024-002',
      customer: {
        name: 'Sarah Anderson',
        email: 'sarah.anderson@example.com',
        phone: '+1 234 567 8901',
        address: '456 Oak Ave, Los Angeles, CA 90001'
      },
      products: [
        { id: 3, name: 'Office Chair', sku: 'OC-003', quantity: 1, price: 199.99 },
        { id: 4, name: 'Laptop Stand', sku: 'LS-004', quantity: 1, price: 49.99 }
      ],
      status: 'Processing',
      priority: 'Medium',
      totalAmount: 249.98,
      assignedWarehouse: 'Warehouse A',
      assignedStaff: 'Sarah Wilson',
      deliveryStaff: null,
      createdAt: '2024-02-17T14:20:00',
      updatedAt: '2024-02-18T09:15:00',
      estimatedDelivery: '2024-02-21',
      notes: 'Large furniture - requires 2 people',
      packingCompleted: true,
      qualityChecked: false
    },
    {
      id: 3,
      orderNumber: 'ORD-2024-003',
      customer: {
        name: 'Mike Johnson',
        email: 'mike.j@example.com',
        phone: '+1 234 567 8902',
        address: '789 Pine Rd, Chicago, IL 60601'
      },
      products: [
        { id: 5, name: 'Desk Lamp', sku: 'DL-005', quantity: 2, price: 34.99 }
      ],
      status: 'Shipped',
      priority: 'Low',
      totalAmount: 69.98,
      assignedWarehouse: 'Warehouse A',
      assignedStaff: 'Mike Johnson',
      deliveryStaff: 'Tom Brown',
      createdAt: '2024-02-16T08:45:00',
      updatedAt: '2024-02-17T16:30:00',
      shippedAt: '2024-02-17T16:30:00',
      estimatedDelivery: '2024-02-20',
      notes: 'Fragile items - handle with care',
      packingCompleted: true,
      qualityChecked: true
    },
    {
      id: 5,
      orderNumber: 'ORD-2024-005',
      customer: {
        name: 'David Brown',
        email: 'david.b@example.com',
        phone: '+1 234 567 8904',
        address: '555 Maple Dr, Phoenix, AZ 85001'
      },
      products: [
        { id: 7, name: 'Notebook Set', sku: 'NS-007', quantity: 5, price: 15.99 }
      ],
      status: 'Processing',
      priority: 'High',
      totalAmount: 79.95,
      assignedWarehouse: 'Warehouse A',
      assignedStaff: 'Sarah Wilson',
      deliveryStaff: null,
      createdAt: '2024-02-18T09:15:00',
      updatedAt: '2024-02-18T11:00:00',
      estimatedDelivery: '2024-02-21',
      notes: 'Bulk order for corporate client',
      packingCompleted: false,
      qualityChecked: false
    },
    {
      id: 6,
      orderNumber: 'ORD-2024-006',
      customer: {
        name: 'Lisa Martinez',
        email: 'lisa.m@example.com',
        phone: '+1 234 567 8905',
        address: '777 Cedar Ln, Miami, FL 33101'
      },
      products: [
        { id: 8, name: 'Monitor Stand', sku: 'MS-008', quantity: 1, price: 39.99 },
        { id: 1, name: 'Wireless Mouse', sku: 'WM-001', quantity: 2, price: 29.99 }
      ],
      status: 'Pending',
      priority: 'Medium',
      totalAmount: 99.97,
      assignedWarehouse: 'Warehouse A',
      assignedStaff: 'Sarah Wilson',
      deliveryStaff: null,
      createdAt: '2024-02-18T13:30:00',
      updatedAt: '2024-02-18T13:30:00',
      estimatedDelivery: '2024-02-22',
      notes: '',
      packingCompleted: false,
      qualityChecked: false
    }
  ]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 992) {
        setShowSidebar(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleProcessOrder = (order) => {
    setSelectedOrder(order);
    setShowProcessModal(true);
  };

  const handleStatusUpdate = (orderId, newStatus, additionalData = {}) => {
    setOrders(orders.map(order => {
      if (order.id === orderId) {
        const updatedOrder = {
          ...order,
          status: newStatus,
          updatedAt: new Date().toISOString(),
          ...additionalData
        };

        // Update timestamps based on status
        if (newStatus === 'Shipped' && !order.shippedAt) {
          updatedOrder.shippedAt = new Date().toISOString();
        }

        return updatedOrder;
      }
      return order;
    }));
  };

  const handleQuickUpdate = (orderId, field, value) => {
    setOrders(orders.map(order => {
      if (order.id === orderId) {
        return {
          ...order,
          [field]: value,
          updatedAt: new Date().toISOString()
        };
      }
      return order;
    }));
  };

  // Filter orders - show only active orders assigned to current warehouse
  const filteredOrders = orders.filter(order => {
    // Only show orders from current warehouse
    if (order.assignedWarehouse !== currentUser.warehouse) {
      return false;
    }

    const matchesSearch =
      order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.name.toLowerCase().includes(searchTerm.toLowerCase());

    // Filter by status
    const activeStatuses = ['Pending', 'Processing', 'Shipped'];
    const matchesStatus =
      filterStatus === 'all' ||
      (filterStatus === 'active' && activeStatuses.includes(order.status)) ||
      order.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="d-flex vh-100 overflow-hidden" style={{ backgroundColor: '#f8f9fa' }}>
      <Sidebar
        showSidebar={showSidebar}
        setShowSidebar={setShowSidebar}
        sidebarCollapsed={sidebarCollapsed}
        setSidebarCollapsed={setSidebarCollapsed}
      />

      <div className="flex-fill d-flex flex-column overflow-hidden">
        <TopNavbar
          setShowSidebar={setShowSidebar}
          sidebarCollapsed={sidebarCollapsed}
          setSidebarCollapsed={setSidebarCollapsed}
        />

        <main className="flex-fill overflow-auto p-4">
          <Container fluid>
            {/* Header */}
            <Row className="mb-4">
              <Col>
                <h3 className="fw-bold mb-2">My Orders - {currentUser.warehouse}</h3>
                <p className="text-muted mb-0">
                  Process and update orders assigned to you
                </p>
              </Col>
              <Col xs="auto">
                <Card className="border-0 shadow-sm">
                  <Card.Body className="p-3 d-flex align-items-center">
                    <div
                      className="rounded-circle d-flex align-items-center justify-content-center me-3"
                      style={{
                        width: '48px',
                        height: '48px',
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                      }}
                    >
                      <i className="bi bi-person text-white fs-4"></i>
                    </div>
                    <div>
                      <div className="fw-semibold">{currentUser.name}</div>
                      <small className="text-muted">{currentUser.role}</small>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            </Row>

            {/* Stats Cards */}
            <WarehouseStats orders={filteredOrders} currentUser={currentUser} />

            {/* Filters */}
            <Card className="border-0 shadow-sm mb-4">
              <Card.Body className="p-4">
                <Row className="g-3">
                  {/* Search */}
                  <Col md={5}>
                    <InputGroup>
                      <InputGroup.Text className="bg-light border-end-0">
                        <i className="bi bi-search"></i>
                      </InputGroup.Text>
                      <Form.Control
                        type="search"
                        placeholder="Search by order # or customer..."
                        className="border-start-0 bg-light"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </InputGroup>
                  </Col>

                  {/* Status Filter */}
                  <Col md={3}>
                    <ButtonGroup className="w-100">
                      <Button
                        variant={filterStatus === 'active' ? 'primary' : 'outline-secondary'}
                        onClick={() => setFilterStatus('active')}
                      >
                        Active Orders
                      </Button>
                      <Button
                        variant={filterStatus === 'all' ? 'primary' : 'outline-secondary'}
                        onClick={() => setFilterStatus('all')}
                      >
                        All
                      </Button>
                    </ButtonGroup>
                  </Col>

                  <Col md={4} className="text-md-end">
                    <ButtonGroup>
                      <Button variant="outline-secondary">
                        <i className="bi bi-funnel me-2"></i>
                        Pending ({orders.filter(o => o.status === 'Pending' && o.assignedWarehouse === currentUser.warehouse).length})
                      </Button>
                      <Button variant="outline-secondary">
                        <i className="bi bi-arrow-repeat me-2"></i>
                        Processing ({orders.filter(o => o.status === 'Processing' && o.assignedWarehouse === currentUser.warehouse).length})
                      </Button>
                    </ButtonGroup>
                  </Col>
                </Row>
              </Card.Body>
            </Card>

            {/* Orders Table */}
            <WarehouseOrdersTable
              orders={filteredOrders}
              onProcessOrder={handleProcessOrder}
              onStatusUpdate={handleStatusUpdate}
              onQuickUpdate={handleQuickUpdate}
              currentUser={currentUser}
            />
          </Container>
        </main>
      </div>

      {/* Process Order Modal */}
      <OrderProcessModal
        show={showProcessModal}
        order={selectedOrder}
        currentUser={currentUser}
        onHide={() => {
          setShowProcessModal(false);
          setSelectedOrder(null);
        }}
        onSubmit={handleStatusUpdate}
      />
    </div>
  );
};

export default WarehouseStaffPage;