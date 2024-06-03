import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useGetProductsQuery } from '../slices/productsApiSlice';
import Product from '../components/Product';
import Loader from '../components/Loader';
import Message from '../components/Message';
import Meta from '../components/Meta';
import AdvertisingBanner from '../components/Advertise';
import advertise from '../advertise';
import { Button } from 'react-bootstrap';

const HomeScreen = () => {
  const { pageNumber, keyword } = useParams();
  const adv = advertise.find(item => item.type === "BodyBanner");
  const containerRefs = useRef([]);
  const [categories, setCategories] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const categoriesPerPage = 2;

  const { data, isLoading, error } = useGetProductsQuery({
    keyword,
    pageNumber,
  });

  const getCategories = useCallback(() => {
    if (!data || !data.products) return [];
    return [...new Set(data.products.map(product => product.category))];
  }, [data]);

  const loadMoreCategories = useCallback(() => {
    const allCategories = getCategories();
    const startIndex = (currentPage - 1) * categoriesPerPage;
    const endIndex = startIndex + categoriesPerPage;
    const newCategories = allCategories.slice(startIndex, endIndex);
    setCategories(prevCategories => [...new Set([...prevCategories, ...newCategories])]);
  }, [getCategories, currentPage, categoriesPerPage]);

  useEffect(() => {
    // Load initial categories
    if (data && data.products) {
      loadMoreCategories();
    }

    // Add scroll event listener
    window.addEventListener('scroll', handleScroll);

    // Cleanup on component unmount
    return () => window.removeEventListener('scroll', handleScroll);
  }, [data, loadMoreCategories]);

  useEffect(() => {
    // Load more categories when the page number changes
    if (currentPage > 1) {
      loadMoreCategories();
    }
  }, [currentPage, loadMoreCategories]);

  const handleScroll = () => {
    if (window.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight - 50) {
      // User has scrolled to the bottom, load more categories
      setCurrentPage(prevPage => prevPage + 1);
    }
  };

  const handleScrollButton = (scrollOffset, index) => {
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
        <div>
          <Meta />
          {categories.map((category, index) => (
            <div key={category}>
              <h3 style={{ marginTop: '1rem' }}>{category}</h3>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <Button className='scroll-button-left' variant='success' onClick={() => handleScrollButton(-100, index)}>&lt;</Button>
                <div style={{ overflowX: 'auto', whiteSpace: 'nowrap' }} ref={(ref) => (containerRefs.current[index] = ref)}>
                  <div style={{ display: 'flex', flexDirection: 'row' }}>
                    {data.products
                      .filter((product) => product.category === category)
                      .map((product) => (
                        <Product key={product._id} product={product} keyword={keyword} />
                      ))}
                  </div>
                </div>
                <Button className='scroll-button-right' variant='success' onClick={() => handleScrollButton(100, index)}>&gt;</Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default HomeScreen;
