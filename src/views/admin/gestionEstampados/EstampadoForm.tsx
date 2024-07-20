import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import {
  actualizarEstampado,
  crearEstampado,
  obtenerEstampadoPorId,
} from "../../../api/AccesoriosAPI";
import { useImageUpload } from "../../../api/UploadImages";

const EstampadoForm = () => {
  const [nombre, setNombre] = useState<string>("");
  const [precio, setPrecio] = useState<number>(0);
  const [imageUrl, setImageUrl] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      const fetchEstampado = async () => {
        setLoading(true);
        try {
          const estampado = await obtenerEstampadoPorId(id);
          if (estampado) {
            setNombre(estampado.nombre);
            setPrecio(estampado.precio);
            setImageUrl(estampado.image);
          }
        } catch (error) {
          console.error("Error fetching estampado:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchEstampado();
    }
  }, [id]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setLoading(true);
      const file = e.target.files?.[0];
      if (file) {
        const imageUrl = await useImageUpload(file);
        setImageUrl(imageUrl);
      }
    } catch (error) {
      console.error("Error uploading image:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!nombre.trim()) {
      toast.info("Por favor ingrese un nombre para el estampado.");
      return;
    }

    setLoading(true);
    try {
      const now = new Date();
      if (id) {
        await actualizarEstampado(id, {
          nombre,
          precio,
          image: imageUrl,
          updatedAt: now,
        });
        toast.success("Estampado actualizado correctamente.");
      } else {
        const newAccesorio = {
          id: "",
          nombre,
          precio,
          image: imageUrl,
          createdAt: now,
          updatedAt: now,
        };
        await crearEstampado(newAccesorio);
        toast.success("Estampado creado correctamente.");
      }
      navigate("/admin/estampado");
    } catch (error) {
      console.error("Error saving estampado:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4 md:p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">
        {id ? "Editar Estampado" : "Añadir Estampado"}
      </h1>
      <div className="w-full max-w-md mx-auto">
        <input
          className="w-full h-10 px-3 border rounded mb-4"
          type="text"
          placeholder="Nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />
        <input
          type="number"
          className="w-full h-10 px-3 border rounded mb-4"
          placeholder="Precio Adicional"
          value={precio}
          onChange={(e) => setPrecio(parseFloat(e.target.value))}
        />
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Seleccione una Imagen:
          </label>
          <div className="flex items-center">
            <label className="cursor-pointer bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition duration-300">
              Subir Imagen
              <input
                type="file"
                className="hidden"
                name="file"
                id="file"
                disabled={loading}
                onChange={handleFileChange}
              />
            </label>
            {loading && (
              <span className="ml-4 text-gray-500">Cargando imagen...</span>
            )}
          </div>
        </div>
        {imageUrl && (
          <div className="mb-4 flex flex-col  md:items-start items-center">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Imagen:
            </label>
            <div className="py-2">
              <img
                src={imageUrl}
                alt={`Imagen del producto ${nombre}`}
                className="mt-2 rounded"
                style={{ maxWidth: "100%", maxHeight: "400px" }}
              />
            </div>
          </div>
        )}
        <button
          className="w-full bg-purple-600 text-white px-4 py-2 rounded shadow hover:bg-purple-700"
          onClick={handleSave}
          disabled={loading}
        >
          {loading ? "Guardando..." : "Guardar"}
        </button>
      </div>
    </div>
  );
};

export default EstampadoForm;
