// src/components/user/UserTable.jsx
import React from 'react';
import { Card, Table, Form, Pagination } from 'react-bootstrap';
import UserTableRow from './UserTableRow';

const UserTable = ({ users, currentPage, totalPages, pageSize, setCurrentPage, setPageSize, onEdit, onDelete, onViewDetails, canEdit, canDelete }) => {

  const handlePageSizeChange = (e) => {
    setPageSize(Number(e.target.value));
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

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
                <th className="border-0 py-3 text-muted small fw-semibold">USER</th>
                <th className="border-0 py-3 text-muted small fw-semibold">EMAIL</th>
                <th className="border-0 py-3 text-muted small fw-semibold">ROLE</th>
                <th className="border-0 py-3 text-muted small fw-semibold">STATUS</th>
                <th className="border-0 py-3 text-muted small fw-semibold">LAST LOGIN</th>
                <th className="border-0 py-3 text-muted small fw-semibold">ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {users.length > 0 ? (
                users.map((user, index) => (
                  <UserTableRow
                    key={user.id}
                    user={user}
                    index={(currentPage - 1) * pageSize + index}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    onViewDetails={onViewDetails}
                    canEdit={canEdit}
                    canDelete={canDelete}
                  />
                ))
              ) : (
                <tr>
                  <td colSpan="9" className="text-center py-5">
                    <i className="bi bi-inbox display-4 text-muted d-block mb-3"></i>
                    <p className="text-muted mb-0">No users found</p>
                  </td>
                </tr>
              )}
              {}
            </tbody>
          </Table>
        </div>

        {/* Footer */}
        <div className="d-flex justify-content-between align-items-center p-4 border-top">
          <div className="d-flex align-items-center gap-3">
            <span className="text-muted small">Rows per page</span>
            <Form.Select
              size="sm"
              style={{ width: 90 }}
              value={pageSize}
              onChange={handlePageSizeChange}
            >
              <option value={10}>10</option>
              <option value={15}>15</option>
              <option value={25}>25</option>
            </Form.Select>
            <span className="text-muted small">
              Showing {(currentPage - 1) * pageSize + 1} to{' '}
              {Math.min(currentPage * pageSize, users.length)} of {users.length}
            </span>
          </div>

          <Pagination className="mb-0">
            <Pagination.Prev
              disabled={currentPage === 1}
              onClick={() => handlePageChange(currentPage - 1)}
            />
            {[...Array(totalPages)].map((_, i) => (
              <Pagination.Item
                key={i + 1}
                active={i + 1 === currentPage}
                onClick={() => handlePageChange(i + 1)}
              >
                {i + 1}
              </Pagination.Item>
            ))}
            <Pagination.Next
              disabled={currentPage === totalPages}
              onClick={() => handlePageChange(currentPage + 1)}
            />
          </Pagination>
        </div>
      </Card.Body>
    </Card>
  );
};

export default UserTable;
