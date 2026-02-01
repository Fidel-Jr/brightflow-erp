import React from 'react';
import { Offcanvas } from 'react-bootstrap';
import SidebarContent from './SidebarContent';

const Sidebar = ({ showSidebar, setShowSidebar, sidebarCollapsed, setSidebarCollapsed }) => {
  return (
    <>
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
        <SidebarContent isCollapsed={sidebarCollapsed} setShowSidebar={setShowSidebar} />
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
          <SidebarContent isCollapsed={false} setShowSidebar={setShowSidebar} />
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
};

export default Sidebar;
