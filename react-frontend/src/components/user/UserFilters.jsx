import React from 'react';
import { Row, Col, Card, Button, Form, InputGroup } from 'react-bootstrap';

const UserFilters = ({ 
  searchTerm, 
  setSearchTerm, 
  filterRole, 
  setFilterRole, 
  onAddUser 
}) => {
  const roles = ['Admin', 'Manager', 'Warehouse Staff', 'Delivery Staff'];

  return (
    <Card className="border-0 shadow-sm mb-4">
      <Card.Body className="p-4">
        <Row className="g-3 align-items-center">
          <Col md={4}>
            <InputGroup>
              <InputGroup.Text className="bg-light border-end-0">
                <i className="bi bi-search"></i>
              </InputGroup.Text>
              <Form.Control
                type="search"
                placeholder="Search users..."
                className="border-start-0 bg-light"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </InputGroup>
          </Col>

          <Col md={3}>
            <Form.Select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
            >
              <option value="all">All Roles</option>
              {roles.map(role => (
                <option key={role} value={role}>{role}</option>
              ))}
            </Form.Select>
          </Col>

          <Col md={5} className="text-md-end">
            <Button 
              variant="primary" 
              onClick={onAddUser}
              className="me-2"
            >
              <i className="bi bi-plus-circle me-2"></i>
              Add New User
            </Button>
            <Button variant="outline-secondary">
              <i className="bi bi-download me-2"></i>
              Export
            </Button>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
};

export default UserFilters;