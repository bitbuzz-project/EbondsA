import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ThemeProvider } from '@mui/material/styles'; 
import CssBaseline from '@mui/material/CssBaseline'; 
import { Web3ReactProvider } from '@web3-react/core';
import { ethers } from 'ethers';
import { ToastContainer } from 'react-toastify'; // Import Container

// Project imports
import { routes } from './routes';
import history from './history';
import BaseLayout from './scenes/BaseLayout/BaseLayout';
import store from './app/store';
import theme from './theme'; 
import PrivateRoute from './scenes/PrivateRoute/PrivateRoute';
import ScrollToTop from './scenes/ScrollToTop/ScrollToTop';

import './fonts.css';
import 'react-toastify/dist/ReactToastify.css';
import "animate.css/animate.min.css";

// Increase polling to 15 seconds to prevent 429 Errors
const POLLING_INTERVAL = 15000;

const getLibrary = (provider) => {
  const library = new ethers.providers.Web3Provider(provider);
  library.pollingInterval = POLLING_INTERVAL;
  return library;
};

const reload = () => window.location.reload();

const App = () => {
  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <CssBaseline /> 
          <ScrollToTop />
          
          {/* NOTIFICATION SYSTEM ACTIVATED */}
          <ToastContainer 
            position="bottom-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={true}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="dark"
            toastStyle={{ 
              backgroundColor: '#0a1019', 
              border: '1px solid rgba(210, 157, 92, 0.3)', 
              color: '#fff',
              fontFamily: '"Space Grotesk", sans-serif'
            }}
          />

          <BaseLayout history={history}>
            <Routes>
              {routes.map((route) => {
                if (route.isProtected)
                  return (
                    <Route key={route.path} path={route.path} element={<PrivateRoute />}>
                      <Route key={route.path} path={route.path} exact={route.exact} element={route.component} />
                    </Route>
                  )
                return (<Route key={route.path} path={route.path} exact={route.exact} element={route.component} />)
              })}
              <Route path="/TermsAndConditions.html" onEnter={reload} />
            </Routes>
          </BaseLayout>
        </ThemeProvider>
      </Provider>
    </Web3ReactProvider>
  );
}

export default App;