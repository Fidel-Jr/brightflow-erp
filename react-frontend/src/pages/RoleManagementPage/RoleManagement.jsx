import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import Sidebar from '../../components/sidebar/Sidebar';
import TopNavbar from '../../components/navbar/TopNavbar';
import RoleStats from '../../components/role/RoleStats';
import RoleGrid from '../../components/role/RoleGrid';
import RoleModal from '../../components/role/RoleModal';
import { getRoles } from '../../api/role-api';

const RoleManagementPage = () => {
  const [showSidebar, setShowSidebar] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [selectedRole, setSelectedRole] = useState(null);

  

  const [roles, setRoles] = useState([
    {
      id: 1,
      name: 'Admin',
      description: 'Full system access with all permissions',
      userCount: 2,
      color: 'danger',
      permissions: {
        users: ['create', 'read', 'update', 'delete'],
        roles: ['create', 'read', 'update', 'delete'],
        content: ['create', 'read', 'update', 'delete'],
        settings: ['read', 'update'],
        reports: ['read', 'export']
      },
      createdAt: '2024-01-01'
    },
    {
      id: 2,
      name: 'Manager',
      description: 'Can manage content and view reports',
      userCount: 5,
      color: 'primary',
      permissions: {
        users: ['read'],
        roles: [],
        content: ['create', 'read', 'update', 'delete'],
        settings: ['read'],
        reports: ['read']
      },
      createdAt: '2024-01-01'
    },
    {
      id: 3,
      name: 'Warehouse Staff',
      description: 'Read-only access to content',
      userCount: 8,
      color: 'info',
      permissions: {
        users: [],
        roles: [],
        content: ['read'],
        settings: [],
        reports: ['read']
      },
      createdAt: '2024-01-01'
    },
    {
      id: 4,
      name: 'Delivery Staff',
      description: 'Can manage users and content',
      userCount: 3,
      color: 'warning',
      permissions: {
        users: ['create', 'read', 'update'],
        roles: ['read'],
        content: ['create', 'read', 'update', 'delete'],
        settings: ['read'],
        reports: ['read', 'export']
      },
      createdAt: '2024-01-15'
    }
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

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await getRoles();
        console.log('Fetched roles:', response.data);

        // Map the API roles to full role objects
        const rolesData = (Array.isArray(response.data) ? response.data : response.data?.roles || [])
          .map((r, index) => ({
            id: index + 1, // fallback id
            name: r.name || `Role ${index + 1}`, // backend only provides name
            description: roleDescriptions[r] || 'No description available',
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

    fetchRoles();
  }, []);

    
    console.log('Current roles state:', roles);
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
    setModalMode(mode);
    setSelectedRole(role);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedRole(null);
  };

  const handleSubmit = (formData) => {
    if (modalMode === 'add') {
      const newRole = {
        id: roles.length + 1,
        name: formData.name,
        description: formData.description,
        color: formData.color,
        userCount: 0,
        permissions: formData.permissions,
        createdAt: new Date().toISOString().split('T')[0]
      };
      setRoles([...roles, newRole]);
    } else {
      setRoles(roles.map(role => 
        role.id === selectedRole.id 
          ? { ...role, ...formData }
          : role
      ));
    }
    handleCloseModal();
  };

  const handleDelete = (roleId) => {
    if (window.confirm('Are you sure you want to delete this role?')) {
      setRoles(roles.filter(role => role.id !== roleId));
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
                <Button 
                  variant="primary"
                  onClick={() => handleOpenModal('add')}
                >
                  <i className="bi bi-plus-circle me-2"></i>
                  Create New Role
                </Button>
              </Col>
            </Row>

            {/* Roles Grid */}
            <RoleGrid 
              roles={roles}
              onEdit={(role) => handleOpenModal('edit', role)}
              onDelete={handleDelete}
              onDuplicate={handleDuplicate}
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