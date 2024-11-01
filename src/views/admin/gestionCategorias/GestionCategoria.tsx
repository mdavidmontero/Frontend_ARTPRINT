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
      <div className="container p-4 mx-auto">
        {loading ? (
          <div className="flex justify-center">
            <Spinner />
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-2xl font-bold">Categorías</h1>
              <button
                className="py-2 font-bold text-white bg-green-600 rounded-full hover:bg-green-700 px-9"
                onClick={() => navigate("/admin/nuevaCategoria")}
              >
                Añadir Categoría
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
              {filteredCategorias.map((item) => (
                <div
                  key={item.id}
                  className="grid items-center grid-cols-2 py-2 border-b border-b-slate-400"
                >
                  <div className="font-arima">{item.nombre}</div>
                  <div className="flex justify-center space-x-4">
                    <button
                      className="w-32 p-2 text-sm font-bold text-center text-white uppercase rounded-lg bg-customBlue"
                      onClick={() => handleEdit(item.id)}
                    >
                      Editar
                    </button>
                    <button
                      className="w-32 p-2 font-bold text-center text-white uppercase rounded-lg bg-customRed"
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
