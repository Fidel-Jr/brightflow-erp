import React, { useState, useEffect } from 'react';
import { Modal, Form, Button, Row, Col, InputGroup, Spinner } from 'react-bootstrap';
import { createProduct, updateProduct } from '../../api/product-api';
import { getCategories } from '../../api/category-api';
import { getLocations } from '../../api/location-api';

const ProductModal = ({ show, mode, product, onHide, onSubmit, onSuccess }) => {
  const categoriesStatic = ['Electronics', 'Furniture', 'Stationery', 'Office Supplies'];
  const [categories, setCategories] = useState([]);
  const [locations, setLocations] = useState([]);
  const [errors, setErrors] = useState({});
  const [serverMessage, setServerMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingCategories, setIsLoadingCategories] = useState(false);
  const [isLoadingLocations, setIsLoadingLocations] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    categoryId: '',
    price: '',
    quantity: '',
    lowStockThreshold: '',
    // supplier: '',
    locationId: '',
    description: '',
    image: null
  });

  useEffect(() => {
    if (mode === 'edit' && product) {
      setFormData({
        name: product.name || '',
        sku: product.sku || '',
        // Map these to IDs for the Select inputs to work
        categoryId: product.category?.id || '', 
        locationId: product.location?.id || '',
        price: product.price || '',
        quantity: product.stockQuantity || '', // Match backend 'stockQuantity'
        lowStockThreshold: product.reorderLevel || '', // Match backend 'reorderLevel'
        description: product.description || '',
        image: null // Keep null unless user uploads a NEW one
      });
    } else {
      setFormData({
        name: '', sku: '', categoryId: '', price: '',
        quantity: '', lowStockThreshold: '', locationId: '',
        description: '', image: null
      });
    }
  }, [mode, product, show]);

  useEffect(() => {
      if (!show) {
        setErrors({});
        setIsSubmitting(false);
      }
    }, [show]);

  useEffect(() => {
    if (!show) return;

    let cancelled = false;

    const fetchCategories = async () => {
      setIsLoadingCategories(true);
      try {
        const data = await getCategories();
        console.log("Categories: ", data.data);
        if (!cancelled) {
          setCategories(data.data);
        }
      } catch (error) {
        console.error("Error loading categories:", error);
      } finally {
        if (!cancelled) {
          setIsLoadingCategories(false);
        }
      }
    };

    const fetchLocations = async () => {
      setIsLoadingLocations(true);
      try {
        const data = await getLocations();
        console.log("Locations: ", data.data);
        if (!cancelled) {
          setLocations(data.data);
        }
      } catch (error) {
        console.error("Error loading categories:", error);
      } finally {
        if (!cancelled) {
          setIsLoadingLocations(false);
        }
      }
    };

    fetchCategories();
    fetchLocations();

    return () => {
      cancelled = true;
    };
  }, [show]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    if (isSubmitting) return;
    setIsSubmitting(true);
    
    try {
      const data = new FormData();
      data.append("Name", formData.name);
      data.append("SKU", formData.sku);
      data.append("CategoryId", formData.categoryId);
      data.append("Price", formData.price);
      data.append("StockQuantity", formData.quantity);
      data.append("ReorderLevel", formData.lowStockThreshold);
      data.append("LocationId", formData.locationId);
      data.append("Description", formData.description);

      // Only append image if a new file was actually selected
      if (formData.image instanceof File) {
        data.append("Image", formData.image);
      }

      if (mode === "add") {
        await createProduct(data);
      } else {
        // product.id comes from the prop passed to the modal
        await updateProduct(product.id, data);
      }

      onSuccess(); // Triggers the parent to refresh the list
      onHide();    // Closes the modal
    } catch (error) {
      if (error.response?.status === 409) {
        setErrors({ sku: "SKU already exists." });
      } else if (error.response?.status === 400) {
        setErrors(error.response.data.errors || {});
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const isLoadingLookups = isLoadingCategories || isLoadingLocations;

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
          {mode === 'add' ? 'Add New Product' : 'Edit Product'}
        </Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body className="p-4">
          <Row className="g-3">
            {/* Product Name */}
            <Col md={8}>
              <Form.Group>
                <Form.Label className="fw-semibold">
                  Product Name <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter product name"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  required
                  disabled={isSubmitting}
                />
              </Form.Group>
            </Col>

            {/* SKU */}
            <Col md={4}>
              <Form.Group>
                <Form.Label className="fw-semibold">
                  SKU <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  type="text"
                  placeholder="e.g., WM-001"
                  value={formData.sku}
                  onChange={(e) => handleChange('sku', e.target.value)}
                  required
                  // 🔥 Add these two lines:
                  isInvalid={!!errors.sku} 
                  disabled={isSubmitting}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.sku}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>

            {/* Category */}
            <Col md={6}>
              <Form.Group>
                <Form.Label className="fw-semibold">
                  Category <span className="text-danger">*</span>
                </Form.Label>
                <Form.Select
                  value={formData.categoryId}
                  onChange={(e) => handleChange('categoryId', e.target.value)}
                  required
                  disabled={isSubmitting || isLoadingCategories}
                >
                  <option value="">
                    {isLoadingCategories ? 'Loading categories...' : 'Select category'}
                  </option>
                  {Array.isArray(categories) &&
                    categories.map(cat => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))
                  }
                </Form.Select>
              </Form.Group>
            </Col>

            {/* Price */}
            <Col md={6}>
              <Form.Group>
                <Form.Label className="fw-semibold">
                  Price <span className="text-danger">*</span>
                </Form.Label>
                <InputGroup>
                  <InputGroup.Text>$</InputGroup.Text>
                  <Form.Control
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={formData.price}
                    onChange={(e) => handleChange('price', e.target.value)}
                    required
                    disabled={isSubmitting}
                    isInvalid={!!errors.Price}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.Price}
                  </Form.Control.Feedback>
                </InputGroup>
              </Form.Group>
            </Col>

            {/* Quantity */}
            <Col md={6}>
              <Form.Group>
                <Form.Label className="fw-semibold">
                  Quantity <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  type="number"
                  placeholder="0"
                  value={formData.quantity}
                  onChange={(e) => handleChange('quantity', e.target.value)}
                  required
                  disabled={isSubmitting}
                  isInvalid={!!errors.StockQuantity}
                 />
                <Form.Control.Feedback type="invalid">
                  {errors.StockQuantity}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>

            {/* Low Stock Threshold */}
            <Col md={6}>
              <Form.Group>
                <Form.Label className="fw-semibold">
                  Low Stock Alert <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  type="number"
                  placeholder="e.g., 20"
                  value={formData.lowStockThreshold}
                  onChange={(e) => handleChange('lowStockThreshold', e.target.value)}
                  required
                  disabled={isSubmitting}
                  isInvalid={!!errors.ReorderLevel}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.ReorderLevel}
                </Form.Control.Feedback>
                <Form.Text className="text-muted">
                  Alert when stock falls below this number
                </Form.Text>
              </Form.Group>
            </Col>

            {/* Supplier */}
            {/* <Col md={6}>
              <Form.Group>
                <Form.Label className="fw-semibold">Supplier</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter supplier name"
                  value={formData.supplier}
                  onChange={(e) => handleChange('supplier', e.target.value)}
                />
              </Form.Group>
            </Col> */}

            {/* Location */}
            <Col md={12}>
              <Form.Group>
                <Form.Label className="fw-semibold">Location</Form.Label>
                <Form.Select
                  value={formData.locationId}
                  onChange={(e) => handleChange('locationId', e.target.value)}
                  required
                  disabled={isSubmitting || isLoadingLocations}
                >
                  <option value="">
                    {isLoadingLocations ? 'Loading locations...' : 'Select location'}
                  </option>
                  {Array.isArray(locations) &&
                    locations.map(loc => (
                      <option key={loc.id} value={loc.id}>
                        {loc.name}
                      </option>
                    ))
                  }
                </Form.Select>
              </Form.Group>
            </Col>

            {/* Description */}
            <Col md={12}>
              <Form.Group>
                <Form.Label className="fw-semibold">Description</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  placeholder="Enter product description"
                  value={formData.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                  disabled={isSubmitting}
                />
              </Form.Group>
            </Col>

            {/* Image Upload */}
            <Col md={12}>
              <Form.Group>
                <Form.Label className="fw-semibold">Product Image</Form.Label>
                <Form.Control
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleChange('image', e.target.files[0])}
                  disabled={isSubmitting}
                />
                <Form.Text className="text-muted">
                  Upload product image (JPG, PNG, max 5MB)
                </Form.Text>
              </Form.Group>
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onHide} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button variant="primary" type="submit" disabled={isSubmitting || isLoadingLookups}>
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
              : (mode === 'add' ? 'Add Product' : 'Save Changes')}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default ProductModal;