import React, { useState, useEffect } from 'react';
import { Modal, Form, Button, Row, Col } from 'react-bootstrap';
import { createUser } from '../../api/user-api';

const UserModal = ({ show, mode, user, onHide, onSubmit }) => {
  const roles = ['Admin', 'Manager', 'Warehouse Staff', 'Delivery Staff'];

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    roles: [],
    status: 'Active',
    password: ''
  });

  useEffect(() => {
    if (mode === 'edit' && user) {
      setFormData({
        username: user.username,
        email: user.email,
        roles: user.roles || [],
        status: user.status,
        password: ''
      });
    } else {
      setFormData({
        username: '',
        email: '',
        roles: [],
        status: 'Active',
        password: ''
      });
    }
  }, [mode, user, show]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Modal show={show} onHide={onHide} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title className="fw-bold">
          {mode === 'add' ? 'Add New User' : 'Edit User'}
        </Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body className="p-4">
          <Row className="g-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label className="fw-semibold">User Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter username"
                  value={formData.username}
                  onChange={(e) => setFormData({...formData, username: e.target.value})}
                  required
                />
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group>
                <Form.Label className="fw-semibold">Email Address</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Enter email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  required
                />
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group>
                <Form.Label className="fw-semibold">Roles</Form.Label>
                <div className="d-flex flex-wrap gap-2">
                  {roles.map((role) => {
                    const isSelected = formData.roles.includes(role);
                    return (
                      <Button
                        key={role}
                        variant={isSelected ? "primary" : "outline-secondary"}
                        size="sm"
                        onClick={() => {
                          const updatedRoles = isSelected
                            ? formData.roles.filter(r => r !== role)
                            : [...formData.roles, role];
                          setFormData({ ...formData, roles: updatedRoles });
                        }}
                      >
                        {role}
                      </Button>
                    );
                  })}
                </div>
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group>
                <Form.Label className="fw-semibold">Status</Form.Label>
                <Form.Select
                  value={formData.status}
                  onChange={(e) => setFormData({...formData, status: e.target.value})}
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </Form.Select>
              </Form.Group>
            </Col>

            <Col md={12}>
              <Form.Group>
                <Form.Label className="fw-semibold">
                  Password {mode === 'edit' && '(leave blank to keep current)'}
                </Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Enter password"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  required={mode === 'add'}
                />
              </Form.Group>
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onHide}>
            Cancel
          </Button>
          <Button variant="primary" type="submit">
            {mode === 'add' ? 'Add User' : 'Save Changes'}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default UserModal;