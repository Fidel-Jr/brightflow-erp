import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, InputGroup, Card, Button, ButtonGroup, Badge } from 'react-bootstrap';
import Sidebar from '../../components/sidebar/Sidebar';
import TopNavbar from '../../components/navbar/TopNavbar';
import DeliveryDriverStats from '../../components/delivery_driver/DeliveryDriverStats';
import DriverDeliveriesTable from '../../components/delivery_driver/DeliveriesDriversTable';
import DeliveryCompleteModal from '../../components/delivery_driver/DeliveryCompleteModal';
import DeliveryNavigationModal from '../../components/delivery_driver/DeliveryNavigationModal';

const DeliveryDriver = () => {
  const [showSidebar, setShowSidebar] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const [showNavigationModal, setShowNavigationModal] = useState(false);
  const [selectedDelivery, setSelectedDelivery] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('active'); // active shows: Assigned, In Transit

  // Mock current user (delivery driver)
  const currentDriver = {
    id: 1,
    name: 'Tom Brown',
    role: 'Delivery Driver',
    phone: '+1 234 567 9001',
    vehicleNumber: 'VN-001',
    vehicleType: 'Van',
    status: 'On Delivery'
  };

  // Mock deliveries data
  const [deliveries, setDeliveries] = useState([
    {
      id: 1,
      deliveryNumber: 'DEL-2024-001',
      order: {
        orderNumber: 'ORD-2024-001',
        customerId: 1,
        customerName: 'John Doe',
        customerPhone: '+1 234 567 8900',
        deliveryAddress: '123 Main St, New York, NY 10001',
        totalAmount: 98.95
      },
      driver: {
        id: 1,
        name: 'Tom Brown',
        phone: '+1 234 567 9001',
        vehicleNumber: 'VN-001',
        vehicleType: 'Van'
      },
      status: 'Assigned',
      priority: 'High',
      scheduledDate: '2024-02-20',
      scheduledTime: '10:00 AM',
      estimatedDuration: '45 mins',
      actualPickupTime: null,
      actualDeliveryTime: null,
      distance: '12.5 km',
      notes: 'Fragile items - handle with care',
      proofOfDelivery: null,
      deliveryPhoto: null,
      recipientName: null,
      recipientSignature: null,
      createdAt: '2024-02-18T10:30:00',
      updatedAt: '2024-02-18T14:00:00'
    },
    {
      id: 2,
      deliveryNumber: 'DEL-2024-002',
      order: {
        orderNumber: 'ORD-2024-002',
        customerId: 2,
        customerName: 'Sarah Anderson',
        customerPhone: '+1 234 567 8901',
        deliveryAddress: '456 Oak Ave, Los Angeles, CA 90001',
        totalAmount: 249.98
      },
      driver: {
        id: 1,
        name: 'Tom Brown',
        phone: '+1 234 567 9001',
        vehicleNumber: 'VN-001',
        vehicleType: 'Van'
      },
      status: 'In Transit',
      priority: 'Medium',
      scheduledDate: '2024-02-20',
      scheduledTime: '11:30 AM',
      estimatedDuration: '60 mins',
      actualPickupTime: '2024-02-20T11:30:00',
      actualDeliveryTime: null,
      distance: '18.3 km',
      notes: 'Large furniture - requires 2 people',
      proofOfDelivery: null,
      deliveryPhoto: null,
      recipientName: null,
      recipientSignature: null,
      createdAt: '2024-02-17T14:20:00',
      updatedAt: '2024-02-20T11:30:00'
    },
    {
      id: 3,
      deliveryNumber: 'DEL-2024-003',
      order: {
        orderNumber: 'ORD-2024-003',
        customerId: 3,
        customerName: 'Mike Johnson',
        customerPhone: '+1 234 567 8902',
        deliveryAddress: '789 Pine Rd, Chicago, IL 60601',
        totalAmount: 69.98
      },
      driver: {
        id: 1,
        name: 'Tom Brown',
        phone: '+1 234 567 9001',
        vehicleNumber: 'VN-001',
        vehicleType: 'Van'
      },
      status: 'Delivered',
      priority: 'Low',
      scheduledDate: '2024-02-19',
      scheduledTime: '02:00 PM',
      estimatedDuration: '30 mins',
      actualPickupTime: '2024-02-19T14:00:00',
      actualDeliveryTime: '2024-02-19T14:25:00',
      distance: '8.7 km',
      notes: '',
      proofOfDelivery: 'Photo taken',
      deliveryPhoto: 'photo-url',
      recipientName: 'Mike Johnson',
      recipientSignature: 'signature-url',
      createdAt: '2024-02-16T08:45:00',
      updatedAt: '2024-02-19T14:25:00'
    },
    {
      id: 5,
      deliveryNumber: 'DEL-2024-005',
      order: {
        orderNumber: 'ORD-2024-005',
        customerId: 5,
        customerName: 'David Brown',
        customerPhone: '+1 234 567 8904',
        deliveryAddress: '555 Maple Dr, Phoenix, AZ 85001',
        totalAmount: 79.95
      },
      driver: {
        id: 1,
        name: 'Tom Brown',
        phone: '+1 234 567 9001',
        vehicleNumber: 'VN-001',
        vehicleType: 'Van'
      },
      status: 'Assigned',
      priority: 'High',
      scheduledDate: '2024-02-20',
      scheduledTime: '03:00 PM',
      estimatedDuration: '50 mins',
      actualPickupTime: null,
      actualDeliveryTime: null,
      distance: '22.1 km',
      notes: 'Corporate client - priority delivery',
      proofOfDelivery: null,
      deliveryPhoto: null,
      recipientName: null,
      recipientSignature: null,
      createdAt: '2024-02-18T09:15:00',
      updatedAt: '2024-02-18T09:15:00'
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

  const handleStartDelivery = (delivery) => {
    setDeliveries(deliveries.map(d => {
      if (d.id === delivery.id) {
        return {
          ...d,
          status: 'In Transit',
          actualPickupTime: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
      }
      return d;
    }));
  };

  const handleCompleteDelivery = (delivery) => {
    setSelectedDelivery(delivery);
    setShowCompleteModal(true);
  };

  const handleNavigate = (delivery) => {
    setSelectedDelivery(delivery);
    setShowNavigationModal(true);
  };

  const handleSubmitDelivery = (deliveryData) => {
    setDeliveries(deliveries.map(d => {
      if (d.id === selectedDelivery.id) {
        return {
          ...d,
          status: 'Delivered',
          actualDeliveryTime: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          ...deliveryData
        };
      }
      return d;
    }));
    setShowCompleteModal(false);
    setSelectedDelivery(null);
  };

  const handleMarkFailed = (deliveryId, reason) => {
    setDeliveries(deliveries.map(d => {
      if (d.id === deliveryId) {
        return {
          ...d,
          status: 'Failed',
          updatedAt: new Date().toISOString(),
          notes: `${d.notes}\n\nFailed Reason: ${reason}`
        };
      }
      return d;
    }));
  };

  // Filter deliveries - show only assigned to current driver
  const filteredDeliveries = deliveries.filter(delivery => {
    // Only show deliveries assigned to current driver
    if (!delivery.driver || delivery.driver.id !== currentDriver.id) {
      return false;
    }

    const matchesSearch =
      delivery.deliveryNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      delivery.order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      delivery.order.customerName.toLowerCase().includes(searchTerm.toLowerCase());

    // Filter by status
    const activeStatuses = ['Assigned', 'In Transit'];
    const matchesStatus =
      filterStatus === 'all' ||
      (filterStatus === 'active' && activeStatuses.includes(delivery.status)) ||
      (filterStatus === 'today' && delivery.scheduledDate === new Date().toISOString().split('T')[0]) ||
      delivery.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  // Sort deliveries: In Transit first, then by scheduled time
  const sortedDeliveries = [...filteredDeliveries].sort((a, b) => {
    if (a.status === 'In Transit' && b.status !== 'In Transit') return -1;
    if (a.status !== 'In Transit' && b.status === 'In Transit') return 1;
    return a.scheduledTime.localeCompare(b.scheduledTime);
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
                <h3 className="fw-bold mb-2">My Deliveries Today</h3>
                <p className="text-muted mb-0">
                  Manage your delivery route and update delivery status
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
                        background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
                      }}
                    >
                      <i className="bi bi-truck text-white fs-4"></i>
                    </div>
                    <div>
                      <div className="fw-semibold">{currentDriver.name}</div>
                      <small className="text-muted">
                        {currentDriver.vehicleType} - {currentDriver.vehicleNumber}
                      </small>
                    </div>
                    <Badge 
                      bg="success" 
                      className="ms-3"
                    >
                      {currentDriver.status}
                    </Badge>
                  </Card.Body>
                </Card>
              </Col>
            </Row>

            {/* Stats Cards */}
            <DeliveryDriverStats deliveries={sortedDeliveries} currentDriver={currentDriver} />

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
                        placeholder="Search by delivery #, order #, customer..."
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
                        Active
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
                        <i className="bi bi-geo-alt me-2"></i>
                        View Route Map
                      </Button>
                      <Button variant="outline-secondary">
                        <i className="bi bi-list-ul me-2"></i>
                        Stops: {sortedDeliveries.filter(d => d.status !== 'Delivered').length}
                      </Button>
                    </ButtonGroup>
                  </Col>
                </Row>
              </Card.Body>
            </Card>

            {/* Deliveries Table */}
            <DriverDeliveriesTable
              deliveries={sortedDeliveries}
              onStartDelivery={handleStartDelivery}
              onCompleteDelivery={handleCompleteDelivery}
              onNavigate={handleNavigate}
              onMarkFailed={handleMarkFailed}
              currentDriver={currentDriver}
            />
          </Container>
        </main>
      </div>

      {/* Complete Delivery Modal */}
      <DeliveryCompleteModal
        show={showCompleteModal}
        delivery={selectedDelivery}
        onHide={() => {
          setShowCompleteModal(false);
          setSelectedDelivery(null);
        }}
        onSubmit={handleSubmitDelivery}
      />

      {/* Navigation Modal */}
      <DeliveryNavigationModal
        show={showNavigationModal}
        delivery={selectedDelivery}
        onHide={() => setShowNavigationModal(false)}
      />
    </div>
  );
};

export default DeliveryDriver;