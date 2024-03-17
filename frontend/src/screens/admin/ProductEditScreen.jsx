import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';
import Message from '../../components/Message';
import Loader from '../../components/Loader';
import FormContainer from '../../components/FormContainer';
import { toast } from 'react-toastify';
import {
  useGetProductDetailsQuery,
  useUpdateProductDetailMutation,
  // useUploadProductImageMutation,
} from '../../slices/productsApiSlice';
import firebase from 'firebase/compat/app';
import 'firebase/compat/storage'

const ProductEditScreen = () => {
  const { id: productId, detailId } = useParams();

  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [brand, setBrand] = useState('');
  const [discount, setDiscount] = useState(0);
  const [price, setPrice] = useState(0);
  const [quantity, setQuantity] = useState('0');
  const [image, setImage] = useState('');
  const [manualQuantity,setManualQuantity] = useState(0);

  const {
    data: product,
    isLoading,
    refetch,
    error,
  } = useGetProductDetailsQuery(productId);

  useEffect(() => {
    if (product) {
      const detail = product.details.find((det) => det._id === detailId);
  
      // Assuming detail.financials is an array of financial details
      const availableQuantities = detail.financials.map((fin) => fin.quantity);
  
      if (!availableQuantities.includes(1)) {
        setQuantity(availableQuantities.length > 0 ? availableQuantities[0] : 1);
      }
    }
  }, [product, detailId]);
  const [updateProductDetail, { isLoading: loadingUpdate }] =
    useUpdateProductDetailMutation();

    // const [uploadProductImage, { isLoading: loadingUpload }] =
    // useUploadProductImageMutation();

  const navigate = useNavigate();

  useEffect(() => {
    if (product) {
      const detail = product.details.find((det) => det._id === detailId);
      const selectedFinancial = detail?.financials.find((fin) => fin.quantity.toString() === quantity.toString());
      setName(product.name);
      setCategory(product.category);
      if (detail && selectedFinancial) {
        setBrand(detail.brand);
        setDiscount(selectedFinancial.Discount);
        setPrice(selectedFinancial.price);
      }
    }
  }, [product, detailId, quantity]);

  const submitHandler = async (e) => {
    
    e.preventDefault();
    try {
      await updateProductDetail({
        productId,
      detailId,
        name,
        category,
        brand,
        discount,
        price,
        quantity,
        image,
        manualQuantity,
      }).unwrap();
      toast.success('Product details updated');
      refetch();
      navigate(`/admin/productlist`);
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }

    // console.log('Product category'+category)
  };

  // const uploadFileHandler = async (e) => {
  //   const formData = new FormData();
  //   formData.append('image', e.target.files[0]);
  //   try {
  //     const res = await uploadProductImage(formData).unwrap();
  //     toast.success(res.message);
  //     setImage(res.image);
  //   } catch (err) {
  //     toast.error(err?.data?.message || err.error);
  //   }
  // };
 
  const uploadFileHandler = async (e) => {
    const imgToUpload=e.target.files[0];
    if(imgToUpload){
      const storage=firebase.app().storage('gs://manakirana-988b3.appspot.com');
      // const storage = firebase.app().storage('gs://your-project.appspot.com');
        
      const storageRef = storage.ref();
      const fileRef=storageRef.child(imgToUpload.name);
      fileRef.put(imgToUpload)
      .then((snapshot)=>{
        snapshot.ref.getDownloadURL()
        .then((downloadURL) => {
          // console.log(downloadURL);
          setImage(downloadURL);
        })

      })
    }
  }
  return (
    <>
      <Link to='/admin/productlist' className='btn btn-light my-3'>
        Go Back
      </Link>
      <FormContainer>
        <h1>Edit Product Details</h1>
        {loadingUpdate && <Loader />}
        {isLoading ? (
          <Loader />
        ) : error ? (
          <Message variant='danger'>{error.data.message}</Message>
        ) : (
          <Form onSubmit={submitHandler}>
            <Form.Group controlId='name'>
              <Form.Label>Name</Form.Label>
              <Form.Control
                type='text'
                placeholder='Enter name'
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId='category'>
              <Form.Label>Category</Form.Label>
              <Form.Control
                type='text'
                placeholder='Enter Category'
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              />
            </Form.Group>
            
            <Form.Group controlId='image'>
              <Form.Label>Image</Form.Label>
              <Form.Control
                type='text'
                placeholder='Enter image url'
                value={image}
                onChange={(e) => setImage(e.target.value)}
              ></Form.Control>
              <Form.Control
                label='Choose File'
                onChange={uploadFileHandler}
                type='file'
              ></Form.Control>
              {/* {loadingUpload && <Loader />} */}
            </Form.Group>
            <Form.Group controlId='brand'>
              <Form.Label>Brand</Form.Label>
              <Form.Control
                type='text'
                placeholder='Enter brand'
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId='discount'>
              <Form.Label>Discount</Form.Label>
              <Form.Control
                type='number'
                placeholder='Enter discount'
                value={discount}
                onChange={(e) => setDiscount(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId='price'>
              <Form.Label>Price</Form.Label>
              <Form.Control
                type='number'
                placeholder='Enter price'
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId='quantity'>
  <Form.Label>Weight</Form.Label>
  <Form.Control
    as='select'
    value={quantity}
    onChange={(e) => setQuantity(e.target.value)}
  >
    {/* Option for manual entry */}
    <option value="">Select Weight</option>

    {/* Populate dropdown with available quantities */}
    {product &&
      product.details.length > 0 &&
      product.details
        .find((det) => det._id === detailId)
        .financials.map((fin, index) => (
          <option key={index} value={fin.quantity}>
            {fin.quantity}
          </option>
        ))}
  </Form.Control>

  </Form.Group>
{quantity === "" && (
  <Form.Group controlId='manualQuantity'>
    <Form.Label>Weight</Form.Label>
    <Form.Control
      type="number"
      placeholder="Enter Weight"
      value={manualQuantity}
      onChange={(e) => setManualQuantity(e.target.value)}
    />
  </Form.Group>
)}



            {/* Additional financial details can be displayed here */}
            {/* For example, you can map through product.details[0].financials and show relevant details */}

            <Button type='submit' variant='primary'>
              Update Details
            </Button>
          </Form>
        )}
      </FormContainer>
    </>
  );
};

export default ProductEditScreen;