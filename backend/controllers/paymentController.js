import axios from 'axios';
import Order from '../models/orderModel.js';
import Payment from '../models/paymentModel.js';

const apiKey = process.env.HDFC_API_KEY; // Base64 encoded API key
const merchantId = process.env.MERCHANT_ID; // Merchant ID
const customerId = process.env.CUSTOMER_ID; // Customer ID

// Function to create a payment session
export const createPaymentSession = async (req, res) => {
  try {
    const { order_id, amount, customer_email, customer_phone, payment_page_client_id, first_name, last_name } = req.body;

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

    const payload = {
      order_id,
      amount,
      customer_id: req.user._id, // Assuming user ID is used as customer ID
      customer_email,
      customer_phone,
      payment_page_client_id,
      action: 'paymentPage',
      currency: 'INR',
      return_url: 'https://shop.merchant.com', // Replace with your actual return URL
      description: 'Complete your payment',
      first_name,
      last_name,
    };

    const response = await axios.post('https://smartgatewayuat.hdfcbank.com/session', payload, {
      headers: {
        Authorization: `Basic ${apiKey}`,
        'Content-Type': 'application/json',
        'x-merchantid': merchantId,
        'x-customerid': req.user._id, // Assuming user ID is used as customer ID
      },
    });

    // Save payment history in the Payments collection
    const newPayment = new Payment({
      order_id,
      amount,
      customer_id: req.user._id,
      payment_method: req.body.paymentMethod,
      status: 'initiated',
    });

    await newPayment.save();

    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
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
    res.status(500).json({ error: error.message });
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
    res.status(500).json({ error: error.message });
  }
};
