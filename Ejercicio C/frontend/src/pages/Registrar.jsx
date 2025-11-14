import { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Alerta from '../components/Alerta.jsx';

const Registrar = () => {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [contraseña, setContraseña] = useState('');
  const [repetirContraseña, setRepetirContraseña] = useState('');
  const [alerta, setAlerta] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();

    if ([nombre, email, contraseña, repetirContraseña].includes('')) {
      setAlerta({ msg: 'Todos los campos son obligatorios', error: true });
      return;
    }
    if (contraseña !== repetirContraseña) {
      setAlerta({ msg: 'Las contraseñas no coinciden', error: true });
      return;
    }
    if (contraseña.length < 6) {
      setAlerta({
        msg: 'La contraseña debe tener al menos 6 caracteres',
        error: true,
      });
      return;
    }
    setAlerta({});

    try {
      const url = 'http://localhost:4000/api/usuarios/registrar';
      await axios.post(url, { nombre, email, contraseña });
      setAlerta({
        msg: 'Usuario creado correctamente',
        error: false,
      });
      setNombre('');
      setEmail('');
      setContraseña('');
      setRepetirContraseña('');
    } catch (error) {
      setAlerta({
        msg: error.response.data.msg,
        error: true,
      });
    }
  };

  const { msg } = alerta;

  return (
    <div className="md:w-2/3 lg:w-2/5 mx-auto">
      <h1 className="text-4xl font-black text-center text-indigo-600">
        Crea tu Cuenta
      </h1>
      <p className="text-lg text-center mt-4">
        Completa el formulario para registrarte
      </p>

      {msg && <Alerta alerta={alerta} />}

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
            className="border-2 w-full p-2 mt-2 placeholder-gray-400 rounded-md focus:border-indigo-500 focus:ring-indigo-500"
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
            className="border-2 w-full p-2 mt-2 placeholder-gray-400 rounded-md focus:border-indigo-500 focus:ring-indigo-500"
            value={repetirContraseña}
            onChange={(e) => setRepetirContraseña(e.target.value)}
          />
        </div>

        <input
          type="submit"
          value="Crear Cuenta"
          className="bg-indigo-600 w-full p-3 text-white uppercase font-bold rounded-md hover:bg-indigo-700 cursor-pointer transition-colors"
        />
      </form>

      <nav className="mt-5 text-center">
        <Link to="/" className="text-gray-500 hover:text-indigo-600">
          ¿Ya tienes una cuenta? Inicia Sesión
        </Link>
      </nav>
    </div>
  );
};

export default Registrar;