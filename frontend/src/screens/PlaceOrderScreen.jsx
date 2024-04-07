import React, { useEffect } from 'react';
import {  useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Button, Row, Col, ListGroup, Image, Card } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Message from '../components/Message';
import CheckoutSteps from '../components/CheckoutSteps';
import Loader from '../components/Loader';
import { useCreateOrderMutation } from '../slices/ordersApiSlice';
import { clearCartItems } from '../slices/cartSlice';

const PlaceOrderScreen = () => {
  const navigate = useNavigate();

  const cart = useSelector((state) => state.cart);

  const [createOrder, { isLoading, error }] = useCreateOrderMutation();

  useEffect(() => {
    if (!cart.shippingAddress.address) {
      navigate('/shipping');
    } else if (!cart.paymentMethod) {
      navigate('/payment');
    }
  }, [cart.paymentMethod, cart.shippingAddress.address, navigate]);

  const dispatch = useDispatch();
  const placeOrderHandler = async () => {
    try {
      //  console.log(cart);
      const res = await createOrder({
        orderItems: cart.cartItems,
        shippingAddress: cart.shippingAddress,
        paymentMethod: 'Cash Or UPI',
        itemsPrice: cart.itemsPrice,
        shippingPrice: cart.shippingPrice,
         //taxPrice: cart.taxPrice,
        totalPrice: cart.totalPrice,
      }).unwrap();
      // console.log(res);
      dispatch(clearCartItems());
      navigate(`/order/${res._id}`);
    } catch (err) {
      toast.error(err);
    }
  };

  return (
    <>
      <CheckoutSteps step1 step2 step3 step4 />
      <Row>
        <Col md={8}>
          <ListGroup variant='flush'>
            <ListGroup.Item>
              <h2>Shipping</h2>
              <p>
                <strong>Address:</strong>
                {cart.shippingAddress.address}, {cart.shippingAddress.city}{' '}
                {cart.shippingAddress.postalCode},{' '}
                {cart.shippingAddress.country}
              </p>
            </ListGroup.Item>

            <ListGroup.Item>
              <h2>Payment Method</h2>
              <strong>Method: </strong>
              Cash/UPI On Delivery
            </ListGroup.Item>

            <ListGroup.Item>
              <h2>Order Items</h2>
              {cart.cartItems.length === 0 ? (
                <Message>Your cart is empty</Message>
              ) : (
                <ListGroup variant='flush'>
                  {cart.cartItems.map((item, index) => (
                    <ListGroup.Item key={index}>
                      <Row>
  <Col md={1}><strong>Image</strong></Col>
  <Col md={3}><strong>Name</strong></Col>
  <Col md={3}><strong>Brand</strong></Col>
  <Col md={2}><strong>Weight</strong></Col>
  <Col md={1}><strong>Qty</strong></Col>
  <Col md={2}><strong>Price</strong></Col>
</Row>
                      <Row>
                        <Col md={1}>
                          <Image
                            src={item.image}
                            alt={item.name}
                            fluid
                            rounded
                          />
                        </Col>
                        <Col md={3}>
                          {/* <Link to={`/product/${item.product}`}> */}
                            {item.name}
                          {/* </Link> */}
                        </Col>
                        <Col md={3}>
                          {/* <Link to={`/product/${item.product}`}> */}
                            {item.brand}
                          {/* </Link> */}
                        </Col>
                        <Col md={2}>
                          {item.quantity}
                        </Col>
                        <Col md={1}>
                          {item.qty}
                        </Col>
                       
                        <Col md={2}>
                          
                          {(item.qty * (item.dprice * 100)) / 100}
                        </Col>
                       
                      </Row>
                    </ListGroup.Item>
                    
                  ))}
                              {/* <ListGroup.Item>
      <Button
        type='button'
        className='btn-block'
        onClick={() => window.print()}
      >
        Print Invoice
      </Button>
    </ListGroup.Item> */}
                </ListGroup>
              )}
            </ListGroup.Item>
          </ListGroup>
        </Col>
        <Col md={4}>
          <Card>
            <ListGroup variant='flush'>
              <ListGroup.Item>
                <h2>Order Summary</h2>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Items</Col>
                  <Col> &#x20b9;{cart.itemsPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Shipping</Col>
                  <Col> &#x20b9;{cart.shippingPrice}</Col>
                </Row>
              </ListGroup.Item>
              {/* <ListGroup.Item>
                <Row>
                  <Col>Tax</Col>
                  <Col> &#x20b9;{cart.taxPrice}</Col>
                </Row>
              </ListGroup.Item> */}
              <ListGroup.Item>
                <Row>
                  <Col>Total</Col>
                  <Col> &#x20b9;{cart.totalPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                {error && (
                  <Message variant='danger'>{error.data.message}</Message>
                )}
              </ListGroup.Item>
              <ListGroup.Item>
                <Button
                  type='button'
                  className='btn-block'
                  disabled={cart.cartItems === 0}
                  onClick={placeOrderHandler}
                >
                  Place Order
                </Button>
                {isLoading && <Loader />}
              </ListGroup.Item>
  
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default PlaceOrderScreen;
