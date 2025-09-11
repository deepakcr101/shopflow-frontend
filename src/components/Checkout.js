import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Checkout = () => {
  const { cartItems, clearCart, getTotalPrice } = useCart();
  const [shippingAddress, setShippingAddress] = useState('');
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const ORDER_SERVICE_URL = process.env.REACT_APP_ORDER_SERVICE_URL || 'http://localhost:8083';

  const handleCheckout = async () => {
    if (cartItems.length === 0) {
      setError('Your cart is empty. Please add items before checking out.');
      return;
    }
    if (!shippingAddress) {
      setError('Please enter your shipping address.');
      return;
    }

    try {
      const orderItems = cartItems.map(item => ({
        productId: item.id,
        quantity: item.quantity,
        price: item.price
      }));

      const orderPayload = {
        userId: 1, // Placeholder for now, will be dynamic with auth
        shippingAddress: shippingAddress,
        totalAmount: parseFloat(getTotalPrice()),
        orderItems: orderItems
      };

      const response = await axios.post(`${ORDER_SERVICE_URL}/api/orders`, orderPayload);
      console.log('Order placed successfully:', response.data);
      setOrderPlaced(true);
      clearCart();
      // Optionally navigate to an order confirmation page
      // navigate('/order-confirmation', { state: { order: response.data } });
    } catch (err) {
      setError('Failed to place order. Please try again.');
      console.error('Error placing order:', err);
    }
  };

  if (orderPlaced) {
    return (
      <div>
        <h1>Order Placed Successfully!</h1>
        <p>Thank you for your purchase.</p>
        <button onClick={() => navigate('/')}>Continue Shopping</button>
      </div>
    );
  }

  return (
    <div>
      <h1>Checkout</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <h2>Order Summary</h2>
      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div>
          <ul>
            {cartItems.map(item => (
              <li key={item.id}>
                {item.name} (x{item.quantity}) - ${item.price * item.quantity}
              </li>
            ))}
          </ul>
          <h3>Total: ${getTotalPrice()}</h3>
        </div>
      )}

      <h2>Shipping Information</h2>
      <form onSubmit={(e) => { e.preventDefault(); handleCheckout(); }}>
        <div>
          <label htmlFor="shippingAddress">Shipping Address:</label>
          <textarea
            id="shippingAddress"
            value={shippingAddress}
            onChange={(e) => setShippingAddress(e.target.value)}
            required
            rows="4"
            cols="50"
          />
        </div>
        <button type="submit" disabled={cartItems.length === 0}>Place Order</button>
      </form>
    </div>
  );
};

export default Checkout;
