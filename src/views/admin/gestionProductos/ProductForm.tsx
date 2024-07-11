import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import { useImageUpload } from "../../../api/UploadImages";
import { Producto, Colors, Categoria } from "../../../types"; 
import { obtenerTodosLosColores } from "../../../api/ColoresAPI";
import {
  actualizarProducto,
  crearProducto,
  obtenerProductoPorId,
} from "../../../api/ProductosAPI";
import { obtenerTodasLasCategorias } from "../../../api/CategoriasAPI"; 

const ProductoForm = () => {
  const [producto, setProducto] = useState<Producto>({
    id: "",
    nombre: "",
    descripcion: "",
    precio: 0,
    idCategoria: "", 
    colores: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  });
  const [loading, setLoading] = useState(false);
  const [coloresDisponibles, setColoresDisponibles] = useState<Colors[]>([]);
  const [categoriasDisponibles, setCategoriasDisponibles] = useState<Categoria[]>([]); 

  const { id } = useParams<{ id: string }>();
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

  useEffect(() => {
    const fetchColores = async () => {
      try {
        const colores = await obtenerTodosLosColores();
        setColoresDisponibles(colores);
      } catch (error) {
        console.error("Error fetching colors:", error);
      }
    };

    fetchColores();
  }, []);

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const categorias = await obtenerTodasLasCategorias();
        setCategoriasDisponibles(categorias);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategorias();
  }, []);

  const handleAddColor = () => {
    setProducto({
      ...producto,
      colores: [...producto.colores, { id: "", nombre: "", imagenUrl: "" }],
    });
  };

  const handleRemoveColor = (index: number) => {
    const updatedColors = [...producto.colores];
    updatedColors.splice(index, 1);
    setProducto({ ...producto, colores: updatedColors });
  };

  const handleColorChange = (
    index: number,
    selectedColorId: string,
    imageUrl: string
  ) => {
    const updatedColors = [...producto.colores];
    updatedColors[index] = {
      ...updatedColors[index],
      id: selectedColorId, // Aquí asignamos el id del color seleccionado
      imagenUrl: imageUrl, // Aquí asignamos la URL de la imagen
    };
    setProducto({ ...producto, colores: updatedColors });
  };
  const handleFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    try {
      setLoading(true);
      const file = e.target.files?.[0];
      if (file) {
        const imageUrl = await useImageUpload(file);
        const selectedColorId = producto.colores[index].id; // Obtén el id del color seleccionado
        handleColorChange(index, selectedColorId, imageUrl); // Pasar el id del color seleccionado
      }
    } catch (error) {
      console.error("Error uploading image:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      if (
        !producto.nombre.trim() ||
        !producto.descripcion.trim() ||
        !producto.precio ||
        !producto.idCategoria || 
        producto.colores.some(
          (color) => !color.id.trim() || !color.imagenUrl.trim()
        )
      ) {
        toast.error("Complete todos los campos");
        return;
      }

      if (id) {
        await actualizarProducto(id, { ...producto, updatedAt: new Date() });
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
          id: "",
          nombre: "",
          descripcion: "",
          precio: 0,
          idCategoria: "", 
          colores: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        });
        toast.success("Producto guardado correctamente");
        navigate("/admin/productos");
      }
    } catch (error) {
      console.error("Error saving product:", error);
      toast.error("Error guardando el producto");
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
          <h2 className="text-xl font-bold mb-4">Categoría</h2>
          <select
            className="border border-gray-300 rounded px-3 py-2 w-full"
            value={producto.idCategoria}
            onChange={(e) =>
              setProducto({ ...producto, idCategoria: e.target.value })
            }
          >
            <option value="">-- Selecciona una categoría --</option>
            {categoriasDisponibles.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.nombre}
              </option>
            ))}
          </select>
        </div>

        <h2 className="text-xl font-bold mb-4">Colores</h2>
        {producto.colores.map((color, index) => (
          <div key={index} className="mb-4 border border-gray-300 p-4 rounded">
            <select
              className="border border-gray-300 rounded px-3 py-2 mb-4 w-full"
              value={color.id}
              onChange={(e) =>
                handleColorChange(index, e.target.value, color.imagenUrl)
              }
            >
              <option value="">Selecciona un color</option>
              {coloresDisponibles.map((col) => (
                <option key={col.id} value={col.id}>
                  {col.nombre}
                </option>
              ))}
            </select>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Seleccione una Imagen:
              </label>
              <input
                type="file"
                className="bg-purple-600 text-white px-4 py-2 rounded w-full"
                name={`file-${index}`}
                disabled={loading}
                onChange={(e) => handleFileChange(e, index)}
              />
              {loading && (
                <span className="text-gray-500">Subiendo imagen...</span>
              )}
            </div>

            {color.imagenUrl && (
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  URL de la Imagen:
                </label>
                <input
                  className="border border-gray-300 rounded px-3 py-2 w-full"
                  type="text"
                  value={color.imagenUrl}
                  readOnly
                />
                <img
                  src={color.imagenUrl}
                  alt={`Imagen de color ${color.nombre}`}
                  className="mt-2 rounded"
                  style={{ maxWidth: "100%", maxHeight: "400px" }}
                />
              </div>
            )}

            <button
              className="bg-red-600 text-white px-4 py-2 rounded"
              onClick={() => handleRemoveColor(index)}
            >
              Eliminar Color
            </button>
          </div>
        ))}
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded mb-4"
          onClick={handleAddColor}
        >
          Agregar Color
        </button>

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
