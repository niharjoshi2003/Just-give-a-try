import React from 'react';
import ReactDOM from 'react-dom/client'; // Use `react-dom/client` for React 18+
import App from './App';
import './index.css'
const rootElement = document.getElementById('root');

// Create the root using `createRoot` (React 18+)
const root = ReactDOM.createRoot(rootElement);

// Render the app
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
