import React from 'react';
import { Card, Table, Form, Pagination, Badge } from 'react-bootstrap';
import InventoryTableRow from './InventoryTableRow';

const InventoryTable = ({ products, 
  totalItems, 
  itemsPerPage, 
  currentPage, 
  setCurrentPage, 
  onEdit, 
  onDelete, 
  onDuplicate, 
  onViewDetails }) => {

    // Calculate total pages
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  // Generate page items
  let items = [];
  for (let number = 1; number <= totalPages; number++) {
    items.push(
      <Pagination.Item 
        key={number} 
        active={number === currentPage}
        onClick={() => setCurrentPage(number)}
      >
        {number}
      </Pagination.Item>,
    );
  }

  return (
    <Card className="border-0 shadow-sm">
      <Card.Body className="p-0">
        <div className="table-responsive">
          <Table hover className="mb-0">
            <thead className="bg-light">
              <tr>
                <th className="border-0 px-4 py-3">
                  <Form.Check type="checkbox" />
                </th>
                <th className="border-0 py-3 text-muted small fw-semibold">PRODUCT</th>
                <th className="border-0 py-3 text-muted small fw-semibold">SKU</th>
                <th className="border-0 py-3 text-muted small fw-semibold">CATEGORY</th>
                <th className="border-0 py-3 text-muted small fw-semibold">PRICE</th>
                <th className="border-0 py-3 text-muted small fw-semibold">STOCK</th>
                <th className="border-0 py-3 text-muted small fw-semibold">STATUS</th>
                <th className="border-0 py-3 text-muted small fw-semibold">ACTIONS</th>
              </tr>
            </thead>
            <tbody>
                {products.length > 0 ? (
                  products.map((product, index) => (
                    <InventoryTableRow
                      key={product.id}
                      product={product}
                      index={index}
                      onEdit={onEdit}
                      onDelete={onDelete}
                      onDuplicate={onDuplicate}
                      onViewDetails={onViewDetails}
                    />
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="text-center py-5">No products found</td>
                  </tr>
                )}
              </tbody>
          </Table>
        </div>

        {/* Dynamic Pagination */}
        {totalItems > 0 && (
          <div className="d-flex justify-content-between align-items-center p-4 border-top">
            <div className="text-muted small">
              Showing {Math.min((currentPage - 1) * itemsPerPage + 1, totalItems)} to {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems} entries
            </div>
            <Pagination className="mb-0">
              <Pagination.Prev 
                disabled={currentPage === 1} 
                onClick={() => setCurrentPage(prev => prev - 1)} 
              />
              {items}
              <Pagination.Next 
                disabled={currentPage === totalPages} 
                onClick={() => setCurrentPage(prev => prev + 1)} 
              />
            </Pagination>
          </div>
        )}
      </Card.Body>
    </Card>
  );
};

export default InventoryTable;