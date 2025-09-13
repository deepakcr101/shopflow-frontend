
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getProductsStart, getProductsSuccess, getProductsFailure } from '../store/slices/productSlice';
import { addToCartSuccess } from '../store/slices/cartSlice';
import axios from 'axios';
import { Container, Grid, Card, CardContent, CardMedia, Typography, Button, CircularProgress, Box, TextField, MenuItem } from '@mui/material';
import { Link } from 'react-router-dom';

const ProductList = () => {
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector((state) => state.products);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');

  const PRODUCT_SERVICE_URL = process.env.REACT_APP_PRODUCT_SERVICE_URL || 'http://localhost:8082';

  useEffect(() => {
    const fetchProducts = async () => {
      dispatch(getProductsStart());
      try {
        const response = await axios.get(`${PRODUCT_SERVICE_URL}/api/products`);
        dispatch(getProductsSuccess(response.data));
      } catch (err) {
        dispatch(getProductsFailure('Failed to fetch products.'));
        console.error('Error fetching products:', err);
      }
    };

    fetchProducts();
  }, [dispatch, PRODUCT_SERVICE_URL]);

  const handleAddToCart = (product) => {
    dispatch(addToCartSuccess(product));
  };

  const filteredProducts = products
    .filter((product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === 'name') {
        return a.name.localeCompare(b.name);
      } else if (sortBy === 'price') {
        return a.price - b.price;
      }
      return 0;
    });

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <Container>
      <Box sx={{ my: 4, display: 'flex', justifyContent: 'space-between' }}>
        <TextField
          label="Search Products"
          variant="outlined"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <TextField
          select
          label="Sort By"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          sx={{ minWidth: 120 }}
        >
          <MenuItem value="name">Name</MenuItem>
          <MenuItem value="price">Price</MenuItem>
        </TextField>
      </Box>
      <Grid container spacing={4}>
        {filteredProducts.map((product) => (
          <Grid item key={product.id} xs={12} sm={6} md={4}>
            <Card>
              <CardMedia
                component={Link}
                to={`/products/${product.id}`}
                image={`https://via.placeholder.com/300?text=${product.name}`}
                title={product.name}
                sx={{ height: 140 }}
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  {product.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {product.description}
                </Typography>
                <Typography variant="h6" color="text.primary">
                  ${product.price}
                </Typography>
              </CardContent>
              <Button size="small" onClick={() => handleAddToCart(product)}>
                Add to Cart
              </Button>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default ProductList;
