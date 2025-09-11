import React, { useState, useEffect } from 'react';
import axios from 'axios';

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null);

  const ORDER_SERVICE_URL = process.env.REACT_APP_ORDER_SERVICE_URL || 'http://localhost:8083';

  const fetchOrders = async () => {
    try {
      const response = await axios.get(`${ORDER_SERVICE_URL}/api/orders`);
      setOrders(response.data);
    } catch (err) {
      setError('Failed to fetch orders.');
      console.error('Error fetching orders:', err);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleUpdateStatus = async (orderId, newStatus) => {
    setError(null);
    try {
      await axios.put(`${ORDER_SERVICE_URL}/api/orders/${orderId}/status`, { status: newStatus });
      fetchOrders(); // Refresh the list after update
    } catch (err) {
      setError('Failed to update order status.');
      console.error('Error updating order status:', err);
    }
  };

  return (
    <div>
      <h2>Order Management</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <h3>All Orders</h3>
      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <div className="order-list">
          {orders.map((order) => (
            <div key={order.id} className="order-item">
              <h4>Order ID: {order.id}</h4>
              <p>User ID: {order.userId}</p>
              <p>Total Amount: ${order.totalAmount}</p>
              <p>Shipping Address: {order.shippingAddress}</p>
              <p>
                Status:
                <select
                  value={order.status}
                  onChange={(e) => handleUpdateStatus(order.id, e.target.value)}
                >
                  <option value="PENDING">PENDING</option>
                  <option value="PROCESSING">PROCESSING</option>
                  <option value="SHIPPED">SHIPPED</option>
                  <option value="DELIVERED">DELIVERED</option>
                  <option value="CANCELLED">CANCELLED</option>
                </select>
              </p>
              <h5>Items:</h5>
              <ul>
                {order.orderItems.map((item) => (
                  <li key={item.id}>
                    Product ID: {item.productId}, Quantity: {item.quantity}, Price: ${item.price}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderManagement;
