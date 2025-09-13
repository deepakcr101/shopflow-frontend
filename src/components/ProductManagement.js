import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getProductsStart, getProductsSuccess, getProductsFailure } from '../store/slices/productSlice';
import axios from 'axios';
import { 
  Container, 
  Typography, 
  Button, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper, 
  IconButton, 
  Dialog, 
  DialogActions, 
  DialogContent, 
  DialogTitle, 
  TextField 
} from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';

const ProductManagement = () => {
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector((state) => state.products);
  const [open, setOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);

  const PRODUCT_SERVICE_URL = process.env.REACT_APP_PRODUCT_SERVICE_URL || 'http://localhost:8082';

  const fetchProducts = async () => {
    dispatch(getProductsStart());
    try {
      const response = await axios.get(`${PRODUCT_SERVICE_URL}/api/products`);
      dispatch(getProductsSuccess(response.data));
    } catch (err) {
      dispatch(getProductsFailure('Failed to fetch products.'));
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [dispatch]);

  const handleClickOpen = (product) => {
    setCurrentProduct(product);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setCurrentProduct(null);
  };

  const handleSave = async () => {
    if (currentProduct.id) {
      await axios.put(`${PRODUCT_SERVICE_URL}/api/products/${currentProduct.id}`, currentProduct);
    } else {
      await axios.post(`${PRODUCT_SERVICE_URL}/api/products`, currentProduct);
    }
    fetchProducts();
    handleClose();
  };

  const handleDelete = async (id) => {
    await axios.delete(`${PRODUCT_SERVICE_URL}/api/products/${id}`);
    fetchProducts();
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom sx={{ mt: 4 }}>
        Product Management
      </Typography>
      <Button variant="contained" onClick={() => handleClickOpen({ name: '', description: '', price: '', quantity: '' })}>
        Add Product
      </Button>
      <TableContainer component={Paper} sx={{ mt: 4 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Quantity</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell>{product.name}</TableCell>
                <TableCell>{product.description}</TableCell>
                <TableCell>${product.price}</TableCell>
                <TableCell>{product.quantity}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleClickOpen(product)}><Edit /></IconButton>
                  <IconButton onClick={() => handleDelete(product.id)}><Delete /></IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{currentProduct?.id ? 'Edit Product' : 'Add Product'}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Name"
            type="text"
            fullWidth
            value={currentProduct?.name || ''}
            onChange={(e) => setCurrentProduct({ ...currentProduct, name: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Description"
            type="text"
            fullWidth
            value={currentProduct?.description || ''}
            onChange={(e) => setCurrentProduct({ ...currentProduct, description: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Price"
            type="number"
            fullWidth
            value={currentProduct?.price || ''}
            onChange={(e) => setCurrentProduct({ ...currentProduct, price: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Quantity"
            type="number"
            fullWidth
            value={currentProduct?.quantity || ''}
            onChange={(e) => setCurrentProduct({ ...currentProduct, quantity: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSave}>Save</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ProductManagement;