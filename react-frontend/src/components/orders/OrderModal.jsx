import React, { useState, useEffect } from 'react';
import { Modal, Form, Button, Row, Col, InputGroup, Table, Badge } from 'react-bootstrap';
import { createOrder, updateOrder } from '../../api/order-api';

const OrderModal = ({ show, mode, order, onHide, onSubmit, products, staffs }) => {

  const initialState = {
    customer: {
      name: '',
      email: '',
      phone: '',
      address: ''
    },
    products: [],
    status: 'Pending',
    priorityLevel: 'Medium',
    assignedStaffId: '',
    estimatedDelivery: '',
    notes: ''
  };

  const [formData, setFormData] = useState(initialState);

  console.log("Staffs: ", staffs);

  const [selectedProduct, setSelectedProduct] = useState('');
  const [productQuantity, setProductQuantity] = useState(1);

  // Mock available products
  const availableProducts = products;

  const warehouses = ['Warehouse A', 'Warehouse B', 'Warehouse C'];
  // const staffMembers = ['Sarah Wilson', 'Mike Johnson', 'Emily Davis', 'Tom Brown', 'James Miller'];

  const staffMembers = staffs;
  console.log("Available Products: ", availableProducts)

  useEffect(() => {
    if (mode === 'edit' && order) {
      setFormData({
        customer: { ...order.customer },
        products: order.products,
        status: order.status,
        priorityLevel: order.priorityLevel,
        assignedStaffId: order.assignedStaffId || '', // ⚠️ you need this from API
        estimatedDelivery: order.estimatedDelivery?.split("T")[0],
        notes: order.notes || ''
      });
    } else {
      setFormData(initialState);
    }
  }, [mode, order, show]);

  const payload = {
    customerName: formData.customer.name,
    customerEmail: formData.customer.email,
    customerPhone: formData.customer.phone,
    customerAddress: formData.customer.address,
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

    try {
        if (mode === "add") {
          await createOrder(payload);
          console.log("Data to be Added!", payload)
        } else {
          // product.id comes from the prop passed to the modal
          await updateOrder(order.id, payload);
          console.log("Data to be Updated!", payload)
        }
  
        onSubmit(); // Triggers the parent to refresh the list
        onHide();    // Closes the modal
      } catch (error) {
          console.log(error.response.data.errors)
        
      }

    // const totalAmount = formData.products.reduce((sum, p) => sum + (p.price * p.quantity), 0);
    // onSubmit({ ...formData, totalAmount });
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
    <Modal show={show} onHide={onHide} centered size="xl">
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
                />
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
                  />
                </Col>
                <Col md={3}>
                  <Button 
                    variant="primary" 
                    onClick={handleAddProduct}
                    className="w-100"
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
                          />
                        </td>
                        <td>${product.price.toFixed(2)}</td>
                        <td className="fw-bold">${(product.price * product.quantity).toFixed(2)}</td>
                        <td className="text-center">
                          <Button
                            variant="link"
                            className="text-danger p-0"
                            onClick={() => handleRemoveProduct(product.id)}
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
                >
                  <option value="Pending">Pending</option>
                  <option value="Processing">Processing</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Delivered">Delivered</option>
                </Form.Select>
              </Form.Group>
            </Col>

            <Col md={4}>
              <Form.Group>
                <Form.Label className="fw-semibold">Priority</Form.Label>
                <Form.Select
                  value={formData.priorityLevel}
                  onChange={(e) => setFormData({ ...formData, priorityLevel: e.target.value })}
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
                />
              </Form.Group>
            </Col>

            {/* <Col md={6}>
              <Form.Group>
                <Form.Label className="fw-semibold">
                  Assign Warehouse <span className="text-danger">*</span>
                </Form.Label>
                <Form.Select
                  value={formData.assignedWarehouse}
                  onChange={(e) => setFormData({ ...formData, assignedWarehouse: e.target.value })}
                  required
                >
                  <option value="">Select warehouse...</option>
                  {warehouses.map(warehouse => (
                    <option key={warehouse} value={warehouse}>{warehouse}</option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col> */}

            <Col md={6}>
              <Form.Group>
                <Form.Label className="fw-semibold">
                  Assign Staff <span className="text-danger">*</span>
                </Form.Label>
                <Form.Select
                  value={formData.assignedStaffId}
                  onChange={(e) => setFormData({ ...formData, assignedStaffId: e.target.value })}
                  required
                >
                  <option value="">Select staff member...</option>
                  {staffMembers.map(staff => (
                    <option key={staff.id} value={staff.id}>{staff.userName}</option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>

            {/* {(formData.status === 'Shipped' || formData.status === 'Delivered') && (
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="fw-semibold">Delivery Staff</Form.Label>
                  <Form.Select
                    value={formData.deliveryStaff}
                    onChange={(e) => setFormData({ ...formData, deliveryStaff: e.target.value })}
                  >
                    <option value="">Select delivery staff...</option>
                    {staffMembers.map(staff => (
                      <option key={staff.id} value={staff.id}>{staff.userName}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
            )} */}

            <Col md={6}>
              <Form.Group>
                <Form.Label className="fw-semibold">Notes</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  placeholder="Add any special instructions or notes..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                />
              </Form.Group>
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onHide}>
            Cancel
          </Button>
          <Button variant="primary" type="submit" disabled={formData.products.length === 0}>
            {mode === 'add' ? 'Create Order' : 'Save Changes'}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default OrderModal;