import { useDispatch, useSelector } from 'react-redux';
import { Link ,useNavigate } from 'react-router-dom';
import { FaTrash } from 'react-icons/fa';
import { addToCart, removeFromCart } from '../slices/cartSlice';
import {
    Row,
    Col,
    ListGroup,
    Image,
    Form,
    Button,
  
  } from 'react-bootstrap';
  

const Cart = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const cart = useSelector((state) => state.cart);
    const { cartItems } = cart;
    const addToCartHandler = (product, qty) => {
        dispatch(addToCart({ ...product, qty }));
      };
      const removeFromCartHandler = (id) => {
        dispatch(removeFromCart(id));
      };
  const getFormattedQuantity = (quantity) => {
    if (!isNaN(quantity)) {
      if (quantity >= 0 && quantity <= 50) {
        return `${quantity} Kg`;
      } else {
        return `${quantity} grams`;
      }
    }
  }
  const checkoutHandler = () => {
    navigate('/login?redirect=/shipping');
  };
  return (
    
    <><ListGroup variant='flush'>
          <p style={{ color: 'forestgreen', textDecoration: "none", fontSize: '2rem', fontWeight: "600" }}> Cart Items</p>
          {cartItems.map((item) => (
              <ListGroup.Item key={item.productId}>
                  <Row>
                      <Col md={3}>
                          <Image src={item.image} alt={item.name} fluid rounded />
                      </Col>
                      <Col md={9}>
                          <Row>
                              <Col md={8} style={{ textAlign: 'left', fontSize: '1.5rem' }}>
                                  <Link to={`/product/${item.productId}`} style={{ color: 'forestgreen', textDecoration: "none", fontWeight: "600" }}>{item.name}</Link>
                              </Col>
                              <Col md={4} style={{ textAlign: 'right', fontSize: '1rem' }}>
                                  {getFormattedQuantity(item.quantity)}
                              </Col>

                              <Col md={10} style={{ textAlign: 'left', fontSize: '1rem' }}>
                                  Per Pack <s style={{ textAlign: 'left', fontSize: '0.75rem' }}>  &#x20b9; {item.price.toFixed(2)}</s>  &#x20b9;{item.dprice.toFixed(2)}
                              </Col>
                              <Col md={2}>
                                  <Button
                                      type='button'
                                      variant='light'
                                      onClick={() => removeFromCartHandler(item.productId)}
                                  >
                                      <FaTrash />
                                  </Button>
                              </Col>
                              <Col md={2}>
                                  <div>
                                      Packs
                                      <Form.Control
                                          as='select'
                                          value={item.qty}
                                          onChange={(e) => addToCartHandler(item, Number(e.target.value))}
                                          style={{ textAlign: 'center', fontSize: '0.75rem' }}
                                      >
                                          {[...Array(item.countInStock).keys()].map((x) => (
                                              <option key={x + 1} value={x + 1}>
                                                  {x + 1}
                                              </option>
                                          ))}
                                      </Form.Control>
                                  </div>
                              </Col>

                              <Col md={10} style={{ textAlign: 'right', fontSize: '1.25rem' }}>
                                  <p style={{ textAlign: 'right', fontSize: '0.75rem', display: 'inline' }}> &#x20b9;{item.dprice.toFixed(2)} x {item.qty}= </p>    &#x20b9;{(item.dprice * item.qty).toFixed(2)}
                              </Col>


                          </Row>
                      </Col>

                  </Row>
              </ListGroup.Item>
          ))}
      </ListGroup>
      <div >
    
    
          <ListGroup variant='flush'>
          <Col md={12} style={{ borderTop:'2px solid grey',borderBottom:'2px solid grey'}} >
            <ListGroup.Item>
              <h5  style={{ textAlign: 'right', fontSize: '2rem' }}>
               <p style={{ textAlign: 'right', fontSize: '1.5rem', display:'inline'}}> Subtotal of ({cartItems.length})
                items :</p> &#x20b9; {cartItems
                .reduce((acc, item) => acc +  (item.dprice * item.qty), 0)
                .toFixed(2)}
              </h5>    
            </ListGroup.Item>
            </Col>
            <Col md={12}  >
            <ListGroup.Item >
              <Button
              style={{ textAlign: 'right', fontSize: '1.5rem' }} 
                type='button'
                // className='btn-block'
                variant='outline-success' 
                
                disabled={cartItems.length === 0}
                onClick={checkoutHandler}
                
              >
                Checkout
              </Button>
            </ListGroup.Item>
            </Col>
          </ListGroup>
       
      
          </div></>
          
  )
}

export default Cart