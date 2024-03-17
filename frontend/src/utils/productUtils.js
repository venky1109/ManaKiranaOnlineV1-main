/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState,  useEffect , useRef} from 'react';
import { useDispatch } from 'react-redux';
import { addToCart } from '../slices/cartSlice';
import { Link , useNavigate} from 'react-router-dom';
import { Container  } from 'react-bootstrap';
import './product.css';
const Product = ({ product }) => {
  const [selectedBrand, setSelectedBrand] = useState('');
  const [selectedQuantity, setSelectedQuantity] = useState('');

  useEffect(() => {
    // Set the default selected brand and quantity when the component mounts
    const brandWithHighestDiscount = getBrandWithHighestDiscount();
    
    setSelectedBrand(brandWithHighestDiscount);
   // const firstBrandDetails = product.details.find((detail) => detail.brand === brandWithHighestDiscount);
    const qty=maxDiscountQuanty(brandWithHighestDiscount);

    setSelectedQuantity(qty.toString());
    
  }, [product.details]);

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
  const handleScroll = (scrollDirection, index) => {
    const scrollContainer = scrollContainersRef.current[index];

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


    const qty=maxDiscountQuanty(newBrand);
    setSelectedQuantity(qty.toString());
  };

  const handleQuantityChange = (event) => {
    setSelectedQuantity(event.target.value);
  };
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const scrollContainersRef = useRef([]);
  const addToCartHandler = () => {
    // console.log(product);
    dispatch(addToCart({ ...product, selectedQuantity }));
    navigate('/cart');
  };

  return (
    <Container  style={{ width: '270px' }} >
      {product.details.map((detail, detailIndex) => (
        (!selectedBrand || detail.brand === selectedBrand) && (
          <div key={detailIndex} className="card-container">
            {/* Render product details here */}
            <Link to={`/products/${product._id}`}>

            {/* Render images with scroll buttons */}
            <div className="image-container" ref={(el) => (scrollContainersRef.current[detailIndex] = el)}>
              {detail.images && detail.images.map((image, imageIndex) => (
                <div key={imageIndex}>
                  <img src={image.image} width={190} height={200} alt={`${product.name}`} />
                </div>
              ))}
            </div>
            <h6 className="cardHeading">{product.name}</h6>
            </Link>
            {/* Brand selection dropdown inside the card */}
            <div>
              <label htmlFor={`brandDropdown-${detailIndex}`}>Brand:</label>
              <select
                id={`brandDropdown-${detailIndex}`}
                onChange={handleBrandChange}
                value={selectedBrand}
              >
                {product.details.map((detail) => (
                  <option key={detail.brand} value={detail.brand}>
                    {detail.brand}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor={`quantityDropdown-${detailIndex}`}>Quantity:</label>
              <select
                id={`quantityDropdown-${detailIndex}`}
                onChange={handleQuantityChange}
                value={selectedQuantity}
              >
                {detail.financials.map((financial, index) => (
                  <option key={index} value={financial.quantity}>
                    {financial.quantity}
                  </option>
                ))}
              </select>
              <br/>
              {/* Display price and discount based on selected quantity */}
              {selectedQuantity && getDiscount(selectedQuantity, detail.financials) > 0 && (
                <span>
                  <span>Price:</span> <s>&#x20b9;{getPrice(selectedQuantity, detail.financials)}</s> &#x20b9;{getDprice(selectedQuantity,detail.financials)} 
                  </span>
              )}
              {selectedQuantity && getDiscount(selectedQuantity, detail.financials) <= 0 && (
                <span>
                  <span>Price:</span> &#x20b9;{getPrice(selectedQuantity, detail.financials)}
                  </span>
              )}
               {selectedQuantity && getDiscount(selectedQuantity, detail.financials) > 0 && (
                <span className='discount-ribbon' >
                  <p>{getDiscount(selectedQuantity,detail.financials)}% off</p>
                  </span>
              )}                                                     
              <button className="cart-button"  disabled={product.countInStock === 0}
                      onClick={addToCartHandler} >ADD</button>
             
            </div>
            {/* Scroll buttons */}
            <div className="scroll-buttons-container" >
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