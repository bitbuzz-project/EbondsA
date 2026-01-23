import React from 'react';
import { Box } from '@mui/material';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';

const BaseLayout = ({ children }) => {
  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      minHeight: '100vh',
      bgcolor: '#05090f',
      // overflowX: 'hidden' <--- DELETED THIS LINE (It breaks fixed headers)
    }}>
      <Header />

      <Box component="main" sx={{ flexGrow: 1, width: '100%' }}>
        {children}
      </Box>

      <Footer />
    </Box>
  );
};

export default BaseLayout;