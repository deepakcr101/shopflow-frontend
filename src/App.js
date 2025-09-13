
import React, { useEffect, Suspense } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import ProtectedRoute from './components/ProtectedRoute';
import { CircularProgress } from '@mui/material';

const Home = React.lazy(() => import('./components/Home'));
const ProductList = React.lazy(() => import('./components/ProductList'));
const ProductDetail = React.lazy(() => import('./components/ProductDetail'));
const Cart = React.lazy(() => import('./components/Cart'));
const Checkout = React.lazy(() => import('./components/Checkout'));
const AdminDashboard = React.lazy(() => import('./components/AdminDashboard'));
const ProductManagement = React.lazy(() => import('./components/ProductManagement'));
const OrderManagement = React.lazy(() => import('./components/OrderManagement'));
const Login = React.lazy(() => import('./components/Login'));
const Signup = React.lazy(() => import('./components/Signup'));

function App() {
  const authError = useSelector((state) => state.auth.error);
  const productsError = useSelector((state) => state.products.error);
  const cartError = useSelector((state) => state.cart.error);
  const ordersError = useSelector((state) => state.orders.error);

  useEffect(() => {
    if (authError) {
      toast.error(authError);
    }
    if (productsError) {
      toast.error(productsError);
    }
    if (cartError) {
      toast.error(cartError);
    }
    if (ordersError) {
      toast.error(ordersError);
    }
  }, [authError, productsError, cartError, ordersError]);

  return (
    <Router>
      <MainLayout>
        <Suspense fallback={<CircularProgress />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<ProductList />} />
            <Route path="/products/:id" element={<ProductDetail />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            {/* Protected Admin Routes */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute adminOnly={true}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/products"
              element={
                <ProtectedRoute adminOnly={true}>
                  <ProductManagement />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/orders"
              element={
                <ProtectedRoute adminOnly={true}>
                  <OrderManagement />
                </ProtectedRoute>
              }
            />
            {/* Fallback for any unmatched routes */}
            <Route path="*" element={<div>Page Not Found</div>} />
          </Routes>
        </Suspense>
      </MainLayout>
    </Router>
  );
}

export default App;
