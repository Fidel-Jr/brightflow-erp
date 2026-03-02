import React, { useState, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import Sidebar from '../../components/sidebar/Sidebar';
import TopNavbar from '../../components/navbar/TopNavbar';
import DeliveryStats from '../../components/deliveries/DeliveryStats';
import DeliveryFilters from '../../components/deliveries/DeliveryFilters';
import DeliveryTable from '../../components/deliveries/DeliveryTable';
import AssignDriverModal from '../../components/deliveries/AssignDriverModal';
import DeliveryDetailsModal from '../../components/deliveries/DeliveryDetailsModal';
import OrderDetailsModal from '../../components/orders/OrderDetailsModal';
import { assignDriver, getDeliveries, unassignDriver, updateDeliveryStatus } from '../../api/delivery-api';
import { getUsers } from '../../api/user-api';
import { updateOrderStatus } from '../../api/order-api';
import { getOrderByOrderNumber } from '../../api/order-api';

const DeliveryPage = () => {
  const [showSidebar, setShowSidebar] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showOrderDetailsModal, setShowOrderDetailsModal] = useState(false);
  const [selectedDelivery, setSelectedDelivery] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterDriver, setFilterDriver] = useState('all');

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  // Mock deliveries data
  const [deliveries, setDeliveries] = useState([
    
  ]);

  const [drivers, setDrivers] = useState([]);

  const fetchDrivers = async () => {
    try {
      const response = await getUsers();
      const deliveryStaff = response.data.filter((u) => (u.roles || []).includes('Delivery Staff'));

      const mappedDrivers = deliveryStaff.map((u) => ({
        id: u.id,
        name: u.fullName || u.username,
        phone: u.phoneNumber || '',
        vehicleNumber: '',
        vehicleType: '',
        status: u.status === 'Active' ? 'Available' : 'Off Duty'
      }));

      setDrivers(mappedDrivers);
    } catch (error) {
      console.error('Error fetching drivers:', error);
      setDrivers([]);
    }
  };
  const fetchDeliveries = async () => {
      try {
        const response = await getDeliveries();
        console.log('Deliveries In State: ', response.data);
        setDeliveries(response.data);
      } catch (error) {
        console.error('Error fetching deliveries:', error);
      }
    }
    useEffect(() => {
      fetchDeliveries();
      fetchDrivers();
        
      }, []);
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 992) {
        setShowSidebar(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (!selectedDelivery?.id) return;
    const latest = deliveries.find((d) => d.id === selectedDelivery.id);
    if (latest) {
      setSelectedDelivery(latest);
    }
  }, [deliveries]);

  const handleAssignDriver = (delivery) => {
    setSelectedDelivery(delivery);
    setShowAssignModal(true);
  };

  const handleViewDetails = (delivery) => {
    setSelectedDelivery(delivery);
    setShowDetailsModal(true);
  };

  const handleViewOrder = async (orderNumber) => {
    if (!orderNumber) return;
    try {
      const response = await getOrderByOrderNumber(orderNumber);
      setSelectedOrder(response.data);
      setShowOrderDetailsModal(true);
    } catch (error) {
      console.error('Error fetching order details:', error);
    }
  };

  // console.log('Selected Delivery for Assignment:', selectedDelivery.id);

  const handleSubmitAssignment = async (driverId, scheduledDate, scheduledTime, notes) => {
    try {
      await assignDriver(selectedDelivery.id, {
        driverId,
        scheduledDate,
        scheduledTime,
        notes
      });

      const orderNumber = selectedDelivery?.orderDetails?.orderNumber;
      if (orderNumber) {
        try {
          await updateOrderStatus(orderNumber, 'Assigned');
        } catch (statusError) {
          console.error('Error updating order status:', statusError);
        }
      }

      await fetchDeliveries();
      setShowAssignModal(false);
      setSelectedDelivery(null);
    } catch (error) {
      console.error('Error assigning driver:', error);
    }
  };

  const handleStatusUpdate = async (deliveryId, newStatus) => {
    try {
      await updateDeliveryStatus(deliveryId, newStatus);
      await fetchDeliveries();
    } catch (error) {
      console.error('Error updating delivery status:', error);
    }
  };

  const handleUnassignDriver = async (deliveryId) => {
    const confirm = window.confirm('Are you sure you want to unassign the driver?');
    if (!confirm) return;

    try {
      await unassignDriver(deliveryId);
      await fetchDeliveries();
    } catch (error) {
      console.error('Error unassigning driver:', error);
    }
  };

  // Filter deliveries
  const filteredDeliveries = deliveries.filter(delivery => {
    const matchesSearch =
      delivery.deliveryNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      delivery.orderDetails.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      delivery.orderDetails.customerName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = filterStatus === 'all' || delivery.status === filterStatus;
    
    const matchesDriver =
      filterDriver === 'all' ||
      (filterDriver === 'unassigned' && !delivery.driverId) ||
      (delivery.driverId && delivery.driverId === filterDriver);

    return matchesSearch && matchesStatus && matchesDriver;
  });

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterStatus, filterDriver]);

  const totalCount = filteredDeliveries.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  const safeCurrentPage = Math.min(Math.max(currentPage, 1), totalPages);
  const startIndex = (safeCurrentPage - 1) * pageSize;
  const pagedDeliveries = filteredDeliveries.slice(startIndex, startIndex + pageSize);

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
                <h3 className="fw-bold mb-2">Delivery Management</h3>
                <p className="text-muted mb-0">Schedule and track deliveries</p>
              </Col>
            </Row>

            {/* Stats Cards */}
            <DeliveryStats deliveries={deliveries} drivers={drivers} />

            {/* Filters and Actions */}
            <DeliveryFilters
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              filterStatus={filterStatus}
              setFilterStatus={setFilterStatus}
              filterDriver={filterDriver}
              setFilterDriver={setFilterDriver}
              drivers={drivers}
            />

            {/* Deliveries Table */}
            <DeliveryTable 
              deliveries={pagedDeliveries}
              totalCount={totalCount}
              pageSize={pageSize}
              currentPage={safeCurrentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              onAssignDriver={handleAssignDriver}
              onUnassignDriver={handleUnassignDriver}
              onViewDetails={handleViewDetails}
              onStatusUpdate={handleStatusUpdate}
              onViewOrder={handleViewOrder}
            />
          </Container>
        </main>
      </div>

      {/* Assign Driver Modal */}
      <AssignDriverModal
        show={showAssignModal}
        delivery={selectedDelivery}
        drivers={drivers}
        onHide={() => {
          setShowAssignModal(false);
          setSelectedDelivery(null);
        }}
        onSubmit={handleSubmitAssignment}
      />

      {/* Delivery Details Modal */}
      <DeliveryDetailsModal
        show={showDetailsModal}
        delivery={selectedDelivery}
        onHide={() => setShowDetailsModal(false)}
        onAssignDriver={(delivery) => {
          setShowDetailsModal(false);
          handleAssignDriver(delivery);
        }}
        onStatusUpdate={handleStatusUpdate}
      />

      <OrderDetailsModal
        show={showOrderDetailsModal}
        order={selectedOrder}
        onHide={() => {
          setShowOrderDetailsModal(false);
          setSelectedOrder(null);
        }}
      />
    </div>
  );
};

export default DeliveryPage;