import { useState, useEffect } from "react";
import { Color } from "../../../types";
import { eliminarColor, obtenerTodosLosColores } from "../../../api/ColoresAPI";
import { useNavigate } from "react-router-dom";
import Spinner from "../../../components/spinner/Spinner";

const GestionColor = () => {
  const [colores, setColores] = useState<Color[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  const fetchColores = async () => {
    try {
      setLoading(true);
      const fetchedColores = await obtenerTodosLosColores();
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
    <div className="container mx-auto p-6">
      {loading ? (
        <Spinner />
      ) : (
        <>
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">Colores</h1>
            <button
              className="bg-purple-600 text-white px-4 py-2 rounded shadow hover:bg-purple-700"
              onClick={() => navigate("/admin/nuevoColor")}
            >
              Añadir Color
            </button>
          </div>
          <input
            className="h-10 px-3 border rounded mb-4"
            type="text"
            placeholder="Buscar"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <div className="grid grid-cols-2 gap-4 mb-2 px-2">
            <span className="font-bold text-center">Nombre</span>
            <span className="font-bold text-center">Acciones</span>
          </div>
          {filteredColores.map((color) => (
            <div
              key={color.id}
              className="grid grid-cols-2 gap-4 items-center bg-white p-3 mb-2 rounded shadow-sm"
            >
              <span className="text-center ">{color.nombre}</span>
              <div className="flex justify-center space-x-2">
                <button
                  className="bg-purple-600 text-white py-1 px-2 rounded"
                  onClick={() => handleEdit(color.id)}
                >
                  Editar
                </button>
                <button
                  className="bg-red-600 text-white px-4 py-1 rounded hover:bg-red-700"
                  onClick={() => handleDelete(color.id)}
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  );
};

export default GestionColor;
