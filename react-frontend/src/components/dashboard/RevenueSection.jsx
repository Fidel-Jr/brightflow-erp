import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Dropdown, Spinner, Alert } from 'react-bootstrap';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from 'recharts';
import { getMonthlyRevenue, getDashboardSummary } from '../../api/report-api';

const RevenueSection = () => {
  // ---------------------------
  // State
  // ---------------------------
  const [revenueData, setRevenueData] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [months, setMonths] = useState(6); // default last 6 months
  const [dropdownLabel, setDropdownLabel] = useState('Last 6 Months');

  // Predefined gradients for categories
  const categoryGradients = [
    'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)'
  ];

  // ---------------------------
  // Fetch Revenue Data
  // ---------------------------
  const fetchRevenue = async () => {
    try {
      const res = await getMonthlyRevenue(months);

      const formattedData = res.data.map(item => ({
        month: item.label,   // e.g., '3/2026'
        revenue: item.value
      }));

      setRevenueData(formattedData);
    } catch (err) {
      console.error('Failed to fetch revenue:', err);
    }
  };

  // ---------------------------
  // Fetch Sales by Category
  // ---------------------------
  const fetchSalesCategory = async () => {
    try {
      setLoading(true);
      const response = await getDashboardSummary();
      const payload = response?.data ?? response;

      console.log('Dashboard Summary Response:', payload);

      // Check if salesByCategory exists and is an array
      if (!payload || !payload.salesByCategory) {
        console.error('Invalid response structure:', payload);
        setError('Invalid data received from server');
        setCategories([]);
        return;
      }

      if (!Array.isArray(payload.salesByCategory)) {
        console.error('salesByCategory is not an array:', payload.salesByCategory);
        setError('Invalid data format received from server');
        setCategories([]);
        return;
      }

      // Calculate total sales to compute percentages
      const totalSales = payload.salesByCategory.reduce(
        (sum, item) => sum + Number(item?.totalSales ?? 0),
        0
      );

      // Transform API data to component format
      const transformedCategories = payload.salesByCategory.map((item, index) => {
        // Backend now returns categoryName directly (from the updated GroupBy)
        const categoryName = item?.categoryName || 'Unknown';
        const categoryId = item?.categoryId;
        const categoryTotalSales = Number(item?.totalSales ?? 0);
        
        const percentage = totalSales > 0 
          ? Math.round((categoryTotalSales / totalSales) * 100) 
          : 0;

        return {
          id: categoryId || index + 1,
          name: categoryName,
          percentage: percentage,
          totalSales: categoryTotalSales,
          gradient: categoryGradients[index] || ''
        };
      });

      setCategories(transformedCategories);
      setError(null);
    } catch (err) {
      console.error('Error fetching sales by category:', err);
      setError('Failed to load sales by category.');
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  // ---------------------------
  // Effects
  // ---------------------------
  useEffect(() => {
    fetchRevenue();
  }, [months]);

  useEffect(() => {
    fetchSalesCategory();
  }, []);

  // ---------------------------
  // Handle Dropdown Selection
  // ---------------------------
  const handleMonthSelect = (value, label) => {
    setMonths(value);
    setDropdownLabel(label);
  };

  // ---------------------------
  // Render
  // ---------------------------
  return (
    <Row className="g-3 mb-4">
      {/* Revenue Overview */}
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
                  {dropdownLabel}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item onClick={() => handleMonthSelect(3, 'Last 3 Months')}>Last 3 Months</Dropdown.Item>
                  <Dropdown.Item onClick={() => handleMonthSelect(6, 'Last 6 Months')}>Last 6 Months</Dropdown.Item>
                  <Dropdown.Item onClick={() => handleMonthSelect(12, 'Last Year')}>Last Year</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>

            {/* Recharts Line Chart */}
            <div style={{ width: '100%', height: 300 }}>
              <ResponsiveContainer>
                <LineChart data={revenueData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
                  <Line type="monotone" dataKey="revenue" stroke="#667eea" strokeWidth={3} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card.Body>
        </Card>
      </Col>

      {/* Sales by Category */}
      <Col lg={4}>
        <Card className="border-0 shadow-sm h-100">
          <Card.Body className="p-4">
            <h5 className="fw-bold mb-4">Sales by Category</h5>
            
            {loading ? (
              <div className="text-center py-5">
                <Spinner animation="border" role="status" variant="primary" size="sm">
                  <span className="visually-hidden">Loading...</span>
                </Spinner>
              </div>
            ) : error ? (
              <Alert variant="danger" className="mb-0 small">
                {error}
              </Alert>
            ) : categories.length === 0 ? (
              <Alert variant="info" className="mb-0 small">
                No sales data available.
              </Alert>
            ) : (
              categories.map((category, index) => (
                <div className={index < categories.length - 1 ? 'mb-4' : ''} key={category.id}>
                  <div className="d-flex justify-content-between mb-2">
                    <span className="text-muted small">{category.name}</span>
                    <span className="fw-semibold">{category.percentage}%</span>
                  </div>
                  <div className="progress" style={{ height: '8px' }}>
                    <div 
                      className={`progress-bar ${!category.gradient ? 'bg-secondary' : ''}`}
                      style={{ 
                        width: `${category.percentage}%`,
                        background: category.gradient || undefined
                      }}
                      role="progressbar"
                      aria-valuenow={category.percentage}
                      aria-valuemin="0"
                      aria-valuemax="100"
                    ></div>
                  </div>
                  <div className="text-muted" style={{ fontSize: '0.7rem', marginTop: '2px' }}>
                    ${category.totalSales.toLocaleString()}
                  </div>
                </div>
              ))
            )}
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
};

export default RevenueSection;