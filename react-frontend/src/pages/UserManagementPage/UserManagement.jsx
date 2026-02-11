// src/pages/users/UserManagement.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import Sidebar from '../../components/sidebar/Sidebar';
import TopNavbar from '../../components/navbar/TopNavbar';
import UserStats from '../../components/user/UserStats';
import UserFilters from '../../components/user/UserFilters';
import UserTable from '../../components/user/UserTable';
import UserModal from '../../components/user/UserModal';
import UserDetailsModal from '../../components/user/UserDetailsModal';
import { useAuth } from "../../context/AuthContext";
import { hasRole } from "../../helper/auth-roles";
import { getUsers, deleteUser } from '../../api/user-api';

const UserManagement = () => {
  const [showSidebar, setShowSidebar] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [selectedUser, setSelectedUser] = useState(null);

  const [users, setUsers] = useState([]); // fetched or mock users

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const { user } = useAuth();

  const isAdmin = hasRole(user, "Admin");
  const isManager = hasRole(user, "Manager");

  
    // Fetch users from API (or use mock)
    const handleViewDetails = (user) => {
      setSelectedUser(user);
      setShowDetailsModal(true);
    };


    const fetchUsers = async () => {
      try {
        const response = await getUsers(); // or your API call
        setUsers(response.data);
      } catch (err) {
        console.error('Failed to fetch users', err);
        // fallback mock data
        setUsers([
          
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

  const handleDelete = async (userId) => {

    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await deleteUser(userId); // API call to delete user
        console.log('User deleted successfully');
      } catch (error) {
        console.error('Error deleting user:', error);
        alert('Failed to delete user. Please try again.');
        return;
      }
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
              onAddUser={isAdmin ? () => handleOpenModal('add') : false}
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
              onViewDetails={handleViewDetails}
              canEdit={isAdmin}
              canDelete={isAdmin}
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
        onSuccess={fetchUsers}
      />

      {/* Details Modal */}
      <UserDetailsModal
        show={showDetailsModal}
        user={selectedUser}
        onHide={() => setShowDetailsModal(false)}
      />
    </div>
  );
};

export default UserManagement;
