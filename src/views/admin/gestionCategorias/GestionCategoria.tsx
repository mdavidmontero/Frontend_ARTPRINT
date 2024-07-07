// src/components/GestionCategoria.tsx

import React, { useState, useEffect } from "react";
import {
  eliminarCategoria,
  obtenerTodasLasCategorias,
} from "../../../api/CategoriasAPI";
import { Categoria } from "../../../types";
import { useNavigate } from "react-router-dom";
import Spinner from "../../../components/spinner/Spinner";
import ModalConfirmCategory from "../../../components/Modals/ModalConfirmCategory";

const GestionCategoria: React.FC = () => {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  const fetchCategorias = async () => {
    try {
      setLoading(true);
      const fetchedCategorias = await obtenerTodasLasCategorias();
      setCategorias(fetchedCategorias);
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategorias();
  }, []);

  const filteredCategorias = categorias.filter((categoria) =>
    categoria.nombre.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleEdit = (id: string) => {
    navigate(`/admin/editarCategoria/${id}`);
  };

  const handleDelete = async (id: string) => {
    try {
      await eliminarCategoria(id);
      setCategorias(categorias.filter((categoria) => categoria.id !== id));
    } catch (error) {
      console.error("Error deleting category:", error);
    }
  };

  return (
    <>
      <div className="p-4 bg-gray-100 min-h-screen">
        {loading ? (
          <Spinner />
        ) : (
          <>
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-2xl font-bold">Categorías</h1>
              <button
                className="bg-purple-600 text-white px-4 py-2 rounded"
                onClick={() => navigate("/admin/nuevaCategoria")}
              >
                Añadir Categoría
              </button>
            </div>
            <input
              className="w-full p-2 mb-4 border border-gray-300 rounded"
              type="text"
              placeholder="Buscar"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <div className="bg-white shadow rounded-lg p-4">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="font-bold text-lg">Nombre</div>
                <div className="font-bold text-lg">Acciones</div>
              </div>
              {filteredCategorias.map((item) => (
                <div
                  key={item.id}
                  className="grid grid-cols-2 gap-4 mb-2 p-2 border-b border-gray-300"
                >
                  <div className="text-center">{item.nombre}</div>
                  <div className="flex justify-center space-x-4">
                    <button
                      className="bg-purple-600 text-white px-2 py-1 rounded"
                      onClick={() => handleEdit(item.id)}
                    >
                      Editar
                    </button>
                    <button
                      className="bg-red-600 text-white px-2 py-1 rounded"
                      onClick={() =>
                        navigate(location.pathname + `?handleDelete=${item.id}`)
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
      <ModalConfirmCategory handleDelete={handleDelete} />
    </>
  );
};

export default GestionCategoria;
