import { useState, useEffect } from "react";
import { Material } from "../../../types";
import { useNavigate } from "react-router-dom";
import {
  eliminarMaterial,
  obtenerTodosLosMateriales,
} from "../../../api/MaterialAPI";
import Spinner from "../../../components/spinner/Spinner";
import ModalConfirmMaterial from "../../../components/Modals/ModalConfirmMaterial";

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
    <>
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
                className="bg-purple-600 text-white px-9 py-2 rounded-full font-bold"
                onClick={() => navigate("/admin/nuevoMaterial")}
              >
                Añadir material
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
                <div className="p-2 font-arima font-bold">Nombre</div>
                <div className="p-2 font-arima font-bold text-center">
                  Acciones
                </div>
              </div>
              {filteredMateriales.map((material) => (
                <div className="grid grid-cols-2 items-center border-b border-b-slate-400  py-2">
                  <span className="font-arima">{material.nombre}</span>
                  <div className="flex space-x-2 justify-center">
                    <button
                      className="bg-customBlue text-white rounded-lg w-32 p-2 uppercase font-bold text-sm text-center"
                      onClick={() => handleEdit(material.id)}
                    >
                      Editar
                    </button>
                    <button
                      className="bg-customRed text-white rounded-lg w-32 p-2 uppercase font-bold text-center"
                      onClick={() =>
                        navigate(
                          location.pathname + `?handleDelete=${material.id}`
                        )
                      }
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
      <ModalConfirmMaterial handleDelete={handleDelete} />
    </>
  );
};

export default GestionMaterial;
