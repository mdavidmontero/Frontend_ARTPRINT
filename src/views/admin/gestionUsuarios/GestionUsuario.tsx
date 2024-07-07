import { useState, useEffect } from "react";
import { eliminarUsuario, obtenerUsuarios } from "../../../api/UsuarioAPI";
import { Usuario } from "../../../types";
import { useNavigate } from "react-router-dom";
import ModalConfirmUsuario from "../../../components/Modals/ModalConfirmUsuario";

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
          <div className="flex justify-center items-center h-full">
            <div className="flex items-center">
              <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V2.83a1 1 0 00-1.57-.83l-4.25 3a1 1 0 00-.18 1.41l.17.22a8 8 0 011.83 4.34zm2 5.19a1 1 0 00.8 1.6A8 8 0 0112 4.83v3.35a1 1 0 001.57.83l4.25-3a1 1 0 00.18-1.41l-.17-.22a8 8 0 01-1.83 4.34 1 1 0 00-.8 1.6 6 6 0 101.63-2.66 1 1 0 00-1.63 1.16 4 4 0 11-1.09 1.76l-.11-.06z"
                />
              </svg>
              <span className="text-purple-600">Cargando...</span>
            </div>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-3xl font-bold">Usuarios</h1>
              <button
                className="bg-purple-600 text-white py-2 px-4 rounded"
                onClick={() => navigate("/admin/nuevoUsuario")}
              >
                Registrar Usuario
              </button>
            </div>
            <input
              type="text"
              className="border border-gray-300 rounded px-3 py-2 mb-4"
              placeholder="Buscar por nombre"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <div className="flex justify-between mb-2">
              <p className="font-bold text-lg w-1/3 text-center">Nombre</p>
              <p className="font-bold text-lg w-1/3 text-center">Rol</p>
              <p className="font-bold text-lg w-1/3 text-center">Acciones</p>
            </div>
            <ul>
              {filteredUsuarios.map((usuario) => (
                <li
                  key={usuario.id}
                  className="flex justify-between items-center bg-white py-3 px-4 mb-2 rounded border border-gray-300"
                >
                  <p className="text-center w-1/3">{usuario.nombre}</p>
                  <p className="text-center w-1/3">{usuario.rol}</p>
                  <div className="flex">
                    <button
                      className="bg-purple-600 text-white py-1 px-2 rounded mr-2"
                      onClick={() => handleEdit(usuario.id)}
                    >
                      Editar
                    </button>
                    <button
                      className="bg-red-600 text-white py-1 px-2 rounded"
                      onClick={() =>
                        navigate(
                          location.pathname + `?handleDelete=${usuario.id}`
                        )
                      }
                    >
                      Eliminar
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
      <ModalConfirmUsuario handleDelete={handleDelete} />
    </>
  );
};
