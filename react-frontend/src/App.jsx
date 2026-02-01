import React, { useState, useEffect } from 'react';
import {
  Container,
  Row,
  Table,
  Col,
  Card,
  Navbar,
  Nav,
  Form,
  InputGroup,
  Dropdown,
  Offcanvas
} from 'react-bootstrap';

const Dashboard = () => {
  const [showSidebar, setShowSidebar] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [searchExpanded, setSearchExpanded] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 992) {
        setShowSidebar(false);
      }
    };

    window.addEventListener('resize', handleResize);
    
    // Cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const navigation = [
    { name: 'Dashboard', icon: 'bi-grid', active: true },
    { name: 'Inventory', icon: 'bi-box', active: false },
    { name: 'Orders', icon: 'bi-basket', active: false },
    { name: 'Deliveries', icon: 'bi-truck', active: false },
    { name: 'Users', icon: 'bi-people', active: false },
    { name: 'Roles', icon: 'bi-shield-lock', active: false },
  ];

  const apps = [
    { name: 'Reports', icon: 'bi-file-earmark-bar-graph' },
    // { name: 'Kanban', icon: 'bi-kanban' },
    // { name: 'Chat', icon: 'bi-chat' },
    // { name: 'Email', icon: 'bi-envelope' },
    // { name: 'Notes', icon: 'bi-file-text' },
  ];

  const SidebarContent = ({ isCollapsed = false }) => (
    <div className="d-flex flex-column h-100 sidebar-modern">
      {/* Logo/Brand */}
      <div className={`p-4 d-flex align-items-center ${isCollapsed ? 'justify-content-center' : ''}`}>
        <div 
          className={`rounded ${isCollapsed ? '' : 'me-2'}`}
          style={{
            width: '32px',
            height: '32px',
            background: 'linear-gradient(135deg, #6080ff 0%, #0d6dfc 100%)'
          }}
        ></div>
        {!isCollapsed && <span className="fw-bold fs-5" style={{color: "#333"}}>Bright<span className="text-primary">Flow</span></span>}
      </div>

      {/* HOME Section */}
      <div className="px-3 mb-4">
        {!isCollapsed && (
          <small className="text-muted text-uppercase px-3 fw-semibold" style={{ fontSize: '0.7rem' }}>
            HOME
          </small>
        )}
        <Nav className="flex-column mt-2">
          {navigation.map((item, index) => (
            <Nav.Link
              key={index}
              href="#"
              className={`d-flex align-items-center px-3 py-2 mb-1 rounded ${
                item.active 
                  ? 'bg-primary text-white' 
                  : 'text-dark sidebar-link'
              } ${isCollapsed ? 'justify-content-center' : ''}`}
              onClick={() => setShowSidebar(false)}
              title={isCollapsed ? item.name : ''}
            >
              <i className={`${item.icon} ${isCollapsed ? '' : 'me-3'}`} style={{ fontSize: '1.1rem' }}></i>
              {!isCollapsed && <span>{item.name}</span>}
            </Nav.Link>
          ))}
        </Nav>
      </div>

      {/* APPS Section */}
      <div className="px-3">
        {!isCollapsed && (
          <small className="text-muted text-uppercase px-3 fw-semibold" style={{ fontSize: '0.7rem' }}>
            Others
          </small>
        )}
        <Nav className="flex-column mt-2">
          {apps.map((item, index) => (
            <Nav.Link
              key={index}
              href="#"
              className={`d-flex align-items-center px-3 py-2 mb-1 rounded text-dark sidebar-link ${isCollapsed ? 'justify-content-center' : ''}`}
              onClick={() => setShowSidebar(false)}
              title={isCollapsed ? item.name : ''}
            >
              <i className={`${item.icon} ${isCollapsed ? '' : 'me-3'}`} style={{ fontSize: '1.1rem' }}></i>
              {!isCollapsed && <span>{item.name}</span>}
            </Nav.Link>
          ))}
        </Nav>
      </div>

      {/* User Profile at Bottom */}
      {!isCollapsed && (
        <div className="mt-auto p-3">
          <div className="d-flex align-items-center p-3 bg-light rounded">
            <div
              className="rounded-circle d-flex align-items-center justify-content-center me-2"
              style={{
                width: '40px',
                height: '40px',
                background: 'linear-gradient(135deg, #6080ff 0%, #0d6dfc 100%)'
              }}
            >
              <i className="bi bi-person text-white"></i>
            </div>
            <div className="flex-fill">
              <div className="fw-semibold small">Fidel-Jr</div>
              <div className="text-muted" style={{ fontSize: '0.75rem' }}>Designer</div>
            </div>
            <i className="bi bi-power text-primary" style={{ cursor: 'pointer' }}></i>
          </div>
        </div>
      )}

      {/* Collapsed user avatar */}
      {isCollapsed && (
        <div className="mt-auto p-3 d-flex justify-content-center">
          <div
            className="rounded-circle d-flex align-items-center justify-content-center"
            style={{
              width: '40px',
              height: '40px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              cursor: 'pointer'
            }}
            title="Fidel-Jr"
          >
            <i className="bi bi-person text-white"></i>
          </div>
        </div>
      )}
    </div>
  );

  // Custom toggle component without caret
  const CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
    <div
      ref={ref}
      onClick={(e) => {
        e.preventDefault();
        onClick(e);
      }}
      style={{ cursor: 'pointer' }}
    >
      {children}
    </div>
  ));

  return (
    <div className="d-flex vh-100 overflow-hidden" style={{ backgroundColor: '#f8f9fa' }}>
      {/* Sidebar for Desktop */}
      <div 
        className="d-none d-lg-flex flex-column bg-white sidebar-transition" 
        style={{ 
          width: sidebarCollapsed ? '80px' : '260px', 
          minWidth: sidebarCollapsed ? '80px' : '260px', 
          borderRight: '1px solid #e9ecef',
          transition: 'all 0.3s ease'
        }}
      >
        <SidebarContent isCollapsed={sidebarCollapsed} />
      </div>

      {/* Offcanvas Sidebar for Mobile/Tablet */}
      <Offcanvas 
        show={showSidebar} 
        onHide={() => setShowSidebar(false)} 
        className="d-lg-none"
        placement="start"
      >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Menu</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body className="p-0">
          <SidebarContent isCollapsed={false} />
        </Offcanvas.Body>
      </Offcanvas>

      {/* Main Content */}
      <div className="flex-fill d-flex flex-column overflow-hidden">
        {/* Header */}
        <Navbar bg="white" className="px-4 py-3" style={{ borderBottom: '1px solid #e9ecef' }}>
          <div className="d-flex align-items-center w-100">
            {/* Hamburger Menu for Mobile */}
            <button
              className="btn btn-link d-lg-none p-0 me-3 text-dark border-0 shadow-none"
              onClick={() => setShowSidebar(true)}
              aria-label="Toggle menu"
            >
              <i className="bi bi-list" style={{ fontSize: '1.5rem' }}></i>
            </button>

            {/* Menu Icon for Desktop - Toggle Sidebar */}
            <button 
              className="btn btn-link d-none d-lg-block p-0 me-3 text-dark border-0 shadow-none"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              aria-label="Toggle sidebar"
            >
              <i className="bi bi-list" style={{ fontSize: '1.5rem' }}></i>
            </button>

            {/* Expandable Search Icon for Desktop
            <div className="d-none d-lg-flex align-items-center me-4">
              <div 
                className={`search-container ${searchExpanded ? 'expanded' : ''}`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  transition: 'all 0.3s ease',
                  width: searchExpanded ? '300px' : 'auto'
                }}
              >
                {!searchExpanded ? (
                  <button 
                    className="btn btn-link p-0 text-dark border-0 shadow-none"
                    onClick={() => setSearchExpanded(true)}
                  >
                    <i className="bi bi-search" style={{ fontSize: '1.2rem' }}></i>
                  </button>
                ) : (
                  <InputGroup>
                    <InputGroup.Text className="bg-light border-end-0">
                      <i className="bi bi-search"></i>
                    </InputGroup.Text>
                    <Form.Control
                      type="search"
                      placeholder="Search..."
                      className="border-start-0 bg-light"
                      autoFocus
                      onBlur={(e) => {
                        if (!e.target.value) {
                          setSearchExpanded(false);
                        }
                      }}
                    />
                  </InputGroup>
                )}
              </div>
            </div> */}

            {/* Top Navigation */}
            <div className="d-none d-md-flex me-auto">
              
            </div>

            {/* Right Side Icons */}
            <div className="d-flex align-items-center gap-4">
              {/* Dark Mode Toggle */}
              {/* <button className="btn btn-link p-0 text-dark border-0 shadow-none">
                <i className="bi bi-moon" style={{ fontSize: '1.2rem' }}></i>
              </button> */}

              {/* Language */}
              {/* <button className="btn btn-link p-0 text-dark border-0 shadow-none position-relative">
                <i className="bi bi-flag" style={{ fontSize: '1.2rem' }}></i>
              </button> */}

              {/* Shopping Cart */}
              {/* <button className="btn btn-link p-0 text-dark border-0 shadow-none position-relative">
                <i className="bi bi-cart" style={{ fontSize: '1.2rem' }}></i>
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style={{ fontSize: '0.6rem' }}>
                  2
                </span>
              </button> */}

                {/* Expandable Search Icon for Desktop */}
            <div className="d-none d-lg-flex align-items-center me-4">
              <div 
                className={`search-container ${searchExpanded ? 'expanded' : ''}`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  transition: 'all 0.3s ease',
                  width: searchExpanded ? '300px' : 'auto'
                }}
              >
                {!searchExpanded ? (
                  <button 
                    className="btn btn-link p-0 text-dark border-0 shadow-none"
                    onClick={() => setSearchExpanded(true)}
                  >
                    <i className="bi bi-search" style={{ fontSize: '1.2rem' }}></i>
                  </button>
                ) : (
                  <InputGroup>
                    <InputGroup.Text className="bg-light border-end-0">
                      <i className="bi bi-search"></i>
                    </InputGroup.Text>
                    <Form.Control
                      type="search"
                      placeholder="Search..."
                      className="border-start-0 bg-light"
                      autoFocus
                      onBlur={(e) => {
                        if (!e.target.value) {
                          setSearchExpanded(false);
                        }
                      }}
                    />
                  </InputGroup>
                )}
              </div>
            </div>

              {/* Notifications */}
              <button className="btn btn-link p-0 text-dark border-0 shadow-none position-relative">
                <i className="bi bi-bell" style={{ fontSize: '1.2rem' }}></i>
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-primary" style={{ fontSize: '0.6rem' }}>
                  3
                </span>
              </button>

              {/* User Avatar - Dropdown without arrow */}
              <Dropdown align="end">
                <Dropdown.Toggle as={CustomToggle} id="user-dropdown">
                  <div
                    className="rounded-circle d-flex align-items-center justify-content-center"
                    style={{
                      width: '40px',
                      height: '40px',
                      background: 'linear-gradient(135deg, #6080ff 0%, #0d6dfc 100%)'
                    }}
                  >
                    <i className="bi bi-person text-white"></i>
                  </div>
                </Dropdown.Toggle>
                <Dropdown.Menu className="shadow-sm">
                  <Dropdown.Item>
                    <i className="bi bi-person me-2"></i>Profile
                  </Dropdown.Item>
                  <Dropdown.Item>
                    <i className="bi bi-gear me-2"></i>Settings
                  </Dropdown.Item>
                  <Dropdown.Divider />
                  <Dropdown.Item className="text-danger">
                    <i className="bi bi-box-arrow-right me-2"></i>Logout
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>
          </div>
        </Navbar>

        {/* Dashboard Content Area */}
        <main className="flex-fill overflow-auto p-4">
          <Container fluid>
            {/* Welcome Header */}
            <div className="mb-4">
              <h3 className="fw-bold mb-1">Good morning, Fidel-Jr! 👋</h3>
              <p className="text-muted mb-0">Here's what's happening with your projects today.</p>
            </div>

            {/* Stats Cards Row */}
            <Row className="g-3 mb-4">
              <Col xs={12} sm={6} lg={3}>
                <Card className="border-0 shadow-sm h-100 stat-card-hover">
                  <Card.Body className="p-4">
                    <div className="d-flex justify-content-between align-items-start mb-3">
                      <div 
                        className="rounded-3 p-3 d-flex align-items-center justify-content-center"
                        style={{ 
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          width: '56px',
                          height: '56px'
                        }}
                      >
                        <i className="bi bi-currency-dollar text-white fs-4"></i>
                      </div>
                      <div className="text-end">
                        <span className="badge bg-success bg-opacity-10 text-success px-2 py-1">
                          <i className="bi bi-arrow-up me-1"></i>
                          +12.5%
                        </span>
                      </div>
                    </div>
                    <p className="text-muted small mb-1 text-uppercase fw-semibold">Total Revenue</p>
                    <h3 className="fw-bold mb-0">$127,500</h3>
                  </Card.Body>
                </Card>
              </Col>

              <Col xs={12} sm={6} lg={3}>
                <Card className="border-0 shadow-sm h-100 stat-card-hover">
                  <Card.Body className="p-4">
                    <div className="d-flex justify-content-between align-items-start mb-3">
                      <div 
                        className="rounded-3 p-3 d-flex align-items-center justify-content-center"
                        style={{ 
                          background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                          width: '56px',
                          height: '56px'
                        }}
                      >
                        <i className="bi bi-exclamation-triangle text-white fs-4"></i>
                      </div>
                      <div className="text-end">
                        <span className="badge bg-success bg-opacity-10 text-success px-2 py-1">
                          <i className="bi bi-arrow-up me-1"></i>
                          +8.2%
                        </span>
                      </div>
                    </div>
                    <p className="text-muted small mb-1 text-uppercase fw-semibold">Low Stock</p>
                    <h3 className="fw-bold mb-0">132</h3>
                  </Card.Body>
                </Card>
              </Col>

              <Col xs={12} sm={6} lg={3}>
                <Card className="border-0 shadow-sm h-100 stat-card-hover">
                  <Card.Body className="p-4">
                    <div className="d-flex justify-content-between align-items-start mb-3">
                      <div 
                        className="rounded-3 p-3 d-flex align-items-center justify-content-center"
                        style={{ 
                          background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                          width: '56px',
                          height: '56px'
                        }}
                      >
                        <i className="bi bi-cart text-white fs-4"></i>
                      </div>
                      <div className="text-end">
                        <span className="badge bg-danger bg-opacity-10 text-danger px-2 py-1">
                          <i className="bi bi-arrow-down me-1"></i>
                          -3.1%
                        </span>
                      </div>
                    </div>
                    <p className="text-muted small mb-1 text-uppercase fw-semibold">Total Orders</p>
                    <h3 className="fw-bold mb-0">1,248</h3>
                  </Card.Body>
                </Card>
              </Col>

              <Col xs={12} sm={6} lg={3}>
                <Card className="border-0 shadow-sm h-100 stat-card-hover">
                  <Card.Body className="p-4">
                    <div className="d-flex justify-content-between align-items-start mb-3">
                      <div 
                        className="rounded-3 p-3 d-flex align-items-center justify-content-center"
                        style={{ 
                          background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
                          width: '56px',
                          height: '56px'
                        }}
                      >
                        <i className="bi bi-truck text-white fs-4"></i>
                      </div>
                      <div className="text-end">
                        <span className="badge bg-success bg-opacity-10 text-success px-2 py-1">
                          <i className="bi bi-arrow-up me-1"></i>
                          +18.4%
                        </span>
                      </div>
                    </div>
                    <p className="text-muted small mb-1 text-uppercase fw-semibold">Deliveries Pending</p>
                    <h3 className="fw-bold mb-0">12</h3>
                  </Card.Body>
                </Card>
              </Col>
            </Row>

            {/* Charts Row */}
            <Row className="g-3 mb-4">
              <Col lg={8}>
                <Card className="border-0 shadow-sm h-100">
                  <Card.Body className="p-4">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                      <div>
                        <h5 className="fw-bold mb-1">Revenue Overview</h5>
                        <p className="text-muted small mb-0">Monthly earnings report</p>
                      </div>
                      <Dropdown>
                        <Dropdown.Toggle variant="outline-secondary" size="sm" className="border-0 bg-light">
                          Last 6 Months
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                          <Dropdown.Item>Last 3 Months</Dropdown.Item>
                          <Dropdown.Item>Last 6 Months</Dropdown.Item>
                          <Dropdown.Item>Last Year</Dropdown.Item>
                        </Dropdown.Menu>
                      </Dropdown>
                    </div>
                    <div 
                      className="bg-light rounded-3 d-flex align-items-center justify-content-center"
                      style={{ height: '300px' }}
                    >
                      <div className="text-center">
                        <i className="bi bi-bar-chart text-muted" style={{ fontSize: '3rem' }}></i>
                        <p className="text-muted mt-2 mb-0">Chart Placeholder</p>
                        <small className="text-muted">Use Chart.js or Recharts</small>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              </Col>

              <Col lg={4}>
                <Card className="border-0 shadow-sm h-100">
                  <Card.Body className="p-4">
                    <h5 className="fw-bold mb-4">Sales by Category</h5>
                    
                    <div className="mb-4">
                      <div className="d-flex justify-content-between mb-2">
                        <span className="text-muted small">Electronics</span>
                        <span className="fw-semibold">65%</span>
                      </div>
                      <div className="progress" style={{ height: '8px' }}>
                        <div 
                          className="progress-bar" 
                          style={{ 
                            width: '65%',
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                          }}
                        ></div>
                      </div>
                    </div>

                    <div className="mb-4">
                      <div className="d-flex justify-content-between mb-2">
                        <span className="text-muted small">Fashion</span>
                        <span className="fw-semibold">48%</span>
                      </div>
                      <div className="progress" style={{ height: '8px' }}>
                        <div 
                          className="progress-bar" 
                          style={{ 
                            width: '48%',
                            background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
                          }}
                        ></div>
                      </div>
                    </div>

                    <div className="mb-4">
                      <div className="d-flex justify-content-between mb-2">
                        <span className="text-muted small">Home & Garden</span>
                        <span className="fw-semibold">35%</span>
                      </div>
                      <div className="progress" style={{ height: '8px' }}>
                        <div 
                          className="progress-bar" 
                          style={{ 
                            width: '35%',
                            background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
                          }}
                        ></div>
                      </div>
                    </div>

                    <div className="mb-4">
                      <div className="d-flex justify-content-between mb-2">
                        <span className="text-muted small">Sports</span>
                        <span className="fw-semibold">28%</span>
                      </div>
                      <div className="progress" style={{ height: '8px' }}>
                        <div 
                          className="progress-bar" 
                          style={{ 
                            width: '28%',
                            background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)'
                          }}
                        ></div>
                      </div>
                    </div>

                    <div>
                      <div className="d-flex justify-content-between mb-2">
                        <span className="text-muted small">Others</span>
                        <span className="fw-semibold">15%</span>
                      </div>
                      <div className="progress" style={{ height: '8px' }}>
                        <div className="progress-bar bg-secondary" style={{ width: '15%' }}></div>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            </Row>

            {/* Recent Orders & Top Products Row */}
            <Row className="g-3 mb-4">
              <Col lg={8}>
                <Card className="border-0 shadow-sm">
                  <Card.Body className="p-4">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                      <h5 className="fw-bold mb-0">Recent Orders</h5>
                      <a href="#" className="text-decoration-none small">View All</a>
                    </div>
                    
                    <div className="table-responsive">
                      <Table hover className="align-middle mb-0">
                        <thead className="bg-light">
                          <tr>
                            <th className="border-0 text-muted small fw-semibold">ORDER ID</th>
                            <th className="border-0 text-muted small fw-semibold">CUSTOMER</th>
                            <th className="border-0 text-muted small fw-semibold">PRODUCT</th>
                            <th className="border-0 text-muted small fw-semibold">AMOUNT</th>
                            <th className="border-0 text-muted small fw-semibold">STATUS</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td className="fw-semibold">#ORD-2024-001</td>
                            <td>
                              <div className="d-flex align-items-center">
                                <div 
                                  className="rounded-circle bg-primary bg-opacity-10 text-primary d-flex align-items-center justify-content-center me-2"
                                  style={{ width: '32px', height: '32px', fontSize: '0.8rem' }}
                                >
                                  JD
                                </div>
                                <span>John Doe</span>
                              </div>
                            </td>
                            <td>Wireless Headphones</td>
                            <td className="fw-semibold">$299.00</td>
                            <td>
                              <span className="badge bg-success bg-opacity-10 text-success px-3 py-2">
                                Delivered
                              </span>
                            </td>
                          </tr>
                          <tr>
                            <td className="fw-semibold">#ORD-2024-002</td>
                            <td>
                              <div className="d-flex align-items-center">
                                <div 
                                  className="rounded-circle bg-danger bg-opacity-10 text-danger d-flex align-items-center justify-content-center me-2"
                                  style={{ width: '32px', height: '32px', fontSize: '0.8rem' }}
                                >
                                  SA
                                </div>
                                <span>Sarah Anderson</span>
                              </div>
                            </td>
                            <td>Smart Watch Pro</td>
                            <td className="fw-semibold">$450.00</td>
                            <td>
                              <span className="badge bg-warning bg-opacity-10 text-warning px-3 py-2">
                                Pending
                              </span>
                            </td>
                          </tr>
                          <tr>
                            <td className="fw-semibold">#ORD-2024-003</td>
                            <td>
                              <div className="d-flex align-items-center">
                                <div 
                                  className="rounded-circle bg-info bg-opacity-10 text-info d-flex align-items-center justify-content-center me-2"
                                  style={{ width: '32px', height: '32px', fontSize: '0.8rem' }}
                                >
                                  MJ
                                </div>
                                <span>Mike Johnson</span>
                              </div>
                            </td>
                            <td>Laptop Stand</td>
                            <td className="fw-semibold">$79.99</td>
                            <td>
                              <span className="badge bg-info bg-opacity-10 text-info px-3 py-2">
                                Processing
                              </span>
                            </td>
                          </tr>
                          <tr>
                            <td className="fw-semibold">#ORD-2024-004</td>
                            <td>
                              <div className="d-flex align-items-center">
                                <div 
                                  className="rounded-circle bg-success bg-opacity-10 text-success d-flex align-items-center justify-content-center me-2"
                                  style={{ width: '32px', height: '32px', fontSize: '0.8rem' }}
                                >
                                  EW
                                </div>
                                <span>Emily Wilson</span>
                              </div>
                            </td>
                            <td>Mechanical Keyboard</td>
                            <td className="fw-semibold">$159.00</td>
                            <td>
                              <span className="badge bg-success bg-opacity-10 text-success px-3 py-2">
                                Delivered
                              </span>
                            </td>
                          </tr>
                          <tr>
                            <td className="fw-semibold">#ORD-2024-005</td>
                            <td>
                              <div className="d-flex align-items-center">
                                <div 
                                  className="rounded-circle bg-warning bg-opacity-10 text-warning d-flex align-items-center justify-content-center me-2"
                                  style={{ width: '32px', height: '32px', fontSize: '0.8rem' }}
                                >
                                  DB
                                </div>
                                <span>David Brown</span>
                              </div>
                            </td>
                            <td>USB-C Hub</td>
                            <td className="fw-semibold">$49.99</td>
                            <td>
                              <span className="badge bg-info bg-opacity-10 text-info px-3 py-2">
                                Processing
                              </span>
                            </td>
                          </tr>
                        </tbody>
                      </Table>
                    </div>
                  </Card.Body>
                </Card>
              </Col>

              <Col lg={4}>
                <Card className="border-0 shadow-sm h-100">
                  <Card.Body className="p-4">
                    <h5 className="fw-bold mb-4">Top Products</h5>
                    
                    <div className="d-flex align-items-center mb-4 pb-3 border-bottom">
                      <div 
                        className="rounded-3 bg-primary bg-opacity-10 d-flex align-items-center justify-content-center me-3"
                        style={{ width: '50px', height: '50px' }}
                      >
                        <i className="bi bi-headphones text-primary fs-4"></i>
                      </div>
                      <div className="flex-fill">
                        <h6 className="mb-1 fw-semibold">Wireless Headphones</h6>
                        <small className="text-muted">1,245 sales</small>
                      </div>
                      <span className="fw-bold">$299</span>
                    </div>

                    <div className="d-flex align-items-center mb-4 pb-3 border-bottom">
                      <div 
                        className="rounded-3 bg-danger bg-opacity-10 d-flex align-items-center justify-content-center me-3"
                        style={{ width: '50px', height: '50px' }}
                      >
                        <i className="bi bi-smartwatch text-danger fs-4"></i>
                      </div>
                      <div className="flex-fill">
                        <h6 className="mb-1 fw-semibold">Smart Watch Pro</h6>
                        <small className="text-muted">987 sales</small>
                      </div>
                      <span className="fw-bold">$450</span>
                    </div>

                    <div className="d-flex align-items-center mb-4 pb-3 border-bottom">
                      <div 
                        className="rounded-3 bg-success bg-opacity-10 d-flex align-items-center justify-content-center me-3"
                        style={{ width: '50px', height: '50px' }}
                      >
                        <i className="bi bi-laptop text-success fs-4"></i>
                      </div>
                      <div className="flex-fill">
                        <h6 className="mb-1 fw-semibold">Laptop Stand</h6>
                        <small className="text-muted">856 sales</small>
                      </div>
                      <span className="fw-bold">$79</span>
                    </div>

                    <div className="d-flex align-items-center mb-4 pb-3 border-bottom">
                      <div 
                        className="rounded-3 bg-warning bg-opacity-10 d-flex align-items-center justify-content-center me-3"
                        style={{ width: '50px', height: '50px' }}
                      >
                        <i className="bi bi-keyboard text-warning fs-4"></i>
                      </div>
                      <div className="flex-fill">
                        <h6 className="mb-1 fw-semibold">Mechanical Keyboard</h6>
                        <small className="text-muted">654 sales</small>
                      </div>
                      <span className="fw-bold">$159</span>
                    </div>

                    <div className="d-flex align-items-center">
                      <div 
                        className="rounded-3 bg-info bg-opacity-10 d-flex align-items-center justify-content-center me-3"
                        style={{ width: '50px', height: '50px' }}
                      >
                        <i className="bi bi-usb-symbol text-info fs-4"></i>
                      </div>
                      <div className="flex-fill">
                        <h6 className="mb-1 fw-semibold">USB-C Hub</h6>
                        <small className="text-muted">543 sales</small>
                      </div>
                      <span className="fw-bold">$49</span>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            </Row>

            {/* Quick Stats Row */}
            <Row className="g-3">
              <Col md={6} lg={3}>
                <Card className="border-0 shadow-sm stat-card-hover">
                  <Card.Body className="p-4">
                    <div className="d-flex align-items-center">
                      <div 
                        className="rounded-circle me-3"
                        style={{ 
                          width: '48px', 
                          height: '48px',
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                        }}
                      ></div>
                      <div>
                        <p className="text-muted small mb-1">Avg. Order Value</p>
                        <h5 className="fw-bold mb-0">$186.50</h5>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              </Col>

              <Col md={6} lg={3}>
                <Card className="border-0 shadow-sm stat-card-hover">
                  <Card.Body className="p-4">
                    <div className="d-flex align-items-center">
                      <div 
                        className="rounded-circle me-3"
                        style={{ 
                          width: '48px', 
                          height: '48px',
                          background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
                        }}
                      ></div>
                      <div>
                        <p className="text-muted small mb-1">Total Customers</p>
                        <h5 className="fw-bold mb-0">12,458</h5>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              </Col>

              <Col md={6} lg={3}>
                <Card className="border-0 shadow-sm stat-card-hover">
                  <Card.Body className="p-4">
                    <div className="d-flex align-items-center">
                      <div 
                        className="rounded-circle me-3"
                        style={{ 
                          width: '48px', 
                          height: '48px',
                          background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
                        }}
                      ></div>
                      <div>
                        <p className="text-muted small mb-1">Active Sessions</p>
                        <h5 className="fw-bold mb-0">2,847</h5>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              </Col>

              <Col md={6} lg={3}>
                <Card className="border-0 shadow-sm stat-card-hover">
                  <Card.Body className="p-4">
                    <div className="d-flex align-items-center">
                      <div 
                        className="rounded-circle me-3"
                        style={{ 
                          width: '48px', 
                          height: '48px',
                          background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)'
                        }}
                      ></div>
                      <div>
                        <p className="text-muted small mb-1">Bounce Rate</p>
                        <h5 className="fw-bold mb-0">32.8%</h5>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Container>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;