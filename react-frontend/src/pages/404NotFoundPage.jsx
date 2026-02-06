import { Container, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

function NotFound() {
  const navigate = useNavigate();

  return (
    <Container
      fluid
      className="d-flex align-items-center justify-content-center vh-100 bg-light"
    >
      <div className="text-center p-4">
        <h1 className="display-1 fw-bold text-danger">404</h1>

        <h4 className="fw-semibold mt-3">Page not found</h4>

        <p className="text-muted mt-2" style={{ maxWidth: "420px" }}>
          The page you’re looking for doesn’t exist or you don’t have
          permission to access it.
        </p>

        <div className="d-flex justify-content-center gap-3 mt-4">
          <Button variant="primary" onClick={() => navigate("/")}>
            Go to Login
          </Button>

          <Button variant="outline-secondary" onClick={() => navigate(-1)}>
            Go Back
          </Button>
        </div>
      </div>
    </Container>
  );
};

export default NotFound;
