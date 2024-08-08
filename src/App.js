import React from 'react'
import {
  BrowserRouter,
  Route,
  Routes,
  Router,
} from 'react-router-dom'
import { Provider } from 'react-redux';
import { routes } from './routes'
import history from './history'
import BaseLayout from './scenes/BaseLayout/BaseLayout'

import { Web3ReactProvider } from '@web3-react/core';
import { ethers } from 'ethers';

import './fonts.css';
import 'react-toastify/dist/ReactToastify.css';

import store from './app/store'
import PrivateRoute from './scenes/PrivateRoute/PrivateRoute';
import "animate.css/animate.min.css";
import ScrollToTop from './scenes/ScrollToTop/ScrollToTop';

const POLLING_INTERVAL = 12000;

const getLibrary = (provider) => {
  const library = new ethers.providers.Web3Provider(provider);
  library.pollingInterval = POLLING_INTERVAL;
  return library;
};

const reload = () => window.location.reload();

class App extends React.PureComponent {

  render() {
    return (
      <Web3ReactProvider getLibrary={getLibrary}>
        <ScrollToTop />
        <Provider store={store}>
          <BaseLayout history={history}>
            <Routes>
              {routes.map((route) => {

                if (route.isProtected)
                  return (
                    <Route key={route.path} path={route.path} element={<PrivateRoute />} >
                      <Route key={route.path} path={route.path} exact={route.exact} element={route.component} />
                    </Route>
                  )

                return (<Route key={route.path} path={route.path} exact={route.exact} element={route.component} />)
              }
              )}

              <Route path="/TermsAndConditions.html" onEnter={reload} />
            </Routes>
          </BaseLayout>
        </Provider>
      </Web3ReactProvider>

    )
  }
}

export default App