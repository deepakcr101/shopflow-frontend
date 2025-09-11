import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useCart } from '../context/CartContext';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);
  const { addToCart } = useCart();

  const PRODUCT_SERVICE_URL = process.env.REACT_APP_PRODUCT_SERVICE_URL || 'http://localhost:8082';

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${PRODUCT_SERVICE_URL}/api/products`);
        setProducts(response.data);
      } catch (err) {
        setError('Failed to fetch products.');
        console.error('Error fetching products:', err);
      }
    };

    fetchProducts();
  }, []);

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h1>Product List</h1>
      <div className="product-list">
        {products.length > 0 ? (
          products.map(product => (
            <div key={product.id} className="product-item">
              <h3>{product.name}</h3>
              <p>{product.description}</p>
              <p>${product.price}</p>
              <p>Quantity: {product.quantity}</p>
              <button onClick={() => addToCart(product)}>Add to Cart</button>
            </div>
          ))
        ) : (
          <p>No products available.</p>
        )}
      </div>
    </div>
  );
};

export default ProductList;