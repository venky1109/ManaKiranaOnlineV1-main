import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Button, Row, Col, ListGroup, Card } from 'react-bootstrap';
import { useGetOrderDetailsQuery } from '../slices/ordersApiSlice';
import Loader from '../components/Loader';
import Message from '../components/Message';
import { clearCartItems } from '../slices/cartSlice';
import { resetOrderDetails  } from '../slices/orderSlice'; // Import action to clear order details
import CheckoutSteps from '../components/CheckoutSteps';

const ConfirmOrderScreen = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const orderId = queryParams.get('orderId');
  const paymentStatus = queryParams.get('status');

  const { data: order, isLoading, error } = useGetOrderDetailsQuery(orderId);

  useEffect(() => {
    if (paymentStatus === 'success') {
      dispatch(clearCartItems());
      dispatch(resetOrderDetails()); // Clear order details
    } else if (paymentStatus === 'failure') {
      navigate('/payment');
    }
  }, [dispatch, navigate, paymentStatus]);

  if (isLoading) return <Loader />;
  if (error) return <Message variant='danger'>{error.data.message}</Message>;

  return (
    <>
      <CheckoutSteps step1 step2 step3 step4 step5 />
      <Row>
        <Col md={8}>
          <ListGroup variant='flush'>
            <ListGroup.Item>
              <h2>Order Confirmation</h2>
              {paymentStatus === 'success' ? (
                <Message variant='success'>
                  Your payment was successful, and your order has been placed.
                </Message>
              ) : (
                <Message variant='danger'>Payment failed. Please try again.</Message>
              )}
            </ListGroup.Item>
            {/* Order Details */}
            <ListGroup.Item>
              <h2>Order Details</h2>
              <p>
                <strong>Order ID:</strong> {order._id}
              </p>
              <p>
                <strong>Items:</strong> {order.orderItems.length} items
              </p>
            </ListGroup.Item>
            {/* Shipping Information */}
            <ListGroup.Item>
              <h2>Shipping</h2>
              <p>
                <strong>Address:</strong> {order.shippingAddress.address},{' '}
                {order.shippingAddress.city} {order.shippingAddress.postalCode},{' '}
                {order.shippingAddress.country}
              </p>
            </ListGroup.Item>
          </ListGroup>
        </Col>
        <Col md={4}>
          <Card>
            <ListGroup variant='flush'>
              <ListGroup.Item>
                <h2>Order Summary</h2>
                <Row>
                  <Col>Items</Col>
                  <Col>&#x20b9;{order.itemsPrice}</Col>
                </Row>
                <Row>
                  <Col>Shipping</Col>
                  <Col>&#x20b9;{order.shippingPrice}</Col>
                </Row>
                <Row>
                  <Col>Total</Col>
                  <Col>&#x20b9;{order.totalPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Button onClick={() => navigate('/')} variant='primary'>
                  Continue Shopping
                </Button>
              </ListGroup.Item>
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default ConfirmOrderScreen;
