import React, { useRef } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useGetProductsQuery } from '../slices/productsApiSlice';
import Product from '../components/Product';
import Loader from '../components/Loader';
import Message from '../components/Message';
import Paginate from '../components/Paginate';
import Meta from '../components/Meta';
import AdvertisingBanner from '../components/Advertise';
import Category from '../components/Category';
import advertise from '../advertise';
import { Button } from 'react-bootstrap';

const HomeScreen = () => {
  const { pageNumber, keyword } = useParams();
  const adv = advertise.find(item => item.type === "BodyBanner");
  const containerRefs = useRef([]);

  const { data, isLoading, error } = useGetProductsQuery({
    keyword,
    pageNumber,
  });

  const getCategories = () => {
    if (!data || !data.products) return [];
    return [...new Set(data.products.map(product => product.category))];
  };

  const handleScroll = (scrollOffset, index) => {
    const container = containerRefs.current[index];
    if (container) {
      container.scrollLeft += scrollOffset;
    }
  };

  return (
    <>
      {!keyword ? (
        <AdvertisingBanner images={adv.images} height={adv.dimensions.height} width={adv.dimensions.width} />
      ) : (
        <Link to='/' className='btn btn-light mb-4'>
          Go Back
        </Link>
      )}
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant='danger'>
          {error?.data?.message || error.error}
        </Message>
      ) : (
        <>
          <Meta />
          <h3>Our Category Of Items</h3>
          <Category categories={getCategories()} />
          {getCategories().map((category, index) => (
            <div key={category} >
              <h3>{category}</h3>
              <div style={{  position: 'relative' ,display: 'flex', alignItems: 'center' }}>
              <Button className='scroll-button-left' style={{ position: 'absolute', top: '50%', left: '0', zIndex: '1' }} onClick={() => handleScroll(-100, index)}>Scroll Left</Button>
              <div style={{ overflowX: 'auto', whiteSpace: 'nowrap' }} ref={(ref) => (containerRefs.current[index] = ref)}>
                <div style={{ display: 'flex', flexDirection: 'row' }}>
                  {data.products
                    .filter((product) => product.category === category)
                    .map((product) => (
                      <Product key={product._id} product={product} keyword={keyword} />
                    ))}
                </div>
              </div>
            
                <Button  className='scroll-button-right'  style={{ position: 'absolute', top: '50%', right: '0', zIndex: '1' }}  onClick={() => handleScroll(100, index)}>Scroll Right</Button>
              </div>
              
            </div>
          ))}
          <Paginate
            pages={data.pages}
            page={data.page}
            keyword={keyword ? keyword : ''}
          />
        </>
      )}
    </>
  );
};

export default HomeScreen;
