import React, { useEffect, useState } from 'react';
import { Modal, Form, Button, Row, Col, Spinner, Alert } from 'react-bootstrap';
import { createCategory } from '../../api/category-api';

const CategoryModal = ({ show, onHide, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!show) return;

    setFormData({ name: '', description: '' });
    setErrors({});
    setIsSubmitting(false);
  }, [show]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field] || errors.general) {
      setErrors((prev) => ({ ...prev, [field]: undefined, general: undefined }));
    }
  };

  const validate = () => {
    const nextErrors = {};
    if (!formData.name.trim()) nextErrors.name = 'Category name is required.';
    if (!formData.description.trim()) nextErrors.description = 'Category description is required.';
    return nextErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    const nextErrors = validate();
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      await createCategory({
        name: formData.name.trim(),
        description: formData.description.trim()
      });

      if (onSuccess) {
        await onSuccess();
      }

      onHide();
    } catch (error) {
      console.error('Error creating category:', error);
      const payload = error?.response?.data;

      if (typeof payload === 'string') {
        setErrors({ general: payload });
      } else if (payload?.errors) {
        setErrors(payload.errors);
      } else {
        setErrors({ general: 'An error occurred. Please try again.' });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      show={show}
      onHide={onHide}
      centered
      backdrop={isSubmitting ? 'static' : true}
      keyboard={!isSubmitting}
    >
      <Modal.Header closeButton={!isSubmitting}>
        <Modal.Title className="fw-bold">Add New Category</Modal.Title>
      </Modal.Header>

      <Form onSubmit={handleSubmit}>
        <Modal.Body className="p-4">
          {errors.general && (
            <Alert variant="danger" dismissible={!isSubmitting} onClose={() => setErrors({})}>
              {errors.general}
            </Alert>
          )}

          <Row className="g-3">
            <Col xs={12}>
              <Form.Group>
                <Form.Label className="fw-semibold">Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter category name"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  disabled={isSubmitting}
                  isInvalid={!!errors.name}
                  required
                />
                <Form.Control.Feedback type="invalid">
                  {errors.name}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>

            <Col xs={12}>
              <Form.Group>
                <Form.Label className="fw-semibold">Description</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  placeholder="Enter category description"
                  value={formData.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                  disabled={isSubmitting}
                  isInvalid={!!errors.description}
                  required
                />
                <Form.Control.Feedback type="invalid">
                  {errors.description}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>
        </Modal.Body>

        <Modal.Footer className="px-4 pb-4">
          <Button variant="outline-secondary" onClick={onHide} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button variant="primary" type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Spinner size="sm" className="me-2" />
                Creating...
              </>
            ) : (
              'Create Category'
            )}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default CategoryModal;
