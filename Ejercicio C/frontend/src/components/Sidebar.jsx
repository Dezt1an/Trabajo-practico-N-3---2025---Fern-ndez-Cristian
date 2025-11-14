import { Link } from 'react-router-dom';

const Sidebar = () => {
  return (
    <aside className="w-full md:w-1/4 lg:w-1/5 xl:w-1/6 px-5 py-10 bg-white shadow-md">
      <nav className="flex flex-col gap-4">
        <h2 className="text-xl font-bold text-center text-gray-700">
          Navegación
        </h2>
        <Link
          to="/admin/vehiculos"
          className="bg-indigo-600 w-full p-3 text-white uppercase font-bold rounded-md hover:bg-indigo-700 cursor-pointer transition-colors text-center"
        >
          Vehículos
        </Link>
        <Link
          to="/admin/conductores"
          className="bg-indigo-600 w-full p-3 text-white uppercase font-bold rounded-md hover:bg-indigo-700 cursor-pointer transition-colors text-center"
        >
          Conductores
        </Link>
        <Link
          to="/admin/viajes"
          className="bg-indigo-600 w-full p-3 text-white uppercase font-bold rounded-md hover:bg-indigo-700 cursor-pointer transition-colors text-center"
        >
          Viajes
        </Link>
      </nav>
    </aside>
  );
};

export default Sidebar;