import { useState, useEffect } from "react";
import { eliminarTalla, obtenerTodasLasTallas } from "../../../api/TallaAPI";
import { useNavigate } from "react-router-dom";
import { Talla } from "../../../types";
import Spinner from "../../../components/spinner/Spinner";
import ModalConfirmTalla from "../../../components/Modals/ModalConfirmTalla";

const GestionTalla = () => {
  const [tallas, setTallas] = useState<Talla[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTallas = async () => {
      try {
        setLoading(true);
        const fetchedTallas = await obtenerTodasLasTallas();
        setTallas(fetchedTallas);
      } catch (error) {
        console.error("Error fetching tallas:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTallas();
  }, []);

  const filteredTallas = tallas.filter((talla) =>
    talla.nombre.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleEdit = (id: string) => {
    navigate("/admin/editarTalla/" + id);
  };

  const handleDelete = async (id: string) => {
    try {
      await eliminarTalla(id);
      setTallas(tallas.filter((talla) => talla.id !== id));
    } catch (error) {
      console.error("Error deleting talla:", error);
    }
  };

  return (
    <>
      <div className="container mx-auto p-4">
        {loading ? (
          <Spinner />
        ) : (
          <>
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-2xl font-bold">Tallas</h1>
              <button
                className="bg-purple-600 text-white py-2 px-4 rounded hover:bg-purple-700"
                onClick={() => navigate("/admin/nuevaTalla")}
              >
                Añadir Talla
              </button>
            </div>
            <input
              className="h-10 border border-gray-300 rounded px-2 w-full mb-4"
              placeholder="Buscar"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <div className="grid grid-cols-2 gap-4 mb-2">
              <span className="font-bold text-center">Nombre</span>
              <span className="font-bold text-center">Acciones</span>
            </div>
            <ul>
              {filteredTallas.map((talla) => (
                <li
                  key={talla.id}
                  className="grid grid-cols-2 gap-4 items-center bg-white p-3 mb-2 rounded shadow-sm"
                >
                  <span className="text-center">{talla.nombre}</span>
                  <div className="flex justify-center space-x-2">
                    <button
                      className="bg-purple-600 text-white py-1 px-2 rounded hover:bg-purple-700"
                      onClick={() => handleEdit(talla.id)}
                    >
                      Editar
                    </button>
                    <button
                      className="bg-red-600 text-white py-1 px-2 rounded hover:bg-red-700"
                      onClick={() =>
                        navigate(
                          location.pathname + `?handleDelete=${talla.id}`
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
      <ModalConfirmTalla handleDelete={handleDelete} />
    </>
  );
};

export default GestionTalla;
