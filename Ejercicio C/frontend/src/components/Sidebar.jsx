import React from 'react';

const Dashboard = () => {
  return (
    // Las clases p-10 ya vienen del layout RutaProtegida
    <div>
      <h2 className="text-5xl font-black text-indigo-600">
        ¡Bienvenido!
      </h2>
      <p className="text-2xl text-gray-600 mt-4">
        Comienza a gestionar tu flota seleccionando una opción en el menú lateral.
      </p>
    </div>
  );
};

export default Dashboard;