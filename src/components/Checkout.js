import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { createOrderStart, createOrderSuccess, createOrderFailure } from '../store/slices/orderSlice';
import { clearCart } from '../store/slices/cartSlice';
import axios from 'axios';
import { Container, Stepper, Step, StepLabel, Button, Typography, Box, TextField } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const steps = ['Shipping address', 'Payment details', 'Review your order'];

const Checkout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);
  const [activeStep, setActiveStep] = useState(0);
  const [shippingAddress, setShippingAddress] = useState('');

  const ORDER_SERVICE_URL = process.env.REACT_APP_ORDER_SERVICE_URL || 'http://localhost:8083';

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const getTotalPrice = () => {
    return items.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);
  };

  const handlePlaceOrder = async () => {
    dispatch(createOrderStart());
    try {
      const orderItems = items.map((item) => ({
        productId: item.id,
        quantity: item.quantity,
        price: item.price,
      }));

      const orderPayload = {
        userId: user ? user.id : 1, // Replace with actual user ID from auth state
        shippingAddress: shippingAddress,
        totalAmount: parseFloat(getTotalPrice()),
        orderItems: orderItems,
      };

      const response = await axios.post(`${ORDER_SERVICE_URL}/api/orders`, orderPayload);
      dispatch(createOrderSuccess(response.data));
      dispatch(clearCart());
      handleNext();
    } catch (err) {
      dispatch(createOrderFailure('Failed to place order.'));
      console.error('Error placing order:', err);
    }
  };

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <TextField
            label="Shipping Address"
            fullWidth
            multiline
            rows={4}
            value={shippingAddress}
            onChange={(e) => setShippingAddress(e.target.value)}
          />
        );
      case 1:
        return <Typography>Payment details form goes here.</Typography>;
      case 2:
        return (
          <>
            <Typography variant="h6" gutterBottom>
              Order summary
            </Typography>
            {items.map((item) => (
              <div key={item.id}>
                <Typography>{item.name} x {item.quantity} - ${item.price * item.quantity}</Typography>
              </div>
            ))}
            <Typography variant="h6" sx={{ mt: 2 }}>
              Total: ${getTotalPrice()}
            </Typography>
          </>
        );
      default:
        throw new Error('Unknown step');
    }
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Typography component="h1" variant="h4" align="center">
        Checkout
      </Typography>
      <Stepper activeStep={activeStep} sx={{ pt: 3, pb: 5 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      <>
        {activeStep === steps.length ? (
          <>
            <Typography variant="h5" gutterBottom>
              Thank you for your order.
            </Typography>
            <Typography variant="subtitle1">
              Your order number is #2001539. We have emailed your order confirmation, and will send you an update when your order has shipped.
            </Typography>
            <Button onClick={() => navigate('/')} sx={{ mt: 3 }}>
              Continue Shopping
            </Button>
          </>
        ) : (
          <>
            {getStepContent(activeStep)}
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              {activeStep !== 0 && (
                <Button onClick={handleBack} sx={{ mt: 3, ml: 1 }}>
                  Back
                </Button>
              )}
              <Button
                variant="contained"
                onClick={activeStep === steps.length - 1 ? handlePlaceOrder : handleNext}
                sx={{ mt: 3, ml: 1 }}
              >
                {activeStep === steps.length - 1 ? 'Place order' : 'Next'}
              </Button>
            </Box>
          </>
        )}
      </>
    </Container>
  );
};

export default Checkout;