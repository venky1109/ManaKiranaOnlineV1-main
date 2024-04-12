import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Row,
  Col,
  ListGroup,
  Image,
  Form,
  Button,
  Card,
} from 'react-bootstrap';
import { FaTrash } from 'react-icons/fa';
import Message from '../components/Message';
import { addToCart, removeFromCart } from '../slices/cartSlice';


const CartScreen = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const cart = useSelector((state) => state.cart);
  const { cartItems } = cart;

  // NOTE: no need for an async function here as we are not awaiting the
  // resolution of a Promise
  const addToCartHandler = (product, qty) => {
    dispatch(addToCart({ ...product, qty }));
  };

  // const removeFromCartHandler = (id) => {
  //   dispatch(removeFromCart(id));
  // };
  const removeFromCartHandler = (productId, brand, quantity) => {
    dispatch(removeFromCart({ productId, brand, quantity }));
  };

  const checkoutHandler = () => {
    navigate('/login?redirect=/shipping');
  };
  const getFormattedQuantity = (quantity) => {
    
  
    if (!isNaN(quantity)) {
      if (quantity > 30) {
        return `${quantity} grams`;
        } else {
        return `${quantity} Kg`;
      }
    }
  }
  return (
    <Row>
      <Col md={8}>
 
          <Link variant='outline-success' className='btn  btn-outline-success  p-1 my-2' to='/'>
            Go Back
          </Link>
        <h5 style={{ marginBottom: '0.25em' }}>Shopping Cart </h5>
        {cartItems.length === 0 ? (
          <Message>
            Your cart is empty 
            {/* <Link to='/'>Go Back</Link> */}
          </Message>
        ) : (
          
          <ListGroup variant='flush'>
            {cartItems.map((item) => (
              <ListGroup.Item key={item.productId}>
                <Row >
                  <Col md={1}>
                    <Image src={item.image} alt={item.name} fluid rounded />
                  </Col>
                  <Col md={4}>
                    <Link to={`/product/${item.productId}`} style={{color:'forestgreen', textDecoration:"none", fontWeight:"600" }}>{item.name}</Link>
                    <br /><span>(<s>&#x20b9;{item.price}</s>  <b>&#x20b9;{item.dprice}</b> per pack)</span>
                  </Col>
                  <Col md={2}>{getFormattedQuantity(item.quantity)}</Col>
                  <Col md={3}><s> &#x20b9; {item.price * item.qty }</s>  <b>&#x20b9;{item.dprice * item.qty }</b><br /> (&#x20b9;{item.dprice} x {item.qty } ) </Col>
                  <Col md={1}>
                    <Form.Control
                      as='select'
                      value={item.qty}
                      onChange={(e) =>
                        addToCartHandler(item, Number(e.target.value))
                      }
                    >
                      {[...Array(item.countInStock).keys()].map((x) => (
                        <option key={x + 1} value={x + 1}>
                          {x + 1}
                        </option>
                      ))}
                    </Form.Control>
                  </Col>
                  <Col md={1}>
                    <Button
                      type='button'
                      variant='light'
                      onClick={() => removeFromCartHandler(item.productId,item.brand,item.quantity)}
                    >
                      <FaTrash />
                    </Button>
                  </Col>
                </Row>
              </ListGroup.Item>
            ))}
          </ListGroup>
        )}
      </Col>
      <Col md={4} >
        <Card>
          <ListGroup variant='flush'>
            <ListGroup.Item>
              <h5>
                Subtotal of ({cartItems.length})
                items : &#x20b9; {cartItems
                .reduce((acc, item) => acc +  (item.dprice * item.qty), 0)
                .toFixed(2)}
              </h5>
              
            
                
            </ListGroup.Item>
            <ListGroup.Item>
              <Button
                type='button'
                // className='btn-block'
                variant='outline-success' 
                className='btn  btn-success mx-5'
                disabled={cartItems.length === 0}
                onClick={checkoutHandler}
              >
                Proceed To Checkout
              </Button>
            </ListGroup.Item>
          </ListGroup>
        </Card>
      </Col>
    </Row>
    
  );
};

export default CartScreen;
