import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthProvider.jsx';
import Alerta from '../components/Alerta.jsx';
import FormularioViaje from '../components/FormularioViaje.jsx';

const Viajes = () => {
  const [viajes, setViajes] = useState([]);
  const [alerta, setAlerta] = useState({});
  const [viajeEditar, setViajeEditar] = useState({});

  const { auth } = useAuth();

  useEffect(() => {
    const obtenerViajes = async () => {
      if (!auth.token) return;
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${auth.token}`,
        },
      };
      try {
        const url = 'http://localhost:4000/api/viajes';
        const { data } = await axios.get(url, config);
        setViajes(data);
      } catch (error) {
        setAlerta({
          msg: error.response.data.msg || 'Error al cargar los viajes',
          error: true,
        });
      }
    };
    obtenerViajes();
  }, [auth, viajes]);

  const handleEliminar = async (id) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar este viaje?')) {
      return;
    }
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${auth.token}`,
        },
      };
      const url = `http://localhost:4000/api/viajes/${id}`;
      await axios.delete(url, config);
      const viajesActualizados = viajes.filter((v) => v.id !== id);
      setViajes(viajesActualizados);
      setAlerta({ msg: 'Viaje eliminado correctamente', error: false });
      setTimeout(() => setAlerta({}), 3000);
    } catch (error) {
      setAlerta({
        msg: error.response.data.msg || 'Error al eliminar',
        error: true,
      });
    }
  };

  const { msg } = alerta;

  return (
    <div className="md:flex gap-10">
      <div className="md:w-1/3">
        <FormularioViaje
          viajes={viajes}
          setViajes={setViajes}
          viajeEditar={viajeEditar}
          setViajeEditar={setViajeEditar}
        />
      </div>

      <div className="md:w-2/3">
        <h2 className="text-3xl font-black text-indigo-600">
          Listado de Viajes
        </h2>
        <p className="text-xl text-gray-600 mt-4 mb-8">
          Administra tus viajes existentes.
        </p>

        <div className="bg-white shadow-md rounded-lg p-5">
          {viajes.length > 0 ? (
            <ul className="divide-y divide-gray-200">
              {viajes.map((viaje) => (
                <li
                  key={viaje.id}
                  className="py-4 px-2 flex flex-col md:flex-row justify-between items-start md:items-center"
                >
                  <div>
                    <p className="text-xl font-bold text-indigo-600">
                      {viaje.origen} → {viaje.destino}
                    </p>
                    <p className="text-sm text-gray-600">
                      Vehículo:{' '}
                      <span className="font-bold">
                        {viaje.vehiculo_patente}
                      </span>
                    </p>
                    <p className="text-sm text-gray-600">
                      Conductor:{' '}
                      <span className="font-bold">
                        {viaje.conductor_nombre} {viaje.conductor_apellido}
                      </span>
                    </p>
                    <p className="text-sm text-gray-600">
                      Salida:{' '}
                      {new Date(viaje.fecha_salida).toLocaleDateString()}
                    </p>
                    <p className="text-sm text-gray-600">
                      KM: {viaje.kilometros}
                    </p>
                  </div>
                  <div className="flex gap-3 mt-4 md:mt-0">
                    <button
                      type="button"
                      className="py-2 px-6 bg-yellow-500 hover:bg-yellow-600 text-white font-bold uppercase rounded-lg"
                      onClick={() => setViajeEditar(viaje)}
                    >
                      Editar
                    </button>
                    <button
                      type="button"
                      className="py-2 px-6 bg-red-600 hover:bg-red-700 text-white font-bold uppercase rounded-lg"
                      onClick={() => handleEliminar(viaje.id)}
                    >
                      Eliminar
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-center text-gray-500">
              No hay viajes registrados todavía.
            </p>
          )}
        </div>
        
        <div className="mt-5">
          {msg && <Alerta alerta={alerta} />}
        </div>
      </div>
    </div>
  );
};

export default Viajes;