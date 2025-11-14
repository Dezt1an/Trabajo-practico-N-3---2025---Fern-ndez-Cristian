import { useState } from 'react';
import { Link } from 'react-router-dom';

const Registrar = () => {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [contraseña, setContraseña] = useState('');
  const [repetirContraseña, setRepetirContraseña] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    if ([nombre, email, contraseña, repetirContraseña].includes('')) {
      console.log('Error: Todos los campos son obligatorios');
      return;
    }

    if (contraseña !== repetirContraseña) {
      console.log('Error: Las contraseñas no coinciden');
      return;
    }

    console.log('Enviando formulario...');
  };

  return (
    <div className="md:w-2/3 lg:w-2/5 mx-auto">
      <h1 className="text-4xl font-black text-center">Crea tu Cuenta</h1>
      <p className="text-lg text-center mt-4">
        Completa el formulario para registrarte
      </p>

      <form
        className="mt-10 bg-white shadow-md rounded-lg p-8"
        onSubmit={handleSubmit}
      >
        <div className="mb-5">
          <label
            htmlFor="nombre"
            className="block text-gray-700 uppercase font-bold"
          >
            Nombre
          </label>
          <input
            id="nombre"
            type="text"
            placeholder="Tu Nombre"
            className="border-2 w-full p-2 mt-2 placeholder-gray-400 rounded-md"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
          />
        </div>

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
            className="border-2 w-full p-2 mt-2 placeholder-gray-400 rounded-md"
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
            className="border-2 w-full p-2 mt-2 placeholder-gray-400 rounded-md"
            value={contraseña}
            onChange={(e) => setContraseña(e.target.value)}
          />
        </div>

        <div className="mb-5">
          <label
            htmlFor="password2"
            className="block text-gray-700 uppercase font-bold"
          >
            Repetir Contraseña
          </label>
          <input
            id="password2"
            type="password"
            placeholder="Repite tu Contraseña"
            className="border-2 w-full p-2 mt-2 placeholder-gray-400 rounded-md"
            value={repetirContraseña}
            onChange={(e) => setRepetirContraseña(e.target.value)}
          />
        </div>

        <input
          type="submit"
          value="Crear Cuenta"
          className="bg-blue-600 w-full p-3 text-white uppercase font-bold rounded-md hover:bg-blue-700 cursor-pointer transition-colors"
        />
      </form>

      <nav className="mt-5 text-center">
        <Link to="/" className="text-gray-500 hover:text-gray-700">
          ¿Ya tienes una cuenta? Inicia Sesión
        </Link>
      </nav>
    </div>
  );
};

export default Registrar;