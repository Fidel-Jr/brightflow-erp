import React, { useState, useEffect } from 'react';
import { Modal, Form, Button, Row, Col } from 'react-bootstrap';

const UserModal = ({ show, mode, user, onHide, onSubmit }) => {
  const roles = ['Admin', 'Manager', 'Warehouse Staff', 'Delivery Staff'];

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: '',
    status: 'Active',
    password: ''
  });

  useEffect(() => {
    if (mode === 'edit' && user) {
      setFormData({
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
        password: ''
      });
    } else {
      setFormData({
        name: '',
        email: '',
        role: '',
        status: 'Active',
        password: ''
      });
    }
  }, [mode, user, show]);

  const handleSubmit = (e) => {
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
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
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
                <Form.Label className="fw-semibold">Role</Form.Label>
                <Form.Select
                  value={formData.role}
                  onChange={(e) => setFormData({...formData, role: e.target.value})}
                  required
                >
                  <option value="">Select role</option>
                  {roles.map(role => (
                    <option key={role} value={role}>{role}</option>
                  ))}
                </Form.Select>
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