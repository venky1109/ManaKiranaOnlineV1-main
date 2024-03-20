/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { addToCart } from '../slices/cartSlice';
import { Link } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import { FaShoppingBag } from 'react-icons/fa';
// import { useNavigate  } from 'react-router-dom';
import Cart from './Cart'


import './product.css';

const Product = ({ product,keyword}) => {
  // console.log(product.details.brand );
  const [selectedBrand, setSelectedBrand] = useState('');
  const [selectedQuantity, setSelectedQuantity] = useState('');
  const [selectedQty, setSelectedQty] = useState(1);
  const [isAddedToCart, setIsAddedToCart] = useState(false);
   
  const dispatch = useDispatch();
  // const navigate = useNavigate();
  const scrollContainersRef = useRef([]);
  
  useEffect(() => {
    // console.log('Running useEffect');
    // Set the default selected brand and quantity when the component mounts
    let newSelectedBrand = '';
    let newSelectedQuantity = '';
    
    if (keyword) {
        const searchSelectedBrand = product.details.filter(detail =>
            detail.brand.toLowerCase().includes(keyword.toLowerCase())
        );
  
        if (searchSelectedBrand.length > 0) {
            const brand = searchSelectedBrand[0].brand;
            const qty = maxDiscountQuanty(brand);
            newSelectedBrand = brand;
            newSelectedQuantity = qty.toString();
            // console.log('Selected brand from search:', brand);
        } else {
            newSelectedBrand = getBrandWithHighestDiscount();
            const qty = maxDiscountQuanty(newSelectedBrand);
            newSelectedQuantity = qty.toString();
            // console.log('Selected brand with highest discount:', newSelectedBrand);
        }
    } else {
        newSelectedBrand = getBrandWithHighestDiscount();
        const qty = maxDiscountQuanty(newSelectedBrand);
        newSelectedQuantity = qty.toString();
        // console.log('Selected brand with highest discount:', newSelectedBrand);
    }
  
    setSelectedBrand(newSelectedBrand);
    setSelectedQuantity(newSelectedQuantity);
  }, [keyword, product.details]);
  

  const maxDiscountQuanty = (brand) => {
    const brandDetails = product.details.filter((detail) => detail.brand === brand);
    const maxDiscountqty = brandDetails.reduce((max, detail) => {
      const detailMaxDiscount = detail.financials.reduce(
        (max, financial) => Math.max(max, parseFloat(financial.quantity)),
        0
      );
      return Math.max(max, detailMaxDiscount);
    }, 0);
    return maxDiscountqty;
  };
  const getFormattedQuantity = (quantity) => {
    
  
    if (!isNaN(quantity)) {
      if (quantity >= 0 && quantity <= 50) {
        return `${quantity} Kg`;
      } else {
        return `${quantity} grams`;
      }
    }
  
    return 'N/A';
  };
  
  const handleScroll = (scrollDirection, index) => {
    // console.log('scrollContainersRef.current:', scrollContainersRef.current);
    // console.log('index:', index);
  
    const scrollContainer = scrollContainersRef.current[index];
    // console.log('scrollContainer:', scrollContainer);

    if (scrollContainer) {
      const containerWidth = scrollContainer.clientWidth;
      const scrollPosition = scrollContainer.scrollLeft;

      if (scrollDirection === 'left') {
        scrollContainer.scrollTo({
          left: Math.max(0, scrollPosition - containerWidth),
          behavior: 'smooth',
        });
      } else if (scrollDirection === 'right') {
        scrollContainer.scrollTo({
          left: scrollPosition + containerWidth,
          behavior: 'smooth',
        });
      }
    }
  };

  const getBrandWithHighestDiscount = () => {
    let maxDiscount = 0;
    let brandWithMaxDiscount = '';

    product.details.forEach((detail) => {
      const brandMaxDiscount = calculateMaxDiscount(detail.brand);
      if (brandMaxDiscount > maxDiscount) {
        maxDiscount = brandMaxDiscount;
        brandWithMaxDiscount = detail.brand;
      }
    });

    return brandWithMaxDiscount;
  };

  const calculateMaxDiscount = (brand) => {
    const brandDetails = product.details.filter((detail) => detail.brand === brand);
    const maxDiscount = brandDetails.reduce((max, detail) => {
      const detailMaxDiscount = detail.financials.reduce(
        (max, financial) => Math.max(max, parseFloat(financial.Discount)),
        0
      );
      return Math.max(max, detailMaxDiscount);
    }, 0);
    return maxDiscount;
  };

  const handleBrandChange = (event) => {
    const newBrand = event.target.value;
    setSelectedBrand(newBrand);

    const qty = maxDiscountQuanty(newBrand);
    setSelectedQuantity(qty.toString());

    setIsAddedToCart(false);
  };

  const handleQuantityChange = (event) => {
    setSelectedQuantity(event.target.value);
    setIsAddedToCart(false);
  };

  const handleQtyChange = (newQty) => {
    if (newQty >= 1 && newQty <= 9 ) {
        setSelectedQty(newQty);
        setIsAddedToCart(false);
    }
};

    const addToCartHandler = () => {
      setIsAddedToCart(true);
      setTimeout(() => {
        setIsAddedToCart(false);
      }, 5000);
      const selectedDetail = product.details.find((detail) => detail.brand === selectedBrand);
      const selectedFinancial = selectedDetail.financials.find(
        (financial) => financial.quantity.toString() === selectedQuantity
      );
      
  
      dispatch(addToCart({
        name:product.name,
        productId:product._id,
        category:product.category,
        brand: selectedBrand,
        quantity: selectedQuantity,
        price: selectedFinancial.price,
        dprice: selectedFinancial.dprice,
        Discount: selectedFinancial.Discount,
        image:selectedDetail.images[0].image,
        qty:selectedQty,
        financialId:selectedFinancial._id,
        brandId:selectedDetail._id,
        countInStock:10
      }));
      
      showCartScreen();
      // navigate('/cart');
    };

    const showCartScreen = () => {
      const cartScreen = document.querySelector('.cart-screen');
      // console.log('cartScreen'+cartScreen);
      if(cartScreen)
      {
      cartScreen.classList.add('show'); 
    }
    };
    
    const hideCartScreen = () => {
      const cartScreen = document.querySelector('.cart-screen');
      if (cartScreen) {
        cartScreen.classList.remove('show');
      }
    };

  return (
    <Container >
      {product.details.map((detail, detailIndex) => (
        (!selectedBrand || detail.brand === selectedBrand) && (
          <div key={detailIndex} className="card-container">
            {/* Render images with scroll buttons */}
            <Link to={`/product/${product._id}`} state={{ brand: selectedBrand, quantity: selectedQuantity, qty: selectedQty }}>
      <div className="image-container" ref={(el) => (scrollContainersRef.current[detailIndex] = el)}>
    
        <div className="images-wrapper">
          {detail.images && detail.images.map((image, imageIndex) => (
            <img key={imageIndex} src={image.image} width='100%' height='auto' alt={`${product.name}`} />
          ))}
        </div>
        
      </div>
      
    </Link>
   
    <div className="quantity-wrap">
    <button className="quantity-button" onClick={() => handleQtyChange(selectedQty - 1)}>-</button>
    {selectedQty}
<button className="quantity-button" onClick={() => handleQtyChange(selectedQty + 1)}>+</button>
<button
  className="cart-button"
  onClick={addToCartHandler}
>
  {isAddedToCart ? 'ITEM ADDED  ' : 'ADD TO CART'}
  {isAddedToCart && <FaShoppingBag />}
  {/* Render the cart screen conditionally */}

</button>
  {/* Render the cart screen conditionally */}

  {/* {console.log('isAddedToCart'+isAddedToCart)} */}
  {
        <div className="cart-screen">
          <button  onClick={hideCartScreen} style={{backgroundColor:'forestgreen',color:'white',fontSize:'1.5rem',borderRadius:'5px'}}>Close</button>
         <div >
          <Cart />
          </div>
        </div>
      }
 
</div>
<div >
  <div>
    <p className="cardHeading">{product.name}</p>
  </div>

  <div style={{ display: 'flex', alignItems: 'center' }}>
    <div style={{ marginRight: '1rem' }}>
      <label htmlFor={`brandDropdown-${detailIndex}`} className="brand-label">Brand</label>
    </div>
    <div>
      <select id={`brandDropdown-${detailIndex}`} onChange={handleBrandChange} value={selectedBrand}  style={{ width: '100%' }}>
        {product.details.map((detail) => (
          <option key={detail.brand} value={detail.brand}>
            {detail.brand}
          </option>
        ))}
      </select>
    </div>
  </div>

  <div style={{ display: 'flex', alignItems: 'center' }}>
    <div style={{ marginRight: '1rem' }}>
      <label htmlFor={`weightDropdown-${detailIndex}`}>Weight</label>
    </div>
    <div>
      <select
        id={`weightDropdown-${detailIndex}`}
        onChange={handleQuantityChange}
        value={selectedQuantity}
      >
        {detail.financials.map((financial, index) => (
          <option key={index} value={financial.quantity}>
            {getFormattedQuantity(financial.quantity)}
          </option>
        ))}
      </select>
    </div>
  </div>

  {/* Display price and discount based on selected quantity */}
  {selectedQuantity && getDiscount(selectedQuantity, detail.financials) > 0 && (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <div style={{ marginRight: '1rem', fontSize: 'medium', fontWeight: 600 }}>
        <span>Price/Pack</span>
      </div>
      <div style={{ fontSize: 'medium', fontWeight: 600 }}>
        <s>&#x20b9;{(getPrice(selectedQuantity, detail.financials)).toFixed(2)}</s> &#x20b9;{(getDprice(selectedQuantity, detail.financials)).toFixed(2)}
      </div>
    </div>
  )}

  {selectedQuantity && getDiscount(selectedQuantity, detail.financials) <= 0 && (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <div style={{ marginRight: '1rem', fontSize: 'medium', fontWeight: 600 }}>
        <span>Price/Pack:</span>
      </div>
      <div style={{ fontSize: 'medium', fontWeight: 600 }}>
        &#x20b9;{(getPrice(selectedQuantity, detail.financials)).toFixed(2)}
      </div>
    </div>
  )}

  {selectedQuantity && selectedQty > 1 && getDiscount(selectedQuantity, detail.financials) > 0 && (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <div style={{ marginRight: '1rem', fontSize: 'medium', fontWeight: 600 }}>
        <span>Price of {selectedQty} packs:</span>
      </div>
      <div style={{ fontSize: 'medium', fontWeight: 600 }}>
        <s>&#x20b9;{(getPrice(selectedQuantity, detail.financials) * selectedQty).toFixed(2)}</s> &#x20b9;{(getDprice(selectedQuantity, detail.financials) * selectedQty).toFixed(2)}
      </div>
    </div>
  )}
</div>

          
          

              
              {selectedQuantity && selectedQty > 1  && getDiscount(selectedQuantity, detail.financials) <= 0 && (
                <span>
                  <span> Price of {selectedQty} packs:</span> &#x20b9;{(getPrice(selectedQuantity, detail.financials) * selectedQty).toFixed(2)}
                  </span>
              )}
               {selectedQuantity && getDiscount(selectedQuantity, detail.financials) > 0 && (
                <span className='discount-ribbon' >
                  <p >{getDiscount(selectedQuantity,detail.financials)}% off</p>
                  </span>
              )} 
            
          
            
            {/* Scroll buttons */}
            <div className="scroll-buttons-container">
              <button className="scroll-button" onClick={() => handleScroll('left', detailIndex)}>
                &lt;
              </button>
              <button className="scroll-button" onClick={() => handleScroll('right', detailIndex)}>
                &gt;
              </button>
            </div>
          </div>
        )
      ))}
    </Container>
  );
};

export default Product;
// Helper function to get price based on selected quantity
const getPrice = (selectedQuantity, financials) => {

  const selectedFinancial = financials.find((financial) => financial.quantity.toString() === selectedQuantity);
  // console.log(selectedQuantity+'   financials  '+financials+'  selectedFinancial  '+selectedFinancial)
  return selectedFinancial ? selectedFinancial.price : 'N/A';
};

const getDprice = (selectedQuantity, financials) => {
  const selectedFinancial = financials.find((financial) => financial.quantity.toString() === selectedQuantity);
  return selectedFinancial ? selectedFinancial.dprice : 0;
};



const getDiscount = (selectedQuantity, financials) => {
  const selectedFinancial = financials.find((financial) => financial.quantity.toString() === selectedQuantity);
  return selectedFinancial ? selectedFinancial.Discount : 0;
};