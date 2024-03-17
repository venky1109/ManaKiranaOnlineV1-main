import { PRODUCTS_URL } from '../constants';
import { apiSlice } from './apiSlice';

export const productsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query({
      query: ({ keyword, pageNumber }) => ({
        url: PRODUCTS_URL,
        params: { keyword, pageNumber },
      }),
      keepUnusedDataFor: 5,
      providesTags: ['Products'],
    }),
    getProductDetails: builder.query({
      query: (productId) => ({
        url: `${PRODUCTS_URL}/${productId}`,
      }),
      keepUnusedDataFor: 5,
    }),
    createProductDetail: builder.mutation({
      query: (productId) => ({
        url: `${PRODUCTS_URL}/${productId}/details`,
        method: 'POST',
      }),
    }),
    createFinancialDetail: builder.mutation({
      query: ({ productId, detailId }) => ({
        url: `${PRODUCTS_URL}/${productId}/details/${detailId}/financials`,
        method: 'POST',
      }),
    }),
    createProduct: builder.mutation({
      query: () => ({
        url: `${PRODUCTS_URL}`,
        method: 'POST',
      }),
      invalidatesTags: ['Product'],
    }),
    updateProduct: builder.mutation({
      query: (data) => ({
        url: `${PRODUCTS_URL}/${data.productId}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Products'],
    }),
    uploadProductImage: builder.mutation({
      query: (data) => ({
        url: `/api/upload`,
        method: 'POST',
        body: data,
      }),
    }),
    deleteProduct: builder.mutation({
      query: (productId) => ({
        url: `${PRODUCTS_URL}/${productId}`,
        method: 'DELETE',
      }),
      providesTags: ['Product'],
    }),
    deleteProductDetail: builder.mutation({
      query: ({ productId, detailId }) => ({
        url: `${PRODUCTS_URL}/${productId}/details/${detailId}`,
        method: 'DELETE',
      }),
    }),
  
  
    updateProductDetail: builder.mutation({
      query: ({ productId, detailId, name,category, brand, discount, price, quantity,image,manualQuantity }) => ({
        url: `${PRODUCTS_URL}/${productId}/details/${detailId}`,
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: {
          name,
          category,
          brand,
          discount,
          price,
          quantity,
          image,
          manualQuantity
        },
      }),
     
    }),
    
    createReview: builder.mutation({
      query: (data) => ({
        url: `${PRODUCTS_URL}/${data.productId}/reviews`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Product'],
    }),
    getTopProducts: builder.query({
      query: () => `${PRODUCTS_URL}/top`,
      keepUnusedDataFor: 5,
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetProductDetailsQuery,
  useCreateProductDetailMutation,
  useCreateFinancialDetailMutation,
  useCreateProductMutation,
  useUpdateProductMutation,
  useUploadProductImageMutation,
  useDeleteProductMutation,
  useDeleteProductDetailMutation,
  useUpdateProductDetailMutation,
  useCreateReviewMutation,
  useGetTopProductsQuery,
} = productsApiSlice;
