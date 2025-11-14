import { useState } from 'react';
import { useAuth } from '../context/AuthProvider.jsx';
import Alerta from './Alerta.jsx';
import axios from 'axios';

const FormularioVehiculo = ({ vehiculos, setVehiculos }) => {
  const [marca, setMarca] = useState('');
  const [modelo, setModelo] = useState('');
  const [patente, setPatente] = useState('');
  const [año, setAño] = useState('');
  const [capacidad, setCapacidad] = useState('');

  const [alerta, setAlerta] = useState({});

  const { auth } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if ([marca, modelo, patente, año, capacidad].includes('')) {
      setAlerta({ msg: 'Todos los campos son obligatorios', error: true });
      return;
    }

    setAlerta({});

    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${auth.token}`,
      },
    };

    try {
      const url = 'http://localhost:4000/api/vehiculos';
      const { data } = await axios.post(
        url,
        { marca, modelo, patente, año, capacidad_carga: capacidad },
        config
      );

      const nuevoVehiculo = {
        id: data.id,
        marca,
        modelo,
        patente,
        año,
        capacidad_carga: capacidad,
      };

      setVehiculos([nuevoVehiculo, ...vehiculos]);

      setAlerta({ msg: 'Vehículo guardado correctamente', error: false });
      setMarca('');
      setModelo('');
      setPatente('');
      setAño('');
      setCapacidad('');

      setTimeout(() => {
        setAlerta({});
      }, 3000);

    } catch (error) {
      setAlerta({
        msg: error.response.data.msg || 'Error al guardar',
        error: true,
      });
    }
  };

  const { msg } = alerta;

  return (
    <>
      <h2 className="text-3xl font-black text-indigo-600">Añadir Vehículo</h2>
      <p className="text-xl text-gray-600 mt-4 mb-8">
        Rellena el formulario
      </p>

      <form
        className="bg-white shadow-md rounded-lg p-5"
        onSubmit={handleSubmit}
      >
        <div className="mb-5">
          <label
            htmlFor="marca"
            className="block text-gray-700 uppercase font-bold"
          >
            Marca
          </label>
          <input
            id="marca"
            type="text"
            placeholder="Ej: Ford"
            className="border-2 w-full p-2 mt-2 placeholder-gray-400 rounded-md focus:border-indigo-500 focus:ring-indigo-500"
            value={marca}
            onChange={(e) => setMarca(e.target.value)}
          />
        </div>

        <div className="mb-5">
          <label
            htmlFor="modelo"
            className="block text-gray-700 uppercase font-bold"
          >
            Modelo
          </label>
          <input
            id="modelo"
            type="text"
            placeholder="Ej: Ranger"
            className="border-2 w-full p-2 mt-2 placeholder-gray-400 rounded-md focus:border-indigo-500 focus:ring-indigo-500"
            value={modelo}
            onChange={(e) => setModelo(e.target.value)}
          />
        </div>

        <div className="mb-5">
          <label
            htmlFor="patente"
            className="block text-gray-700 uppercase font-bold"
          >
            Patente
          </label>
          <input
            id="patente"
            type="text"
            placeholder="Ej: AB123CD"
            className="border-2 w-full p-2 mt-2 placeholder-gray-400 rounded-md focus:border-indigo-500 focus:ring-indigo-500"
            value={patente}
            onChange={(e) => setPatente(e.target.value)}
          />
        </div>

        <div className="mb-5">
          <label
            htmlFor="año"
            className="block text-gray-700 uppercase font-bold"
          >
            Año
          </label>
          <input
            id="año"
            type="number"
            placeholder="Ej: 2022"
            className="border-2 w-full p-2 mt-2 placeholder-gray-400 rounded-md focus:border-indigo-500 focus:ring-indigo-500"
            value={año}
            onChange={(e) => setAño(e.target.value)}
          />
        </div>

        <div className="mb-5">
          <label
            htmlFor="capacidad"
            className="block text-gray-700 uppercase font-bold"
          >
            Capacidad de Carga (kg)
          </label>
          <input
            id="capacidad"
            type="number"
            placeholder="Ej: 1000"
            className="border-2 w-full p-2 mt-2 placeholder-gray-400 rounded-md focus:border-indigo-500 focus:ring-indigo-500"
            value={capacidad}
            onChange={(e) => setCapacidad(e.target.value)}
          />
        </div>

        <input
          type="submit"
          value="Guardar Vehículo"
          className="bg-indigo-600 w-full p-3 text-white uppercase font-bold rounded-md hover:bg-indigo-700 cursor-pointer transition-colors"
        />
      </form>

      <div className="mt-5">
        {msg && <Alerta alerta={alerta} />}
      </div>
    </>
  );
};

export default FormularioVehiculo;