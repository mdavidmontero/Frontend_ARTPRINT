import React from "react";

interface Props {
  imagen: string;
  titulo: string;
  precio: string;
  cantidad: number;
  onEliminar: () => void;
  onIncrementar: () => void;
  onDecrementar: () => void;
}

const TarjetaDeProductoEnCarrito: React.FC<Props> = ({
  imagen,
  titulo,
  precio,
  cantidad,
  onEliminar,
  onIncrementar,
  onDecrementar,
}) => {
  return (
    <div className="flex justify-between items-center bg-white p-4 rounded-lg my-2 shadow">
      <div className="mr-4">
        <img className="w-20 h-24 rounded-lg" src={imagen} alt={titulo} />
      </div>
      <div className="flex-1">
        <h3 className="text-lg font-bold mb-2 text-gray-700">{titulo}</h3>
        <p className="text-sm mb-2 text-gray-700">${precio}</p>
        <div className="flex items-center mb-2">
          <button
            onClick={onDecrementar}
            className="p-2 rounded bg-purple-600 text-white font-bold"
          >
            -
          </button>
          <span className="mx-4 text-sm text-gray-700">{cantidad}</span>
          <button
            onClick={onIncrementar}
            className="p-2 rounded bg-purple-600 text-white font-bold"
          >
            +
          </button>
        </div>
        <button
          onClick={onEliminar}
          className="py-2 px-4 rounded bg-purple-600 text-white font-bold mt-2"
        >
          Eliminar
        </button>
      </div>
    </div>
  );
};

export default TarjetaDeProductoEnCarrito;
