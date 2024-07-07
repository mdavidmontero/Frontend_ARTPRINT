import { useState, useEffect } from "react";
import { Prenda } from "../../../types";
import { obtenerPrendas, eliminarPrenda } from "../../../api/PrendaAPI";
import { useNavigate } from "react-router-dom";
import Spinner from "../../../components/spinner/Spinner";
import ModalConfirmPrenda from "../../../components/Modals/ModalConfirmPrenda";

const GestionPrenda = () => {
  const [prendas, setPrendas] = useState<Prenda[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  const fetchPrendas = async () => {
    try {
      setLoading(true);
      const fetchedPrendas = await obtenerPrendas();
      setPrendas(fetchedPrendas!);
    } catch (error) {
      console.error("Error fetching prendas:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrendas();
  }, []);

  const filteredPrendas = prendas.filter((prenda) =>
    prenda.nombre.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleEdit = (id: string) => {
    navigate("/admin/editarPrenda/" + id);
  };

  const handleDelete = async (id: string) => {
    try {
      await eliminarPrenda(id);
      setPrendas(prendas.filter((prenda) => prenda.id !== id));
    } catch (error) {
      console.error("Error deleting prenda:", error);
    }
  };

  return (
    <>
      <div className="flex flex-col min-h-screen bg-gray-100 p-4">
        {loading ? (
          <Spinner />
        ) : (
          <>
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-2xl font-bold">Prendas</h1>
              <button
                className="bg-purple-600 text-white py-2 px-4 rounded"
                onClick={() => navigate("/admin/nuevaPrenda")}
              >
                Añadir Prenda
              </button>
            </div>
            <input
              className="mb-4 p-2 border border-gray-300 rounded"
              placeholder="Buscar"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <div className="grid grid-cols-2 gap-4 mb-2 px-2">
              <span className="font-bold text-center">Nombre</span>
              <span className="font-bold text-center">Acciones</span>
            </div>
            <ul>
              {filteredPrendas.map((prenda) => (
                <li
                  key={prenda.id}
                  className="grid grid-cols-2 gap-4 items-center bg-white p-3 mb-2 rounded shadow-sm"
                >
                  <span className="text-center">{prenda.nombre}</span>
                  <div className="flex justify-center space-x-2">
                    <button
                      className="bg-purple-600 text-white py-1 px-2 rounded"
                      onClick={() => handleEdit(prenda.id)}
                    >
                      Editar
                    </button>
                    <button
                      className="bg-red-600 text-white py-1 px-2 rounded"
                      onClick={() =>
                        navigate(
                          location.pathname + `?handleDelete=${prenda.id}`
                        )
                      }
                    >
                      Eliminar
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
      <ModalConfirmPrenda handleDelete={handleDelete} />
    </>
  );
};

export default GestionPrenda;
