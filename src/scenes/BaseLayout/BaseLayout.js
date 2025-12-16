import React from 'react';
import { Box, Container } from '@mui/material';
import Header from '../Header/Header';
import Footer from '../Footer/Footer'; // <--- FIXED: Removed curly braces { }

const BaseLayout = ({ children }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh', 
        bgcolor: 'background.default',
      }}
    >
      <Header />
      
      {/* Main Content Area */}
      <Container
        maxWidth="xl" 
        component="main"
        sx={{
          flexGrow: 1, 
          py: 4, 
          mt: { xs: 8, md: 10 },
          position: 'relative',
          zIndex: 1,
        }}
      >
        {children}
      </Container>

      <Footer />
    </Box>
  );
};

export default BaseLayout;