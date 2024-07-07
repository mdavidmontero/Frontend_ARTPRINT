import { useState, useEffect } from "react";
import { Talla } from "../../../types";
import { useNavigate, useParams } from "react-router-dom";
import {
  actualizarTalla,
  crearTalla,
  obtenerTallaPorId,
} from "../../../api/TallaAPI";
import { toast } from "react-toastify";

const TallaForm = () => {
  const [nombre, setNombre] = useState("");
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  const { id } = useParams();
  useEffect(() => {
    if (id) {
      const fetchTalla = async () => {
        setLoading(true);
        try {
          const talla = await obtenerTallaPorId(id);
          if (talla) {
            setNombre(talla.nombre);
          }
        } catch (error) {
          console.error("Error fetching talla:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchTalla();
    }
  }, [id]);

  const handleSave = async () => {
    setLoading(true);
    try {
      if (!nombre.trim()) {
        toast.success("Por favor ingrese un nombre para la talla.");
        return;
      }

      const now = new Date();
      if (id) {
        await actualizarTalla(id, { nombre, updatedAt: now });
        toast.success("Talla actualizada correctamente.");
      } else {
        const newTalla: Talla = {
          id: "",
          nombre,
          createdAt: now,
          updatedAt: now,
        };
        await crearTalla(newTalla);
        toast.success("Talla creada correctamente.");
      }
      navigate("/admin/tallas");
    } catch (error) {
      console.error("Error saving talla:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold">
        {id ? "Editar Talla" : "Añadir Talla"}
      </h1>
      <input
        className="border border-gray-300 rounded px-2 py-1 w-full mb-4"
        type="text"
        placeholder="Nombre"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
      />
      <button
        className={`bg-purple-600 text-white py-2 px-4 rounded ${
          loading ? "opacity-50 cursor-not-allowed" : "hover:bg-purple-700"
        }`}
        onClick={handleSave}
        disabled={loading}
      >
        {loading ? "Guardando..." : "Guardar"}
      </button>
    </div>
  );
};

export default TallaForm;
