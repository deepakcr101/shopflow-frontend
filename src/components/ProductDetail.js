import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [error, setError] = useState(null);

  const PRODUCT_SERVICE_URL = process.env.REACT_APP_PRODUCT_SERVICE_URL || 'http://localhost:8082';

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`${PRODUCT_SERVICE_URL}/api/products/${id}`);
        setProduct(response.data);
      } catch (err) {
        setError('Failed to fetch product details.');
        console.error('Error fetching product details:', err);
      }
    };

    fetchProduct();
  }, [id]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!product) {
    return <div>Loading product details...</div>;
  }

  return (
    <div>
      <h1>{product.name}</h1>
      <p>{product.description}</p>
      <p>Price: ${product.price}</p>
      <p>Quantity: {product.quantity}</p>
      {/* Add to cart button or other actions */}
    </div>
  );
};

export default ProductDetail;
