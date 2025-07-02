import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import  UserProvider  from './context/userContext.jsx';
import { LoadingProvider } from './context/loadingContext.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <UserProvider>
      <LoadingProvider>
        <App />
      </LoadingProvider>
    </UserProvider>
  </React.StrictMode>
);
