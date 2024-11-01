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
      <div className="container p-4 mx-auto">
        {loading ? (
          <div className="flex justify-center">
            <Spinner />
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-2xl font-bold">Tallas</h1>
              <button
                className="py-2 font-bold text-white bg-green-600 rounded-full hover:bg-green-700 px-9"
                onClick={() => navigate("/admin/nuevaTalla")}
              >
                Añadir Talla
              </button>
            </div>
            <input
              className="w-2/5 p-2 mb-4 bg-gray-300 border border-gray-300 rounded placeholder:text-gray-600 placeholder:font-semibold"
              placeholder="Buscar"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <div className="w-full p-6 mt-4 bg-white shadow">
              <div className="grid w-full grid-cols-2 mb-2 font-semibold text-black rounded-md bg-customYellow">
                <span className="p-2 font-bold text-center font-arima">
                  Nombre
                </span>
                <span className="p-2 font-bold text-center font-arima">
                  Acciones
                </span>
              </div>
              <ul>
                {filteredTallas.map((talla) => (
                  <li
                    key={talla.id}
                    className="grid items-center grid-cols-2 py-2 border-b border-b-slate-400"
                  >
                    <span className="text-center">{talla.nombre}</span>
                    <div className="flex justify-center space-x-2">
                      <button
                        className="w-32 p-2 text-sm font-bold text-center text-white uppercase rounded-lg bg-customBlue"
                        onClick={() => handleEdit(talla.id)}
                      >
                        Editar
                      </button>
                      <button
                        className="w-32 p-2 font-bold text-center text-white uppercase rounded-lg bg-customRed"
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
