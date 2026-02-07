import React from 'react';
import { Accordion, Row, Col, Form, Badge } from 'react-bootstrap';

const PermissionAccordion = ({ 
  permissionModules, 
  formData, 
  onPermissionChange 
}) => {
  return (
    <Accordion>
      {permissionModules.map((module, index) => (
        <Accordion.Item key={module.name} eventKey={index.toString()}>
          <Accordion.Header>
            <div className="d-flex align-items-center">
              <i className={`${module.icon} me-2`}></i>
              <span>{module.label}</span>
              <Badge 
                bg="primary" 
                className="bg-opacity-10 ms-2"
              >
                <span className="text-primary">
                  {formData.permissions[module.name]?.length || 0}/{module.actions.length}
                </span>
              </Badge>
            </div>
          </Accordion.Header>
          <Accordion.Body>
            <Row>
              {module.actions.map(action => (
                <Col xs={6} key={action} className="mb-2">
                  <Form.Check
                    type="checkbox"
                    id={`${module.name}-${action}`}
                    label={action.charAt(0).toUpperCase() + action.slice(1)}
                    checked={formData.permissions[module.name]?.includes(action)}
                    onChange={() => onPermissionChange(module.name, action)}
                  />
                </Col>
              ))}
            </Row>
          </Accordion.Body>
        </Accordion.Item>
      ))}
    </Accordion>
  );
};

export default PermissionAccordion;