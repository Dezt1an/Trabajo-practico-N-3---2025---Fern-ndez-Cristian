import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthProvider.jsx';
import Alerta from './Alerta.jsx';
import axios from 'axios';

const FormularioConductor = ({
  conductores,
  setConductores,
  conductorEditar,
  setConductorEditar,
}) => {
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [dni, setDni] = useState('');
  const [licencia, setLicencia] = useState('');
  const [fechaVencimiento, setFechaVencimiento] = useState('');
  const [id, setId] = useState(null);

  const [alerta, setAlerta] = useState({});
  const { auth } = useAuth();

  useEffect(() => {
    if (conductorEditar?.id) {
      setNombre(conductorEditar.nombre);
      setApellido(conductorEditar.apellido);
      setDni(conductorEditar.dni);
      setLicencia(conductorEditar.licencia);
      setFechaVencimiento(
        conductorEditar.fecha_vencimiento_licencia.split('T')[0]
      );
      setId(conductorEditar.id);
    }
  }, [conductorEditar]);

  const limpiarFormulario = () => {
    setNombre('');
    setApellido('');
    setDni('');
    setLicencia('');
    setFechaVencimiento('');
    setId(null);
    setConductorEditar({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if ([nombre, apellido, dni, licencia, fechaVencimiento].includes('')) {
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

    const conductorDatos = {
      nombre,
      apellido,
      dni,
      licencia,
      fecha_vencimiento_licencia: fechaVencimiento,
    };

    try {
      if (id) {
        const url = `http://localhost:4000/api/conductores/${id}`;
        await axios.put(url, conductorDatos, config);
        const conductoresActualizados = conductores.map((c) =>
          c.id === id ? { ...conductorDatos, id } : c
        );
        setConductores(conductoresActualizados);
        setAlerta({ msg: 'Conductor actualizado correctamente', error: false });
      } else {
        const url = 'http://localhost:4000/api/conductores';
        const { data } = await axios.post(url, conductorDatos, config);
        const nuevoConductor = { ...conductorDatos, id: data.id };
        setConductores([nuevoConductor, ...conductores]);
        setAlerta({ msg: 'Conductor guardado correctamente', error: false });
      }

      limpiarFormulario();
      setTimeout(() => setAlerta({}), 3000);
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
      <h2 className="text-3xl font-black text-indigo-600">
        {id ? 'Editar Conductor' : 'Añadir Conductor'}
      </h2>
      <p className="text-xl text-gray-600 mt-4 mb-8">
        {id
          ? 'Modifica los datos del conductor'
          : 'Rellena el formulario para añadir un nuevo conductor'}
      </p>

      <form
        className="bg-white shadow-md rounded-lg p-5"
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
            placeholder="Nombre del conductor"
            className="border-2 w-full p-2 mt-2 placeholder-gray-400 rounded-md focus:border-indigo-500 focus:ring-indigo-500"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
          />
        </div>
        <div className="mb-5">
          <label
            htmlFor="apellido"
            className="block text-gray-700 uppercase font-bold"
          >
            Apellido
          </label>
          <input
            id="apellido"
            type="text"
            placeholder="Apellido del conductor"
            className="border-2 w-full p-2 mt-2 placeholder-gray-400 rounded-md focus:border-indigo-500 focus:ring-indigo-500"
            value={apellido}
            onChange={(e) => setApellido(e.target.value)}
          />
        </div>
        <div className="mb-5">
          <label
            htmlFor="dni"
            className="block text-gray-700 uppercase font-bold"
          >
            DNI
          </label>
          <input
            id="dni"
            type="text"
            placeholder="DNI (sin puntos)"
            className="border-2 w-full p-2 mt-2 placeholder-gray-400 rounded-md focus:border-indigo-500 focus:ring-indigo-500"
            value={dni}
            onChange={(e) => setDni(e.target.value)}
          />
        </div>
        <div className="mb-5">
          <label
            htmlFor="licencia"
            className="block text-gray-700 uppercase font-bold"
          >
            Licencia
          </label>
          <input
            id="licencia"
            type="text"
            placeholder="Ej: B1, C3, etc."
            className="border-2 w-full p-2 mt-2 placeholder-gray-400 rounded-md focus:border-indigo-500 focus:ring-indigo-500"
            value={licencia}
            onChange={(e) => setLicencia(e.target.value)}
          />
        </div>
        <div className="mb-5">
          <label
            htmlFor="vencimiento"
            className="block text-gray-700 uppercase font-bold"
          >
            Vencimiento Licencia
          </label>
          <input
            id="vencimiento"
            type="date"
            className="border-2 w-full p-2 mt-2 placeholder-gray-400 rounded-md focus:border-indigo-500 focus:ring-indigo-500"
            value={fechaVencimiento}
            onChange={(e) => setFechaVencimiento(e.target.value)}
          />
        </div>
        <input
          type="submit"
          value={id ? 'Actualizar Conductor' : 'Guardar Conductor'}
          className="bg-indigo-600 w-full p-3 text-white uppercase font-bold rounded-md hover:bg-indigo-700 cursor-pointer transition-colors"
        />
        {id && (
          <button
            type="button"
            onClick={limpiarFormulario}
            className="bg-gray-500 w-full p-3 mt-3 text-white uppercase font-bold rounded-md hover:bg-gray-600 cursor-pointer transition-colors"
          >
            Cancelar Edición
          </button>
        )}
      </form>

      <div className="mt-5">{msg && <Alerta alerta={alerta} />}</div>
    </>
  );
};

export default FormularioConductor;