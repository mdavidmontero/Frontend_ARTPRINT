import React from "react";
import { formatCurrency } from "../../utils";

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
    <li className="flex flex-col px-4 sm:flex-row space-x-6 py-6 items-center bg-white rounded-lg shadow-md overflow-hidden">
      <img
        className="h-32 w-32 sm:h-56 sm:w-auto flex-none rounded-md object-cover"
        src={imagen}
        alt={titulo}
      />
      <div className="flex-auto space-y-2 mt-4 sm:mt-0 sm:ml-6">
        <h3 className="text-xl font-semibold text-gray-900">{titulo}</h3>
        <p className="text-lg text-gray-600">{formatCurrency(+precio)}</p>
        <div className="flex items-center justify-start lg:items-start  space-x-4">
          <button
            onClick={onDecrementar}
            className="px-4 py-1 rounded bg-purple-600 text-white font-bold hover:bg-purple-700 transition duration-300"
          >
            -
          </button>
          <span className="text-sm text-gray-700">{cantidad}</span>
          <button
            onClick={onIncrementar}
            className="px-4 py-1 rounded bg-purple-600 text-white font-bold hover:bg-purple-700 transition duration-300"
          >
            +
          </button>
          <button type="button" onClick={onEliminar}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              className="w-8 h-8 text-red-500"
            >
              <path
                strokeLinecap="round"
                stroke-linejoin="round"
                d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
              />
            </svg>
          </button>
        </div>
      </div>
    </li>
  );
};

export default TarjetaDeProductoEnCarrito;
