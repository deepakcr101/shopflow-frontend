import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { getProductDetailStart, getProductDetailSuccess, getProductDetailFailure } from '../store/slices/productSlice';
import { addToCartSuccess } from '../store/slices/cartSlice';
import axios from 'axios';
import { Container, Grid, Card, CardContent, CardMedia, Typography, Button, CircularProgress, Box, Divider } from '@mui/material';

const ProductDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { product, loading, error } = useSelector((state) => state.products);

  const PRODUCT_SERVICE_URL = process.env.REACT_APP_PRODUCT_SERVICE_URL || 'http://localhost:8082';

  useEffect(() => {
    const fetchProduct = async () => {
      dispatch(getProductDetailStart());
      try {
        const response = await axios.get(`${PRODUCT_SERVICE_URL}/api/products/${id}`);
        dispatch(getProductDetailSuccess(response.data));
      } catch (err) {
        dispatch(getProductDetailFailure('Failed to fetch product details.'));
        console.error('Error fetching product details:', err);
      }
    };

    fetchProduct();
  }, [id, dispatch, PRODUCT_SERVICE_URL]);

  const handleAddToCart = (product) => {
    dispatch(addToCartSuccess(product));
  };

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!product) {
    return <div>Product not found.</div>;
  }

  return (
    <Container>
      <Grid container spacing={4} sx={{ mt: 4 }}>
        <Grid item xs={12} md={6}>
          <CardMedia
            component="img"
            image={`https://via.placeholder.com/600x400?text=${product.name}`}
            alt={product.name}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography variant="h4" gutterBottom>
            {product.name}
          </Typography>
          <Typography variant="h5" color="text.secondary" gutterBottom>
            ${product.price}
          </Typography>
          <Typography variant="body1" paragraph>
            {product.description}
          </Typography>
          <Button variant="contained" onClick={() => handleAddToCart(product)}>
            Add to Cart
          </Button>
        </Grid>
      </Grid>

      {/* Reviews Section */}
      <Box sx={{ mt: 8 }}>
        <Typography variant="h5" gutterBottom>
          Reviews
        </Typography>
        <Divider sx={{ mb: 4 }} />
        {/* Add reviews here */}
      </Box>

      {/* Related Products Section */}
      <Box sx={{ mt: 8 }}>
        <Typography variant="h5" gutterBottom>
          Related Products
        </Typography>
        <Divider sx={{ mb: 4 }} />
        {/* Add related products here */}
      </Box>
    </Container>
  );
};

export default ProductDetail;