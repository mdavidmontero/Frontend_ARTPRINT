import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  actualizarColor,
  crearColor,
  obtenerColorPorId,
} from "../../../api/ColoresAPI";
import { toast } from "react-toastify";

const ColorForm = () => {
  const [nombre, setNombre] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      const fetchColor = async () => {
        setLoading(true);
        try {
          const color = await obtenerColorPorId(id);
          if (color) {
            setNombre(color.nombre);
          }
        } catch (error) {
          console.error("Error fetching color:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchColor();
    }
  }, [id]);

  const handleSave = async () => {
    if (!nombre.trim()) {
      toast.info("Por favor ingrese un nombre para el color.");
      return;
    }

    setLoading(true);
    try {
      const now = new Date();
      if (id) {
        await actualizarColor(id, { nombre, updatedAt: now });
        toast.success("Color actualizado correctamente.");
      } else {
        const newColor = { id: "", nombre, createdAt: now, updatedAt: now };
        await crearColor(newColor);
        toast.success("Color creado correctamente.");
      }
      navigate("/admin/color");
    } catch (error) {
      console.error("Error saving color:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container p-4 mx-auto md:p-6">
      <h1 className="mb-6 text-3xl font-bold text-center">
        {id ? "Editar Color" : "Añadir Color"}
      </h1>
      <div className="w-full max-w-md mx-auto">
        <input
          className="w-full px-3 py-2 mb-4 border border-gray-300 rounded"
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

export default ColorForm;
