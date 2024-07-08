interface Props {
  imagen: string;
  titulo: string;
  precio: string;
}

const TarjetaCarrito: React.FC<Props> = ({ imagen, titulo, precio }) => {
  return (
    <div className="flex p-4 border border-gray-200 rounded-lg shadow-md">
      <div className="mr-4">
        <img
          className="w-20 h-24 rounded object-cover"
          src={imagen}
          alt={titulo}
        />
      </div>
      <div className="flex flex-col justify-between">
        <p className="text-lg font-medium text-gray-800">{titulo}</p>
        <p className="text-lg text-purple-600">{precio}</p>
      </div>
    </div>
  );
};

export default TarjetaCarrito;
