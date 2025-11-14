import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import './index.css';

import App from './App.jsx';
import RutaProtegida from './layouts/RutaProtegida.jsx';
import Login from './pages/Login.jsx';
import Registrar from './pages/Registrar.jsx';
import Dashboard from './pages/Dashboard.jsx';
import AuthProvider from './context/AuthProvider.jsx';
import Vehiculos from './pages/Vehiculos.jsx';
import Conductores from './pages/Conductores.jsx';
import Viajes from './pages/Viajes.jsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        index: true,
        element: <Login />,
      },
      {
        path: '/registrar',
        element: <Registrar />,
      },
    ],
  },
  {
    path: '/admin',
    element: <RutaProtegida />,
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
      {
        path: 'vehiculos',
        element: <Vehiculos />,
      },
      {
        path: 'conductores',
        element: <Conductores />,
      },
      {
        path: 'viajes',
        element: <Viajes />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>
);