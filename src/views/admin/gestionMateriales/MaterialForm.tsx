import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  actualizarMaterial,
  crearMaterial,
  obtenerMaterialPorId,
} from "../../../api/MaterialAPI";
import { toast } from "react-toastify";

const MaterialForm = () => {
  const [nombre, setNombre] = useState<string>("");
  const [precioExtra, setPrecioExtra] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      const fetchMaterial = async () => {
        setLoading(true);
        try {
          const material = await obtenerMaterialPorId(id);
          if (material) {
            setNombre(material.nombre);
            setPrecioExtra(material.precioExtra.toString());
          }
        } catch (error) {
          console.error("Error fetching material:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchMaterial();
    }
  }, [id]);

  const handleSave = async () => {
    if (!nombre.trim() || !precioExtra.trim()) {
      alert("Por favor complete todos los campos.");
      return;
    }

    setLoading(true);
    try {
      const now = new Date();
      const parsedPrecioExtra = parseFloat(precioExtra);
      if (!isNaN(parsedPrecioExtra)) {
        if (id) {
          await actualizarMaterial(id, {
            nombre,
            precioExtra: parsedPrecioExtra,
            updatedAt: now,
          });
          toast.success("Material Actualizado Correctamente");
          navigate("/admin/material");
        } else {
          const newMaterial = {
            id: "",
            nombre,
            precioExtra: parsedPrecioExtra,
            createdAt: now,
            updatedAt: now,
          };
          await crearMaterial(newMaterial);
          toast.success("Material Creado Correctamente");
          navigate("/admin/material");
        }
      } else {
        console.error("Precio extra inválido.");
      }
    } catch (error) {
      console.error("Error saving material:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-100 p-4">
      <h1 className="text-2xl font-bold mb-4">
        {id ? "Editar Material" : "Añadir Material"}
      </h1>
      <input
        className="border border-gray-300 rounded px-3 py-2 mb-4"
        type="text"
        placeholder="Nombre"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
      />
      <input
        className="border border-gray-300 rounded px-3 py-2 mb-4"
        type="number"
        placeholder="Precio Extra"
        value={precioExtra}
        onChange={(e) => setPrecioExtra(e.target.value)}
      />
      <button
        className="bg-purple-600 text-white py-2 px-4 rounded"
        onClick={handleSave}
        disabled={loading}
      >
        {loading ? "Guardando..." : "Guardar"}
      </button>
    </div>
  );
};

export default MaterialForm;
