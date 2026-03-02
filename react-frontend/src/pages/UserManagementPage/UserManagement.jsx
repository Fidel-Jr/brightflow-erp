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

  const [users, setUsers] = useState([]);

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const { user } = useAuth();

  const isAdmin = hasRole(user, "Admin");
  
  // ✅ Fetch users from API
  const fetchUsers = async () => {
    try {
      const response = await getUsers();
      setUsers(response.data);
    } catch (err) {
      console.error('Failed to fetch users', err);
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

  // ✅ Modal handlers
  const handleOpenModal = (mode, user = null) => {
    setModalMode(mode);
    setSelectedUser(user);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedUser(null);
  };

  // ✅ Removed handleSubmit - now handled inside UserModal

  const handleViewDetails = (user) => {
    setSelectedUser(user);
    setShowDetailsModal(true);
  };

  const handleDelete = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await deleteUser(userId);
        fetchUsers(); // Refresh list after delete
      } catch (error) {
        console.error('Error deleting user:', error);
        alert('Failed to delete user. Please try again.');
      }
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

            <UserStats users={users} />

            <UserFilters
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              filterRole={filterRole}
              setFilterRole={setFilterRole}
              onAddUser={isAdmin ? () => handleOpenModal('add') : false}
            />

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

      {/* ✅ Simplified props: onSuccess instead of onSubmit */}
      <UserModal
        show={showModal}
        mode={modalMode}
        user={selectedUser}
        onHide={handleCloseModal}
        onSuccess={fetchUsers} // Just refresh the list
      />

      <UserDetailsModal
        show={showDetailsModal}
        user={selectedUser}
        onHide={() => setShowDetailsModal(false)}
      />
    </div>
  );
};

export default UserManagement;