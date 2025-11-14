import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthProvider.jsx';
import Alerta from '../components/Alerta.jsx';
import FormularioConductor from '../components/FormularioConductor.jsx';

const Conductores = () => {
  const [conductores, setConductores] = useState([]);
  const [alerta, setAlerta] = useState({});
  const [conductorEditar, setConductorEditar] = useState({});

  const { auth } = useAuth();

  useEffect(() => {
    const obtenerConductores = async () => {
      if (!auth.token) return;
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${auth.token}`,
        },
      };
      try {
        const url = 'http://localhost:4000/api/conductores';
        const { data } = await axios.get(url, config);
        setConductores(data);
      } catch (error) {
        setAlerta({
          msg: error.response.data.msg || 'Error al cargar los conductores',
          error: true,
        });
      }
    };
    obtenerConductores();
  }, [auth]);

  const handleEliminar = async (id) => {
    if (
      !window.confirm('¿Estás seguro de que deseas eliminar este conductor?')
    ) {
      return;
    }
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${auth.token}`,
        },
      };
      const url = `http://localhost:4000/api/conductores/${id}`;
      await axios.delete(url, config);

      const conductoresActualizados = conductores.filter((c) => c.id !== id);
      setConductores(conductoresActualizados);

      setAlerta({ msg: 'Conductor eliminado correctamente', error: false });
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
        <FormularioConductor
          conductores={conductores}
          setConductores={setConductores}
          conductorEditar={conductorEditar}
          setConductorEditar={setConductorEditar}
        />
      </div>

      <div className="md:w-2/3">
        <h2 className="text-3xl font-black text-indigo-600">
          Listado de Conductores
        </h2>
        <p className="text-xl text-gray-600 mt-4 mb-8">
          Administra tus conductores existentes.
        </p>

        <div className="bg-white shadow-md rounded-lg p-5">
          {conductores.length > 0 ? (
            <ul className="divide-y divide-gray-200">
              {conductores.map((conductor) => (
                <li
                  key={conductor.id}
                  className="py-4 px-2 flex flex-col md:flex-row justify-between items-start md:items-center"
                >
                  <div>
                    <p className="text-xl font-bold text-indigo-600">
                      {conductor.nombre} {conductor.apellido}
                    </p>
                    <p className="text-sm text-gray-600">
                      DNI: <span className="font-bold">{conductor.dni}</span>
                    </p>
                    <p className="text-sm text-gray-600">
                      Licencia: {conductor.licencia} (Vence:{' '}
                      {new Date(
                        conductor.fecha_vencimiento_licencia
                      ).toLocaleDateString()})
                    </p>
                  </div>
                  <div className="flex gap-3 mt-4 md:mt-0">
                    <button
                      type="button"
                      className="py-2 px-6 bg-yellow-500 hover:bg-yellow-600 text-white font-bold uppercase rounded-lg"
                      onClick={() => setConductorEditar(conductor)}
                    >
                      Editar
                    </button>
                    <button
                      type="button"
                      className="py-2 px-6 bg-red-600 hover:bg-red-700 text-white font-bold uppercase rounded-lg"
                      onClick={() => handleEliminar(conductor.id)}
                    >
                      Eliminar
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-center text-gray-500">
              No hay conductores registrados todavía.
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

export default Conductores;