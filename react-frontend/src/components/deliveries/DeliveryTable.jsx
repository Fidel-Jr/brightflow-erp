import React from 'react';
import { Card, Table, Form, Pagination } from 'react-bootstrap';
import DeliveryTableRow from './DeliveryTableRow';

const DeliveryTable = ({
  deliveries,
  totalCount = 0,
  pageSize = 10,
  currentPage = 1,
  totalPages = 1,
  onPageChange,
  onAssignDriver,
  onUnassignDriver,
  onViewDetails,
  onStatusUpdate,
  onViewOrder
}) => {
  console.log('Deliveries in Table: ', deliveries);

  const start = totalCount === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const end = Math.min(currentPage * pageSize, totalCount);

  const handlePrev = () => {
    if (!onPageChange) return;
    onPageChange(Math.max(1, currentPage - 1));
  };

  const handleNext = () => {
    if (!onPageChange) return;
    onPageChange(Math.min(totalPages, currentPage + 1));
  };

  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);
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
                <th className="border-0 py-3 text-muted small fw-semibold">DELIVERY #</th>
                <th className="border-0 py-3 text-muted small fw-semibold">ORDER #</th>
                <th className="border-0 py-3 text-muted small fw-semibold">CUSTOMER</th>
                <th className="border-0 py-3 text-muted small fw-semibold">DRIVER</th>
                <th className="border-0 py-3 text-muted small fw-semibold">SCHEDULE</th>
                <th className="border-0 py-3 text-muted small fw-semibold">STATUS</th>
                <th className="border-0 py-3 text-muted small fw-semibold">ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {deliveries.length > 0 ? (
                deliveries.map((delivery) => (
                  <DeliveryTableRow
                    key={delivery.id}
                    delivery={delivery}
                    onAssignDriver={onAssignDriver}
                    onUnassignDriver={onUnassignDriver}
                    onViewDetails={onViewDetails}
                    onStatusUpdate={onStatusUpdate}
                    onViewOrder={onViewOrder}
                  />
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="text-center py-5">
                    <i className="bi bi-inbox display-4 text-muted d-block mb-3"></i>
                    <p className="text-muted mb-0">No deliveries found</p>
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </div>

        {/* Pagination */}
        {totalCount > 0 && (
          <div className="d-flex justify-content-between align-items-center p-4 border-top">
            <div className="text-muted small">
              Showing {start} to {end} of {totalCount} entries
            </div>
            <Pagination className="mb-0">
              <Pagination.Prev disabled={currentPage <= 1} onClick={handlePrev} />
              {pageNumbers.map((page) => (
                <Pagination.Item
                  key={page}
                  active={page === currentPage}
                  onClick={() => onPageChange?.(page)}
                >
                  {page}
                </Pagination.Item>
              ))}
              <Pagination.Next disabled={currentPage >= totalPages} onClick={handleNext} />
            </Pagination>
          </div>
        )}
      </Card.Body>
    </Card>
  );
};

export default DeliveryTable;