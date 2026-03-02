import React, { useState, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import Sidebar from '../../components/sidebar/Sidebar';
import TopNavbar from '../../components/navbar/TopNavbar';
import OrdersStats from '../../components/orders/OrdersStats';
import OrdersFilters from '../../components/orders/OrdersFilters';
import OrdersTable from '../../components/orders/OrdersTable';
import OrderModal from '../../components/orders/OrderModal';
import OrderDetailsModal from '../../components/orders/OrderDetailsModal';
import { getOrders, deleteOrder, getOrderByOrderNumber } from '../../api/order-api';
import { getProducts } from '../../api/product-api';
import { getStaffs } from '../../api/user-api';

const Orders = () => {
  const [showSidebar, setShowSidebar] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterDate, setFilterDate] = useState('all');
  const [products, setProducts] = useState([
      
  ]);
  const [staffs, setStaffs] = useState([
      
  ]);  

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Mock orders data
  const [orders, setOrders] = useState([
    
  ]);

  const fetchOrders = async () => {
    try {
      const response = await getOrders();
      setOrders(response.data);
      return response.data; // return orders for chaining
    } catch (err) {
      console.error('Failed to fetch orders', err);
      return [];
    }
  };

  const fetchProducts = async () => {
      try {
        const response = await getProducts();
        setProducts(response.data);
        console.log('Fetched products:', response.data);
      } catch (err) {
        console.error('Failed to fetch products', err);
      }
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 992) {
        setShowSidebar(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const fetchStaffs = async () => {
    try {
      const response = await getStaffs();
      setStaffs(response.data);
      console.log('Fetched staffs:', response.data);
    } catch (err) {
      console.error('Failed to fetch staffs', err);
    }
  }

  useEffect(() => {
    fetchOrders();
    fetchProducts();
    fetchStaffs();
  }, []);

  const handleOrderSaved = async (createdOrderNumber) => {
    await fetchOrders();     // refresh table
    await fetchProducts();   // optional

    if (createdOrderNumber) {
      try {
        const response = await getOrderByOrderNumber(createdOrderNumber);
        const fullOrder = response.data;

        setSelectedOrder(fullOrder);
        setShowDetailsModal(true);
      } catch (err) {
        console.error("Failed to fetch created order:", err);
      }
    }
  };

  const handleOpenModal = (mode, order = null) => {
    setModalMode(mode);
    setSelectedOrder(order);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedOrder(null);
  };

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setShowDetailsModal(true);
  };

  const handleStatusUpdate = (orderId, newStatus) => {
    setOrders(orders.map(order => {
      if (order.id === orderId) {
        const updatedOrder = { 
          ...order, 
          status: newStatus,
          updatedAt: new Date().toISOString()
        };
        
        // Update timestamps based on status
        if (newStatus === 'Shipped' && !order.shippedAt) {
          updatedOrder.shippedAt = new Date().toISOString();
        }
        if (newStatus === 'Delivered' && !order.deliveredAt) {
          updatedOrder.deliveredAt = new Date().toISOString();
        }
        
        return updatedOrder;
      }
      return order;
    }));
  };

  const handleDelete = async (orderId) => {
  
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await deleteOrder(orderId); // API call to delete user
        console.log('User deleted successfully');
      } catch (error) {
        console.error('Error deleting user:', error);
        alert('Failed to delete order. Please try again.');
        return;
      }
      setOrders(orders.filter(o => o.id !== orderId));
    }
  };

  // Filter orders
  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus =
      filterStatus === 'all' ||
      ((order.status ?? '').toLowerCase() === filterStatus.toLowerCase());
    
    const matchesDate = () => {
      if (filterDate === 'all') return true;
      const orderDate = new Date(order.createdAt);
      const today = new Date();
      const daysDiff = Math.floor((today - orderDate) / (1000 * 60 * 60 * 24));
      
      if (filterDate === 'today') return daysDiff === 0;
      if (filterDate === 'week') return daysDiff <= 7;
      if (filterDate === 'month') return daysDiff <= 30;
      return true;
    };
    
    return matchesSearch && matchesStatus && matchesDate();
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const paginatedOrders = filteredOrders.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);

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
                <h3 className="fw-bold mb-2">Orders Management</h3>
                <p className="text-muted mb-0">Track and manage customer orders</p>
              </Col>
            </Row>

            {/* Stats Cards */}
            <OrdersStats orders={orders} />

            {/* Filters and Actions */}
            <OrdersFilters
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              filterStatus={filterStatus}
              setFilterStatus={setFilterStatus}
              filterDate={filterDate}
              setFilterDate={setFilterDate}
              onAddOrder={() => handleOpenModal('add')}
            />

            {/* Orders Table */}
            <OrdersTable 
              orders={paginatedOrders}
              currentPage={currentPage}
              totalPages={totalPages}
              setCurrentPage={setCurrentPage}
              totalItems={filteredOrders.length}
              onEdit={(order) => handleOpenModal('edit', order)}
              onDelete={handleDelete}
              onViewDetails={handleViewDetails}
              onStatusUpdate={handleStatusUpdate}
            />
          </Container>
        </main>
      </div>

      {/* Add/Edit Order Modal */}
      <OrderModal
        show={showModal}
        mode={modalMode}
        order={selectedOrder}
        onHide={handleCloseModal}
        onSubmit={handleOrderSaved}
        products={products}
        staffs={staffs}
      />

      {/* Order Details Modal */}
      <OrderDetailsModal
        show={showDetailsModal}
        order={selectedOrder}
        onHide={() => setShowDetailsModal(false)}
        onEdit={(order) => {
          setShowDetailsModal(false);
          handleOpenModal('edit', order);
        }}
        onStatusUpdate={handleStatusUpdate}
      />
    </div>
  );
};

export default Orders;