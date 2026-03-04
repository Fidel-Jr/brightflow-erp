import React from 'react';
import { Row, Col, Card, Button, Form, InputGroup } from 'react-bootstrap';

const InventoryFilters = ({ 
  searchTerm, 
  setSearchTerm, 
  filterCategory,
  setFilterCategory,
  categories =[],
  filterStock,
  setFilterStock,
  onAddProduct,
  onAddCategory = () => {}
}) => {
  // const categories = ['Electronics', 'Furniture', 'Stationery', 'Office Supplies'];

  return (
    <Card className="border-0 shadow-sm mb-4">
      <Card.Body className="p-4">
        <Row className="g-3">
          {/* Search */}
          <Col md={4}>
            <InputGroup>
              <InputGroup.Text className="bg-light border-end-0">
                <i className="bi bi-search"></i>
              </InputGroup.Text>
              <Form.Control
                type="search"
                placeholder="Search by name or SKU..."
                className="border-start-0 bg-light"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </InputGroup>
          </Col>

          {/* Category Filter */}
          <Col md={2}>
            <Form.Select 
              value={filterCategory} // This will be 'all' or the ID
              onChange={(e) => setFilterCategory(e.target.value)}
            >
              <option value="all">All Categories</option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </Form.Select>
          </Col>

          {/* Stock Filter */}
          <Col md={2}>
            <Form.Select 
              value={filterStock}
              onChange={(e) => setFilterStock(e.target.value)}
            >
              <option value="all">All Stock</option>
              <option value="in">In Stock</option>
              <option value="low">Low Stock</option>
              <option value="out">Out of Stock</option>
            </Form.Select>
          </Col>

          {/* Actions */}
          <Col md={4} className="text-md-end">
            {/* <ButtonGroup className="me-2">
              <Button variant="outline-secondary">
                <i className="bi bi-download me-2"></i>
                Export
              </Button>
              <Dropdown as={ButtonGroup}>
                <Dropdown.Toggle variant="outline-secondary" split>
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item>
                    <i className="bi bi-file-earmark-excel me-2"></i>
                    Export as CSV
                  </Dropdown.Item>
                  <Dropdown.Item>
                    <i className="bi bi-file-earmark-pdf me-2"></i>
                    Export as PDF
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </ButtonGroup> */}
            <Button
              variant="outline-primary"
              className="me-2"
              onClick={onAddCategory}
            >
              <i className="bi bi-plus-circle me-2"></i>
              Add Category
            </Button>

            <Button variant="primary" onClick={onAddProduct}>
              <i className="bi bi-plus-circle me-2"></i>
              Add Product
            </Button>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
};

export default InventoryFilters;