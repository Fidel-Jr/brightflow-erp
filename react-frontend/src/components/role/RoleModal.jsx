import React, { useState, useEffect } from 'react';
import { Modal, Form, Button, Row, Col } from 'react-bootstrap';
import PermissionAccordion from './PermissionAccordion';

const RoleModal = ({ 
  show, 
  mode, 
  role, 
  permissionModules, 
  onHide, 
  onSubmit 
}) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    color: 'primary',
    permissions: {
      users: [],
      roles: [],
      content: [],
      settings: [],
      reports: []
    }
  });

  useEffect(() => {
    if (mode === 'edit' && role) {
      setFormData({
        name: role.name,
        description: role.description,
        color: role.color,
        permissions: role.permissions
      });
    } else {
      setFormData({
        name: '',
        description: '',
        color: 'primary',
        permissions: {
          users: [],
          roles: [],
          content: [],
          settings: [],
          reports: []
        }
      });
    }
  }, [mode, role, show]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handlePermissionChange = (module, action) => {
    const currentPermissions = formData.permissions[module] || [];
    const updatedPermissions = currentPermissions.includes(action)
      ? currentPermissions.filter(p => p !== action)
      : [...currentPermissions, action];

    setFormData({
      ...formData,
      permissions: {
        ...formData.permissions,
        [module]: updatedPermissions
      }
    });
  };

  return (
    <Modal show={show} onHide={onHide} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title className="fw-bold">
          {mode === 'add' ? 'Create New Role' : 'Edit Role'}
        </Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body className="p-4">
          <Row className="g-3 mb-4 align-items-center">
            <Col md={8}>
              <Form.Group>
                <Form.Label className="fw-semibold">Role Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter role name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                />
              </Form.Group>
            </Col>

            <Col md={4}>
              <Form.Group>
                <Form.Label className="fw-semibold">Color</Form.Label>
                <Form.Select
                  value={formData.color}
                  onChange={(e) => setFormData({...formData, color: e.target.value})}
                >
                  <option value="primary">Blue</option>
                  <option value="danger">Red</option>
                  <option value="success">Green</option>
                  <option value="warning">Yellow</option>
                  <option value="info">Cyan</option>
                  <option value="secondary">Gray</option>
                </Form.Select>
              </Form.Group>
            </Col>

            <Col md={12}>
              <Form.Group>
                <Form.Label className="fw-semibold">Description</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={2}
                  placeholder="Enter role description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  required
                />
              </Form.Group>
            </Col>
          </Row>

          {/* Permissions */}
          <div className="mb-3">
            <h6 className="fw-bold mb-3">Permissions</h6>
            <PermissionAccordion
              permissionModules={permissionModules}
              formData={formData}
              onPermissionChange={handlePermissionChange}
            />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onHide}>
            Cancel
          </Button>
          <Button variant="primary" type="submit">
            {mode === 'add' ? 'Create Role' : 'Save Changes'}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default RoleModal;