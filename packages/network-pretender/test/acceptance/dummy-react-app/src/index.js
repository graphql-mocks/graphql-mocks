/* eslint-disable no-undef */
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { setup as setupPretender } from './mocks';

setupPretender();

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root'),
);
