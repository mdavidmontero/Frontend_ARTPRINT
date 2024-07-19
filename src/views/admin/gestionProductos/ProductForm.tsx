import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import { useImageUpload } from "../../../api/UploadImages";
import { Producto, Colors, Genero } from "../../../types";
import { obtenerTodosLosColores } from "../../../api/ColoresAPI";
import {
  actualizarProducto,
  crearProducto,
  obtenerProductoPorId,
} from "../../../api/ProductosAPI";
import { obtenerTodasLasCategorias } from "../../../api/CategoriasAPI";
import { useQuery } from "@tanstack/react-query";
import { obtenerTodosLosMateriales } from "../../../api/MaterialAPI";
import { obtenerTodasLasTallas } from "../../../api/TallaAPI";

const ProductoForm = () => {
  const [producto, setProducto] = useState<Producto>({
    id: "",
    nombre: "",
    descripcion: "",
    precio: 0,
    idCategoria: "",
    materiales: [],
    tallas: [],
    colores: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  });
  const [loading, setLoading] = useState(false);
  const [coloresDisponibles, setColoresDisponibles] = useState<Colors[]>([]);
  const [selectedGenero, setSelectedGenero] = useState<Genero | null>();
  const [tallaPantalon, setTallaPantalon] = useState("superior");
  const [tallasInferior, setTallaInferior] = useState<string[]>([]);
  const [tallaInput, setTallaInput] = useState("");
  const genero: Genero[] = ["Hombre", "Mujer", "Unisex"];

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

  const { data: dataCategorias } = useQuery({
    queryKey: ["categorias"],
    queryFn: obtenerTodasLasCategorias,
  });

  const { data: dataMateriales } = useQuery({
    queryKey: ["materiales"],
    queryFn: obtenerTodosLosMateriales,
  });
  const { data: dataTallas } = useQuery({
    queryKey: ["tallas"],
    queryFn: obtenerTodasLasTallas,
  });

  const handleAddColor = () => {
    setProducto({
      ...producto,
      colores: [...producto.colores, { id: "", nombre: "", imagenUrl: "" }],
    });
  };
  const handleGeneroClick = (size: Genero) => {
    setSelectedGenero(size);
    setProducto((prevProducto) => ({
      ...prevProducto,
      tamaño: size,
    }));
  };

  const handleRemoveColor = (index: number) => {
    const updatedColors = [...producto.colores];
    updatedColors.splice(index, 1);
    setProducto({ ...producto, colores: updatedColors });
  };

  const handleMaterialesChange = (selectedMaterialesId: string) => {
    const selectedMateriales =
      dataMateriales &&
      dataMateriales.find((material) => material.id === selectedMaterialesId);
    if (
      selectedMateriales &&
      !producto.materiales.some(
        (material) => material.id === selectedMateriales.id
      )
    ) {
      setProducto({
        ...producto,
        materiales: [...producto.materiales, selectedMateriales],
      });
    }
  };
  const handleTallasInferiorChange = () => {
    if (tallaInput && !tallasInferior.includes(tallaInput)) {
      const nuevasTallas = [...tallasInferior, tallaInput];
      setTallaInferior(nuevasTallas);
      setProducto({
        ...producto,
        tallas: nuevasTallas,
      });
      setTallaInput(""); // Clear the input field after adding the talla
    } else {
      toast.error("Ya agregaste esa talla o el campo está vacío");
    }
  };

  const handleEliminarTalla = (talla: string) => {
    const nuevasTallas = tallasInferior.filter((t) => t !== talla);
    setTallaInferior(nuevasTallas);
    setProducto({
      ...producto,
      tallas: nuevasTallas,
    });
  };
  const handleRemoveMaterial = (index: number) => {
    const updatedMateriales = [...producto.materiales];
    updatedMateriales.splice(index, 1);
    setProducto({ ...producto, materiales: updatedMateriales });
  };

  const handleTallasChange = (selectedTallaNombre: any) => {
    const isAlreadySelected = producto.tallas.includes(selectedTallaNombre);

    if (isAlreadySelected) {
      setProducto({
        ...producto,
        tallas: producto.tallas.filter(
          (talla) => talla !== selectedTallaNombre
        ),
      });
    } else {
      setProducto({
        ...producto,
        tallas: [...producto.tallas, selectedTallaNombre],
      });
    }
  };

  console.log(producto);

  const handleColorChange = (
    index: number,
    selectedColorId: string,
    imageUrl: string
  ) => {
    const updatedColors = [...producto.colores];
    updatedColors[index] = {
      ...updatedColors[index],
      id: selectedColorId,
      imagenUrl: imageUrl,
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
          materiales: [],
          tallas: [],
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
        <label className="block text-gray-700  font-bold mb-2">Precio</label>
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
            <option value="">Selecciona una categoría</option>
            {dataCategorias?.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.nombre}
              </option>
            ))}
          </select>
        </div>
        <div className="py-2">
          <h2 className="text-xl font-bold ">Genero</h2>
          <p className="mb-2">Seleccione Genero</p>
          <div className="flex flex-wrap gap-2 mb-4">
            {genero.map((gen) => (
              <button
                key={gen}
                onClick={() => handleGeneroClick(gen)}
                className={`py-2 px-4 rounded ${
                  selectedGenero === gen
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-700"
                }`}
              >
                {gen}
              </button>
            ))}
          </div>
        </div>
        <div className="py-2">
          <h2 className="text-xl font-bold mb-4">Materiales</h2>
          <select
            className="border border-gray-300 rounded px-3 py-2 mb-4 w-full"
            onChange={(e) => handleMaterialesChange(e.target.value)}
          >
            <option value="">Selecciona los Materiales</option>
            {dataMateriales &&
              dataMateriales.map((col) => (
                <option key={col.id} value={col.id}>
                  {col.nombre}
                </option>
              ))}
          </select>
        </div>

        {producto.materiales.length > 0 && (
          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-2">
              Materiales Seleccionados:
            </h3>
            {producto.materiales.map((material, index) => (
              <div
                key={index}
                className="flex items-center lg:w-60 justify-between w-full mb-2 p-2 border border-gray-300 rounded"
              >
                <span>{material.nombre}</span>
                <button
                  className="bg-red-600 text-white px-2 py-1 rounded"
                  onClick={() => handleRemoveMaterial(index)}
                >
                  Eliminar
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="py-2">
          <h2 className="text-xl font-bold ">Tipo de Prenda</h2>
          <div>
            <div className="flex gap-2">
              <div>
                <label className="mr-2">Prenda Superior</label>
                <input
                  type="radio"
                  name="superior"
                  checked={tallaPantalon === "superior"}
                  onChange={() => setTallaPantalon("superior")}
                />
              </div>
              <div>
                <label className="mr-2">Prenda Inferior</label>
                <input
                  type="radio"
                  name="inferior"
                  checked={tallaPantalon === "inferior"}
                  onChange={() => setTallaPantalon("inferior")}
                />
              </div>
            </div>
          </div>
        </div>

        {tallaPantalon === "superior" ? (
          <div className="py-2">
            <h2 className="text-xl font-bold ">Tallas</h2>
            <p className="mb-2">Seleccione las tallas disponibles</p>
            <div className="flex flex-wrap gap-2 mb-4">
              {dataTallas?.map((talla) => (
                <button
                  key={talla.id}
                  className={`px-3 py-2 rounded border ${
                    producto.tallas.includes(talla.nombre)
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200"
                  }`}
                  onClick={() => handleTallasChange(talla.nombre)}
                >
                  {talla.nombre}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="mb-4">
            <h2 className="text-xl font-bold mb-4">Tallas Disponibles</h2>
            <input
              type="text"
              placeholder="Ingrese la talla"
              value={tallaInput}
              onChange={(e) => setTallaInput(e.target.value)}
            />
            <button
              className="ml-2 px-4 py-2 bg-blue-600 text-white rounded"
              onClick={handleTallasInferiorChange}
            >
              Agregar Talla
            </button>
            <div className="mt-4">
              <h3 className="text-lg font-bold py-2">Tallas Agregadas:</h3>
              <div>
                {tallasInferior.map((talla, index) => (
                  <div
                    className="flex items-center lg:w-60 justify-between w-full gap-4 mb-2 p-2 border border-gray-300 rounded"
                    key={index}
                  >
                    <span>{talla}</span>

                    <button
                      className="ml-2 px-2 py-1 bg-red-600 text-white rounded"
                      onClick={() => handleEliminarTalla(talla)}
                    >
                      Eliminar
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

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
              <div className="flex items-center">
                <label className="cursor-pointer bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition duration-300">
                  Seleccionar Imagen
                  <input
                    type="file"
                    className="hidden"
                    name={`file-${index}`}
                    disabled={loading}
                    onChange={(e) => handleFileChange(e, index)}
                  />
                </label>
                {loading && (
                  <span className="text-gray-500">Subiendo imagen...</span>
                )}
              </div>
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
