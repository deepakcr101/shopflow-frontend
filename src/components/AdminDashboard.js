import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Grid, Card, CardContent, Typography, Button } from '@mui/material';

const AdminDashboard = () => {
  return (
    <Container>
      <Typography variant="h4" gutterBottom sx={{ mt: 4 }}>
        Admin Dashboard
      </Typography>
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h5" component="div">
                Product Management
              </Typography>
              <Typography sx={{ mb: 1.5 }} color="text.secondary">
                Manage your products
              </Typography>
              <Button component={Link} to="/admin/products" variant="contained">
                Go to Products
              </Button>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h5" component="div">
                Order Management
              </Typography>
              <Typography sx={{ mb: 1.5 }} color="text.secondary">
                Manage your orders
              </Typography>
              <Button component={Link} to="/admin/orders" variant="contained">
                Go to Orders
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default AdminDashboard;