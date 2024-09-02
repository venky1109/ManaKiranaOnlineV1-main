import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
  order_id: { type: String, required: true },
  amount: { type: Number, required: true },
  customer_id: { type: String, required: true },
  payment_method: { type: String, required: true },
  status: { type: String, enum: ['initiated', 'completed', 'failed', 'refunded'], default: 'initiated' },
  transaction_id: { type: String },
  createdAt: { type: Date, default: Date.now },
});

const Payment = mongoose.model('Payment', paymentSchema);

export default Payment; // Use default export for the Payment model
