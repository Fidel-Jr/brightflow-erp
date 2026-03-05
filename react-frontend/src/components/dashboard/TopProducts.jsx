import React, { useState, useEffect } from 'react';
import { Col, Card, Spinner, Alert } from 'react-bootstrap';
import { getDashboardSummary } from '../../api/report-api';

const TopProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Predefined icons and colors for products
  const productStyles = [
    { icon: 'bi-1-square-fill', color: 'primary' },
    { icon: 'bi-2-square-fill', color: 'danger' },
    { icon: 'bi-3-square-fill', color: 'success' },
    { icon: 'bi-4-square-fill', color: 'warning' },
    { icon: 'bi-5-square-fill', color: 'info' }
  ];

  // ---------------------------
  // Fetch Top Products
  // ---------------------------
  const fetchTopProducts = async () => {
    try {
      setLoading(true);
      const response = await getDashboardSummary();
      const payload = response?.data ?? response;

      // Check if topProducts exists and is an array
      if (!payload || !payload.topProducts) {
        console.error('Invalid response structure:', payload);
        setError('Invalid data received from server');
        setProducts([]);
        return;
      }

      if (!Array.isArray(payload.topProducts)) {
        console.error('topProducts is not an array:', payload.topProducts);
        setError('Invalid data format received from server');
        setProducts([]);
        return;
      }

      // Transform API data to component format
      const transformedProducts = payload.topProducts.map((item, index) => ({
        id: item?.productId,
        name: item?.productName || 'Unknown Product',
        sales: `${item?.totalQuantity || 0} sales`,
        price: `₱${(item?.totalRevenue || 0).toFixed(2)}`,
        quantity: item?.totalQuantity || 0,
        revenue: item?.totalRevenue || 0,
        icon: productStyles[index]?.icon || 'bi-box-seam',
        color: productStyles[index]?.color || 'secondary'
      }));

      setProducts(transformedProducts);
      setError(null);
    } catch (err) {
      console.error('Error fetching top products:', err);
      setError('Failed to load top products.');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTopProducts();
  }, []);

  return (
    <Col lg={4}>
      <Card className="border-0 shadow-sm h-100">
        <Card.Body className="p-4">
          <h5 className="fw-bold mb-4">Top Products</h5>
          
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
          ) : products.length === 0 ? (
            <Alert variant="info" className="mb-0 small">
              No product data available.
            </Alert>
          ) : (
            products.map((product, index) => (
              <div 
                className={`d-flex align-items-center ${index < products.length - 1 ? 'mb-4 pb-3 border-bottom' : ''}`}
                key={product.id || index}
              >
                <div 
                  className={`rounded-3 bg-${product.color} bg-opacity-10 d-flex align-items-center justify-content-center me-3`}
                  style={{ width: '50px', height: '50px' }}
                >
                  <i className={`${product.icon} text-${product.color} fs-4`}></i>
                </div>
                <div className="flex-fill">
                  <h6 className="mb-1 fw-semibold">{product.name}</h6>
                  <small className="text-muted">{product.sales}</small>
                </div>
                <span className="fw-bold">{product.price}</span>
              </div>
            ))
          )}
        </Card.Body>
      </Card>
    </Col>
  );
};

export default TopProducts;