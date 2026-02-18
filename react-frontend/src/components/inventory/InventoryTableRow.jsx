import React from 'react';
import { Form, Badge, Dropdown } from 'react-bootstrap';

const InventoryTableRow = ({ product, index, onEdit, onDelete, onDuplicate, onViewDetails }) => {
  if (!product) {
    return null;
  }

  const parseNumber = (value, fallback = 0) => {
    const numericValue = Number(value);
    return Number.isFinite(numericValue) ? numericValue : fallback;
  };

  const stockQuantity = parseNumber(product.stockQuantity);
  const reorderLevel = parseNumber(product.reorderLevel);
  const priceValue = parseNumber(product.price);

  const getStockStatus = () => {
    if (stockQuantity === 0) {
      return { label: 'Out of Stock', variant: 'danger' };
    } else if (stockQuantity <= reorderLevel) {
      return { label: 'Low Stock', variant: 'warning' };
    }
    return { label: 'In Stock', variant: 'success' };
  };

  const getCategoryColor = (category) => {
    const colors = {
      'Electronics': 'primary',
      'Furniture': 'info',
      'Stationery': 'warning',
      'Office Supplies': 'secondary'
    };
    return colors[category] || 'secondary';
  };

  const status = getStockStatus();
  const API_BASE = "https://localhost:7071";
  console.log("Product image URL:",  product.imageUrl);


  return (
    <tr className={stockQuantity <= reorderLevel ? 'table-warning bg-opacity-10' : ''}>
      <td className="px-4 align-middle">
        <Form.Check type="checkbox" />
      </td>
      <td className="align-middle">
        <div className="d-flex align-items-center">
          <div 
            className="rounded bg-light d-flex align-items-center justify-content-center me-3"
            style={{ 
              width: '48px', 
              height: '48px',
              minWidth: '48px'
            }}
          >
            {product.imageUrl ? (
              <img src={`${API_BASE}${product.imageUrl}`} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <i className="bi bi-box-seam text-muted fs-4"></i>
            )}
          </div>
          <div>
            <div className="fw-semibold">{product.name}</div>
            <small className="text-muted">{product.description}</small>
          </div>
        </div>
      </td>
      <td className="align-middle">
        <code className="text-primary">{product.sku}</code>
      </td>
      <td className="align-middle">
        <Badge 
          bg={getCategoryColor(product.category?.name)} 
          className="bg-opacity-10 px-3 py-2"
        >
          <span className={`text-${getCategoryColor(product.category?.name)}`}>
            {product.category?.name}
          </span>
        </Badge>
      </td>
      <td className="align-middle fw-semibold">
        ${priceValue.toFixed(2)}
      </td>
      <td className="align-middle">
        <div className="d-flex align-items-center">
          <span className="fw-semibold me-2">{stockQuantity}</span>
          {stockQuantity <= reorderLevel && (
            <i className="bi bi-exclamation-triangle text-warning"></i>
          )}
        </div>
        <small className="text-muted">Min: {reorderLevel}</small>
      </td>
      <td className="align-middle">
        <Badge 
          bg={status.variant} 
          className="bg-opacity-10 px-3 py-2"
        >
          <span className={`text-${status.variant}`}>
            {status.label}
          </span>
        </Badge>
      </td>
      <td className="align-middle">
        <Dropdown>
          <Dropdown.Toggle 
            variant="link" 
            className="text-dark p-0 border-0 shadow-none"
          >
            <i className="bi bi-three-dots-vertical"></i>
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item onClick={() => onViewDetails(product)}>
              <i className="bi bi-eye me-2"></i>
              View Details
            </Dropdown.Item>
            <Dropdown.Item onClick={() => onEdit(product)}>
              <i className="bi bi-pencil me-2"></i>
              Edit
            </Dropdown.Item>
            <Dropdown.Item onClick={() => onDuplicate(product)}>
              <i className="bi bi-files me-2"></i>
              Duplicate
            </Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Item 
              className="text-danger"
              onClick={() => onDelete(product.id)}
            >
              <i className="bi bi-trash me-2"></i>
              Delete
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </td>
    </tr>
  );
};

export default InventoryTableRow;