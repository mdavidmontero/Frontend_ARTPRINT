import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Prenda, createPrenda } from "../../../types";
import { Categoria } from "../../../types";
import {
  actualizarPrenda,
  crearPrenda,
  obtenerPrendaPorId,
} from "../../../api/PrendaAPI";
import { obtenerTodasLasCategorias } from "../../../api/CategoriasAPI";
import { toast } from "react-toastify";
const PrendaForm = () => {
  const [nombre, setNombre] = useState("");
  const [idCategoria, setIdCategoria] = useState("");
  const [precio, setPrecio] = useState("");
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { id } = useParams();

  const [errors, setErrors] = useState<{
    nombre: boolean;
    idCategoria: boolean;
    precio: boolean;
  }>({
    nombre: false,
    idCategoria: false,
    precio: false,
  });

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const fetchedCategorias = await obtenerTodasLasCategorias();
        setCategorias(fetchedCategorias);
        console.log(idCategoria);
        if (id) {
          const prenda = await obtenerPrendaPorId(id);
          if (prenda) {
            setNombre(prenda.nombre);
            setIdCategoria(prenda.idCategoria);
            setPrecio(prenda.precio.toString());
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const validateFields = () => {
    const newErrors = {
      nombre: nombre.trim() === "",
      idCategoria: idCategoria === "",
      precio: precio.trim() === "" || isNaN(Number(precio)),
    };
    setErrors(newErrors);
    return !Object.values(newErrors).includes(true);
  };

  const handleSave = async () => {
    if (!validateFields()) {
      return;
    }

    try {
      const prendaData: Prenda = createPrenda(
        id || "",
        nombre,
        idCategoria,
        parseFloat(precio),
        new Date(),
        new Date()
      );

      if (id) {
        await actualizarPrenda(id, prendaData);
        toast.success("Prenda Actualizada Correctamente");
      } else {
        await crearPrenda(prendaData);
        toast.success("Prenda Creada Correctamente");
      }
      navigate("/admin/prendas");
    } catch (error) {
      console.error("Error saving prenda:", error);
    }
  };

  // const handleCategoriaSelect = (id: string) => {
  //   setIdCategoria(id);
  // };

  return (
    <div className="flex flex-col items-center mt-8">
      <h1 className="mb-4 text-3xl font-bold">
        {id ? "Editar Prenda" : "Añadir Prenda"}
      </h1>
      {loading ? (
        <div className="text-purple-600">Loading...</div>
      ) : (
        <div className="w-full max-w-md">
          <label
            className="block mb-2 text-sm font-bold text-gray-700"
            htmlFor="nombre"
          >
            Nombre
          </label>
          <input
            className={`appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
              errors.nombre ? "border-red-500" : "border-gray-300"
            }`}
            id="nombre"
            type="text"
            placeholder="Nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
          />
          {errors.nombre && (
            <p className="text-xs italic text-red-500">Nombre es requerido</p>
          )}
          <label
            className="block mt-4 mb-2 text-sm font-bold text-gray-700"
            htmlFor="categoria"
          >
            Categoría
          </label>
          <div className="relative">
            <select
              className={`appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                errors.idCategoria ? "border-red-500" : "border-gray-300"
              }`}
              id="categoria"
              value={idCategoria}
              onChange={(e) => setIdCategoria(e.target.value)}
            >
              <option value="">-- Seleccione una categoría --</option>
              {categorias.map((categoria) => (
                <option key={categoria.id} value={categoria.id}>
                  {categoria.nombre}
                </option>
              ))}
            </select>
            {errors.idCategoria && (
              <p className="text-xs italic text-red-500">
                Categoría es requerida
              </p>
            )}
          </div>
          <label
            className="block mt-4 mb-2 text-sm font-bold text-gray-700"
            htmlFor="precio"
          >
            Precio
          </label>
          <input
            className={`appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
              errors.precio ? "border-red-500" : "border-gray-300"
            }`}
            id="precio"
            type="text"
            placeholder="Precio"
            value={precio}
            onChange={(e) => setPrecio(e.target.value)}
          />
          {errors.precio && (
            <p className="text-xs italic text-red-500">
              Precio es requerido y debe ser un número
            </p>
          )}
          <div className="mt-6">
            <button
              className="w-full px-4 py-2 text-white bg-green-600 rounded hover:bg-green-700 focus:outline-none focus:shadow-outline"
              onClick={handleSave}
            >
              {id ? "Actualizar" : "Guardar"} Prenda
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PrendaForm;
