import React from 'react';
import { Row, Col, Card, Button, Form, InputGroup, Dropdown, ButtonGroup } from 'react-bootstrap';

const DeliveryFilters = ({ 
  searchTerm, 
  setSearchTerm, 
  filterStatus,
  setFilterStatus,
  filterDriver,
  setFilterDriver,
  drivers
}) => {
  const statuses = ['Pending', 'Assigned', 'In Transit', 'Delivered', 'Failed'];

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
                placeholder="Search delivery #, order #, customer..."
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

          {/* Driver Filter */}
          <Col md={3}>
            <Form.Select 
              value={filterDriver}
              onChange={(e) => setFilterDriver(e.target.value)}
            >
              <option value="all">All Drivers</option>
              <option value="unassigned">Unassigned</option>
              {drivers.map(driver => (
                <option key={driver.id} value={driver.id}>{driver.name}</option>
              ))}
            </Form.Select>
          </Col>

          {/* Actions */}
          <Col md={3} className="text-md-end">
            {/* <ButtonGroup>
              <Button variant="outline-secondary">
                <i className="bi bi-calendar me-2"></i>
                Schedule
              </Button>
              <Dropdown as={ButtonGroup}>
                <Dropdown.Toggle variant="outline-secondary" split>
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item>
                    <i className="bi bi-file-earmark-excel me-2"></i>
                    Export Routes
                  </Dropdown.Item>
                  <Dropdown.Item>
                    <i className="bi bi-printer me-2"></i>
                    Print Manifests
                  </Dropdown.Item>
                  <Dropdown.Item>
                    <i className="bi bi-map me-2"></i>
                    View Map
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </ButtonGroup> */}
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
};

export default DeliveryFilters;