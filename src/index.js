import { Buffer } from 'buffer';
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

// 2. Polyfills and global definitions come AFTER all imports
window.Buffer = window.Buffer || Buffer;

if (window.process === undefined) {
  window.process = { env: {} };
}

if (window.process === undefined) {
  window.process = { env: {} };
};
ReactDOM.render(
    <BrowserRouter>
        <App/>
    </BrowserRouter>
    , document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();