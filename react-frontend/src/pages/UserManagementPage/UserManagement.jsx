// src/pages/users/UserManagement.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import Sidebar from '../../components/sidebar/Sidebar';
import TopNavbar from '../../components/navbar/TopNavbar';
import UserStats from '../../components/user/UserStats';
import UserFilters from '../../components/user/UserFilters';
import UserTable from '../../components/user/UserTable';
import UserModal from '../../components/user/UserModal';
import { getUsers } from '../../api/user-api';

const UserManagement = () => {
  const [showSidebar, setShowSidebar] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [selectedUser, setSelectedUser] = useState(null);

  const [users, setUsers] = useState([]); // fetched or mock users

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  
    // Fetch users from API (or use mock)

    const fetchUsers = async () => {
      try {
        const response = await getUsers(); // or your API call
        setUsers(response.data);
      } catch (err) {
        console.error('Failed to fetch users', err);
        // fallback mock data
        setUsers([
          { id:1, username:'John Doe', email:'john@example.com', role:'Admin', roles:['Admin'], status:'Active', avatar:'JD', lastLogin:'2 hours ago'},
          { id:2, username:'Sarah Anderson', email:'sarah@example.com', role:'Manager', roles:['Manager'], status:'Active', avatar:'SA', lastLogin:'1 day ago'},
          { id:3, username:'Mike Johnson', email:'mike@example.com', role:'Warehouse Staff', roles:['Warehouse Staff'], status:'Inactive', avatar:'MJ', lastLogin:'5 days ago'},
          { id:4, username:'Emily Wilson', email:'emily@example.com', role:'Delivery Staff', roles:['Delivery Staff'], status:'Active', avatar:'EW', lastLogin:'5 hours ago'},
          { id:5, username:'David Brown', email:'david@example.com', role:'Admin', roles:['Admin'], status:'Active', avatar:'DB', lastLogin:'1 hour ago'}
        ]);
      }
    };

    useEffect(() => {
      fetchUsers();
    }, []);

   

  // Filter users based on search & role
  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      const username = user.username || '';
      const email = user.email || '';
      const userRoles = Array.isArray(user.roles) ? user.roles : [user.role];

      const matchesSearch =
        username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        email.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesRole = filterRole === 'all' || userRoles.includes(filterRole);

      return matchesSearch && matchesRole;
    });
  }, [users, searchTerm, filterRole]);

  // Reset to first page when filter/search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterRole]);

  // Paginate filtered users
  const paginatedUsers = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredUsers.slice(startIndex, startIndex + pageSize);
  }, [filteredUsers, currentPage, pageSize]);

  const totalPages = Math.ceil(filteredUsers.length / pageSize);

  // Modal handlers
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
        username: formData.username,
        email: formData.email,
        role: formData.roles[0] || 'User',
        roles: formData.roles,
        status: formData.status,
        avatar: formData.username.split(' ').map(n => n[0]).join('').toUpperCase(),
        lastLogin: 'Never'
      };
      setUsers([...users, newUser]);
    } else {
      setUsers(users.map(u =>
        u.id === selectedUser.id
          ? { ...u, ...formData, avatar: formData.username.split(' ').map(n => n[0]).join('').toUpperCase() }
          : u
      ));
    }
    handleCloseModal();
  };

  const handleDelete = (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      setUsers(users.filter(u => u.id !== userId));
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
            <Row className="mb-4">
              <Col>
                <h3 className="fw-bold mb-2">User Management</h3>
                <p className="text-muted mb-0">Manage user accounts and permissions</p>
              </Col>
            </Row>

            {/* Stats cards */}
            <UserStats users={users} />

            {/* Filters */}
            <UserFilters
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              filterRole={filterRole}
              setFilterRole={setFilterRole}
              onAddUser={() => handleOpenModal('add')}
            />

            {/* Table */}
            <UserTable
              users={paginatedUsers}
              currentPage={currentPage}
              totalPages={totalPages}
              pageSize={pageSize}
              setCurrentPage={setCurrentPage}
              setPageSize={setPageSize}
              onEdit={(user) => handleOpenModal('edit', user)}
              onDelete={handleDelete}
            />
          </Container>
        </main>
      </div>

      {/* Add/Edit modal */}
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

export default UserManagement;
