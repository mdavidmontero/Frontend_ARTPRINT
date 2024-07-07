import { useState, useEffect } from "react";
import { Material } from "../../../types";
import { useNavigate } from "react-router-dom";
import {
  eliminarMaterial,
  obtenerTodosLosMateriales,
} from "../../../api/MaterialAPI";
import Spinner from "../../../components/spinner/Spinner";

const GestionMaterial = () => {
  const [materiales, setMateriales] = useState<Material[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  const fetchMateriales = async () => {
    try {
      setLoading(true);
      const fetchedMateriales = await obtenerTodosLosMateriales();
      setMateriales(fetchedMateriales);
    } catch (error) {
      console.error("Error fetching materials:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMateriales();
  }, []);

  const filteredMateriales = materiales.filter((material) =>
    material.nombre.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleEdit = (id: string) => {
    navigate(`/admin/editarMaterial/${id}`);
  };

  const handleDelete = async (id: string) => {
    try {
      await eliminarMaterial(id);
      setMateriales(materiales.filter((material) => material.id !== id));
    } catch (error) {
      console.error("Error deleting material:", error);
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
            <h1 className="text-2xl font-bold">Materiales</h1>
            <button
              className="bg-purple-600 text-white px-4 py-2 rounded"
              onClick={() => navigate("/admin/nuevoMaterial")}
            >
              Añadir material
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
            <span className="font-bold text-lg text-center">Nombre</span>
            <span className="font-bold text-lg text-center">Precio Extra</span>
            <span className="font-bold text-lg text-center">Acciones</span>
          </div>
          {filteredMateriales.map((material) => (
            <div
              key={material.id}
              className="grid grid-cols-3 gap-4 items-center border-b py-2"
            >
              <span className="flex-1 text-center">{material.nombre}</span>
              <span className="flex-1 text-center">{material.precioExtra}</span>
              <div className="flex space-x-2 justify-center">
                <button
                  className="bg-purple-600 text-white px-4 py-2 rounded"
                  onClick={() => handleEdit(material.id)}
                >
                  Editar
                </button>
                <button
                  className="bg-red-600 text-white px-4 py-1 rounded hover:bg-red-700"
                  onClick={() => handleDelete(material.id)}
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

export default GestionMaterial;
