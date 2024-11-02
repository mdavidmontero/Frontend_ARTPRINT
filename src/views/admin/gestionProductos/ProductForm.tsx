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
    genero: "",
    materiales: [],
    tallas: [],
    colores: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  });
  const [loading, setLoading] = useState(false);
  const [coloresDisponibles, setColoresDisponibles] = useState<Colors[]>([]);
  const [selectedGenero, setSelectedGenero] = useState("");
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
  useEffect(() => {
    if (producto.genero) {
      setSelectedGenero(producto.genero);
    }
  }, [producto.genero]);

  const handleGeneroClick = (gen: Genero) => {
    setSelectedGenero(gen);
    setProducto({
      ...producto,
      genero: gen,
    });
  };

  const handleMaterialesChange = (selectedMaterialesId: string) => {
    const selectedMateriales = dataMateriales?.find(
      (material) => material.id === selectedMaterialesId
    );
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
  const handleRemoveMaterial = (index: number) => {
    const updatedMateriales = [...producto.materiales];
    updatedMateriales.splice(index, 1);
    setProducto({ ...producto, materiales: updatedMateriales });
  };
  const handleAddColor = () => {
    setProducto({
      ...producto,
      colores: [...producto.colores, { id: "", nombre: "", imagenUrl: "" }],
    });
  };
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

  const handleRemoveColor = (index: number) => {
    const updatedColors = [...producto.colores];
    updatedColors.splice(index, 1);
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
        const selectedColorId = producto.colores[index].id;
        handleColorChange(index, selectedColorId, imageUrl);
      }
    } catch (error) {
      console.error("Error uploading image:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleTallasChange = (selectedTallaNombre: string) => {
    const isAlreadySelected = producto.tallas.includes(selectedTallaNombre);
    const busqueda = producto.tallas.filter(
      (talla) => talla !== selectedTallaNombre
    );
    if (isAlreadySelected) {
      setProducto({
        ...producto,
        tallas: busqueda,
      });
    } else {
      setProducto({
        ...producto,
        tallas: [...producto.tallas, selectedTallaNombre],
      });
    }
  };

  const handleTallasInferiorChange = () => {
    if (!tallasInferior.includes(tallaInput)) {
      const nuevasTallas = [...tallasInferior, tallaInput];
      setTallaInferior(nuevasTallas);

      setProducto({
        ...producto,
        tallas: nuevasTallas,
      });
      setTallaInput("");
    } else {
      toast.error("Ya agregaste esa talla o el campo está vacío");
    }
  };

  const handleEliminarTalla = (talla: string) => {
    const nuevasTallas = producto.tallas.filter((t) => t !== talla);
    setTallaInferior(nuevasTallas);
    setProducto({
      ...producto,
      tallas: nuevasTallas,
    });
  };

  const handleSave = async () => {
    try {
      if (
        !producto.nombre.trim() ||
        !producto.descripcion.trim() ||
        !producto.precio ||
        !producto.idCategoria ||
        !producto.genero ||
        !producto.materiales.length ||
        !producto.tallas.length ||
        !producto.colores.length ||
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
          genero: "",
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
      <div className="container p-4 mx-auto md:p-6">
        <h1 className="mb-6 text-2xl font-bold text-center">
          {id ? "Editar Prenda" : "Agregar Prenda"}
        </h1>
        <div className="w-full max-w-md mx-auto">
          <input
            className="w-full px-3 py-2 mb-4 border border-gray-300 rounded"
            type="text"
            placeholder="Nombre"
            value={producto.nombre}
            onChange={(e) =>
              setProducto({ ...producto, nombre: e.target.value })
            }
          />
          <textarea
            className="w-full px-3 py-2 mb-4 border border-gray-300 rounded"
            placeholder="Descripción"
            value={producto.descripcion}
            onChange={(e) =>
              setProducto({ ...producto, descripcion: e.target.value })
            }
          />
          <label className="block mb-2 font-bold text-gray-700">Precio</label>
          <input
            className="w-full px-3 py-2 mb-4 border border-gray-300 rounded"
            type="number"
            placeholder="Precio"
            value={producto.precio}
            onChange={(e) =>
              setProducto({ ...producto, precio: parseFloat(e.target.value) })
            }
          />
          <div className="mb-4">
            <h2 className="mb-4 text-xl font-bold">Categoría</h2>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded"
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
            <h2 className="mb-4 text-xl font-bold">Materiales</h2>
            <select
              className="w-full px-3 py-2 mb-4 border border-gray-300 rounded"
              onChange={(e) => handleMaterialesChange(e.target.value)}
            >
              <option value="">Selecciona los Materiales</option>
              {dataMateriales?.map((col) => (
                <option key={col.id} value={col.id}>
                  {col.nombre}
                </option>
              ))}
            </select>
          </div>
          {producto.materiales.length > 0 && (
            <div className="mb-4">
              <h3 className="mb-2 text-lg font-semibold">
                Materiales Seleccionados:
              </h3>
              {producto.materiales.map((material, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between w-full p-2 mb-2 border border-gray-300 rounded lg:w-60"
                >
                  <span>{material.nombre}</span>
                  <button
                    className="px-2 py-1 text-white bg-red-600 rounded"
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
              <h2 className="mb-4 text-xl font-bold">Tallas Disponibles</h2>
              <input
                type="text"
                placeholder="Ingrese la talla"
                value={tallaInput}
                onChange={(e) => setTallaInput(e.target.value)}
              />
              <button
                className="px-4 py-2 ml-2 text-white bg-blue-600 rounded"
                onClick={handleTallasInferiorChange}
              >
                Agregar Talla
              </button>
              <div className="mt-4">
                <h3 className="py-2 text-lg font-bold">Tallas Agregadas:</h3>
                <div>
                  {producto.tallas.map((talla) => (
                    <div
                      className="flex items-center justify-between w-full gap-4 p-2 mb-2 border border-gray-300 rounded lg:w-60"
                      key={producto.tallas.indexOf(talla)}
                    >
                      <span>{talla}</span>
                      <button
                        className="px-2 py-1 ml-2 text-white bg-red-600 rounded"
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
          <h2 className="mb-4 text-xl font-bold">Colores</h2>
          {producto.colores.map((color, index) => (
            <div
              key={index}
              className="p-4 mb-4 border border-gray-300 rounded"
            >
              <select
                className="w-full px-3 py-2 mb-4 border border-gray-300 rounded"
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
                  <label className="px-4 py-2 text-white transition duration-300 bg-blue-600 rounded cursor-pointer hover:bg-blue-700">
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
                  <img
                    src={color.imagenUrl}
                    alt={`Imagen de color ${color.nombre}`}
                    className="mt-2 rounded"
                    style={{ maxWidth: "100%", maxHeight: "400px" }}
                  />
                </div>
              )}
              <button
                className="px-4 py-2 text-white bg-red-600 rounded"
                onClick={() => handleRemoveColor(index)}
              >
                Eliminar Color
              </button>
            </div>
          ))}
          <button
            className="px-4 py-2 mb-4 text-white bg-green-500 rounded hover:bg-green-600"
            onClick={handleAddColor}
          >
            Agregar Color
          </button>
          <button
            className="w-full px-4 py-2 text-white bg-green-600 rounded hover:bg-green-700"
            onClick={handleSave}
          >
            Guardar
          </button>
        </div>
      </div>
    </>
  );
};

export default ProductoForm;
