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
      <div className="container p-4 mx-auto">
        {loading ? (
          <div className="flex justify-center">
            <Spinner />
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-2xl font-bold">Materiales</h1>
              <button
                className="py-2 font-bold text-white bg-green-600 rounded-full hover:bg-green-700 px-9"
                onClick={() => navigate("/admin/nuevoMaterial")}
              >
                Añadir material
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
                <div className="p-2 font-bold font-arima">Nombre</div>
                <div className="p-2 font-bold text-center font-arima">
                  Acciones
                </div>
              </div>
              {filteredMateriales.map((material) => (
                <div className="grid items-center grid-cols-2 py-2 border-b border-b-slate-400">
                  <span className="font-arima">{material.nombre}</span>
                  <div className="flex justify-center space-x-2">
                    <button
                      className="w-32 p-2 text-sm font-bold text-center text-white uppercase rounded-lg bg-customBlue"
                      onClick={() => handleEdit(material.id)}
                    >
                      Editar
                    </button>
                    <button
                      className="w-32 p-2 font-bold text-center text-white uppercase rounded-lg bg-customRed"
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
