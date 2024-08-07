import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Spinner from "../../../components/spinner/Spinner";
import { Estampado } from "../../../types";
import {
  eliminarEstampado,
  obtenerTodosLosEstampados,
} from "../../../api/AccesoriosAPI";
import ModalConfirmEstampado from "../../../components/Modals/ModalEstampadoConfirm";

const GestionEstampado = () => {
  const [estampados, setEstampados] = useState<Estampado[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  const fetchColores = async () => {
    try {
      setLoading(true);
      const fetchedColores = await obtenerTodosLosEstampados();
      setEstampados(fetchedColores);
    } catch (error) {
      console.error("Error fetching estampados:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchColores();
  }, []);

  const filteredAccesorios = estampados.filter((estampado) =>
    estampado.nombre.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleEdit = (id: string) => {
    navigate(`/admin/editarEstampado/${id}`);
  };

  const handleDelete = async (id: string) => {
    try {
      await eliminarEstampado(id);
      setEstampados(estampados.filter((estampado) => estampado.id !== id));
    } catch (error) {
      console.error("Error deleting estampado:", error);
    }
  };

  return (
    <div className="container mx-auto p-4 md:p-6">
      {loading ? (
        <Spinner />
      ) : (
        <>
          <div className="flex flex-col md:flex-row justify-between items-center mb-6">
            <h1 className="text-2xl md:text-3xl font-bold mb-4 md:mb-0">
              Estampados
            </h1>
            <button
              className="bg-purple-600 text-white px-9 py-2 rounded-full font-bold"
              onClick={() => navigate("/admin/nuevoEstampado")}
            >
              Añadir Estampado
            </button>
          </div>
          <input
            className="bg-gray-300 border border-gray-300 rounded p-2 mb-4 w-2/5 placeholder:text-gray-600 placeholder:font-semibold"
            type="text"
            placeholder="Buscar"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <div className="mt-4 p-4 md:p-6 text-black shadow w-full overflow-x-auto">
            <div className="hidden md:grid grid-cols-4 mb-2 font-bold bg-customYellow text-black w-full">
              <div className="p-2 font-arima font-bold">Nombre</div>
              <div className="p-2 font-arima font-bold">Precio</div>
              <div className="p-2 font-arima font-bold">Imagen</div>
              <div className="p-2 font-arima font-bold text-center">
                Acciones
              </div>
            </div>
            <div className="md:hidden font-bold bg-customYellow text-black w-full mb-2">
              <div className="p-2 text-center">Estampados</div>
            </div>
            {filteredAccesorios.map((estampado) => (
              <div
                key={estampado.id}
                className="grid grid-cols-1 md:grid-cols-4 items-center border-b py-2"
              >
                <div className="flex flex-col md:flex-row items-center md:space-x-4 p-2">
                  <div className="md:hidden font-bold font-arima">Nombre:</div>
                  <span>{estampado.nombre}</span>
                </div>
                <div className="flex flex-col md:flex-row items-center md:space-x-4 p-2">
                  <div className="md:hidden font-bold font-arima">Precio:</div>
                  <span>{estampado.precio}</span>
                </div>
                <div className="flex flex-col md:flex-row items-center md:space-x-4 p-2">
                  <div className="md:hidden font-bold font-arima">Imagen:</div>
                  <img
                    className="w-20 h-20 mx-auto md:mx-0"
                    src={estampado.image}
                    alt={estampado.nombre}
                  />
                </div>
                <div className="flex flex-col md:flex-row items-center md:space-x-4 p-2">
                  <div className="flex justify-center md:justify-end space-x-4 w-full">
                    <button
                      className="bg-indigo-600 text-white rounded-lg w-full md:w-32 p-2 uppercase font-bold text-xs text-center"
                      onClick={() => handleEdit(estampado.id)}
                    >
                      Editar
                    </button>
                    <button
                      className="bg-red-600 text-white rounded-lg w-full md:w-32 p-2 uppercase font-bold text-xs text-center"
                      onClick={() =>
                        navigate(
                          location.pathname + `?handleDelete=${estampado.id}`
                        )
                      }
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <ModalConfirmEstampado handleDelete={handleDelete} />
        </>
      )}
    </div>
  );
};

export default GestionEstampado;
