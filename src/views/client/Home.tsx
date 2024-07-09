import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Producto } from "../../types";
import TarjetaDeProducto from "../../components/shared/TarjetaDeProducto";
import { obtenerProductos } from "../../api/ProductosAPI";
import useAuth from "../../hooks/useAuth";

const Home: React.FC = () => {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
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

  const cargarData = async () => {
    try {
      await cargarProductos();
    } catch (error) {
      console.error("Error al cargar productos:", error);
    }
  };

  useEffect(() => {
    cargarData();
  }, []);

  //   useEffect(() => {
  //     const cargarDatos = async () => {
  //       await cargarProductos();
  //       const unsubscribe = onAuthStateChanged(async (userAuth) => {
  //         if (userAuth) {
  //           try {
  //             const user = await obtenerUsuarioPorId(userAuth.uid);
  //             if (user) {
  //               setUser(user);
  //             }
  //           } catch (error) {
  //             console.error(
  //               "Error al obtener la información del usuario:",
  //               error
  //             );
  //           }
  //         } else {
  //           setUser(null);
  //         }
  //       });

  //       return () => unsubscribe();
  //     };

  //     cargarDatos();
  //   }, []);

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
      <div className="mt-5 p-4">
        <div className="flex items-center bg-white rounded-full p-4 border border-purple-600 mx-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m15.75 15.75-2.489-2.489m0 0a3.375 3.375 0 1 0-4.773-4.773 3.375 3.375 0 0 0 4.774 4.774ZM21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
            />
          </svg>

          <input
            type="text"
            className="flex-grow text-lg text-gray-600 focus:outline-none"
            placeholder="Buscar productos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
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
