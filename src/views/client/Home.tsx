import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Producto } from "../../types";
import TarjetaDeProducto from "../../components/shared/TarjetaDeProducto";
import { obtenerProductos } from "../../api/ProductosAPI";
import useAuth from "../../hooks/useAuth";
// import { CarrouselHome } from "./home/CarrouselHome";

interface Props {
  searchQuery: string;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
}
const Home = ({ searchQuery }: Props) => {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);
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

  const filteredProductos = productos.filter((producto) =>
    producto.nombre.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 p-4">
      {/* <div className="my-4">
        <CarrouselHome productos={productos} />
      </div> */}
      {loading ? (
        <div className="flex justify-center items-center flex-grow">
          <div className="loader"></div>
        </div>
      ) : (
        <div className="flex-grow overflow-y-auto">
          <div className="flex flex-wrap justify-evenly">
            {filteredProductos.map((producto, index) => (
              <TarjetaDeProducto
                key={index}
                imagen={producto.colores[0]?.imagenUrl || ""}
                titulo={producto.nombre}
                precio={producto.precio.toString()}
                onPress={() => navigate("/detallesProducto/" + producto.id)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
