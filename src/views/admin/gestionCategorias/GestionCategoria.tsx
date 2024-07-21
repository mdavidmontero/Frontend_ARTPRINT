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
      <div className="container mx-auto p-4">
        {loading ? (
          <div className="flex justify-center">
            <Spinner />
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-2xl font-bold">Categorías</h1>
              <button
                className="bg-purple-600 text-white px-9 py-2 rounded-full font-bold"
                onClick={() => navigate("/admin/nuevaCategoria")}
              >
                Añadir Categoría
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
              {filteredCategorias.map((item) => (
                <div
                  key={item.id}
                  className="grid grid-cols-2 items-center border-b border-b-slate-400  py-2"
                >
                  <div className="font-arima">{item.nombre}</div>
                  <div className="flex justify-center space-x-4">
                    <button
                      className="bg-customBlue text-white rounded-lg w-32 p-2 uppercase font-bold text-sm text-center"
                      onClick={() => handleEdit(item.id)}
                    >
                      Editar
                    </button>
                    <button
                      className="bg-customRed text-white rounded-lg w-32 p-2 uppercase font-bold text-center"
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
