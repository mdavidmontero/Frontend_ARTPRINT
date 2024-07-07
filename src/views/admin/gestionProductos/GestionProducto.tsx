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
              <h1 className="text-2xl font-bold">Productos</h1>
              <button
                className="bg-purple-600 text-white px-4 py-2 rounded"
                onClick={() => navigate("/admin/nuevoProducto")}
              >
                Añadir Producto
              </button>
            </div>
            <input
              className="border border-gray-300 rounded p-2 mb-4 w-full"
              type="text"
              placeholder="Buscar"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <div className="grid grid-cols-3 gap-4 mb-2 font-bold">
              <div>Nombre</div>
              <div>Precio</div>
              <div>Acciones</div>
            </div>
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="grid grid-cols-3 gap-4 items-center border-b py-2"
              >
                <div>{product.nombre}</div>
                <div>{product.precio}</div>
                <div className="flex space-x-2">
                  <button
                    className="bg-purple-600 text-white px-4 py-2 rounded"
                    onClick={() => handleEdit(product.id)}
                  >
                    Editar
                  </button>
                  <button
                    className="bg-red-600 text-white px-4 py-2 rounded"
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
            {error && <div className="text-red-600 mt-4">Error: {error}</div>}
          </>
        )}
      </div>
      <DeleteConfirm handleDelete={handleDelete} />
    </>
  );
};

export default GestionProducto;
