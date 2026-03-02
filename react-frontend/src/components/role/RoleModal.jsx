import React, { useState, useEffect } from 'react';
import { Modal, Form, Button, Row, Col, Spinner } from 'react-bootstrap';
import PermissionAccordion from './PermissionAccordion';
import { createRole, updateRole } from '../../api/role-api';

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
    // color: 'primary',
    // permissions: {
    //   users: [],
    //   roles: [],
    //   content: [],
    //   settings: [],
    //   reports: []
    // }
  });

  const [error, setError] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!show) {
      setIsSubmitting(false);
    }
  }, [show]);

  useEffect(() => {
    if (mode === 'edit' && role) {
      setFormData({
        role: role.name,
        description: role.description,
        // color: role.color,
        // permissions: role.permissions
      });
    } else {
      setFormData({
        role: '',
        description: '',
        // color: 'primary',
        // permissions: {
        //   users: [],
        //   roles: [],
        //   content: [],
        //   settings: [],
        //   reports: []
        // }
      });
    }
  }, [mode, role, show]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError({}); // Clear previous errors
    console.log('Submitting role with data:', formData);
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      if (mode === 'add') {
        await createRole(formData);
      } else {
        await updateRole(role.id, formData);
      }

      onSubmit(); // Call the parent's onSubmit callback to refresh the role list
      onHide();
    } catch (error) {
      console.error(`Error ${mode === 'add' ? 'creating' : 'updating'} role:`, error);
      console.log('Error response data:', error.response?.data.errors);
      setError(error.response?.data?.errors || 'An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
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
          {mode === 'add' ? 'Create New Role' : 'Edit Role'}
        </Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body className="p-4">
          <Row className="g-3 mb-4 align-items-center">
            <Col md={12}>
              <Form.Group>
                <Form.Label className="fw-semibold">Role Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter role name"
                  value={formData.role}
                  onChange={(e) => setFormData({...formData, role: e.target.value})}
                  required
                  isInvalid={!!error.Role}
                  disabled={isSubmitting}
                />
                <Form.Control.Feedback type="invalid">
                  {error.Role}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>

            {/* <Col md={4}>
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
            </Col> */}

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
                  isInvalid={!!error.Description}
                  disabled={isSubmitting}
                />
                <Form.Control.Feedback type="invalid">
                  {error.Description}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>

          {/* Permissions */}
          {/* <div className="mb-3">
            <h6 className="fw-bold mb-3">Permissions</h6>
            <PermissionAccordion
              permissionModules={permissionModules}
              formData={formData}
              onPermissionChange={handlePermissionChange}
            />
          </div> */}
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
              ? (mode === 'add' ? 'Creating...' : 'Saving...')
              : (mode === 'add' ? 'Create Role' : 'Save Changes')}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default RoleModal;