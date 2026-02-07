import React, { useState, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import Sidebar from '../../components/sidebar/Sidebar';
import TopNavbar from '../../components/navbar/TopNavbar';
import UserStats from '../../components/user/UserStats';
import UserFilters from '../../components/user/UserFilters';
import UserTable from '../../components/user/UserTable';
import UserModal from '../../components/user/UserModal';

const UserManagementPage = () => {
  const [showSidebar, setShowSidebar] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');

  // Mock user data
  const [users, setUsers] = useState([
    {
      id: 1,
      name: 'John Doe',
      email: 'john.doe@example.com',
      role: 'Admin',
      status: 'Active',
      avatar: 'JD',
      createdAt: '2024-01-15',
      lastLogin: '2 hours ago'
    },
    {
      id: 2,
      name: 'Sarah Anderson',
      email: 'sarah.anderson@example.com',
      role: 'Manager',
      status: 'Active',
      avatar: 'SA',
      createdAt: '2024-02-10',
      lastLogin: '1 day ago'
    },
    {
      id: 3,
      name: 'Mike Johnson',
      email: 'mike.johnson@example.com',
      role: 'Warehouse Staff',
      status: 'Inactive',
      avatar: 'MJ',
      createdAt: '2024-01-20',
      lastLogin: '5 days ago'
    },
    {
      id: 4,
      name: 'Emily Wilson',
      email: 'emily.wilson@example.com',
      role: 'Delivery Staff',
      status: 'Active',
      avatar: 'EW',
      createdAt: '2024-03-01',
      lastLogin: '5 hours ago'
    },
    {
      id: 5,
      name: 'David Brown',
      email: 'david.brown@example.com',
      role: 'Admin',
      status: 'Active',
      avatar: 'DB',
      createdAt: '2024-01-05',
      lastLogin: '1 hour ago'
    },
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

  const handleOpenModal = (mode, user = null) => {
    setModalMode(mode);
    setSelectedUser(user);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedUser(null);
  };

  const handleSubmit = (formData) => {
    if (modalMode === 'add') {
      const newUser = {
        id: users.length + 1,
        name: formData.name,
        email: formData.email,
        role: formData.role,
        status: formData.status,
        avatar: formData.name.split(' ').map(n => n[0]).join('').toUpperCase(),
        createdAt: new Date().toISOString().split('T')[0],
        lastLogin: 'Never'
      };
      setUsers([...users, newUser]);
    } else {
      setUsers(users.map(user => 
        user.id === selectedUser.id 
          ? { ...user, ...formData, avatar: formData.name.split(' ').map(n => n[0]).join('').toUpperCase() }
          : user
      ));
    }
    handleCloseModal();
  };

  const handleDelete = (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      setUsers(users.filter(user => user.id !== userId));
    }
  };

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
                <h3 className="fw-bold mb-2">User Management</h3>
                <p className="text-muted mb-0">Manage user accounts and permissions</p>
              </Col>
            </Row>

            {/* Stats Cards */}
            <UserStats users={users} />

            {/* Filters and Actions */}
            <UserFilters
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              filterRole={filterRole}
              setFilterRole={setFilterRole}
              onAddUser={() => handleOpenModal('add')}
            />

            {/* Users Table */}
            <UserTable 
              users={users}
              onEdit={(user) => handleOpenModal('edit', user)}
              onDelete={handleDelete}
            />
          </Container>
        </main>
      </div>

      {/* Add/Edit User Modal */}
      <UserModal
        show={showModal}
        mode={modalMode}
        user={selectedUser}
        onHide={handleCloseModal}
        onSubmit={handleSubmit}
      />
    </div>
  );
};

export default UserManagementPage;