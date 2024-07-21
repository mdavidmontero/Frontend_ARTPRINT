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
    <div className="container mx-auto p-4">
      {loading ? (
        <div className="flex justify-center">
          <Spinner />
        </div>
      ) : (
        <>
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-3xl font-bold">Colores</h1>
            <button
              className="bg-purple-600 text-white px-9 py-2 rounded-full font-bold"
              onClick={() => navigate("/admin/nuevoColor")}
            >
              Añadir Color
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
            <div className="grid grid-cols-2  mb-2 font-semibold bg-customYellow text-black w-full rounded-md">
              <span className="p-2 font-arima font-bold text-center">
                Nombre
              </span>
              <span className="p-2 font-arima font-bold text-center">
                Acciones
              </span>
            </div>
            {filteredColores.map((color) => (
              <div
                key={color.id}
                className="grid grid-cols-2 items-center border-b border-b-slate-400  py-2"
              >
                <span className="text-center ">{color.nombre}</span>
                <div className="flex justify-center space-x-2">
                  <button
                    className="bg-customBlue text-white rounded-lg w-32 p-2 uppercase font-bold text-sm text-center"
                    onClick={() => handleEdit(color.id)}
                  >
                    Editar
                  </button>
                  <button
                    className="bg-customRed text-white rounded-lg w-32 p-2 uppercase font-bold text-center"
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
