import React, { useState } from 'react';
import { Navbar, Form, InputGroup, Dropdown } from 'react-bootstrap';
import { useAuth } from '../../context/AuthContext.jsx';

const TopNavbar = ({ setShowSidebar, sidebarCollapsed, setSidebarCollapsed }) => {
  const [searchExpanded, setSearchExpanded] = useState(false);
  const { logout } = useAuth();

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

  const handleLogout = () => {
    logout();
  }

  return (
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

        {/* Top Navigation */}
        <div className="d-none d-md-flex me-auto">
          {/* Add additional navigation items here if needed */}
        </div>

        {/* Right Side Icons */}
        <div className="d-flex align-items-center gap-4">
          {/* Expandable Search Icon for Desktop */}
          {/* <div className="d-none d-lg-flex align-items-center me-4">
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
              <Dropdown.Item 
                className="text-danger d-flex align-items-center" 
                onClick={handleLogout}>
                <i className="bi bi-box-arrow-right me-2"></i>
                Logout
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </div>
    </Navbar>
  );
};

export default TopNavbar;