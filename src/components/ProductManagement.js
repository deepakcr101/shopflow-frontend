import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: '',
    quantity: '',
  });
  const [editingProduct, setEditingProduct] = useState(null);
  const [error, setError] = useState(null);

  const PRODUCT_SERVICE_URL = process.env.REACT_APP_PRODUCT_SERVICE_URL || 'http://localhost:8082';

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${PRODUCT_SERVICE_URL}/api/products`);
      setProducts(response.data);
    } catch (err) {
      setError('Failed to fetch products.');
      console.error('Error fetching products:', err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (editingProduct) {
      setEditingProduct({ ...editingProduct, [name]: value });
    } else {
      setNewProduct({ ...newProduct, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      if (editingProduct) {
        await axios.put(`${PRODUCT_SERVICE_URL}/api/products/${editingProduct.id}`, editingProduct);
        setEditingProduct(null);
      } else {
        await axios.post(`${PRODUCT_SERVICE_URL}/api/products`, newProduct);
        setNewProduct({ name: '', description: '', price: '', quantity: '' });
      }
      fetchProducts();
    } catch (err) {
      setError('Failed to save product.');
      console.error('Error saving product:', err);
    }
  };

  const handleDelete = async (id) => {
    setError(null);
    try {
      await axios.delete(`${PRODUCT_SERVICE_URL}/api/products/${id}`);
      fetchProducts();
    } catch (err) {
      setError('Failed to delete product.');
      console.error('Error deleting product:', err);
    }
  };

  const startEditing = (product) => {
    setEditingProduct({ ...product });
  };

  const cancelEditing = () => {
    setEditingProduct(null);
  };

  return (
    <div>
      <h2>Product Management</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <h3>{editingProduct ? 'Edit Product' : 'Add New Product'}</h3>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name:</label>
          <input
            type="text"
            name="name"
            value={editingProduct ? editingProduct.name : newProduct.name}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Description:</label>
          <textarea
            name="description"
            value={editingProduct ? editingProduct.description : newProduct.description}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Price:</label>
          <input
            type="number"
            name="price"
            value={editingProduct ? editingProduct.price : newProduct.price}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Quantity:</label>
          <input
            type="number"
            name="quantity"
            value={editingProduct ? editingProduct.quantity : newProduct.quantity}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit">{editingProduct ? 'Update Product' : 'Add Product'}</button>
        {editingProduct && <button type="button" onClick={cancelEditing}>Cancel</button>}
      </form>

      <h3>Existing Products</h3>
      {products.length === 0 ? (
        <p>No products found.</p>
      ) : (
        <div className="product-list">
          {products.map((product) => (
            <div key={product.id} className="product-item">
              <h4>{product.name}</h4>
              <p>{product.description}</p>
              <p>Price: ${product.price}</p>
              <p>Quantity: {product.quantity}</p>
              <button onClick={() => startEditing(product)}>Edit</button>
              <button onClick={() => handleDelete(product.id)}>Delete</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductManagement;
