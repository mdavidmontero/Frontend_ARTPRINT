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
  // const [precioExtra, setPrecioExtra] = useState<string>("");
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
            // setPrecioExtra(material.precioExtra.toString());
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
    // || !precioExtra.trim()
    if (!nombre.trim()) {
      alert("Por favor complete todos los campos.");
      return;
    }

    setLoading(true);
    try {
      const now = new Date();
      // const parsedPrecioExtra = parseFloat(precioExtra);

      if (id) {
        await actualizarMaterial(id, {
          nombre,
          // precioExtra: parsedPrecioExtra,
          updatedAt: now,
        });
        toast.success("Material Actualizado Correctamente");
        navigate("/admin/material");
      } else {
        const newMaterial = {
          id: "",
          nombre,
          // precioExtra: parsedPrecioExtra,
          createdAt: now,
          updatedAt: now,
        };
        await crearMaterial(newMaterial);
        toast.success("Material Creado Correctamente");
        navigate("/admin/material");
      }
    } catch (error) {
      console.error("Error saving material:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container p-4 mx-auto md:p-6">
      <h1 className="mb-6 text-3xl font-bold text-center">
        {id ? "Editar Material" : "Añadir Material"}
      </h1>
      <div className="w-full max-w-md mx-auto">
        <input
          className="w-full px-3 py-2 mb-4 border border-gray-300 rounded"
          type="text"
          placeholder="Nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />

        <button
          className="w-full px-4 py-2 text-white bg-green-600 rounded shadow hover:bg-green-700"
          onClick={handleSave}
          disabled={loading}
        >
          {loading ? "Guardando..." : "Guardar"}
        </button>
      </div>
    </div>
  );
};

export default MaterialForm;
