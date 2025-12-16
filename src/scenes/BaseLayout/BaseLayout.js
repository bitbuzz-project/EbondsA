import React from 'react';
import { Box, Container } from '@mui/material';
import { ToastContainer } from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css'; 
import Header from '../Header/Header';
import Footer from '../Footer/Footer';

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
      
      {/* PRO NOTIFICATION STYLING */}
      <ToastContainer 
        position="bottom-right" 
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        // Custom Styles to match your Theme.js
        toastStyle={{ 
            backgroundColor: '#1a202c', // Your Secondary Dark Color
            color: '#ffffff',
            borderRadius: '12px',       // Rounded corners like your cards
            fontFamily: '"Space Grotesk", sans-serif', // Your custom font
            fontSize: '0.9rem',
            fontWeight: 600,
            boxShadow: '0 10px 40px rgba(0,0,0,0.2)' // Deep shadow for depth
        }}
      /> 
    </Box>
  );
};

export default BaseLayout;