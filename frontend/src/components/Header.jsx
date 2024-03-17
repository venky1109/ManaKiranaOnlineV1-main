import { useEffect,useRef,useState } from 'react';
import { Navbar, Nav, Container, NavDropdown, Badge } from 'react-bootstrap';
import { FaShoppingBag, FaUserCircle } from 'react-icons/fa';
import { LinkContainer } from 'react-router-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useLogoutMutation } from '../slices/usersApiSlice';
import { logout } from '../slices/authSlice';
import SearchBox from './SearchBox';
import logo from '../assets/LogoManaKirana.png';
import { resetCart } from '../slices/cartSlice';
import './header.css'
import ContactUsBanner from './ContactUsBanner';
// import advertise from '../advertise';
//  import AdvertisingBanner from './Advertise';

const Header = () => {
  const { cartItems } = useSelector((state) => state.cart);
  const { userInfo } = useSelector((state) => state.auth);
  useEffect(() => {
    // Add animation class to each letter
    const brandLetters = document.querySelectorAll('.brand-letter');
    brandLetters.forEach((letter, index) => {
      letter.style.animationDelay = `${index * 150}ms`;
    });
  }, []);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // const banner = advertise.find(item => item.type === "MarketMessageInHeader");

  const [logoutApiCall] = useLogoutMutation();
  const [isNavbarOpen, setNavbarOpen] = useState(false);
  const navbarRef = useRef(null);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (navbarRef.current && !navbarRef.current.contains(event.target)) {
        // Clicked outside the navbar
        setNavbarOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  const handleNavbarToggle = () => {
    setNavbarOpen(!isNavbarOpen);
  };

  const logoutHandler = async () => {
    try {
      await logoutApiCall().unwrap();
      dispatch(logout());
      // NOTE: here we need to reset cart state for when a user logs out so the next
      // user doesn't inherit the previous users cart and shipping
      dispatch(resetCart());
      navigate('/login');
    } catch (err) {
      console.error(err);
    }
  };

  

  return (
    <header>
      <Navbar 
      expand="md" 
      fixed="top" 
       expanded={isNavbarOpen}
        onSelect={() => setNavbarOpen(false)} 
        ref={navbarRef} >
        <Container className="d-flex justify-content-between align-items-center">
        {/* <Navbar.Toggle aria-controls="navbar-nav" onClick={handleNavbarToggle} /> */}
          <LinkContainer to="/">
                <Navbar.Brand >
                    <div className="logo-container">
                    <img className="logo-image" src= {logo}  alt= "ManaKirana logo"/>
                    <span className='brand-name'>
                        {' '}
                        <span className="brand-letter">M</span>
                        <span className="brand-letter">A</span>
                        <span className="brand-letter">N</span>
                        <span className="brand-letter">A</span>
                        {' '}
                        <span className="brand-letter">K</span>
                        <span className="brand-letter">I</span>
                        <span className="brand-letter">R</span>
                        <span className="brand-letter">A</span>
                        <span className="brand-letter">N</span>
                        <span className="brand-letter">A</span>
                      
                        </span>
                    </div>
                </Navbar.Brand>
            </LinkContainer>  
            
            
            <Nav className='ms-auto search-box'>
            <SearchBox />
          </Nav>
          {/* <div >
            <ContactUsBanner className="d-flex contact justify-content-space-around"  /> 
            {/* </Container>   */}
            {/* </div> */} 
            <ContactUsBanner className="contact-us-banner mb-0" />
           
          <Navbar.Toggle className="toggle" aria-controls="navbar-nav" onClick={handleNavbarToggle} />
          <Navbar.Collapse id="navbar-nav" className=" justify-content-center align-items-start">
          
          
    
          {/* <AdvertisingBanner   images={banner.images} height={banner.dimensions.height} width={banner.dimensions.width}/> */}
          <Nav className='ms-auto align-items-right' >
              <LinkContainer to='/cart'>
                <Nav.Link className='compNav'>
                  <FaShoppingBag /> 
                  {cartItems.length > 0 && (
                    <Badge pill bg='success' style={{ marginLeft: '5px' }}>
                      {cartItems.length}
                    </Badge>
                  )}
                </Nav.Link>
              </LinkContainer>
              {userInfo ? (
                <>
                  <NavDropdown title={`Hi ${userInfo.name}`} id='username' >
                    <LinkContainer to='/profile'>
                      <NavDropdown.Item>Profile</NavDropdown.Item>
                    </LinkContainer>
                    <NavDropdown.Item onClick={logoutHandler}>
                      Logout
                    </NavDropdown.Item>
                  </NavDropdown>
                </>
              ) : (
                <LinkContainer to='/login'>
                  <Nav.Link className='compNav'>
                    <FaUserCircle /> 
                  </Nav.Link>
                </LinkContainer>
              )}

              {/* Admin Links */}
              {userInfo && userInfo.isAdmin && (
                <NavDropdown title='Admin' id='adminmenu'>
                  <LinkContainer to='/admin/productlist'>
                    <NavDropdown.Item>Products</NavDropdown.Item>
                  </LinkContainer>
                  <LinkContainer to='/admin/orderlist'>
                    <NavDropdown.Item>Orders</NavDropdown.Item>
                  </LinkContainer>
                  <LinkContainer to='/admin/userlist'>
                    <NavDropdown.Item>Users</NavDropdown.Item>
                  </LinkContainer>
                </NavDropdown>
              )}
           </Nav> 
          </Navbar.Collapse>
        
        </Container>
      </Navbar>
    </header>
  );
};

export default Header;
