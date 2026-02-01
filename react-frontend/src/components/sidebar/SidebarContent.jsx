    import React from 'react';
    import { Nav } from 'react-bootstrap';

    const SidebarContent = ({ isCollapsed = false, setShowSidebar }) => {
    const navigation = [
        { name: 'Dashboard', icon: 'bi-grid', active: true },
        { name: 'Inventory', icon: 'bi-box', active: false },
        { name: 'Orders', icon: 'bi-basket', active: false },
        { name: 'Deliveries', icon: 'bi-truck', active: false },
        { name: 'Users', icon: 'bi-people', active: false },
        { name: 'Roles', icon: 'bi-shield-lock', active: false },
    ];

    const apps = [
        { name: 'Reports', icon: 'bi-file-earmark-bar-graph' }
    ];

    return (
        <div className="d-flex flex-column h-100 sidebar-modern">
        {/* Logo/Brand */}
        <div className={`p-4 d-flex align-items-center ${isCollapsed ? 'justify-content-center' : ''}`}>
            <div
            className={`${isCollapsed ? '' : 'me-2'}`}
            style={{ width: '32px', height: '32px' }}
            >
            <svg
                width="32"
                height="32"
                viewBox="0 0 50 50"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <circle cx="25" cy="25" r="25" fill="#3B82F6" />
                <path
                d="M15 20C15 20 20 15 25 20C30 25 35 20 35 20V30C35 30 30 35 25 30C20 25 15 30 15 30V20Z"
                fill="white"
                />
            </svg>
            </div>

            {!isCollapsed && (
            <span className="fw-bold fs-5" style={{ color: "#333" }}>
                Bright<span className="text-primary">Flow</span>
            </span>
            )}
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
                onClick={() => setShowSidebar && setShowSidebar(false)}
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
                onClick={() => setShowSidebar && setShowSidebar(false)}
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
    };

    export default SidebarContent;