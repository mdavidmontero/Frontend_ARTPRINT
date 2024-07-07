import { useState, useEffect } from "react";
import {
  obtenerProductoPorId,
  actualizarProducto,
  crearProducto,
} from "../../../api/ProductosAPI";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import { useImageUpload } from "../../../api/UploadImages";

const ProductoForm = () => {
  const [producto, setProducto] = useState({
    nombre: "",
    descripcion: "",
    precio: 0,
    imagenUrl: "",
  });
  const [loading, setLoading] = useState(false);

  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      const fetchProduct = async () => {
        try {
          const fetchedProduct = await obtenerProductoPorId(id);
          if (fetchedProduct) {
            setProducto(fetchedProduct);
          }
        } catch (error) {
          console.error("Error fetching product:", error);
        }
      };
      fetchProduct();
    }
  }, [id]);

  const handleSave = async () => {
    try {
      if (
        !producto.nombre.trim() ||
        !producto.descripcion.trim() ||
        !producto.precio ||
        !producto.imagenUrl.trim()
      ) {
        toast.error("Complete todos los campos");
        return;
      }

      if (id) {
        await actualizarProducto(id, producto);
        toast.success("Producto actualizado correctamente");
        navigate("/admin/productos");
      } else {
        await crearProducto({
          ...producto,
          id: "",
          createdAt: new Date(),
          updatedAt: new Date(),
        });
        setProducto({
          nombre: "",
          descripcion: "",
          precio: 0,
          imagenUrl: "",
        });
        toast.success("Producto guardado correctamente");
        navigate("/admin/productos");
      }
    } catch (error) {
      console.error("Error saving product:", error);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setLoading(true);
      const file = e.target.files?.[0];
      if (file) {
        const imageUrl = await useImageUpload(file);
        setProducto({ ...producto, imagenUrl: imageUrl });
      }
    } catch (error) {
      console.error("Error uploading image:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">
          {id ? "Editar Producto" : "Agregar Producto"}
        </h1>
        <input
          className="border border-gray-300 rounded px-3 py-2 mb-4 w-full"
          type="text"
          placeholder="Nombre"
          value={producto.nombre}
          onChange={(e) => setProducto({ ...producto, nombre: e.target.value })}
        />
        <textarea
          className="border border-gray-300 rounded px-3 py-2 mb-4 w-full"
          placeholder="Descripción"
          value={producto.descripcion}
          onChange={(e) =>
            setProducto({ ...producto, descripcion: e.target.value })
          }
        />
        <input
          className="border border-gray-300 rounded px-3 py-2 mb-4 w-full"
          type="number"
          placeholder="Precio"
          value={producto.precio}
          onChange={(e) =>
            setProducto({ ...producto, precio: parseFloat(e.target.value) })
          }
        />
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Seleccione una Imagen:
          </label>
          <input
            type="file"
            className="bg-purple-600 text-white px-4 py-2 rounded w-full"
            name="file"
            id="file"
            disabled={loading}
            onChange={handleFileChange}
          />
          {loading && <span className="text-gray-500">Subiendo imagen...</span>}
        </div>

        {producto.imagenUrl && (
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              URL de la Imagen:
            </label>
            <input
              className="border border-gray-300 rounded px-3 py-2 w-full"
              type="text"
              value={producto.imagenUrl}
              readOnly
            />
            <img
              src={producto.imagenUrl}
              alt="Imagen Producto"
              className="mt-2 rounded"
              style={{ maxWidth: "100%", maxHeight: "400px" }}
            />
          </div>
        )}

        <button
          className="bg-purple-600 text-white px-4 py-2 rounded w-full"
          onClick={handleSave}
        >
          Guardar
        </button>
      </div>
    </>
  );
};

export default ProductoForm;
