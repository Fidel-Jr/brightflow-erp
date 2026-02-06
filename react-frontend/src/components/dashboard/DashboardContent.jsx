import React from 'react';
import { Container, Row } from 'react-bootstrap';
import StatCards from './StatCards';
import RevenueSection from './RevenueSection';
import RecentOrders from './RecentOrders';
import TopProducts from './TopProducts';
import QuickStats from './QuickStats';
import { useAuth } from '../../context/AuthContext.jsx';

const DashboardContent = () => {
  const { user } = useAuth();
  return (
    <main className="flex-fill overflow-auto p-4">
      <Container fluid>
        {/* Welcome Header */}
        <div className="mb-4">
          <h3 className="fw-bold mb-1">Good morning, {user.username} 👋</h3>
          <p className="text-muted mb-0">Here's what's happening with your projects today.</p>
        </div>

        {/* Stats Cards Row */}
        <StatCards />

        {/* Charts Row */}
        <RevenueSection />

        {/* Recent Orders & Top Products Row */}
        <Row className="g-3 mb-4">
          <RecentOrders />
          <TopProducts />
        </Row>

        {/* Quick Stats Row */}
        <QuickStats />
      </Container>
    </main>
  );
};

export default DashboardContent;