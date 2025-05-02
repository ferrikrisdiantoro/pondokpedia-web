import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'; // Pastikan ini mengimpor file CSS
import App from './App';
import { AuthProvider } from './contexts/AuthContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
        <AuthProvider>
            <App />
        </AuthProvider>
    </React.StrictMode>,
);