import { useState, useEffect } from "react";
import { eliminarUsuario, obtenerUsuarios } from "../../../api/UsuarioAPI";
import { Usuario } from "../../../types";
import { useNavigate } from "react-router-dom";
import ModalConfirmUsuario from "../../../components/Modals/ModalConfirmUsuario";
import Spinner from "../../../components/spinner/Spinner";

export const GestionUsuarios = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsuarios();
  }, []);

  const fetchUsuarios = async () => {
    try {
      setLoading(true);
      const fetchedUsuarios = await obtenerUsuarios();
      if (fetchedUsuarios) {
        setUsuarios(fetchedUsuarios);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsuarios = usuarios.filter((usuario) =>
    usuario.nombre.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleEdit = (id: string) => {
    navigate("/admin/editarUsuario/" + id);
  };

  const handleDelete = async (id: string) => {
    try {
      await eliminarUsuario(id);
      setUsuarios(usuarios.filter((usuario) => usuario.id !== id));
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  return (
    <>
      <div className="flex flex-col h-full bg-gray-100 p-4">
        {loading ? (
          <Spinner />
        ) : (
          <>
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-2xl font-semibold">Usuarios</h1>
              <button
                className="bg-purple-600 text-white px-9 py-2 rounded-full font-bold"
                onClick={() => navigate("/admin/nuevoUsuario")}
              >
                Registrar Usuario
              </button>
            </div>
            <input
              type="text"
              className="bg-gray-300 border border-gray-300 rounded p-2 mb-4 w-2/5 placeholder:text-gray-600 placeholder:font-semibold"
              placeholder="Buscar por nombre"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <div className="mt-4 p-6 bg-white shadow w-full">
              <div className="grid grid-cols-3  mb-2 font-semibold bg-customYellow text-black w-full rounded-md">
                <div className="p-2 font-arima font-bold">Nombre</div>
                <div className="p-2 font-arima font-bold">Rol</div>
                <div className="p-2 font-arima font-bold text-center">
                  Acciones
                </div>
              </div>
              <ul>
                {filteredUsuarios.map((usuario) => (
                  <li
                    key={usuario.id}
                    className="grid grid-cols-3 items-center border-b border-b-slate-400  py-2"
                  >
                    <p className="font-arima">{usuario.nombre}</p>
                    <p className="font-arima">{usuario.rol}</p>
                    <div className="flex space-x-2 justify-center">
                      <button
                        className="bg-customBlue text-white rounded-lg w-32 p-2 uppercase font-bold text-sm text-center"
                        onClick={() => handleEdit(usuario.id)}
                      >
                        Editar
                      </button>
                      {/* <button
                        className="bg-customRed text-white rounded-lg w-32 p-2 uppercase font-bold text-center"
                        onClick={() =>
                          navigate(
                            location.pathname + `?handleDelete=${usuario.id}`
                          )
                        }
                      >
                        Eliminar
                      </button> */}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </>
        )}
      </div>
      <ModalConfirmUsuario handleDelete={handleDelete} />
    </>
  );
};
