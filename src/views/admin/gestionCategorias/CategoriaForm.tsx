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
    <div className="container p-4 mx-auto md:p-6">
      <h1 className="mb-6 text-2xl font-bold text-center">
        {id ? "Editar Categoría" : "Añadir Categoría"}
      </h1>
      <div className="w-full max-w-md mx-auto">
        <input
          className="w-full h-10 px-3 mb-4 border rounded"
          type="text"
          placeholder="Nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />
        <button
          className={`w-full px-4 py-2 text-white bg-green-600 rounded shadow hover:bg-green-700 ${
            loading ? "opacity-50" : ""
          }`}
          onClick={handleSave}
          disabled={loading}
        >
          {loading ? "Guardando..." : "Guardar"}
        </button>
      </div>
    </div>
  );
};

export default CategoriaForm;
