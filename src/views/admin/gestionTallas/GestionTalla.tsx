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
          <div className="flex justify-center">
            <Spinner />
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-2xl font-bold">Tallas</h1>
              <button
                className="bg-purple-600 text-white px-9 py-2 rounded-full font-bold"
                onClick={() => navigate("/admin/nuevaTalla")}
              >
                Añadir Talla
              </button>
            </div>
            <input
              className="bg-gray-300 border border-gray-300 rounded p-2 mb-4 w-2/5 placeholder:text-gray-600 placeholder:font-semibold"
              placeholder="Buscar"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <div className="mt-4 p-6 bg-white shadow w-full">
              <div className="grid grid-cols-2  mb-2 font-semibold bg-customYellow text-black w-full rounded-md">
                <span className="p-2 font-arima font-bold text-center">
                  Nombre
                </span>
                <span className="p-2 font-arima font-bold text-center">
                  Acciones
                </span>
              </div>
              <ul>
                {filteredTallas.map((talla) => (
                  <li
                    key={talla.id}
                    className="grid grid-cols-2 items-center border-b border-b-slate-400  py-2"
                  >
                    <span className="text-center">{talla.nombre}</span>
                    <div className="flex space-x-2 justify-center">
                      <button
                        className="bg-customBlue text-white rounded-lg w-32 p-2 uppercase font-bold text-sm text-center"
                        onClick={() => handleEdit(talla.id)}
                      >
                        Editar
                      </button>
                      <button
                        className="bg-customRed text-white rounded-lg w-32 p-2 uppercase font-bold text-center"
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
            </div>
          </>
        )}
      </div>
      <ModalConfirmTalla handleDelete={handleDelete} />
    </>
  );
};

export default GestionTalla;
