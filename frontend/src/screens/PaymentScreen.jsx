import React, { useState, useEffect } from 'react';
import { Form, Button, Col } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import FormContainer from '../components/FormContainer';
import CheckoutSteps from '../components/CheckoutSteps';
import { savePaymentMethod } from '../slices/cartSlice';
import { clearCartItems } from '../slices/cartSlice'; // Import clearCartItems action

const PaymentScreen = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
//   const location = useLocation();

  const cart = useSelector((state) => state.cart);
  const userInfo = useSelector((state) => state.auth.userInfo);
  const orderInfo = useSelector((state) => state.order); // Access order details from Redux

  console.log(cart)
  console.log('userInfo'+userInfo.name)
  console.log('orderInfo'+JSON.stringify(orderInfo.orderItems, null, 2))


  const { shippingAddress, totalPrice } = cart;

  const orderId = orderInfo?.orderId;
//   const orderItems = orderInfo?.orderItems || [];


      // Map the order items to match the backend structure
      const orderItems = orderInfo.orderItems.map((item) => ({
        product: item.productId, // Use `product` for the product ID as expected
        name: item.name,
        quantity: item.quantity, // Ensure this matches the expected field
        brand: item.brand,
        qty: item.qty,
        image: item.image,
        price: item.price,
      }));

  useEffect(() => {
    if (!shippingAddress.address) {
      navigate('/shipping');
    }
  }, [navigate, shippingAddress]);

  const [paymentMethod, setPaymentMethod] = useState('UPI');

  const submitHandler = async (e) => {
    e.preventDefault();
    dispatch(savePaymentMethod(paymentMethod));

    if (paymentMethod === 'UPI') {
      try {
        const email = userInfo?.email || 'default_email@example.com'; 
        
        const { data } = await axios.post('/api/payments/create-session', {
            order_id: orderInfo.orderId, // Replace with your actual order ID
            amount: totalPrice, // Ensure totalPrice is defined in the cart state
            customer_email: email, 
            customer_phone: userInfo.phoneNo,
            user:userInfo._id,
            name: userInfo?.name || 'John', // Replace with actual first name
            orderItems:orderItems, // Pass order items
            shippingAddress:shippingAddress, // Pass shipping address
            paymentMethod:paymentMethod, // Pass payment method
          });
  

        const paymentUrl = data.paymentUrl;

        if (!paymentUrl) {
          console.error('Payment URL not received from the server');
          return;
        }

        window.location.href = `${paymentUrl}&returnUrl=${encodeURIComponent(
          `${window.location.origin}/confirm-order?orderId=${orderId}&status=success`
        )}`;
      } catch (error) {
        console.error('Error creating UPI payment session:', error.message);
      }
    } else {
      // Simulate payment success for Cash/UPI Payment On Delivery
      dispatch(clearCartItems()); // Clear the cart
      navigate(`/confirm-order?orderId=${orderId}&status=success`);
    }
  };

  return (
    <FormContainer>
      <CheckoutSteps step1 step2 step3 step4 />
      <h1>Payment Method</h1>
      <Form onSubmit={submitHandler}>
        <Form.Group>
          <Form.Label as='legend'>Select Method</Form.Label>
          <Col>
            <Form.Check
              className='my-2'
              type='radio'
              label='Cash/UPI Payment On Delivery'
              id='CashOnDelivery'
              name='paymentMethod'
              value='CashOnDelivery'
              checked={paymentMethod === 'CashOnDelivery'}
              onChange={(e) => setPaymentMethod(e.target.value)}
            ></Form.Check>
            <Form.Check
              className='my-2'
              type='radio'
              label='UPI Payment'
              id='UPI'
              name='paymentMethod'
              value='UPI'
              checked={paymentMethod === 'UPI'}
              onChange={(e) => setPaymentMethod(e.target.value)}
            ></Form.Check>
          </Col>
        </Form.Group>

        <Button type='submit' variant='primary'>
          Continue
        </Button>
      </Form>
    </FormContainer>
  );
};

export default PaymentScreen;
