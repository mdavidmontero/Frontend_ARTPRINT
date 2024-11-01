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
    <div className="container p-4 mx-auto md:p-6">
      {loading ? (
        <Spinner />
      ) : (
        <>
          <div className="flex flex-col items-center justify-between mb-6 md:flex-row">
            <h1 className="mb-4 text-2xl font-bold md:text-3xl md:mb-0">
              Estampados
            </h1>
            <button
              className="py-2 font-bold text-white bg-green-600 rounded-full hover:bg-green-700 px-9"
              onClick={() => navigate("/admin/nuevoEstampado")}
            >
              Añadir Estampado
            </button>
          </div>
          <input
            className="w-2/5 p-2 mb-4 bg-gray-300 border border-gray-300 rounded placeholder:text-gray-600 placeholder:font-semibold"
            type="text"
            placeholder="Buscar"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <div className="w-full p-4 mt-4 overflow-x-auto text-black shadow md:p-6">
            <div className="hidden w-full grid-cols-4 mb-2 font-bold text-black md:grid bg-customYellow">
              <div className="p-2 font-bold font-arima">Nombre</div>
              <div className="p-2 font-bold font-arima">Precio</div>
              <div className="p-2 font-bold font-arima">Imagen</div>
              <div className="p-2 font-bold text-center font-arima">
                Acciones
              </div>
            </div>
            <div className="w-full mb-2 font-bold text-black md:hidden bg-customYellow">
              <div className="p-2 text-center">Estampados</div>
            </div>
            {filteredAccesorios.map((estampado) => (
              <div
                key={estampado.id}
                className="grid items-center grid-cols-1 py-2 border-b md:grid-cols-4"
              >
                <div className="flex flex-col items-center p-2 md:flex-row md:space-x-4">
                  <div className="font-bold md:hidden font-arima">Nombre:</div>
                  <span>{estampado.nombre}</span>
                </div>
                <div className="flex flex-col items-center p-2 md:flex-row md:space-x-4">
                  <div className="font-bold md:hidden font-arima">Precio:</div>
                  <span>{estampado.precio}</span>
                </div>
                <div className="flex flex-col items-center p-2 md:flex-row md:space-x-4">
                  <div className="font-bold md:hidden font-arima">Imagen:</div>
                  <img
                    className="w-20 h-20 mx-auto md:mx-0"
                    src={estampado.image}
                    alt={estampado.nombre}
                  />
                </div>
                <div className="flex flex-col items-center p-2 md:flex-row md:space-x-4">
                  <div className="flex justify-center w-full space-x-4 md:justify-end">
                    <button
                      className="w-full p-2 text-xs font-bold text-center text-white uppercase bg-indigo-600 rounded-lg md:w-32"
                      onClick={() => handleEdit(estampado.id)}
                    >
                      Editar
                    </button>
                    <button
                      className="w-full p-2 text-xs font-bold text-center text-white uppercase bg-red-600 rounded-lg md:w-32"
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
