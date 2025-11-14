import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthProvider.jsx';
import Header from '../components/Header.jsx';
import Sidebar from '../components/Sidebar.jsx';

const RutaProtegida = () => {
  const { auth, cargando } = useAuth();

  if (cargando) return <p>Cargando...</p>;

  if (!auth.token) {
    return <Navigate to="/" />;
  }

  return (
    <div className="bg-indigo-100 min-h-screen">
      <Header />
      <div className="md:flex min-h-screen">
        <Sidebar />
        <main className="flex-1 p-10">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default RutaProtegida;