import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import Sidebar from '../../components/sidebar/Sidebar';
import TopNavbar from '../../components/navbar/TopNavbar';
import RoleStats from '../../components/role/RoleStats';
import RoleGrid from '../../components/role/RoleGrid';
import RoleModal from '../../components/role/RoleModal';
import { getRoles, deleteRole } from '../../api/role-api';
import { useAuth } from '../../context/AuthContext';
import { hasRole } from '../../helper/auth-roles';

const RoleManagementPage = () => {
  const [showSidebar, setShowSidebar] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [selectedRole, setSelectedRole] = useState(null);

  const { user } = useAuth();
  const isAdmin = hasRole(user, 'Admin');

  

  const [roles, setRoles] = useState([
    
  ]);

  const permissionModules = [
    {
      name: 'users',
      label: 'User Management',
      icon: 'bi-people',
      actions: ['create', 'read', 'update', 'delete']
    },
    {
      name: 'roles',
      label: 'Role Management',
      icon: 'bi-shield-check',
      actions: ['create', 'read', 'update', 'delete']
    },
    {
      name: 'content',
      label: 'Content Management',
      icon: 'bi-file-text',
      actions: ['create', 'read', 'update', 'delete']
    },
    {
      name: 'settings',
      label: 'System Settings',
      icon: 'bi-gear',
      actions: ['read', 'update']
    },
    {
      name: 'reports',
      label: 'Reports & Analytics',
      icon: 'bi-graph-up',
      actions: ['read', 'export']
    }
  ];

  const roleDescriptions = {
    'Admin': 'Full system access with all permissions',
    'Manager': 'Can manage content and view reports',
    'Warehouse Staff': 'Read-only access to content',
    'Delivery Staff': 'Can manage users and content'
  };

  const rolePermissions = {
    'Admin': {
      users: ['create', 'read', 'update', 'delete'],
      roles: ['create', 'read', 'update', 'delete'],
      content: ['create', 'read', 'update', 'delete'],
      settings: ['read', 'update'],
      reports: ['read', 'export']
    },
    'Manager': {
      users: ['read'],
      roles: [],
      content: ['create', 'read', 'update', 'delete'],
      settings: ['read'],
      reports: ['read']
    },
    'Warehouse Staff': {
      users: [],
      roles: [],
      content: ['read'],
      settings: [],
      reports: ['read']
    },
    'Delivery Staff': {
      users: ['create', 'read', 'update'],
      roles: ['read'],
      content: ['create', 'read', 'update', 'delete'],
      settings: ['read'],
      reports: ['read', 'export']
    }
  };


  const defaultPermissions = {};
    permissionModules.forEach(mod => {
      defaultPermissions[mod.name] = []; // start with empty actions
  });

  const fetchRoles = async () => {
      try {
        const response = await getRoles();
        // Map the API roles to full role objects
        const rolesData = (Array.isArray(response.data) ? response.data : response.data?.roles || [])
          .map((r, index) => ({
            id: r.id, // fallback id
            name: r.name || `Role ${index + 1}`, // backend only provides name
            description: r.description || 'No description available',
            color: r.color || 'primary',
            userCount: r.userCount || 0,
            permissions: rolePermissions[r.name] || {}, 
            createdAt: r.createdAt || new Date().toISOString().split('T')[0]
          }));

        setRoles(rolesData);
      } catch (err) {
        console.error('Failed to fetch roles', err);
        setRoles([]); // fallback to empty array
      }
    };
  useEffect(() => {
    

    fetchRoles();
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

  const handleOpenModal = (mode, role = null) => {
    if (!isAdmin) return;
    setModalMode(mode);
    setSelectedRole(role);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedRole(null);
  };

  const handleSubmit = (formData) => {
    
    handleCloseModal();
    fetchRoles(); // Refresh roles after add/edit
  };

  const handleDelete = async (roleId) => {
    if (window.confirm('Are you sure you want to delete this role?')) {
      try {
        await deleteRole(roleId); // API call to delete role
      } catch (error) {
        console.error('Error deleting role:', error);
        alert('Failed to delete role. Please try again.');
        return;
      }
      setRoles(roles.filter(r => r.id !== roleId));
    }
  };

  const handleDuplicate = (role) => {
    const duplicatedRole = {
      ...role,
      id: roles.length + 1,
      name: `${role.name} (Copy)`,
      userCount: 0,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setRoles([...roles, duplicatedRole]);
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
                <h3 className="fw-bold mb-2">Role Management</h3>
                <p className="text-muted mb-0">Define roles and manage permissions</p>
              </Col>
            </Row>

            {/* Stats Cards */}
            <RoleStats roles={roles} permissionModules={permissionModules} />

            {/* Action Bar */}
            <Row className="mb-4">
              <Col>
                {isAdmin && (
                  <Button 
                    variant="primary"
                    onClick={() => handleOpenModal('add')}
                  >
                    <i className="bi bi-plus-circle me-2"></i>
                    Create New Role
                  </Button>
                )}
              </Col>
            </Row>

            {/* Roles Grid */}
            <RoleGrid 
              roles={roles}
              onEdit={isAdmin ? (role) => handleOpenModal('edit', role) : undefined}
              onDelete={isAdmin ? handleDelete : undefined}
              onDuplicate={isAdmin ? handleDuplicate : undefined}
              canManage={isAdmin}
            />
          </Container>
        </main>
      </div>

      {/* Add/Edit Role Modal */}
      <RoleModal
        show={showModal}
        mode={modalMode}
        role={selectedRole}
        permissionModules={permissionModules}
        onHide={handleCloseModal}
        onSubmit={handleSubmit}
      />
    </div>
  );
};

export default RoleManagementPage;