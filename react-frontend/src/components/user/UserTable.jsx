import React from 'react';
import { Card, Table, Form, Pagination } from 'react-bootstrap';
import UserTableRow from './UserTableRow';

const UserTable = ({ users, onEdit, onDelete }) => {
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
              {users.map((user) => (
                <UserTableRow
                  key={user.id}
                  user={user}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              ))}
            </tbody>
          </Table>
        </div>

        {/* Pagination */}
        <div className="d-flex justify-content-between align-items-center p-4 border-top">
          <div className="text-muted small">
            Showing 1 to {users.length} of {users.length} entries
          </div>
          <Pagination className="mb-0">
            <Pagination.Prev disabled />
            <Pagination.Item active>{1}</Pagination.Item>
            <Pagination.Item>{2}</Pagination.Item>
            <Pagination.Item>{3}</Pagination.Item>
            <Pagination.Next />
          </Pagination>
        </div>
      </Card.Body>
    </Card>
  );
};

export default UserTable;