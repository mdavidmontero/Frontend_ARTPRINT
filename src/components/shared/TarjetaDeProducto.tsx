interface Props {
  imagen: string;
  titulo: string;
  precio: string;
  onPress: () => void;
}

const TarjetaDeProducto: React.FC<Props> = ({
  imagen,
  titulo,
  precio,
  onPress,
}) => {
  return (
    <button
      onClick={onPress}
      className="w-44 rounded-lg m-2 bg-white shadow-md hover:shadow-lg transition-shadow"
    >
      <div className="flex justify-start">
        <img
          className="w-44 h-56 rounded-t-lg object-cover"
          src={imagen}
          alt={titulo}
        />
      </div>
      <div className="flex flex-col justify-start p-3">
        <h3 className="text-lg font-bold mb-1 text-gray-700 text-left">
          {titulo}
        </h3>
        <p className="text-sm font-semibold text-purple-600 text-left">
          ${precio}
        </p>
      </div>
    </button>
  );
};

export default TarjetaDeProducto;
