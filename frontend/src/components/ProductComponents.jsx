// ProductComponents.js
import React from 'react';

export const BrandDropdown = ({ details, selectedBrand, onChange }) => (
  <div>
    <label>Brand:</label>
    <select onChange={onChange} value={selectedBrand}>
      {details.map((detail) => (
        <option key={detail.brand} value={detail.brand}>
          {detail.brand}
        </option>
      ))}
    </select>
  </div>
);

export const QuantityDropdown = ({ financials, selectedQuantity, onChange }) => (
  <div>
    <label>Quantity:</label>
    <select onChange={onChange} value={selectedQuantity}>
      {financials.map((financial, index) => (
        <option key={index} value={financial.quantity}>
          {financial.quantity}
        </option>
      ))}
    </select>
  </div>
);

export const PriceDisplay = ({ selectedQuantity, financials }) => {
  const selectedFinancial = financials.find(
    (financial) => financial.quantity.toString() === selectedQuantity
  );
    
  return (
    <div>
      {selectedQuantity && selectedFinancial && selectedFinancial.Discount > 0 && (
        <span>
          <span>Price:</span> <s>&#x20b9;{selectedFinancial.price}</s> &#x20b9;{selectedFinancial.dprice}
        </span>
      )}
      {selectedQuantity && selectedFinancial && selectedFinancial.Discount <= 0 && (
        <span>
          <span>Price:</span> &#x20b9;{selectedFinancial.price}
        </span>
      )}
      {selectedQuantity && selectedFinancial && selectedFinancial.Discount > 0 && (
        <span className='discount-ribbon'>
          <p>{selectedFinancial.Discount}% off</p>
        </span>
      )}
    </div>
  );
};


