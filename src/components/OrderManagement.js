import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getOrdersStart, getOrdersSuccess, getOrdersFailure } from '../store/slices/orderSlice';
import axios from 'axios';
import { 
  Container, 
  Typography, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper, 
  Select, 
  MenuItem 
} from '@mui/material';

const OrderManagement = () => {
  const dispatch = useDispatch();
  const { orders, loading, error } = useSelector((state) => state.orders);

  const ORDER_SERVICE_URL = process.env.REACT_APP_ORDER_SERVICE_URL || 'http://localhost:8083';

  const fetchOrders = async () => {
    dispatch(getOrdersStart());
    try {
      const response = await axios.get(`${ORDER_SERVICE_URL}/api/orders`);
      dispatch(getOrdersSuccess(response.data));
    } catch (err) {
      dispatch(getOrdersFailure('Failed to fetch orders.'));
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [dispatch]);

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      await axios.put(`${ORDER_SERVICE_URL}/api/orders/${orderId}/status`, { status: newStatus });
      fetchOrders();
    } catch (err) {
      console.error('Error updating order status:', err);
    }
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom sx={{ mt: 4 }}>
        Order Management
      </Typography>
      <TableContainer component={Paper} sx={{ mt: 4 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Order ID</TableCell>
              <TableCell>User ID</TableCell>
              <TableCell>Total Amount</TableCell>
              <TableCell>Shipping Address</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell>{order.id}</TableCell>
                <TableCell>{order.userId}</TableCell>
                <TableCell>${order.totalAmount}</TableCell>
                <TableCell>{order.shippingAddress}</TableCell>
                <TableCell>
                  <Select
                    value={order.status}
                    onChange={(e) => handleUpdateStatus(order.id, e.target.value)}
                  >
                    <MenuItem value="PENDING">PENDING</MenuItem>
                    <MenuItem value="PROCESSING">PROCESSING</MenuItem>
                    <MenuItem value="SHIPPED">SHIPPED</MenuItem>
                    <MenuItem value="DELIVERED">DELIVERED</MenuItem>
                    <MenuItem value="CANCELLED">CANCELLED</MenuItem>
                  </Select>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default OrderManagement;