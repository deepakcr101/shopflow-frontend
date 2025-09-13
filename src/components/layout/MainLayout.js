
import React from 'react';
import Header from './Header';
import Footer from './Footer';
import { Container } from '@mui/material';

const MainLayout = ({ children }) => {
  return (
    <>
      <Header />
      <Container component="main" sx={{ mt: 4, mb: 4 }}>
        {children}
      </Container>
      <Footer />
    </>
  );
};

export default MainLayout;
