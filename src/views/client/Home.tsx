import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Producto } from "../../types";
import TarjetaDeProducto from "../../components/shared/TarjetaDeProducto";
import { obtenerProductos } from "../../api/ProductosAPI";
import useAuth from "../../hooks/useAuth";
import { useValidationUserRoutes } from "../../utils";
import { CarrouselHome } from "./home/CarrouselHome";

interface Props {
  searchQuery: string;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
}

const Home = ({ searchQuery }: Props) => {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedGenero, setSelectedGenero] = useState<string | null>(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      return;
    }
    switch (user.role) {
      case "ADMIN":
        navigate("/admin");
        break;
      case "CLIENTE":
        navigate("/cliente");
        break;
      default:
        break;
    }
  }, [user, navigate]);

  useEffect(() => {
    cargarProductos();
  }, []);

  const cargarProductos = async () => {
    try {
      const productosObtenidos = await obtenerProductos();
      if (productosObtenidos && productosObtenidos.length > 0) {
        setProductos(productosObtenidos);
      } else {
        console.log("No se encontraron productos.");
      }
    } catch (error) {
      console.error("Error al cargar productos:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleGeneroFilter = (genero: string) => {
    setSelectedGenero(genero);
  };

  const filteredProductos = productos.filter((producto) => {
    const matchesSearchQuery = producto.nombre
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesGenero = selectedGenero
      ? producto.genero.toLowerCase() === selectedGenero.toLowerCase()
      : true;
    return matchesSearchQuery && matchesGenero;
  });

  const route = useValidationUserRoutes(user);

  return (
    <>
      <div className={"bg-customVerde h-10 flex justify-evenly "}>
        <button
          className={`font-bold text-white px-5 ${
            selectedGenero === "Mujer" ? "bg-customBlueVerde" : ""
          }`}
          onClick={() => handleGeneroFilter("Mujer")}
        >
          Mujer
        </button>
        <button
          className={`font-bold text-white px-5 ${
            selectedGenero === "Hombre" ? "bg-customBlueVerde" : ""
          }`}
          onClick={() => handleGeneroFilter("Hombre")}
        >
          Hombre
        </button>
        <button
          className={`font-bold text-white  px-5 ${
            selectedGenero === "Unisex" ? "bg-customBlueVerde" : ""
          }`}
          onClick={() => handleGeneroFilter("Unisex")}
        >
          Unisex
        </button>
        <button
          className={`font-bold text-white px-5 ${
            selectedGenero === null ? "bg-customBlueVerde" : ""
          }`}
          onClick={() => handleGeneroFilter(null!)}
        >
          Todos
        </button>
      </div>
      <div className="h-4 mt-2 bg-customYellow"></div>

      <div className="flex flex-col min-h-screen overflow-x-hidden bg-gray-100">
        <div className="py-2">
          <CarrouselHome />
        </div>
        <div className="h-4 bg-customBlueVerde"></div>
        <h2 className="text-2xl text-center font-anto">Productos</h2>
        <div className="h-4 bg-customBlueVerde"></div>
        {loading ? (
          <div className="flex items-center justify-center flex-grow">
            <div className="loader"></div>
          </div>
        ) : (
          <div className="flex-grow mt-8 overflow-y-auto">
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 sm:gap-4">
              {filteredProductos.map((producto, index) => (
                <TarjetaDeProducto
                  key={index}
                  imagen={producto.colores[0]?.imagenUrl || ""}
                  titulo={producto.nombre}
                  precio={producto.precio.toString()}
                  onPress={() => navigate(`${route}` + producto.id)}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Home;
