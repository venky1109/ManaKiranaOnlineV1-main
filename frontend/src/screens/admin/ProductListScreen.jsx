import { LinkContainer } from 'react-router-bootstrap';
import { Table, Button, Row, Col } from 'react-bootstrap';
import { FaEdit, FaMinus, FaPlus, FaTrash } from 'react-icons/fa';
import { useParams } from 'react-router-dom';
import Message from '../../components/Message';
import Loader from '../../components/Loader';
import Paginate from '../../components/Paginate';
import {
  useGetProductsQuery,
  useDeleteProductMutation,
  useDeleteProductDetailMutation,
  useCreateProductDetailMutation,
  useCreateProductMutation,
  useCreateFinancialDetailMutation,
} from '../../slices/productsApiSlice';
import { toast } from 'react-toastify';

const ProductListScreen = () => {
  const { pageNumber } = useParams();

  const { data, isLoading, error, refetch } = useGetProductsQuery({
    pageNumber,
  });

  const [deleteProduct, { isLoading: loadingDelete }] =
  useDeleteProductMutation();
  const [deleteProductDetail, { isLoading: loadingDeleteDetail }] =
  useDeleteProductDetailMutation();
  const [createProductDetail, { isLoading: loadingCreateDetail }] =
  useCreateProductDetailMutation();
  const [createFinancialDetail,{isLoading: loadingFinancialDetail }]=
  useCreateFinancialDetailMutation();


  const deleteProductHandler = async () => {
    const productIdToDelete = window.prompt('Enter the Product ID to delete:');
    
    if (productIdToDelete) {
      if (window.confirm('Are you sure you want to delete this product?')) {
        try {
          await deleteProduct(productIdToDelete);
          refetch();
          toast.success('Product deleted successfully');
        } catch (err) {
          toast.error(err?.data?.message || err.error);
        }
      }
    } else {
      toast.warning('Product ID is required for deletion');
    }
  };

  const deleteProductDeatilHandler = async (productId,detailId) => {
    // console.log(productId+'detail '+detailId);
    if (window.confirm('Are you sure')) {
      try {
        await deleteProductDetail({productId, detailId}).unwrap();
        refetch();
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  const [createProduct, { isLoading: loadingCreate }] =
    useCreateProductMutation();

  const createProductHandler = async () => {
    if (window.confirm('Are you sure you want to create a new product?')) {
      try {
        await createProduct();
        refetch();
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  const createProductDetailHandler = async () => {
    const productId = window.prompt('Enter the Product ID:');
    if (productId) {
      try {
        await createProductDetail(productId);
        refetch();
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };
  
  const createFinancialDetailHandler =async () =>{
    let productId = window.prompt('Enter the Product ID:');
  
    // Validate Product ID
    if (!productId) {
      prompt('Product ID is required.');
      productId = window.prompt('Enter the Product ID:');
    }
  
    if(productId)
    {
    // Prompt for Detail ID
    let detailId = window.prompt('Enter the Detail ID:');
  
    // Validate Detail ID
    if (!detailId) {
      prompt('Detail ID is required.');
      detailId = window.prompt('Enter the Detail ID:');
    }
    if(detailId){
      try{
        await createFinancialDetail({productId,detailId}).unwrap;
        refetch();
      }catch(err){
        toast.error(err?.data?.message || err.error);
      }
    }
  }
}

  return (
    <>
      <Row className='align-items-center'>
        <Col>
          <h1>Products</h1>
        </Col>
        <Col className='text-end'>
          <Button className='my-3' onClick={createFinancialDetailHandler}>
            <FaPlus/> Create Financial
          </Button>
          <Button className='my-3 mx-2' onClick={createProductDetailHandler} >
            <FaPlus /> Create Detail
          </Button>
          <Button className='my-3 mx-2' onClick={createProductHandler}>
            <FaPlus /> Create Product
          </Button>
          <Button className='my-3' onClick={deleteProductHandler}>
            <FaMinus /> Delete Product
          </Button>
        </Col>
        
      </Row>

      {loadingCreate && <Loader />}
      {loadingDelete && <Loader />}
      {loadingDeleteDetail && <Loader />}
      {loadingCreateDetail && <Loader /> }
      {loadingFinancialDetail && <Loader />}
      {/* {loadingDeleteDetail && <Loader />} */}
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant='danger'>{error.data.message}</Message>
      ) : (
        <>
          <Table striped bordered hover responsive className='table-sm'>
  <thead>
    <tr>
      <th>PRODUCTID</th>
      <th>DETAILID</th>
      <th>NAME</th>
      <th>CATEGORY</th>
      <th>BRAND</th>
      <th>PRICE</th>
      <th>DISCOUNT</th>
      <th>WEIGHT</th>
      <th>STOCK</th>
      {/* <th>RATING</th>
      <th>REVIEWS</th> */}
      <th></th>
    </tr>
  </thead>
  <tbody>
  {
  data.products.map((product) => (
    product.details.map((detail) => (
      <tr key={detail._id}>
        <td>{product._id}</td>
        <td>{detail._id}</td>
        <td>{product.name}</td>
        <td>{product.category}</td>
        <td>{detail.brand}</td>
        <td>&#x20b9;{detail.financials[detail.financials.length - 1].price}</td>
        <td>{detail.financials[detail.financials.length - 1].Discount}%</td>
        <td>{detail.financials[detail.financials.length - 1].quantity}</td>
        <td>{detail.financials[detail.financials.length - 1].countInStock}</td>
      
        <td>
          <LinkContainer to={`/admin/product/${product._id}/edit/${detail._id}`}>
            <Button variant='light' className='btn-sm mx-2'>
              <FaEdit />
            </Button>
          </LinkContainer>
          <Button
            variant='danger'
            className='btn-sm'
            onClick={() => deleteProductDeatilHandler(product._id, detail._id)}
          >
            <FaTrash style={{ color: 'white' }} />
          </Button>
        </td>
      </tr>
    ))
  ))
}

  </tbody>
</Table>

          <Paginate pages={data.pages} page={data.page} isAdmin={true} />
        </>
      )}
    </>
  );
};

export default ProductListScreen;
