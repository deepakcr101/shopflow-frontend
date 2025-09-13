import React from 'react';
import { Box, Typography, Button, Container, Grid } from '@mui/material';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <>
      {/* Hero Section */}
      <Box
        sx={{
          bgcolor: 'background.paper',
          pt: 8,
          pb: 6,
        }}
      >
        <Container maxWidth="sm">
          <Typography
            component="h1"
            variant="h2"
            align="center"
            color="text.primary"
            gutterBottom
          >
            Welcome to ShopFlow
          </Typography>
          <Typography variant="h5" align="center" color="text.secondary" paragraph>
            Your one-stop shop for everything you need. We have a wide selection of products at the best prices.
          </Typography>
          <Box sx={{ pt: 4, display: 'flex', justifyContent: 'center' }}>
            <Button component={Link} to="/products" variant="contained">
              Shop Now
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Featured Products Section */}
      <Container sx={{ py: 8 }} maxWidth="md">
        <Typography variant="h4" align="center" gutterBottom>
          Featured Products
        </Typography>
        <Grid container spacing={4}>
          {/* Add featured products here */}
        </Grid>
      </Container>
    </>
  );
};

export default Home;