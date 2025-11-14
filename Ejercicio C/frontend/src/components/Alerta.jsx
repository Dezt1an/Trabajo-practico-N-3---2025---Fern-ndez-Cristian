import React from 'react';

const Alerta = ({ alerta }) => {
  return (
    <div
      className={`${
        alerta.error
          ? 'from-red-400 to-red-600' // Error (Rojo)
          : 'from-green-400 to-green-600' // Éxito (Verde)
      } bg-gradient-to-r text-center p-3 rounded-xl uppercase text-white font-bold text-sm mb-6`}
    >
      {alerta.msg}
    </div>
  );
};

export default Alerta;