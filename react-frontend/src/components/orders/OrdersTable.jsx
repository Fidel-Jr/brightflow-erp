import React from 'react';
import { Card, Table, Form, Pagination } from 'react-bootstrap';
import OrdersTableRow from './OrdersTableRow';

const OrdersTable = ({ orders,
  onEdit,
  onDelete,
  onViewDetails,
  onStatusUpdate,
  currentPage,
  totalPages,
  setCurrentPage,
  totalItems }) => {
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
                <th className="border-0 py-3 text-muted small fw-semibold">ORDER #</th>
                <th className="border-0 py-3 text-muted small fw-semibold">CUSTOMER</th>
                <th className="border-0 py-3 text-muted small fw-semibold">PRODUCTS</th>
                <th className="border-0 py-3 text-muted small fw-semibold">AMOUNT</th>
                <th className="border-0 py-3 text-muted small fw-semibold">STATUS</th>
                <th className="border-0 py-3 text-muted small fw-semibold">ASSIGNED TO</th>
                <th className="border-0 py-3 text-muted small fw-semibold">DATE</th>
                <th className="border-0 py-3 text-muted small fw-semibold">ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {orders.length > 0 ? (
                orders.map((order) => (
                  <OrdersTableRow
                    key={order.id}
                    order={order}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    onViewDetails={onViewDetails}
                    onStatusUpdate={onStatusUpdate}
                  />
                ))
              ) : (
                <tr>
                  <td colSpan="9" className="text-center py-5">
                    <i className="bi bi-inbox display-4 text-muted d-block mb-3"></i>
                    <p className="text-muted mb-0">No orders found</p>
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </div>

        {/* Pagination */}
        {totalItems > 0 && (
          <div className="d-flex justify-content-between align-items-center p-4 border-top">
            <div className="text-muted small">
              Showing {(currentPage - 1) * 5 + 1} to{" "}
              {Math.min(currentPage * 5, totalItems)} of {totalItems} entries
            </div>

            <Pagination className="mb-0">
              <Pagination.Prev
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
              />

              {[...Array(totalPages)].map((_, index) => (
                <Pagination.Item
                  key={index + 1}
                  active={currentPage === index + 1}
                  onClick={() => setCurrentPage(index + 1)}
                >
                  {index + 1}
                </Pagination.Item>
              ))}

              <Pagination.Next
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(currentPage + 1)}
              />
            </Pagination>
          </div>
        )}
      </Card.Body>
    </Card>
  );
};

export default OrdersTable;