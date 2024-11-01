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
      className="m-2 transition-shadow bg-gray-200 rounded-lg shadow-md w-44 hover:shadow-lg"
    >
      <div className="flex justify-start">
        <img
          className="object-cover h-56 rounded-t-lg w-44"
          src={imagen}
          alt={titulo}
        />
      </div>
      <div className="flex flex-col justify-start p-3">
        <h3 className="mb-1 text-lg font-bold text-left text-gray-900">
          {titulo}
        </h3>
        <p className="font-semibold text-left text-black text-md">${precio}</p>
      </div>
    </button>
  );
};

export default TarjetaDeProducto;
