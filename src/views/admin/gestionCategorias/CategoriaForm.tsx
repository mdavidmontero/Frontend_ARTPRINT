// src/components/CategoriaForm.tsx

import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  crearCategoria,
  obtenerCategoriaPorId,
  actualizarCategoria,
} from "../../../api/CategoriasAPI";
import { Categoria } from "../../../types";
import { toast } from "react-toastify";

const CategoriaForm: React.FC = () => {
  const [nombre, setNombre] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      const fetchCategoria = async () => {
        setLoading(true);
        try {
          const categoria = await obtenerCategoriaPorId(id);
          if (categoria) {
            setNombre(categoria.nombre);
          }
        } catch (error) {
          console.error("Error fetching category:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchCategoria();
    }
  }, [id]);

  const handleSave = async () => {
    if (!nombre.trim()) {
      alert("Por favor ingrese un nombre para la categoría.");
      return;
    }

    setLoading(true);
    try {
      const now = new Date();
      if (id) {
        await actualizarCategoria(id, { nombre, updatedAt: now });
        toast.success("Categoría actualizada correctamente");
      } else {
        const newCategoria: Categoria = {
          id: "",
          nombre,
          createdAt: now,
          updatedAt: now,
        };
        await crearCategoria(newCategoria);
        toast.success("Categoría creada correctamente");
      }
      navigate("/admin/categorias");
    } catch (error) {
      console.error("Error saving category:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 flex flex-col items-center">
      <h1 className="text-2xl font-bold mb-4">
        {id ? "Editar Categoría" : "Añadir Categoría"}
      </h1>
      <input
        className="w-full p-2 mb-4 border border-gray-300 rounded"
        type="text"
        placeholder="Nombre"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
      />
      <button
        className={`bg-purple-600 text-white px-4 py-2 rounded ${
          loading ? "opacity-50" : ""
        }`}
        onClick={handleSave}
        disabled={loading}
      >
        {loading ? "Guardando..." : "Guardar"}
      </button>
    </div>
  );
};

export default CategoriaForm;
