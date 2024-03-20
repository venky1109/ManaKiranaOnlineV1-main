import {Container, Row, Col ,Nav } from "react-bootstrap"
import { TiSocialFacebook , TiSocialInstagram , TiSocialYoutubeCircular } from "react-icons/ti";
import { FaSquareXTwitter } from "react-icons/fa6";
import './footer.css'

const Footer = () => {
    const currentYear = new Date().getFullYear();
  return (
    <footer className="footer">
    <Container>
      <Row>
        <Col md={3}>
          <h6>About Us</h6>
          <p>We are team of aspirants with a mission to deliver fresh and finest products 
            to  your doorstep , ensuring  timely and reliable service.With a diverse range of items over phone call , whatsapp message , user-friendly online platform, 
            and a commitment to customer satisfaction , we make grocery shopping a breeze.</p>
        </Col>
        <Col md={3}>
          <h6>Contact Us</h6>
          <p id="ul">Email: customercare@manakirana.online</p>
          <p id="ul">Phone: 8121774325</p>
        </Col>
        <Col md={3}>
          <h6>Quick Links</h6>
          <ul className="list-unstyled">
            <li><a href="/">Home</a></li>
            <li><a href="/">Products</a></li>
            <li><a href="/cart">Cart</a></li>
           
            {/* <li><a href="/contact">Contact</a></li> */}
          </ul>
        </Col>
        <Col md={3}>
          <h6>Follow Us</h6>
          {/* Add social media icons or links here */}
          <Nav>
          
          <Nav.Link  className="social-icon"  href="https://www.facebook.com/profile.php?id=61557084347066" target="_blank"><TiSocialFacebook /></Nav.Link>
          <Nav.Link  className="social-icon"  href="https://www.instagram.com/manakirana8/" target="_blank"><TiSocialInstagram /></Nav.Link>
          <Nav.Link  className="social-icon"  href="https://www.youtube.com" target="_blank"><TiSocialYoutubeCircular /></Nav.Link>
          <Nav.Link className="social-icon"  href="https://twitter.com/manakirana8" target="_blank"><FaSquareXTwitter/></Nav.Link>
          
          </Nav>
          
        </Col>
      </Row>
      <hr className="my-4" />
      <p className="text-center">&copy; {currentYear} ManaKirana</p>
    </Container>
  </footer>

  )
}

export default Footer