import React from 'react';
import { Card, Table, Alert, Row, Col } from 'react-bootstrap';
import WarehouseOrderRow from './WarehouseOrderRow';

const WarehouseOrdersTable = ({ orders, onProcessOrder, onStatusUpdate, onQuickUpdate, currentUser }) => {
  const pendingOrders = orders.filter(o => o.status === 'Pending').length;

  return (
    <Card className="border-0 shadow-sm">
      <Card.Body className="p-0">
        {/* Alert for pending orders */}
        {pendingOrders > 0 && (
          <Alert variant="warning" className="m-4 mb-0 d-flex align-items-center">
            <i className="bi bi-exclamation-triangle-fill me-2 fs-5"></i>
            <div>
              <strong>Action Required:</strong> You have {pendingOrders} pending order{pendingOrders > 1 ? 's' : ''} waiting to be processed.
            </div>
          </Alert>
        )}

        <div className="table-responsive">
          <Table hover className="mb-0">
            <thead className="bg-light">
              <tr>
                <th className="border-0 px-4 py-3 text-muted small fw-semibold">ORDER #</th>
                <th className="border-0 py-3 text-muted small fw-semibold">CUSTOMER</th>
                <th className="border-0 py-3 text-muted small fw-semibold">PRODUCTS</th>
                <th className="border-0 py-3 text-muted small fw-semibold">AMOUNT</th>
                <th className="border-0 py-3 text-muted small fw-semibold">STATUS</th>
                <th className="border-0 py-3 text-muted small fw-semibold">CHECKLIST</th>
                <th className="border-0 py-3 text-muted small fw-semibold">ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {orders.length > 0 ? (
                orders.map((order) => (
                  <WarehouseOrderRow
                    key={order.id}
                    order={order}
                    onProcessOrder={onProcessOrder}
                    onStatusUpdate={onStatusUpdate}
                    onQuickUpdate={onQuickUpdate}
                    currentUser={currentUser}
                  />
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center py-5">
                    <i className="bi bi-inbox display-4 text-muted d-block mb-3"></i>
                    <p className="text-muted mb-0">No orders to process</p>
                    <small className="text-muted">Great job! All orders are up to date.</small>
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </div>

        {/* Summary */}
        {orders.length > 0 && (
          <div className="p-4 border-top bg-light">
            <Row>
              <Col>
                <small className="text-muted">
                  Showing {orders.length} order{orders.length !== 1 ? 's' : ''} assigned to {currentUser.warehouse}
                </small>
              </Col>
            </Row>
          </div>
        )}
      </Card.Body>
    </Card>
  );
};

export default WarehouseOrdersTable;