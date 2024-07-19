import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useProductStore } from "../../../store/productoStore";
import Spinner from "../../../components/spinner/Spinner";
import DeleteConfirm from "../../../components/Modals/ModalConfirm";

const GestionProducto: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [showModal, setShowModal] = useState<boolean>(false);
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
      setShowModal(true);
      await deleteProducto(id);
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  return (
    <>
      <div className="container mx-auto p-4">
        {loading ? (
          <div className="flex justify-center">
            <Spinner />
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-2xl font-semibold">Gestión Prendas</h1>
              <button
                className="bg-purple-600 text-white px-9 py-2 rounded-full font-bold"
                onClick={() => navigate("/admin/nuevoProducto")}
              >
                Añadir
              </button>
            </div>
            <input
              className="bg-gray-300 border border-gray-300 rounded p-2 mb-4 w-2/5 placeholder:text-gray-600 placeholder:font-semibold"
              type="text"
              placeholder="Buscar"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <div className="mt-4 p-6 bg-white shadow w-full">
              <div className="grid grid-cols-3  mb-2 font-semibold bg-customYellow text-black w-full rounded-md">
                <div className="p-2 font-arima font-bold">Nombre</div>
                <div className="p-2 font-arima font-bold">Precio</div>
                <div className="p-2 font-arima font-bold text-center">
                  Acciones
                </div>
              </div>
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className="grid grid-cols-3 items-center border-b border-b-slate-400  py-2"
                >
                  <div className="font-arima">{product.nombre}</div>
                  <div className="font-arima">{product.precio}</div>
                  <div className="flex space-x-2 justify-center">
                    <button
                      className="bg-customBlue text-white rounded-lg w-32 p-2 uppercase font-bold text-sm text-center"
                      onClick={() => handleEdit(product.id)}
                    >
                      Editar
                    </button>
                    <button
                      className="bg-customRed text-white rounded-lg w-32 p-2 uppercase font-bold text-center"
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

            {error && <div className="text-red-600 mt-4">Error: {error}</div>}
          </>
        )}
      </div>
      <DeleteConfirm handleDelete={handleDelete} />
    </>
  );
};

export default GestionProducto;
