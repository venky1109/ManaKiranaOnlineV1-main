import React, { useRef, useState } from 'react';
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
  const [currentPage, setCurrentPage] = useState(1);
  const [categoriesPerPage] = useState(4); // Adjust as needed
  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo(0, 0); // Scroll to top of the page
  };

  const { data, isLoading, error } = useGetProductsQuery({
    keyword,
    pageNumber,
  });

  // console.log(keyword+'xxx'+pageNumber);

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

  // Pagination logic for categories
  const indexOfLastCategory = currentPage * categoriesPerPage;
  const indexOfFirstCategory = indexOfLastCategory - categoriesPerPage;
  const currentCategories = getCategories().slice(indexOfFirstCategory, indexOfLastCategory);
  console.log('indexOfLastCategory'+indexOfLastCategory+'indexOfFirstCategory'+indexOfFirstCategory+'currentCategories'+currentCategories)



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
          <Category categories={getCategories()} />
          {currentCategories.map((category, index) => (
            <div key={category}>
              <h3 style={{ marginTop: '1rem' }}>{category}</h3>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <Button className='scroll-button-left' variant='success' onClick={() => handleScroll(-100, index)}>&lt;</Button>
                <div style={{ overflowX: 'auto', whiteSpace: 'nowrap' }} ref={(ref) => (containerRefs.current[index] = ref)}>
                  <div style={{ display: 'flex', flexDirection: 'row' }}>
                    {data.products
                      .filter((product) => product.category === category)
                      .map((product) => (
                        <Product key={product._id} product={product} keyword={keyword} />
                      ))}
                  </div>
                </div>
                <Button className='scroll-button-right' variant='success' onClick={() => handleScroll(100, index)}>&gt;</Button>
              </div>
            </div>
          ))}
          <Paginate
            pages={Math.ceil(getCategories().length / categoriesPerPage)}
            page={currentPage}
            paginate={paginate}
          />
        </div>
      )}
    </>
  );
};

export default HomeScreen;
