import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

import AuthContextProvider from './AuthContext/AuthContextProvider.jsx'
// import { store } from './Redux/store';

// import { Provider } from 'react-redux'

import { BrowserRouter } from 'react-router-dom'
import axios from 'axios';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    {/* <Provider store={store}> */}
    <BrowserRouter>

      <AuthContextProvider>

        <App />

      </AuthContextProvider>


    </BrowserRouter>
    {/* </Provider> */}
  </React.StrictMode>
);


setInterval(() => {

  let token = localStorage.getItem('token') || null;

  if (token) {
    axios.get(`${process.env.REACT_APP_BASE_URL}/user/active`, { headers: { 'Authorization': `Bearer ${token}` } }).then((res) => {
      console.log(res.data);
    }).catch((err) => {
      console.error(err)
    })
  }

}, 3000);