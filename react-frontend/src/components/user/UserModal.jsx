import React, { useState, useEffect } from 'react';
import { Modal, Form, Button, Row, Col, Spinner } from 'react-bootstrap';
import { createUser, updateUser } from '../../api/user-api';

const UserModal = ({ show, mode, user, onHide, onSuccess }) => {
  const roles = ['Admin', 'Manager', 'Warehouse Staff', 'Delivery Staff'];
  const [passwordError, setPasswordError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!show) {
      setPasswordError('');
      setIsSubmitting(false);
    }
  }, [show]);

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    fullName: '',
    phoneNumber: '',
    roles: [],
    status: 'Active',
    password: ''
  });

  useEffect(() => {
    if (mode === 'edit' && user) {
      setFormData({
        username: user.username,
        email: user.email,
        fullName: user.fullName || '',
        phoneNumber: user.phoneNumber || '',
        roles: user.roles || [],
        status: user.status,
        password: ''
      });
    } else {
      setFormData({
        username: '',
        email: '',
        fullName: '',
        phoneNumber: '',
        roles: [],
        status: 'Active',
        password: ''
      });
    }
  }, [mode, user, show]);

  const validatePassword = (password) => {
    const minLength = password.length > 6;
    const hasUppercase = /[A-Z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecialChar = /[_\W]/.test(password); // includes _ and other symbols

    return minLength && hasUppercase && hasNumber && hasSpecialChar;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isSubmitting) return;

    // Validate password
    if (
      (mode === 'add' && !validatePassword(formData.password)) ||
      (mode === 'edit' && formData.password && !validatePassword(formData.password))
    ) {
      setPasswordError(
        'Password must be longer than 6 characters, include 1 uppercase letter, 1 number, and 1 special character (e.g. _)'
      );
      return;
    }

    setPasswordError('');
    setIsSubmitting(true);

    try {
      if (mode === 'add') {
        await createUser(formData);
      } else {
        await updateUser(user.id, {
          ...formData,
          password: formData.password || undefined
        });
      }

      onSuccess();
      onHide();
    } catch (error) {
      console.error(`Error ${mode === 'add' ? 'creating' : 'updating'} user:`, error);
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <Modal
      show={show}
      onHide={onHide}
      centered
      size="lg"
      backdrop={isSubmitting ? 'static' : true}
      keyboard={!isSubmitting}
    >
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
                  disabled={isSubmitting}
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
                  disabled={isSubmitting}
                />
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group>
                <Form.Label className="fw-semibold">Full Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter full name"
                  value={formData.fullName}
                  onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                  disabled={isSubmitting}
                />
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group>
                <Form.Label className="fw-semibold">Phone Number</Form.Label>
                <Form.Control
                  type="tel"
                  placeholder="Enter phone number"
                  value={formData.phoneNumber}
                  onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
                  disabled={isSubmitting}
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
                        disabled={isSubmitting}
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
                  disabled={isSubmitting}
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
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required={mode === 'add'}
                  isInvalid={!!passwordError}
                  disabled={isSubmitting}
                />

                {passwordError && (
                  <Form.Control.Feedback type="invalid">
                    {passwordError}
                  </Form.Control.Feedback>
                )}
              </Form.Group>

            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onHide} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button variant="primary" type="submit" disabled={isSubmitting}>
            {isSubmitting && (
              <Spinner
                as="span"
                animation="border"
                size="sm"
                role="status"
                aria-hidden="true"
                className="me-2"
              />
            )}
            {isSubmitting
              ? (mode === 'add' ? 'Adding...' : 'Saving...')
              : (mode === 'add' ? 'Add User' : 'Save Changes')}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default UserModal;