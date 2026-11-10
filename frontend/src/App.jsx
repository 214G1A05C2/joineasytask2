import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import { AppRoutes } from './routes/AppRoutes';

export default function App() {
  return (
    <BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3500,
          style: {
            background: '#0f172a',
            color: '#ffffff',
            borderRadius: '16px',
            fontSize: '13px',
            fontWeight: 500,
            padding: '12px 18px',
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.2), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
          },
          success: {
            iconTheme: {
              primary: '#10b981',
              secondary: '#ffffff',
            },
          },
          error: {
            iconTheme: {
              primary: '#f43f5e',
              secondary: '#ffffff',
            },
          },
        }}
      />
      <AuthProvider>
        <DataProvider>
          <AppRoutes />
        </DataProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
