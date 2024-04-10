import React from 'react';
import logo from '../assets/ManaKiranaLogoWithName.png';
// import { Button } from 'react-bootstrap';

const PrintableOrderDetails = ({ order }) => {
//   const printContent = () => {
//     const printableContent = document.getElementById('printable-content');
//     const originalContent = document.body.innerHTML;
//     document.body.innerHTML = printableContent.innerHTML;
//     window.print();
//     document.body.innerHTML = originalContent;
//   };

  return (
    <>
     
      <div id="printable-content">
      <div className="invoice-header" style={{ display: 'flex', alignItems: 'center' }}>
  <img src={logo} alt="Mana Kirana Logo" className="logo" width="50" height="45" />
  <div className="invoice-header" style={{ textAlign: 'right' }}>
  <h2 className="invoice-title" style={{ margin: '0', padding: '0' }}>Mana Kirana</h2>
  <p style={{ fontSize: '16px', margin: '0', padding: '0' }}><i><u>manakirana.online</u></i></p>
</div>


  </div>
        <h4>InvoiceNumber:{order._id}</h4>
      
        <h3 style={{ margin: '0', padding: '0' }}><u>Shipping Details</u></h3>
        <p style={{ margin: '0', padding: '0' }}>
          <strong>Name: </strong> {order.user.name}
        </p>
        <p style={{ margin: '0', padding: '0' }}>
          <strong>Phone Number: </strong>{' '}
          <a href={`call to:${order.user.phoneNo}`}>{order.user.phoneNo}</a>
        </p>
        <p style={{ margin: '0', padding: '0' }}>
          <strong>Address:</strong> {order.shippingAddress.address},{' '}
          {order.shippingAddress.city} {order.shippingAddress.postalCode},{' '}
          {order.shippingAddress.country}
        </p>

        <h3 style={{ marginBottom: '0', paddingBottom: '0' }}><u>Order Items</u></h3>
        <table className="order-items">
          <thead>
            <tr align="left">
              <th>Name</th>
              <th>ITEM TYPE/Brand Name</th>
              <th>WEIGHT</th>
              <th>Qty</th>
              <th>RATE</th>
              <th>Price</th>
            </tr>
          </thead>
          <tbody>
  {order.orderItems.map((item, index) => (
    <tr key={index}>
      <td>{item.name}</td>
      <td>{item.brand}</td>
      {/* <td>{item.quantity}</td> */}
      <td>{item.quantity > 30 ?  `${item.quantity} grams`:`${item.quantity}` }</td>
      <td>{item.qty}</td>
      <td>{item.qty} x &#x20b9;{item.price} </td>
      <td>&#x20b9;{item.price * item.qty}</td>
    </tr>
  ))}
  <tr>
    <td colSpan="5" align="right"><strong>Total:</strong></td>
    <td>
      <strong>
      &#x20b9;{Math.round(order.orderItems.reduce((total, item) => total + (item.price * item.qty), 0))}
      </strong>
    </td>
  </tr>
</tbody>

        </table>
      </div>
    </>
  );
};

export default PrintableOrderDetails;
