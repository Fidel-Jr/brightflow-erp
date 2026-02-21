import React from 'react';
import { Row, Col, Card, Button, Form, InputGroup, Dropdown, ButtonGroup } from 'react-bootstrap';

const OrdersFilters = ({ 
  searchTerm, 
  setSearchTerm, 
  filterStatus,
  setFilterStatus,
  filterDate,
  setFilterDate,
  onAddOrder 
}) => {
  const statuses = ['Pending', 'Processing', 'Shipped', 'Delivered'];

  return (
    <Card className="border-0 shadow-sm mb-4">
      <Card.Body className="p-4">
        <Row className="g-3">
          {/* Search */}
          <Col md={4}>
            <InputGroup>
              <InputGroup.Text className="bg-light border-end-0">
                <i className="bi bi-search"></i>
              </InputGroup.Text>
              <Form.Control
                type="search"
                placeholder="Search by order #, customer..."
                className="border-start-0 bg-light"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </InputGroup>
          </Col>

          {/* Status Filter */}
          <Col md={2}>
            <Form.Select 
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">All Status</option>
              {statuses.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </Form.Select>
          </Col>

          {/* Date Filter */}
          <Col md={2}>
            <Form.Select 
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
            </Form.Select>
          </Col>

          {/* Actions */}
          <Col md={4} className="text-md-end">
            {/* <ButtonGroup className="me-2">
              <Button variant="outline-secondary">
                <i className="bi bi-download me-2"></i>
                Export
              </Button>
              <Dropdown as={ButtonGroup}>
                <Dropdown.Toggle variant="outline-secondary" split>
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item>
                    <i className="bi bi-file-earmark-excel me-2"></i>
                    Export as CSV
                  </Dropdown.Item>
                  <Dropdown.Item>
                    <i className="bi bi-file-earmark-pdf me-2"></i>
                    Export as PDF
                  </Dropdown.Item>
                  <Dropdown.Item>
                    <i className="bi bi-printer me-2"></i>
                    Print Labels
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </ButtonGroup> */}
            
            <Button 
              variant="primary" 
              onClick={onAddOrder}
            >
              <i className="bi bi-plus-circle me-2"></i>
              New Order
            </Button>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
};

export default OrdersFilters;