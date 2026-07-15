import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';

import App from './App.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import { PreferencesProvider } from './context/PreferencesContext.jsx';
import { store } from './store/store.js';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Provider store={store}>
        <PreferencesProvider>
          <AuthProvider>
            <App />
          </AuthProvider>
        </PreferencesProvider>
      </Provider>
    </BrowserRouter>
  </React.StrictMode>
);