import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthProvider.jsx';
import Alerta from './Alerta.jsx';
import axios from 'axios';

const FormularioViaje = ({ viajes, setViajes, viajeEditar, setViajeEditar }) => {
  const [vehiculoId, setVehiculoId] = useState('');
  const [conductorId, setConductorId] = useState('');
  const [fechaSalida, setFechaSalida] = useState('');
  const [fechaLlegada, setFechaLlegada] = useState('');
  const [origen, setOrigen] = useState('');
  const [destino, setDestino] = useState('');
  const [kilometros, setKilometros] = useState('');
  const [observaciones, setObservaciones] = useState('');
  const [id, setId] = useState(null);

  const [listaVehiculos, setListaVehiculos] = useState([]);
  const [listaConductores, setListaConductores] = useState([]);

  const [alerta, setAlerta] = useState({});
  const { auth } = useAuth();

  useEffect(() => {
    if (!auth.token) return;

    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${auth.token}`,
      },
    };

    const cargarDependencias = async () => {
      try {
        const { data: vehiculos } = await axios.get(
          'http://localhost:4000/api/vehiculos',
          config
        );
        setListaVehiculos(vehiculos);

        const { data: conductores } = await axios.get(
          'http://localhost:4000/api/conductores',
          config
        );
        setListaConductores(conductores);
      } catch (error) {
        setAlerta({ msg: 'Error al cargar datos', error: true });
      }
    };
    cargarDependencias();
  }, [auth]);

  useEffect(() => {
    if (viajeEditar?.id) {
      setVehiculoId(viajeEditar.vehiculo_id);
      setConductorId(viajeEditar.conductor_id);
      setFechaSalida(viajeEditar.fecha_salida.split('T')[0]);
      setFechaLlegada(viajeEditar.fecha_llegada?.split('T')[0] || '');
      setOrigen(viajeEditar.origen);
      setDestino(viajeEditar.destino);
      setKilometros(viajeEditar.kilometros);
      setObservaciones(viajeEditar.observaciones || '');
      setId(viajeEditar.id);
    }
  }, [viajeEditar]);

  const limpiarFormulario = () => {
    setVehiculoId('');
    setConductorId('');
    setFechaSalida('');
    setFechaLlegada('');
    setOrigen('');
    setDestino('');
    setKilometros('');
    setObservaciones('');
    setId(null);
    setViajeEditar({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      [
        vehiculoId,
        conductorId,
        fechaSalida,
        origen,
        destino,
        kilometros,
      ].includes('')
    ) {
      setAlerta({ msg: 'Campos obligatorios faltantes', error: true });
      return;
    }
    setAlerta({});

    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${auth.token}`,
      },
    };

    const viajeDatos = {
      vehiculo_id: vehiculoId,
      conductor_id: conductorId,
      fecha_salida: fechaSalida,
      fecha_llegada: fechaLlegada || null,
      origen,
      destino,
      kilometros,
      observaciones,
    };

    try {
      if (id) {
        const url = `http://localhost:4000/api/viajes/${id}`;
        await axios.put(url, viajeDatos, config);

        const viajesActualizados = viajes.map((v) =>
          v.id === id ? { ...v, ...viajeDatos } : v
        );
        setViajes(viajesActualizados);
        setAlerta({ msg: 'Viaje actualizado correctamente', error: false });
      } else {
        const url = 'http://localhost:4000/api/viajes';
        const { data } = await axios.post(url, viajeDatos, config);
        const nuevoViaje = { ...viajeDatos, id: data.id };
        setViajes([nuevoViaje, ...viajes]);
        setAlerta({ msg: 'Viaje guardado correctamente', error: false });
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
        {id ? 'Editar Viaje' : 'Añadir Viaje'}
      </h2>
      <p className="text-xl text-gray-600 mt-4 mb-8">
        {id
          ? 'Modifica los datos del viaje'
          : 'Rellena el formulario para registrar un nuevo viaje'}
      </p>

      <form
        className="bg-white shadow-md rounded-lg p-5"
        onSubmit={handleSubmit}
      >
        <div className="mb-5">
          <label
            htmlFor="vehiculo"
            className="block text-gray-700 uppercase font-bold"
          >
            Vehículo
          </label>
          <select
            id="vehiculo"
            className="border-2 w-full p-2 mt-2 rounded-md focus:border-indigo-500 focus:ring-indigo-500"
            value={vehiculoId}
            onChange={(e) => setVehiculoId(e.target.value)}
          >
            <option value="">-- Seleccionar Vehículo --</option>
            {listaVehiculos.map((v) => (
              <option key={v.id} value={v.id}>
                {v.marca} {v.modelo} (Patente: {v.patente})
              </option>
            ))}
          </select>
        </div>

        <div className="mb-5">
          <label
            htmlFor="conductor"
            className="block text-gray-700 uppercase font-bold"
          >
            Conductor
          </label>
          <select
            id="conductor"
            className="border-2 w-full p-2 mt-2 rounded-md focus:border-indigo-500 focus:ring-indigo-500"
            value={conductorId}
            onChange={(e) => setConductorId(e.target.value)}
          >
            <option value="">-- Seleccionar Conductor --</option>
            {listaConductores.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nombre} {c.apellido} (DNI: {c.dni})
              </option>
            ))}
          </select>
        </div>

        <div className="mb-5">
          <label
            htmlFor="fechaSalida"
            className="block text-gray-700 uppercase font-bold"
          >
            Fecha Salida
          </label>
          <input
            id="fechaSalida"
            type="date"
            className="border-2 w-full p-2 mt-2 placeholder-gray-400 rounded-md focus:border-indigo-500 focus:ring-indigo-500"
            value={fechaSalida}
            onChange={(e) => setFechaSalida(e.target.value)}
          />
        </div>

        <div className="mb-5">
          <label
            htmlFor="fechaLlegada"
            className="block text-gray-700 uppercase font-bold"
          >
            Fecha Llegada (Opcional)
          </label>
          <input
            id="fechaLlegada"
            type="date"
            className="border-2 w-full p-2 mt-2 placeholder-gray-400 rounded-md focus:border-indigo-500 focus:ring-indigo-500"
            value={fechaLlegada}
            onChange={(e) => setFechaLlegada(e.target.value)}
          />
        </div>

        <div className="mb-5">
          <label
            htmlFor="origen"
            className="block text-gray-700 uppercase font-bold"
          >
            Origen
          </label>
          <input
            id="origen"
            type="text"
            placeholder="Ciudad de Origen"
            className="border-2 w-full p-2 mt-2 placeholder-gray-400 rounded-md focus:border-indigo-500 focus:ring-indigo-500"
            value={origen}
            onChange={(e) => setOrigen(e.target.value)}
          />
        </div>

        <div className="mb-5">
          <label
            htmlFor="destino"
            className="block text-gray-700 uppercase font-bold"
          >
            Destino
          </label>
          <input
            id="destino"
            type="text"
            placeholder="Ciudad de Destino"
            className="border-2 w-full p-2 mt-2 placeholder-gray-400 rounded-md focus:border-indigo-500 focus:ring-indigo-500"
            value={destino}
            onChange={(e) => setDestino(e.target.value)}
          />
        </div>

        <div className="mb-5">
          <label
            htmlFor="km"
            className="block text-gray-700 uppercase font-bold"
          >
            Kilómetros
          </label>
          <input
            id="km"
            type="number"
            placeholder="Total de KM"
            className="border-2 w-full p-2 mt-2 placeholder-gray-400 rounded-md focus:border-indigo-500 focus:ring-indigo-500"
            value={kilometros}
            onChange={(e) => setKilometros(e.target.value)}
          />
        </div>

        <div className="mb-5">
          <label
            htmlFor="obs"
            className="block text-gray-700 uppercase font-bold"
          >
            Observaciones (Opcional)
          </label>
          <textarea
            id="obs"
            placeholder="Carga frágil, etc."
            className="border-2 w-full p-2 mt-2 placeholder-gray-400 rounded-md focus:border-indigo-500 focus:ring-indigo-500"
            value={observaciones}
            onChange={(e) => setObservaciones(e.target.value)}
          />
        </div>

        <input
          type="submit"
          value={id ? 'Actualizar Viaje' : 'Guardar Viaje'}
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

export default FormularioViaje;