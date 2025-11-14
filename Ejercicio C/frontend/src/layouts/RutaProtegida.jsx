import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthProvider.jsx';

const RutaProtegida = () => {
  const { auth, cargando } = useAuth();

  if (cargando) return <p>Cargando...</p>;

  if (!auth.token) {
    return <Navigate to="/" />;
  }

  return (
    <main>
      <h1 className="text-4xl font-bold text-indigo-600 p-10">
        PANEL DE ADMINISTRACIÓN
      </h1>
      <Outlet />
    </main>
  );
};

export default RutaProtegida;