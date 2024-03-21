import { Row, Col } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { useGetProductsQuery } from '../slices/productsApiSlice';
import { Link } from 'react-router-dom';
import Product from '../components/Product';
import Loader from '../components/Loader';
import Message from '../components/Message';
import Paginate from '../components/Paginate';
import Meta from '../components/Meta';
import AdvertisingBanner from '../components/Advertise';
import advertise from '../advertise';
import Category from '../components/Category';

const HomeScreen = () => {
  const { pageNumber, keyword } = useParams();
  const adv = advertise.find(item => item.type === "BodyBanner");
  const { data, isLoading, error } = useGetProductsQuery({
    keyword,
    pageNumber,
  });
  const getCategories = () => {
    return  [...new Set(data.products.map(product => product.category))];
  }
  return (
    <>
      {!keyword ? (
       <AdvertisingBanner images={adv.images} height={adv.dimensions.height}  width={adv.dimensions.width} />
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
          <Category categories={getCategories()}/>
          <h3>Our Grocery Items</h3>
          <Row>
            {data.products.map((product) => (
              <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
                {/* <Product product={product} /> */}
                <Product product={product} keyword={keyword}/>
              </Col>
            ))}
          </Row>
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
