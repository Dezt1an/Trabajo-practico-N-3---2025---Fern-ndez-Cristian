import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthProvider.jsx';
import Alerta from '../components/Alerta.jsx';
import FormularioVehiculo from '../components/FormularioVehiculo.jsx';

const Vehiculos = () => {
  const [vehiculos, setVehiculos] = useState([]);
  const [alerta, setAlerta] = useState({});
  const [vehiculoEditar, setVehiculoEditar] = useState({});

  const { auth } = useAuth();

  useEffect(() => {
    const obtenerVehiculos = async () => {
      if (!auth.token) return;
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${auth.token}`,
        },
      };
      try {
        const url = 'http://localhost:4000/api/vehiculos';
        const { data } = await axios.get(url, config);
        setVehiculos(data);
      } catch (error) {
        setAlerta({
          msg: error.response.data.msg || 'Error al cargar los vehículos',
          error: true,
        });
      }
    };
    obtenerVehiculos();
  }, [auth]);

  const handleEliminar = async (id) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar este vehículo?')) {
      return;
    }

    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${auth.token}`,
        },
      };
      const url = `http://localhost:4000/api/vehiculos/${id}`;
      await axios.delete(url, config);

      const vehiculosActualizados = vehiculos.filter((v) => v.id !== id);
      setVehiculos(vehiculosActualizados);

      setAlerta({ msg: 'Vehículo eliminado correctamente', error: false });
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
        <FormularioVehiculo
          vehiculos={vehiculos}
          setVehiculos={setVehiculos}
          vehiculoEditar={vehiculoEditar}
          setVehiculoEditar={setVehiculoEditar}
        />
      </div>

      <div className="md:w-2/3">
        <h2 className="text-3xl font-black text-indigo-600">
          Listado de Vehículos
        </h2>
        <p className="text-xl text-gray-600 mt-4 mb-8">
          Administra tus vehículos existentes.
        </p>

        <div className="bg-white shadow-md rounded-lg p-5">
          {vehiculos.length > 0 ? (
            <ul className="divide-y divide-gray-200">
              {vehiculos.map((vehiculo) => (
                <li
                  key={vehiculo.id}
                  className="py-4 px-2 flex flex-col md:flex-row justify-between items-start md:items-center"
                >
                  <div>
                    <p className="text-xl font-bold text-indigo-600">
                      {vehiculo.marca} {vehiculo.modelo}
                    </p>
                    <p className="text-sm text-gray-600">
                      Patente: <span className="font-bold">{vehiculo.patente}</span>
                    </p>
                    <p className="text-sm text-gray-600">
                      Año: {vehiculo.año} - Capacidad: {vehiculo.capacidad_carga} kg
                    </p>
                  </div>
                  <div className="flex gap-3 mt-4 md:mt-0">
                    <button
                      type="button"
                      className="py-2 px-6 bg-yellow-500 hover:bg-yellow-600 text-white font-bold uppercase rounded-lg"
                      onClick={() => setVehiculoEditar(vehiculo)}
                    >
                      Editar
                    </button>
                    <button
                      type="button"
                      className="py-2 px-6 bg-red-600 hover:bg-red-700 text-white font-bold uppercase rounded-lg"
                      onClick={() => handleEliminar(vehiculo.id)}
                    >
                      Eliminar
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-center text-gray-500">
              No hay vehículos registrados todavía.
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

export default Vehiculos;