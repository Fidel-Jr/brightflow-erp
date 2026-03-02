import React, { useState, useEffect } from 'react';
import { Modal, Form, Button, Row, Col, InputGroup, Table, Badge, Spinner } from 'react-bootstrap';
import { createOrder, updateOrder, getWarehouseLocation } from '../../api/order-api';
import { createDelivery } from '../../api/delivery-api';
import MapComponent from './MapComponent';
import { DEFAULT_WAREHOUSE_LOCATION } from '../../config/warehouse';

const OrderModal = ({ show, mode, order, onHide, onSubmit, products, staffs }) => {

  const initialState = {
    customer: {
      name: '',
      email: '',
      phone: '',
      address: '',
      customerLat: null,
      customerLng: null
    },
    products: [],
    status: 'Pending',
    priorityLevel: 'Medium',
    assignedStaffId: '',
    estimatedDelivery: '',
    notes: ''
  };

  const [formData, setFormData] = useState(initialState);
  const [showMap, setShowMap] = useState(false);
  const [warehouse, setWarehouse] = useState(null);
  const [isWarehouseLoading, setIsWarehouseLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  console.log("Staffs: ", staffs);

  const [selectedProduct, setSelectedProduct] = useState('');
  const [productQuantity, setProductQuantity] = useState(1);

  // Mock available products
  const availableProducts = products;

  const warehouses = ['Warehouse A', 'Warehouse B', 'Warehouse C'];
  // const staffMembers = ['Sarah Wilson', 'Mike Johnson', 'Emily Davis', 'Tom Brown', 'James Miller'];

  const staffMembers = staffs;
  console.log("Available Products: ", availableProducts)

  const warehouseLat = warehouse?.lat != null ? Number(warehouse.lat) : Number(DEFAULT_WAREHOUSE_LOCATION.lat);
  const warehouseLng = warehouse?.lng != null ? Number(warehouse.lng) : Number(DEFAULT_WAREHOUSE_LOCATION.lng);
  const hasWarehouseLocation = Number.isFinite(warehouseLat) && Number.isFinite(warehouseLng);
  const warehouseLocation = hasWarehouseLocation ? { lat: warehouseLat, lng: warehouseLng } : null;

  useEffect(() => {
    if (!show) return;

    setIsWarehouseLoading(true);

    let cancelled = false;
    (async () => {
      try {
        const res = await getWarehouseLocation();
        if (!cancelled) {
          setWarehouse(res.data);
        }
      } catch (err) {
        if (!cancelled) {
          setWarehouse(null);
        }
      } finally {
        if (!cancelled) {
          setIsWarehouseLoading(false);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [show]);

  useEffect(() => {
    if (!show) {
      setIsSubmitting(false);
      setIsWarehouseLoading(false);
    }
  }, [show]);

  const setCustomerFromMap = (partialCustomer) => {
    setFormData(prev => ({
      ...prev,
      customer: {
        ...prev.customer,
        ...partialCustomer
      }
    }));
  };

  const setAddressFromMap = (address) => {
    setFormData(prev => ({
      ...prev,
      customer: {
        ...prev.customer,
        address
      }
    }));
  };

  useEffect(() => {
    if (mode === 'edit' && order) {
      const rawCustomerLat =
        order?.customer?.customerLat ??
        order?.customer?.latitude ??
        order?.customer?.Latitude ??
        null;

      const rawCustomerLng =
        order?.customer?.customerLng ??
        order?.customer?.longitude ??
        order?.customer?.Longitude ??
        null;

      const parsedCustomerLat = rawCustomerLat == null ? null : Number(rawCustomerLat);
      const parsedCustomerLng = rawCustomerLng == null ? null : Number(rawCustomerLng);

      const customerLat = Number.isFinite(parsedCustomerLat) ? parsedCustomerLat : null;
      const customerLng = Number.isFinite(parsedCustomerLng) ? parsedCustomerLng : null;

      setFormData({
        customer: {
          name: order?.customer?.name ?? order?.customer?.Name ?? '',
          email: order?.customer?.email ?? order?.customer?.Email ?? '',
          phone: order?.customer?.phone ?? order?.customer?.Phone ?? '',
          address: order?.customer?.address ?? order?.customer?.Address ?? '',
          customerLat,
          customerLng
        },
        products: order.products,
        status: order.status,
        priorityLevel: order.priorityLevel,
        assignedStaffId: order.assignedStaffId || '', // ⚠️ you need this from API
        estimatedDelivery: order.estimatedDelivery?.split("T")[0],
        notes: order.notes || ''
      });

      const hasCustomerLocation = Number.isFinite(customerLat) && Number.isFinite(customerLng);
      setShowMap(hasCustomerLocation);
    } else {
      setFormData(initialState);
      setShowMap(false);
    }
  }, [mode, order, show]);

  const payload = {
    customerName: formData.customer.name,
    customerEmail: formData.customer.email,
    customerPhone: formData.customer.phone,
    customerAddress: formData.customer.address,
    customerLat: formData.customer.customerLat,
    customerLng: formData.customer.customerLng,
    products: formData.products.map(product => ({
      productId: product.id,
      quantity: product.quantity,
    })),
    status: formData.status,
    priorityLevel: formData.priorityLevel,
    assignedStaffId: formData.assignedStaffId,
    estimatedDelivery: formData.estimatedDelivery,
    notes: formData.notes
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
        let createdOrderNumber = null;

        if (mode === "add") {
          const response = await createOrder(payload);
          createdOrderNumber = response?.data?.orderNumber ?? response?.data?.OrderNumber ?? null;
          console.log("Data to be Added!", payload)
          
        } else {
            // If moving to delivery
            if (payload.status === "ForDelivery") {
              const confirmMove = window.confirm(
                "Move to delivery? This order is done processing and ready for delivery."
              );

              if (!confirmMove) return;

              try {
                const deliveryPayload = {
                  orderId: order.id,
                  notes: payload.notes
                };

                await createDelivery(deliveryPayload);
                console.log("Delivery created successfully");
              } catch (error) {
                console.error("Error creating delivery:", error);
                alert("Failed to create delivery. Please try again.");
                return;
              }
            }

            // Update order AFTER delivery succeeds
            await updateOrder(order.id, payload);
            console.log("Data updated!", payload);
          }
  
        onSubmit(createdOrderNumber); // Triggers the parent to refresh the list
        onHide();    // Closes the modal
      } catch (error) {
          console.log(error?.response?.data?.errors ?? error);
      } finally {
        setIsSubmitting(false);
      }
  };


  // console.log("Product ID: ", formData.products.map(p => p.id));
  // LIKE CART ADDING
  const handleAddProduct = () => {
    if (!selectedProduct) return;
    
    const product = availableProducts.find(p => p.id === parseInt(selectedProduct));
    if (!product) return;

    const existingProduct = formData.products.find(p => p.id === product.id);
    if (existingProduct) {
      setFormData({
        ...formData,
        products: formData.products.map(p =>
          p.id === product.id
            ? { ...p, quantity: p.quantity + productQuantity }
            : p
        )
      });
    } else {
      setFormData({
        ...formData,
        products: [...formData.products, { ...product, quantity: productQuantity }]
      });
    }

    setSelectedProduct('');
    setProductQuantity(1);
  };

  const handleRemoveProduct = (productId) => {
    setFormData({
      ...formData,
      products: formData.products.filter(p => p.id !== productId)
    });
  };

  const handleQuantityChange = (productId, newQuantity) => {
    setFormData({
      ...formData,
      products: formData.products.map(p =>
        p.id === productId ? { ...p, quantity: parseInt(newQuantity) || 1 } : p
      )
    });
  };

  const calculateTotal = () => {
    return formData.products.reduce((sum, p) => sum + (p.price * p.quantity), 0);
  };
  // console.log("Customer Name: ",formData.customer.name)
  return (
    <Modal
      show={show}
      onHide={onHide}
      centered
      size="xl"
      backdrop={isSubmitting ? 'static' : true}
      keyboard={!isSubmitting}
    >
      <Modal.Header closeButton>
        <Modal.Title className="fw-bold">
          {mode === 'add' ? 'Create New Order' : 'Edit Order'}
        </Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body className="p-4" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
          <Row className="g-4">
            {/* Customer Information */}
            <Col md={12}>
              <h6 className="fw-bold mb-3 text-uppercase text-muted" style={{ fontSize: '0.75rem' }}>
                Customer Information
              </h6>
            </Col>

            <Col md={6}>
              <Form.Group>
                <Form.Label className="fw-semibold">
                  Customer Name <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter customer name"
                  value={formData.customer.name}
                  onChange={(e) => setFormData({
                    ...formData,
                    customer: { ...formData.customer, name: e.target.value }
                  })}
                  required
                  disabled={isSubmitting}
                />
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group>
                <Form.Label className="fw-semibold">
                  Email <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  type="email"
                  placeholder="customer@example.com"
                  value={formData.customer.email}
                  onChange={(e) => setFormData({
                    ...formData,
                    customer: { ...formData.customer, email: e.target.value }
                  })}
                  required
                  disabled={isSubmitting}
                />
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group>
                <Form.Label className="fw-semibold">
                  Phone <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  type="tel"
                  placeholder="+1 234 567 8900"
                  value={formData.customer.phone}
                  onChange={(e) => setFormData({
                    ...formData,
                    customer: { ...formData.customer, phone: e.target.value }
                  })}
                  required
                  disabled={isSubmitting}
                />
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group>
                <Form.Label className="fw-semibold">
                  Delivery Address <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  type="text"
                  placeholder="123 Main St, City, State ZIP"
                  value={formData.customer.address}
                  onChange={(e) => setFormData({
                    ...formData,
                    customer: { ...formData.customer, address: e.target.value }
                  })}
                  required
                  disabled={isSubmitting}
                />

                <div className="d-flex align-items-center justify-content-between mt-2">
                  <Form.Check
                    type="switch"
                    id="toggle-order-map"
                    label="Use map"
                    checked={showMap}
                    onChange={(e) => setShowMap(e.target.checked)}
                    disabled={isSubmitting || isWarehouseLoading || !hasWarehouseLocation}
                  />
                  {isWarehouseLoading && (
                    <small className="text-muted">Loading warehouse location...</small>
                  )}
                  {!isWarehouseLoading && !hasWarehouseLocation && (
                    <small className="text-muted">
                      Warehouse location unavailable
                    </small>
                  )}
                </div>

                {showMap && warehouseLocation && (
                  <div className="mt-2">
                    <MapComponent
                      warehouse={warehouseLocation}
                      customer={formData.customer}
                      setCustomer={setCustomerFromMap}
                      setAddress={setAddressFromMap}
                    />
                  </div>
                )}
              </Form.Group>
            </Col>

            {/* Products */}
            <Col md={12}>
              <h6 className="fw-bold mb-3 mt-3 text-uppercase text-muted" style={{ fontSize: '0.75rem' }}>
                Products
              </h6>
            </Col>

            <Col md={12}>
              <Row className="g-2 mb-3">
                <Col md={6}>
                  <Form.Select
                    value={selectedProduct}
                    onChange={(e) => setSelectedProduct(e.target.value)}
                    disabled={isSubmitting}
                  >
                    <option value="">Select product...</option>
                    {availableProducts.map(product => (
                      <option key={product.id} value={product.id}>
                        {product.name} - ${product.price} (Stock: {product.stockQuantity})
                      </option>
                    ))}
                  </Form.Select>
                </Col>
                <Col md={3}>
                  <Form.Control
                    type="number"
                    min="1"
                    placeholder="Qty"
                    value={productQuantity}
                    onChange={(e) => setProductQuantity(parseInt(e.target.value) || 1)}
                    disabled={isSubmitting}
                  />
                </Col>
                <Col md={3}>
                  <Button 
                    variant="primary" 
                    onClick={handleAddProduct}
                    className="w-100"
                    disabled={isSubmitting}
                  >
                    <i className="bi bi-plus-circle me-2"></i>
                    Add
                  </Button>
                </Col>
              </Row>

              {formData.products.length > 0 ? (
                <Table bordered className="mb-0">
                  <thead className="bg-light">
                    <tr>
                      <th>Product</th>
                      <th>SKU</th>
                      <th style={{ width: '120px' }}>Quantity</th>
                      <th style={{ width: '120px' }}>Price</th>
                      <th style={{ width: '120px' }}>Total</th>
                      <th style={{ width: '60px' }}></th>
                    </tr>
                  </thead>
                  <tbody>
                    {formData.products.map(product => (
                      <tr key={product.id}>
                        <td>{product.productName}</td>
                        <td><code>{product.sku}</code></td>
                        <td>
                          <Form.Control
                            type="number"
                            min="1"
                            value={product.quantity}
                            onChange={(e) => handleQuantityChange(product.id, e.target.value)}
                            size="sm"
                            disabled={isSubmitting}
                          />
                        </td>
                        <td>${product.price.toFixed(2)}</td>
                        <td className="fw-bold">${(product.price * product.quantity).toFixed(2)}</td>
                        <td className="text-center">
                          <Button
                            variant="link"
                            className="text-danger p-0"
                            onClick={() => handleRemoveProduct(product.id)}
                            disabled={isSubmitting}
                          >
                            <i className="bi bi-trash"></i>
                          </Button>
                        </td>
                      </tr>
                    ))}
                    <tr className="bg-light">
                      <td colSpan="4" className="text-end fw-bold">Total:</td>
                      <td className="fw-bold text-success">${calculateTotal().toFixed(2)}</td>
                      <td></td>
                    </tr>
                  </tbody>
                </Table>
              ) : (
                <div className="text-center py-4 border rounded bg-light">
                  <i className="bi bi-cart-x display-4 text-muted d-block mb-2"></i>
                  <p className="text-muted mb-0">No products added yet</p>
                </div>
              )}
            </Col>

            {/* Order Details */}
            <Col md={12}>
              <h6 className="fw-bold mb-3 mt-3 text-uppercase text-muted" style={{ fontSize: '0.75rem' }}>
                Order Details
              </h6>
            </Col>

            <Col md={4}>
              <Form.Group>
                <Form.Label className="fw-semibold">Status</Form.Label>
                <Form.Select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  disabled={isSubmitting}
                >
                  <option value="Pending">Pending</option>
                  <option value="Processing">Processing</option>
                  <option value="ForDelivery">For Delivery</option>
                </Form.Select>
              </Form.Group>
            </Col>

            <Col md={4}>
              <Form.Group>
                <Form.Label className="fw-semibold">Priority</Form.Label>
                <Form.Select
                  value={formData.priorityLevel}
                  onChange={(e) => setFormData({ ...formData, priorityLevel: e.target.value })}
                  disabled={isSubmitting}
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </Form.Select>
              </Form.Group>
            </Col>

            <Col md={4}>
              <Form.Group>
                <Form.Label className="fw-semibold">
                  Estimated Delivery <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  type="date"
                  value={formData.estimatedDelivery}
                  onChange={(e) => setFormData({ ...formData, estimatedDelivery: e.target.value })}
                  required
                  disabled={isSubmitting}
                />
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group>
                <Form.Label className="fw-semibold">
                  Assign Staff <span className="text-danger">*</span>
                </Form.Label>
                <Form.Select
                  value={formData.assignedStaffId}
                  onChange={(e) => setFormData({ ...formData, assignedStaffId: e.target.value })}
                  required
                  disabled={isSubmitting}
                >
                  <option value="">Select staff member...</option>
                  {staffMembers.map(staff => (
                    <option key={staff.id} value={staff.id}>{staff.userName}</option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group>
                <Form.Label className="fw-semibold">Notes</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  placeholder="Add any special instructions or notes..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  disabled={isSubmitting}
                />
              </Form.Group>
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onHide} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button
            variant="primary"
            type="submit"
            disabled={isSubmitting || formData.products.length === 0}
          >
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
              : (mode === 'add' ? 'Create Order' : 'Save Changes')}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default OrderModal;