import { useState, useEffect } from 'react';
import { Form, Button, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios'; // Import axios to make HTTP requests
import FormContainer from '../components/FormContainer';
import CheckoutSteps from '../components/CheckoutSteps';
import { savePaymentMethod } from '../slices/cartSlice';

const PaymentScreen = () => {
  const navigate = useNavigate();
  const cart = useSelector((state) => state.cart);
  const { shippingAddress, userInfo } = cart;

  useEffect(() => {
    if (!shippingAddress.address) {
      navigate('/shipping');
    }
  }, [navigate, shippingAddress]);

  const [paymentMethod, setPaymentMethod] = useState('UPI');

  const dispatch = useDispatch();

  const submitHandler = async (e) => {
    e.preventDefault();
    dispatch(savePaymentMethod(paymentMethod));

    if (paymentMethod === 'UPI') {
      try {
        // Provide fallback values if userInfo is missing
        const email = userInfo?.email || 'default_email@example.com'; 
        const phone = userInfo?.phone;

        // Make a request to your backend to create a payment session for UPI
        const { data } = await axios.post('/api/payments/session', {
          order_id: 'testing-order-one', // Replace with your actual order ID
          amount: cart.totalPrice, // Replace with the actual amount
          customer_email: email, 
          customer_phone: phone,
          payment_page_client_id: 'your_client_id', // Replace with your HDFC payment page client ID
        });

        // Redirect to the HDFC payment gateway
        window.location.href = data.payment_url; // Redirect to the payment URL received from the backend
      } catch (error) {
        console.error('Error creating UPI payment session:', error.message);
        // Handle error (e.g., show an error message to the user)
      }
    } else {
      navigate('/placeorder');
    }
  };

  return (
    <FormContainer>
      <CheckoutSteps step1 step2 step3 />
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
            {/* <Form.Check
              className='my-2'
              type='radio'
              label='PayPal or Credit Card'
              id='PayPal'
              name='paymentMethod'
              value='PayPal'
              checked={paymentMethod === 'PayPal'}
              onChange={(e) => setPaymentMethod(e.target.value)}
            ></Form.Check> */}
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
