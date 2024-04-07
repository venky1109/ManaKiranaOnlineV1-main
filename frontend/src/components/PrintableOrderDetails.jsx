import React from 'react';
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
        <h2>Shipping Details</h2>
        <p>
          <strong>Name: </strong> {order.user.name}
        </p>
        <p>
          <strong>Phone Number: </strong>{' '}
          <a href={`call to:${order.user.phoneNo}`}>{order.user.phoneNo}</a>
        </p>
        <p>
          <strong>Address:</strong> {order.shippingAddress.address},{' '}
          {order.shippingAddress.city} {order.shippingAddress.postalCode},{' '}
          {order.shippingAddress.country}
        </p>

        <h2>Order Items</h2>
        <table className="order-items">
          <thead>
            <tr>
              <th>Name</th>
              <th>Brand</th>
              <th>Quantity</th>
              <th>Qty</th>
              <th>Price</th>
            </tr>
          </thead>
          <tbody>
  {order.orderItems.map((item, index) => (
    <tr key={index}>
      <td>{item.name}</td>
      <td>{item.brand}</td>
      <td>{item.quantity}</td>
      <td>{item.qty}</td>
      <td>&#x20b9;{item.price * item.qty}</td>
    </tr>
  ))}
  <tr>
    <td colSpan="4" align="right"><strong>Total:</strong></td>
    <td>
      <strong>
        &#x20b9;{order.orderItems.reduce((total, item) => total + (item.price * item.qty), 0)}
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
