import { useState, useEffect } from "react";
import { Color } from "../../../types";
import { eliminarColor, obtenerTodosLosColores } from "../../../api/ColoresAPI";
import { useNavigate } from "react-router-dom";
import Spinner from "../../../components/spinner/Spinner";
import ModalConfirmColor from "../../../components/Modals/ModalConfirmColor";

const GestionColor = () => {
  const [colores, setColores] = useState<Color[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  const fetchColores = async () => {
    try {
      setLoading(true);
      const fetchedColores = await obtenerTodosLosColores();
      // @ts-ignore
      setColores(fetchedColores);
    } catch (error) {
      console.error("Error fetching colors:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchColores();
  }, []);

  const filteredColores = colores.filter((color) =>
    color.nombre.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleEdit = (id: string) => {
    navigate(`/admin/editarColor/${id}`);
  };

  const handleDelete = async (id: string) => {
    try {
      await eliminarColor(id);
      setColores(colores.filter((color) => color.id !== id));
    } catch (error) {
      console.error("Error deleting color:", error);
    }
  };

  return (
    <div className="container p-4 mx-auto">
      {loading ? (
        <div className="flex justify-center">
          <Spinner />
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold">Colores</h1>
            <button
              className="py-2 font-bold text-white bg-green-600 rounded-full hover:bg-green-700 px-9"
              onClick={() => navigate("/admin/nuevoColor")}
            >
              Añadir Color
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
            <div className="grid w-full grid-cols-2 mb-2 font-semibold text-black rounded-md bg-customYellow">
              <span className="p-2 font-bold text-center font-arima">
                Nombre
              </span>
              <span className="p-2 font-bold text-center font-arima">
                Acciones
              </span>
            </div>
            {filteredColores.map((color) => (
              <div
                key={color.id}
                className="grid items-center grid-cols-2 py-2 border-b border-b-slate-400"
              >
                <span className="text-center ">{color.nombre}</span>
                <div className="flex justify-center space-x-2">
                  <button
                    className="w-32 p-2 text-sm font-bold text-center text-white uppercase rounded-lg bg-customBlue"
                    onClick={() => handleEdit(color.id)}
                  >
                    Editar
                  </button>
                  <button
                    className="w-32 p-2 font-bold text-center text-white uppercase rounded-lg bg-customRed"
                    onClick={() =>
                      navigate(location.pathname + `?handleDelete=${color.id}`)
                    }
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>
          <ModalConfirmColor handleDelete={handleDelete} />
        </>
      )}
    </div>
  );
};

export default GestionColor;
