import { Container, Row } from "react-bootstrap";
import Menu from "./Menu"; // Menu Component for navigation

// The Header Component Function
function Header(props) {
  return (
    <Container className="header text-center">
      <Row>
        <h1>Search Apple iTunes for Your Favourite Artists</h1>
      </Row>
      <Row>
        <Menu></Menu>
      </Row>
    </Container>
  );
}

export default Header;
