import React from 'react';
import { Card, Table, Alert, Row, Col } from 'react-bootstrap';
import DeliveryDriverRow from './DeliveryDriverRow';
import Delivery from '../../pages/DeliveryManagementPage/Delivery';

const DeliverysDriversTable = ({ 
  deliveries, 
  onStartDelivery, 
  onCompleteDelivery, 
  onNavigate,
  onMarkFailed,
  currentDriver 
}) => {
  const pendingDeliveries = deliveries.filter(d => d.status === 'Assigned').length;
  const inTransitDeliveries = deliveries.filter(d => d.status === 'In Transit').length;

  return (
    <Card className="border-0 shadow-sm">
      <Card.Body className="p-0">
        {/* Alert for in transit deliveries */}
        {inTransitDeliveries > 0 && (
          <Alert variant="primary" className="m-4 mb-0 d-flex align-items-center">
            <i className="bi bi-truck me-2 fs-5"></i>
            <div>
              <strong>In Transit:</strong> You have {inTransitDeliveries} delivery{inTransitDeliveries > 1 ? 's' : ''} in progress. Complete them before starting new ones.
            </div>
          </Alert>
        )}

        {/* Alert for pending deliveries */}
        {pendingDeliveries > 0 && inTransitDeliveries === 0 && (
          <Alert variant="info" className="m-4 mb-0 d-flex align-items-center">
            <i className="bi bi-info-circle me-2 fs-5"></i>
            <div>
              <strong>Ready to Start:</strong> You have {pendingDeliveries} delivery{pendingDeliveries > 1 ? 's' : ''} waiting. Click "Start Delivery" to begin.
            </div>
          </Alert>
        )}

        <div className="table-responsive">
          <Table hover className="mb-0">
            <thead className="bg-light">
              <tr>
                <th className="border-0 px-4 py-3 text-muted small fw-semibold">STOP #</th>
                <th className="border-0 py-3 text-muted small fw-semibold">DELIVERY INFO</th>
                <th className="border-0 py-3 text-muted small fw-semibold">CUSTOMER</th>
                <th className="border-0 py-3 text-muted small fw-semibold">ADDRESS</th>
                <th className="border-0 py-3 text-muted small fw-semibold">SCHEDULE</th>
                <th className="border-0 py-3 text-muted small fw-semibold">STATUS</th>
                <th className="border-0 py-3 text-muted small fw-semibold">ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {deliveries.length > 0 ? (
                deliveries.map((delivery, index) => (
                  <DeliveryDriverRow
                    key={delivery.id}
                    delivery={delivery}
                    stopNumber={index + 1}
                    onStartDelivery={onStartDelivery}
                    onCompleteDelivery={onCompleteDelivery}
                    onNavigate={onNavigate}
                    onMarkFailed={onMarkFailed}
                    currentDriver={currentDriver}
                  />
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center py-5">
                    <i className="bi bi-inbox display-4 text-muted d-block mb-3"></i>
                    <p className="text-muted mb-0">No deliveries assigned</p>
                    <small className="text-muted">Check back later for new assignments.</small>
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </div>

        {/* Summary */}
        {deliveries.length > 0 && (
          <div className="p-4 border-top bg-light">
            <Row>
              <Col>
                <small className="text-muted">
                  Showing {deliveries.length} delivery{deliveries.length !== 1 ? 's' : ''} assigned to you
                </small>
              </Col>
              <Col xs="auto">
                <small className="text-muted">
                  Total Distance: {deliveries.reduce((sum, d) => sum + parseFloat(d.distance), 0).toFixed(1)} km
                </small>
              </Col>
            </Row>
          </div>
        )}
      </Card.Body>
    </Card>
  );
};

export default DeliverysDriversTable;