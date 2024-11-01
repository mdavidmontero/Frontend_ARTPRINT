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
      <div className="container p-4 mx-auto">
        {loading ? (
          <Spinner />
        ) : (
          <>
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-2xl font-semibold">Usuarios</h1>
              <button
                className="py-2 font-bold text-white bg-green-600 rounded-full hover:bg-green-700 px-9"
                onClick={() => navigate("/admin/nuevoUsuario")}
              >
                Registrar Usuario
              </button>
            </div>
            <input
              type="text"
              className="w-2/5 p-2 mb-4 bg-gray-300 border border-gray-300 rounded placeholder:text-gray-600 placeholder:font-semibold"
              placeholder="Buscar por nombre"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <div className="w-full p-6 mt-4 bg-white shadow">
              <div className="grid w-full grid-cols-3 mb-2 font-semibold text-black rounded-md bg-customYellow">
                <div className="p-2 font-bold font-arima">Nombre</div>
                <div className="p-2 font-bold font-arima">Rol</div>
                <div className="p-2 font-bold text-center font-arima">
                  Acciones
                </div>
              </div>
              <ul>
                {filteredUsuarios.map((usuario) => (
                  <li
                    key={usuario.id}
                    className="grid items-center grid-cols-3 py-2 border-b border-b-slate-400"
                  >
                    <p className="font-arima">{usuario.nombre}</p>
                    <p className="font-arima">{usuario.rol}</p>
                    <div className="flex justify-center space-x-2">
                      <button
                        className="w-32 p-2 text-sm font-bold text-center text-white uppercase rounded-lg bg-customBlue"
                        onClick={() => handleEdit(usuario.id)}
                      >
                        Editar
                      </button>
                      {/* <button
                        className="w-32 p-2 font-bold text-center text-white uppercase rounded-lg bg-customRed"
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
