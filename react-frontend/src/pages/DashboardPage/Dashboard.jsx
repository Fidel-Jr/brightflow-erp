import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/sidebar/Sidebar';
import TopNavbar from '../../components/navbar/TopNavbar';
import DashboardContent from '../../components/dashboard/DashboardContent';
import { useAuth } from '../../context/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const [showSidebar, setShowSidebar] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 992) {
        setShowSidebar(false);
      }
    };

    window.addEventListener('resize', handleResize);
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // useEffect(() => {
  //   if (!isLoggedIn) {
  //     navigate('/');
  //   }
  // }, [isLoggedIn]);

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
        
        <DashboardContent />
      </div>
    </div>
  );
}

export default Dashboard;