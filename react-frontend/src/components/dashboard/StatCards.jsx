import React, { useEffect, useState } from 'react';
import { Row, Col, Card } from 'react-bootstrap';
import { getDashboardSummary } from '../../api/report-api';

const StatCards = () => {

  const [stats, setStats] = useState([]);

  const fetchStats = async () => {
    try {
      const res = await getDashboardSummary();
      const data = res.data;

      const formattedStats = [
        {
          title: 'Total Revenue',
          value: `₱${data.totalRevenue.toLocaleString()}`,
          icon: 'bi-currency-dollar',
          gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          trend: data.revenueChange >= 0 ? 'up' : 'down',
          trendValue: `${data.revenueChange >= 0 ? '+' : ''}${data.revenueChange}%`
        },
        {
          title: 'Low Stock',
          value: data.totalLowStock,
          icon: 'bi-exclamation-triangle',
          gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
          trend: 'up', // optional: if you didn’t compute change
          trendValue: ''
        },
        {
          title: 'Total Orders',
          value: data.totalOrders,
          icon: 'bi-cart',
          gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
          trend: data.ordersChange >= 0 ? 'up' : 'down',
          trendValue: `${data.ordersChange >= 0 ? '+' : ''}${data.ordersChange}%`
        },
        {
          title: 'Deliveries Pending',
          value: data.totalPendingDeliveries,
          icon: 'bi-truck',
          gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
          trend: 'up', // optional if no trend calculation
          trendValue: ''
        }
      ];

      setStats(formattedStats);

    } catch (err) {
      console.error('Failed to fetch stats', err);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <Row className="g-3 mb-4">
      {stats.map((stat, index) => (
        <Col xs={12} sm={6} lg={3} key={index}>
          <Card className="border-0 shadow-sm h-100 stat-card-hover">
            <Card.Body className="p-4">
              <div className="d-flex justify-content-between align-items-start mb-3">
                <div 
                  className="rounded-3 p-3 d-flex align-items-center justify-content-center"
                  style={{ 
                    background: stat.gradient,
                    width: '56px',
                    height: '56px'
                  }}
                >
                  <i className={`${stat.icon} text-white fs-4`}></i>
                </div>

                {stat.trendValue && (
                  <div className="text-end">
                    <span className={`badge bg-${stat.trend === 'up' ? 'success' : 'danger'} bg-opacity-10 text-${stat.trend === 'up' ? 'success' : 'danger'} px-2 py-1`}>
                      <i className={`bi bi-arrow-${stat.trend} me-1`}></i>
                      {stat.trendValue}
                    </span>
                  </div>
                )}
              </div>

              <p className="text-muted small mb-1 text-uppercase fw-semibold">
                {stat.title}
              </p>
              <h3 className="fw-bold mb-0">{stat.value}</h3>
            </Card.Body>
          </Card>
        </Col>
      ))}
    </Row>
  );
};

export default StatCards;