import React, { useState, useEffect ,useRef } from 'react';
import { Link, useNavigate, useParams, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useGetProductDetailsQuery } from '../slices/productsApiSlice';
import { addToCart } from '../slices/cartSlice';
import Loader from '../components/Loader';
import Message from '../components/Message';
import {   Row,
  Col, 
  Button} from 'react-bootstrap';

import './ProductScreen.css'


const ProductScreen = () => {
  const { id: productId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const scrollContainersRef = useRef([]);
  const { brand, quantity , qty } = location.state || {};

  const {
    data: product,
    isLoading,
    error,
  } = useGetProductDetailsQuery(productId);

  const [selectedBrand, setSelectedBrand] = useState(brand || '');
  const [selectedQuantity, setSelectedQuantity] = useState(quantity || '1');
  const [selectedQty, setSelectedQty] = useState(qty || '1');

  useEffect(() => {
    if (brand) {
      setSelectedBrand(brand);
    }
    if (quantity) {
      setSelectedQuantity(quantity);
    }
  }, [brand, quantity]);
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
  const handleBrandChange = (event) => {
    const newBrand = event.target.value;
    setSelectedBrand(newBrand);


    const qty = maxDiscountQuanty(newBrand);
    setSelectedQuantity(qty.toString());
  };

  const handleQtyChange = (event) => {
    setSelectedQty(event.target.value);
  };


  const handleQuantityChange = (event) => {
    setSelectedQuantity(event.target.value);
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
  const addToCartHandler = () => {
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

    navigate('/cart');
  };

  return (
    <>
      <Link variant='outline-success' className='btn  btn-outline-success  p-1 my-2' to='/'>
        Go Back
      </Link>
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant='danger'>{error?.data?.message || error.error}</Message>
      ) : (
   
      product.details.map((detail, detailIndex) => (
        (!selectedBrand || detail.brand === selectedBrand) && (
        <Row >
          <Col md="4" >
          <div key={detailIndex} className="card-container-screen" >
            {/* Render images with scroll buttons */}  
            <Link to={`/product/${product._id}`} state={{brand: selectedBrand, quantity: selectedQuantity }}>
              <div className="image-container" ref={(el) => (scrollContainersRef.current[detailIndex] = el)}>
                {detail.images && detail.images.map((image, imageIndex) => (
                  <div key={imageIndex}>
                    <img src={image.image} width={300} height={350} alt={`${product.name}`} />
                  </div>
                ))}
              </div>
            </Link>
            <div className="scroll-buttons-container">
              <button className="scroll-button" onClick={() => handleScroll('left', detailIndex)}>
                &lt;
              </button>
              <button className="scroll-button" onClick={() => handleScroll('right', detailIndex)}>
                &gt;
              </button>
            </div>
            {selectedQuantity && getDiscount(selectedQuantity, detail.financials) > 0 && (
                <span className='discount-ribbon-screen' >
                  <p>{getDiscount(selectedQuantity,detail.financials)}% off</p>
                  </span>
              )}  
          </div>
          </Col>
          <Col md="4">
          <h4 className="card-heading" style={{ color: '#937c0c', fontweight:500 }}>{product.name}</h4>
          <div className="product-info">
          <div className="form-group  justify-content-center mb-0" >
          <label htmlFor={`brandDropdown-${detailIndex}`} className='mb-0' style={{ color: 'forestgreen' }}>
      <h6 style={{ margin: '0.25em' }}>Brand:</h6>
          </label>
          <select
      id={`brandDropdown-${detailIndex}`}
      className="form-control mb-0"
      style={{ borderColor: 'forestgreen' ,color: '#937c0c' ,fontWeight:500 ,fontSize:'15px' }}
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

  <div className="form-group mb-0">
    <label htmlFor={`weightDropdown-${detailIndex}`} style={{ color: 'forestgreen',paddingTop:'0.25em',paddingBottom:'0em' }}>
    <h6 style={{ margin: '0.25em' }}>Weight:</h6>
    </label>
    <select
      id={`weightDropdown-${detailIndex}`}
      className="form-control"
      style={{ borderColor: 'forestgreen',color: '#937c0c' ,fontWeight:500 ,fontSize:'15px'  }}
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
  <div className="form-group">
    <label htmlFor={`quantityDropdown-${detailIndex}`} style={{ color: 'forestgreen',paddingTop:'0.25em'  }}>
    <h6 style={{ margin: '0.25em' }}>Number Of Packs:</h6>
    </label>
    <select
      id={`quantityDropdown-${detailIndex}`}
      className="form-control"
      style={{ borderColor: 'forestgreen',color: '#937c0c' ,fontWeight:500 ,fontSize:'15px' }}
      onChange={handleQtyChange}
      value={selectedQty}
    >
        {[...Array(10).keys()].map((x) => (
                        <option key={x + 1} value={x + 1}>
                          {x + 1}
                        </option>
                      ))}
    </select>
  </div>


</div>
 </Col>
 <Col md="4">
  
 <div className="price-info" style={{paddingTop:'3em',paddingLeft:'1em'}}>
  {selectedQuantity && getDiscount(selectedQuantity, detail.financials) > 0 && (
    <div className="price-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
      <div className="mrp-container" style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5em' }}>
        <span style={{ color: 'forestgreen' }}>
          <h6>MRP </h6>
        </span>
        <span style={{ color: 'forestgreen', fontSize: '10px', marginLeft: '0.5em', lineHeight: '1.5' }}>(Max Retail Price):</span>
        <h6 style={{ color: 'forestgreen' }}>:</h6>
        <h6 style={{ margin: '0.25em' }}><s className="original-price" style={{ color: '#937c0c', fontWeight: 600, fontSize: '20px', marginLeft: '0.5em', lineHeight: '1.5' }}>
          &#x20b9;{(getPrice(selectedQuantity, detail.financials)).toFixed(2)} 
        </s>  </h6> <p style={{ color: '#937c0c' ,fontSize:'15px'}}>Per Pack</p>
      </div>
      <div className="mkp-container" style={{ display: 'flex', alignItems: 'center' }}>
        <h6 style={{ color: 'forestgreen' , margin: '0.25em' }}>MKP</h6>
        <p style={{color: 'forestgreen', fontSize: '10px', marginLeft: '0.5em', lineHeight: '1.5' }}>(ManaKiranaPrice)</p>
        <h6 style={{ color: 'forestgreen' ,  margin: '0.25em'}}>:</h6>
        <h6 className="discounted-price" style={{ color: 'forestgreen',  margin: '0.25em',fontWeight: 600, fontSize: '20px', marginLeft: '0.5em' }}>
          &#x20b9;{(getDprice(selectedQuantity, detail.financials)).toFixed(2)}
        </h6><p style={{ color: 'forestgreen' ,fontSize:'15px'}}>Per Pack</p>
      </div>
      { selectedQty >1 &&(
      <div className="mkp-container" style={{ display: 'flex', alignItems: 'center', border:' 2px solid #937c0c',borderRadius:'4px',padding:'3px' }}>
        <h6 style={{ color: 'forestgreen' }}>MKP of {selectedQty} Packs</h6>
        <p style={{color: 'forestgreen', fontSize: '10px', marginLeft: '0.5em', lineHeight: '1.5' , margin: '0.25em'}}>(ManaKiranaPrice)</p>
        <h6 style={{ color: 'forestgreen' }}>:</h6>
        <h6 className="discounted-price" style={{ color: 'forestgreen', fontWeight: 600, fontSize: '30px', marginLeft: '0.5em' , margin: '0.25em'}}>
          &#x20b9;{(getDprice(selectedQuantity, detail.financials) * selectedQty).toFixed(2)}
        </h6>
      </div>
      )}

      <div className="discount-container" style={{ display: 'flex', alignItems: 'center' }}>
        <h6 style={{ color: 'forestgreen' , margin: '0.25em'}}>You Save</h6>
        <h6 style={{ color: '#937c0c' , margin: '0.25em'}}> (&#x20b9;{getPrice(selectedQuantity, detail.financials) } * {selectedQty} - &#x20b9;{getDprice(selectedQuantity, detail.financials)} * {selectedQty})</h6>
        <h6 style={{ color: 'forestgreen' , margin: '0.25em'}}>:</h6>
        <h6 className="discounted-price" style={{ color: 'forestgreen',  margin: '0.25em',fontWeight: 600, fontSize: '20px', marginLeft: '0.5em' }}>
          &#x20b9;{(getPrice(selectedQuantity, detail.financials) * selectedQty -getDprice(selectedQuantity, detail.financials) * selectedQty).toFixed(2)}
        </h6>
      </div>

      
      <div className="discount-percent-container" style={{ display: 'flex', alignItems: 'center' }}>
      <Button className="discounted-percent" style={{ backgroundColor:'floralwhite', color: '#937c0c' , fontWeight: 600, fontSize: '16px',marginBottom:'1em' }}>On purchage enjoy Discount of {getDiscount(selectedQuantity,detail.financials)}% </Button>
      </div>
    </div>
  )}
    {selectedQuantity && getDiscount(selectedQuantity, detail.financials) <= 0 && (

<div className="mrp-container" style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5em' }}>
  <span style={{ color: 'forestgreen' }}>
    <h6>MRP </h6>
  </span>
  <span style={{ color: 'forestgreen', fontSize: '10px', marginLeft: '0.5em', lineHeight: '1.5' }}>(Max Retail Price):</span>
  <h6 style={{ color: 'forestgreen' }}>:</h6>
  <h6 style={{ margin: '0.25em',color: '#937c0c', fontWeight: 600, fontSize: '20px', marginLeft: '0.5em', lineHeight: '1.5' }} >
    &#x20b9;{(getPrice(selectedQuantity, detail.financials)).toFixed(2)} 
    </h6> <p style={{ color: '#937c0c' ,fontSize:'15px'}}>Per Pack</p>
</div> )}
      { selectedQty >1 && getDiscount(selectedQuantity, detail.financials) <= 0 &&(
        <div className="mkp-container" style={{ display: 'flex', alignItems: 'center', border:' 2px solid #937c0c',borderRadius:'4px',padding:'3px', marginBottom:'1em'}}>
          <h6 style={{ color: 'forestgreen' }}>MRP of {selectedQty} Packs</h6>
          <p style={{color: 'forestgreen', fontSize: '10px', marginLeft: '0.5em', lineHeight: '1.5' , margin: '0.25em'}}>(ManaKiranaPrice)</p>
          <h6 style={{ color: 'forestgreen' }}>:</h6>
          <h6 className="discounted-price" style={{ color: 'forestgreen', fontWeight: 600, fontSize: '30px', marginLeft: '0.5em' , margin: '0.25em'}}>
            &#x20b9;{(getDprice(selectedQuantity, detail.financials) * selectedQty).toFixed(2)}
          </h6>
        </div>
        )}
 
   



    <Button
      className="cart-button"
      style={{ backgroundColor: 'forestgreen', borderColor: 'forestgreen' }}
      onClick={addToCartHandler}
    >
      ADD TO CART
    </Button>
  </div>
  </Col>  
          
          </Row>
        )
      ))
   

      )}
    </>
  );
};

export default ProductScreen;
const getPrice = (selectedQuantity, financials) => {

  const selectedFinancial = financials.find((financial) => financial.quantity.toString() === selectedQuantity);
  // console.log(selectedQuantity+'   financials  '+financials+'  selectedFinancial  '+selectedFinancial)
  return selectedFinancial ? selectedFinancial.price : 0;
};

const getDprice = (selectedQuantity, financials) => {
  const selectedFinancial = financials.find((financial) => financial.quantity.toString() === selectedQuantity);
  return selectedFinancial ? selectedFinancial.dprice : 0;
};



const getDiscount = (selectedQuantity, financials) => {
  const selectedFinancial = financials.find((financial) => financial.quantity.toString() === selectedQuantity);
  return selectedFinancial ? selectedFinancial.Discount : 0;
};

