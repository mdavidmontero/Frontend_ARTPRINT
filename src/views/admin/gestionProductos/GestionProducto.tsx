import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useProductStore } from "../../../store/productoStore";
import Spinner from "../../../components/spinner/Spinner";
import DeleteConfirm from "../../../components/Modals/ModalConfirm";

const GestionProducto: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  // const [showModal, setShowModal] = useState<boolean>(false);
  const navigate = useNavigate();

  const { productos, loading, error, fetchProductos, deleteProducto } =
    useProductStore();

  useEffect(() => {
    fetchProductos();
  }, [fetchProductos]);

  const filteredProducts = productos.filter((product) =>
    product.nombre.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleEdit = (id: string) => {
    navigate(`/admin/editarProducto/${id}`);
  };

  const handleDelete = async (id: string) => {
    try {
      // setShowModal(true);
      await deleteProducto(id);
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  return (
    <>
      <div className="container p-4 mx-auto">
        {loading ? (
          <div className="flex justify-center">
            <Spinner />
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-2xl font-semibold">Gestión Prendas</h1>
              <button
                className="py-2 font-bold text-white bg-green-600 rounded-full hover:bg-green-700 px-9"
                onClick={() => navigate("/admin/nuevoProducto")}
              >
                Añadir
              </button>
            </div>
            <input
              className="w-2/5 p-2 mb-4 bg-gray-300 border border-gray-300 rounded placeholder:text-gray-600 placeholder:font-semibold"
              type="text"
              placeholder="Buscar"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <div className="w-full p-6 mt-4 bg-white shadow">
              <div className="grid w-full grid-cols-3 mb-2 font-semibold text-black rounded-md bg-customYellow">
                <div className="p-2 font-bold font-arima">Nombre</div>
                <div className="p-2 font-bold font-arima">Precio</div>
                <div className="p-2 font-bold text-center font-arima">
                  Acciones
                </div>
              </div>
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className="grid items-center grid-cols-3 py-2 border-b border-b-slate-400"
                >
                  <div className="font-arima">{product.nombre}</div>
                  <div className="font-arima">{product.precio}</div>
                  <div className="flex justify-center space-x-2">
                    <button
                      className="w-32 p-2 text-sm font-bold text-center text-white uppercase rounded-lg bg-customBlue"
                      onClick={() => handleEdit(product.id)}
                    >
                      Editar
                    </button>
                    <button
                      className="w-32 p-2 font-bold text-center text-white uppercase rounded-lg bg-customRed"
                      onClick={() =>
                        navigate(
                          location.pathname + `?handleDelete=${product.id}`
                        )
                      }
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {error && <div className="mt-4 text-red-600">Error: {error}</div>}
          </>
        )}
      </div>
      <DeleteConfirm handleDelete={handleDelete} />
    </>
  );
};

export default GestionProducto;
