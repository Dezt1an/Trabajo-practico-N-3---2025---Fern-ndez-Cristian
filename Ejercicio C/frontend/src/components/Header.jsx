import { useAuth } from '../context/AuthProvider';

const Header = () => {
  const { cerrarSesion } = useAuth();

  return (
    <header className="py-8 px-10 bg-indigo-600">
      <div className="flex justify-between items-center">
        <h1 className="font-black text-3xl text-white">
          Gestión de Flota
        </h1>

        <button
          type="button"
          className="text-indigo-600 text-sm bg-white p-3 rounded-md uppercase font-bold hover:bg-gray-200 transition-colors"
          onClick={cerrarSesion}
        >
          Cerrar Sesión
        </button>
      </div>
    </header>
  );
};

export default Header;