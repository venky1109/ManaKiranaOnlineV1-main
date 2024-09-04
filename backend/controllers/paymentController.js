import axios from 'axios';
import Order from '../models/orderModel.js';
import Payment from '../models/paymentModel.js';
import { jwtEncryptRequest  } from '../utils/encryptionUtils.js'; // Import encryption utility

// Load environment variables
const apiKey = process.env.HDFC_API_KEY; // Base64 encoded API key
const merchantId = process.env.MERCHANT_ID; // Merchant ID
const customerId = process.env.CUSTOMER_ID; // Customer ID
const privateKeyString = process.env.PRIVATE_KEY; // Load private key from environment variable
const publicString=process.env.PUBLIC_KEY;
const keyId = process.env.KEY_ID; // Load key ID from environment variable

// Function to create a payment session
export const createPaymentSession = async (req, res) => {
  try {
    const { order_id, amount, customer_email, customer_phone, name } = req.body;
    
        // console.log(req.body.orderItems)
    // Create a new order in the Orders collection
    const newOrder = new Order({
      order_id,
      user: req.user._id, // Assuming the user is authenticated and available in req.user
      orderItems: req.body.orderItems, // Assuming orderItems are sent in the body
      shippingAddress: req.body.shippingAddress,
      paymentMethod: req.body.paymentMethod,
      itemsPrice: req.body.itemsPrice,
      shippingPrice: req.body.shippingPrice,
      totalPrice: amount,
      customer_email,
      customer_phone,
      status: 'pending',
    });

    await newOrder.save();

    // Set expiry time to 1 hour from current time
    // const currentTime = new Date(); // Current time in UTC
    // const expiryTime = new Date(currentTime.getTime() + 60 * 60 * 1000); // Set expiry to 1 hour from now

    const payload = {
        "order_id": order_id,
        "amount": amount,
        "customer_id": customerId, // Use a specific customer ID for HDFC API
        "customer_email": customer_email,
        "customer_phone": customer_phone,
        "payment_page_client_id": "hdfcmaster",
        "action": "paymentPage",
        "return_url": "https://manakirana.online", // Replace with your actual return URL
        "description": "Complete your payment",
        "name": name,
        "metadata.JUSPAY:gateway_reference_id": "payu_test"
      };



      console.log('Payload before encryption:', JSON.stringify(payload, null, 2)); // Pretty-print the payload

    // Encrypt the payload using the utility function
    const encryptedPayload = await jwtEncryptRequest(payload, keyId, publicString,privateKeyString);
    console.log(encryptedPayload)

    // Call HDFC API to create a payment session with the encrypted payload
    const response = await axios.post('https://smartgatewayuat.hdfcbank.com/session', encryptedPayload, {
      headers: {
        Authorization: `Basic ${apiKey}`,
        'Content-Type': 'application/json',
        'x-merchantid': merchantId,
        'x-customerid': customerId,
      },
    });

    // Extract the payment URL and expiry time from the response
    const paymentUrl = response.data.payment_links?.web;
    const receivedExpiryTime = response.data.payment_links?.expiry; // Capture the expiry time

    if (!paymentUrl) {
      throw new Error('Payment URL not found in the response');
    }

    // Save payment history in the Payments collection
    const newPayment = new Payment({
      order_id,
      amount,
      customer_id: req.user._id,
      payment_method: req.body.paymentMethod,
      status: 'initiated',
    });

    await newPayment.save();

    // Send the payment URL to the frontend
    res.json({ paymentUrl });
  } catch (error) {
    // Log detailed error information
    console.error('Error creating payment session:', error.response ? error.response.data : error.message);
    res.status(500).json({ error: error.response ? error.response.data : 'Failed to create payment session' });
  }
};

// Function to get order status
export const getOrderStatus = async (req, res) => {
  try {
    const { order_id } = req.params;

    const response = await axios.get(`https://smartgatewayuat.hdfcbank.com/orders/${order_id}`, {
      headers: {
        Authorization: `Basic ${apiKey}`,
        version: '2023-06-30',
        'Content-Type': 'application/x-www-form-urlencoded',
        'x-merchantid': merchantId,
        'x-customerid': customerId,
      },
    });

    // Update the order status in the Orders collection
    await Order.findOneAndUpdate(
      { order_id },
      { status: response.data.status === 'CHARGED' ? 'success' : 'failed' }
    );

    res.json(response.data);
  } catch (error) {
    console.error('Error fetching order status:', error.response ? error.response.data : error.message);
    res.status(500).json({ error: error.response ? error.response.data : 'Failed to fetch order status' });
  }
};

// Function to refund an order
export const refundOrder = async (req, res) => {
  try {
    const { order_id } = req.params;
    const { unique_request_id, amount } = req.body;

    const response = await axios.post(`https://smartgatewayuat.hdfcbank.com/orders/${order_id}/refunds`, {
      unique_request_id,
      amount,
    }, {
      headers: {
        Authorization: `Basic ${apiKey}`,
        'Content-Type': 'application/x-www-form-urlencoded',
        'x-merchantid': merchantId,
        'x-customerid': customerId,
      },
    });

    // Save refund details in the Payments collection
    await Payment.findOneAndUpdate(
      { order_id },
      { status: 'refunded', transaction_id: response.data.txn_id }
    );

    res.json(response.data);
  } catch (error) {
    console.error('Error processing refund:', error.response ? error.response.data : error.message);
    res.status(500).json({ error: error.response ? error.response.data : 'Failed to process refund' });
  }
};
