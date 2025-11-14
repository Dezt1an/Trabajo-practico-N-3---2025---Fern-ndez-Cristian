import { useState } from 'react';
import { Link } from 'react-router-dom';
// (Asegúrate de importar Alerta si lo añades aquí)

const Login = () => {
  const [email, setEmail] = useState('');
  const [contraseña, setContraseña] = useState('');
  // (Aquí iría el state de Alerta y el handleSubmit para conectar a la API)

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Iniciando sesión...');
  };

  return (
    <div className="md:w-2/3 lg:w-2/5 mx-auto">
      <h1 className="text-4xl font-black text-center text-indigo-600">
        Iniciar Sesión
      </h1>
      <p className="text-lg text-center mt-4">
        Administra tus vehículos, conductores y viajes
      </p>

      {/* Aquí iría {msg && <Alerta ... />} */}

      <form
        className="mt-10 bg-white shadow-md rounded-lg p-8"
        onSubmit={handleSubmit}
      >
        <div className="mb-5">
          <label
            htmlFor="email"
            className="block text-gray-700 uppercase font-bold"
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            placeholder="Tu Email"
            className="border-2 w-full p-2 mt-2 placeholder-gray-400 rounded-md focus:border-indigo-500 focus:ring-indigo-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="mb-5">
          <label
            htmlFor="password"
            className="block text-gray-700 uppercase font-bold"
          >
            Contraseña
          </label>
          <input
            id="password"
            type="password"
            placeholder="Tu Contraseña"
            className="border-2 w-full p-2 mt-2 placeholder-gray-400 rounded-md focus:border-indigo-500 focus:ring-indigo-500"
            value={contraseña}
            onChange={(e) => setContraseña(e.target.value)}
          />
        </div>

        <input
          type="submit"
          value="Iniciar Sesión"
          className="bg-indigo-600 w-full p-3 text-white uppercase font-bold rounded-md hover:bg-indigo-700 cursor-pointer transition-colors"
        />
      </form>

      <nav className="mt-5 text-center">
        <Link
          to="/registrar"
          className="text-gray-500 hover:text-indigo-600"
        >
          ¿No tienes una cuenta? Regístrate
        </Link>
      </nav>
    </div>
  );
};

export default Login;