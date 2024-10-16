import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import '../App.css'; // Make sure your CSS is imported

function Header() {
  return (
    <Navbar collapseOnSelect expand="lg" className="bg-blue">
      <Container>
        <Navbar.Brand href="/" className="navbar-brand">Smart Soil Monitoring System</Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" className="navbar-toggler" />
        <Navbar.Collapse id="responsive-navbar-nav">


        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Header;
