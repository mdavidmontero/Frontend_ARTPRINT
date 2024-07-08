import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  useParams,
  useNavigate,
} from "react-router-dom";
import useAuthStore from "../../store/authStore";
import { obtenerTodasLasTallas } from "../../api/TallaAPI";
import { obtenerTodosLosColores } from "../../api/ColoresAPI";
import { obtenerTodosLosMateriales } from "../../api/MaterialAPI";
import { obtenerTodasLasCategorias } from "../../api/CategoriasAPI";
import { Categoria, Color, Material, Prenda, Talla } from "../../types";
import CarritoController from "../../api/CarritoAPI";

import { obtenerPrendasPorCategoria } from "../../api/PrendaAPI";
import { obtenerProductoPorId } from "../../api/ProductosAPI";
import { toast } from "react-toastify";
const carritoController = new CarritoController();
import useAuth from "../../hooks/useAuth";

export const DetallesDeProducto = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const usuarioId = user?.uid;
  const navigate = useNavigate();
  const [tallas, setTallas] = useState<Talla[]>([]);
  const [colores, setColores] = useState<Color[]>([]);
  const [materiales, setMateriales] = useState<Material[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [prendas, setPrendas] = useState<Prenda[]>([]);
  const [selectedTalla, setSelectedTalla] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [selectedMaterial, setSelectedMaterial] = useState<string>("");
  const [selectedCategoria, setSelectedCategoria] = useState<string>("");
  const [selectedPrenda, setSelectedPrenda] = useState<string>("");
  const [selectedGenero, setSelectedGenero] = useState<string>("");
  const [cantidad, setCantidad] = useState<number>(1);
  const [addToCartDisabled, setAddToCartDisabled] = useState(true);
  const [loading, setLoading] = useState(true);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [producto, setProducto] = useState({
    id: "",
    nombre: "",
    descripcion: "",
    precio: 0,
    imagenUrl: "",
  });

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
    const fetchData = async () => {
      try {
        const [tallasData, coloresData, materialesData, categoriasData] =
          await Promise.all([
            obtenerTodasLasTallas(),
            obtenerTodosLosColores(),
            obtenerTodosLosMateriales(),
            obtenerTodasLasCategorias(),
          ]);
        setTallas(tallasData);
        setColores(coloresData);
        setMateriales(materialesData);
        setCategorias(categoriasData);
      } catch (error) {
        console.error("Error al cargar datos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  useEffect(() => {
    const fetchPrendas = async () => {
      if (selectedCategoria) {
        try {
          const prendasData = await obtenerPrendasPorCategoria(
            selectedCategoria
          );
          setPrendas(prendasData);
          setSelectedPrenda(prendasData.length > 0 ? prendasData[0].id : "");
        } catch (error) {
          console.error("Error al cargar prendas:", error);
        }
      }
    };

    fetchPrendas();
  }, [selectedCategoria]);

  useEffect(() => {
    const allSelectionsMade = [
      selectedTalla,
      selectedColor,
      selectedMaterial,
      selectedCategoria,
      selectedPrenda,
      selectedGenero,
    ].every(Boolean);
    setAddToCartDisabled(!allSelectionsMade);
  }, [
    selectedTalla,
    selectedColor,
    selectedMaterial,
    selectedCategoria,
    selectedPrenda,
    selectedGenero,
  ]);

  const handleAddToCart = async () => {
    if (!usuarioId) {
      toast.error(
        "Por favor, inicie sesión para agregar productos al carrito."
      );
      navigate("/auth/login");
      return;
    }

    setIsAddingToCart(true);

    try {
      let carrito = await carritoController.obtenerCarritoPorUsuarioId(
        usuarioId
      );

      if (!carrito) {
        carrito = await carritoController.crearCarrito(usuarioId);
      }

      const itemCarrito = {
        productoId: producto.id,
        imagen: producto.imagenUrl,
        nombre: producto.nombre,
        idPrenda: selectedPrenda,
        idMaterial: selectedMaterial,
        idColor: selectedColor,
        talla: selectedTalla,
        genero: selectedGenero,
        cantidad: cantidad,
        precio: producto.precio,
      };

      await carritoController.agregarProductoAlCarrito(
        carrito.id,
        itemCarrito,
        usuarioId
      );
      toast.success("Producto agregado al carrito correctamente.");
    } catch (error) {
      console.error("Error al agregar el producto al carrito:", error);
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleIncrement = () => setCantidad(cantidad + 1);
  const handleDecrement = () => {
    if (cantidad > 1) setCantidad(cantidad - 1);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="spinner"></div>
      </div>
    );
  }

  const renderOptions = (
    title: string,
    items: any[],
    selected: string,
    setSelected: React.Dispatch<React.SetStateAction<string>>
  ) => (
    <div>
      <h2 className="text-lg font-semibold mb-2">{title}</h2>
      <div className="flex flex-wrap mb-4">
        {items.map((item) => (
          <div
            key={item.id}
            className={`p-2 border rounded-md mr-2 mb-2 cursor-pointer ${
              selected === item.id ? "bg-purple-600 text-white" : "bg-white"
            }`}
            onClick={() => setSelected(item.id)}
          >
            {item.nombre}
          </div>
        ))}
      </div>
    </div>
  );

  const renderSimpleOptions = (
    title: string,
    items: string[],
    selected: string,
    setSelected: React.Dispatch<React.SetStateAction<string>>
  ) => (
    <div>
      <h2 className="text-lg font-semibold mb-2">{title}</h2>
      <div className="flex flex-wrap mb-4">
        {items.map((item) => (
          <div
            key={item}
            className={`p-2 border rounded-md mr-2 mb-2 cursor-pointer ${
              selected === item ? "bg-purple-600 text-white" : "bg-white"
            }`}
            onClick={() => setSelected(item)}
          >
            {item}
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="flex flex-col items-center bg-gray-100 p-4 min-h-screen">
      <div className="w-full max-w-3xl bg-white shadow-md rounded-lg overflow-hidden">
        <div className="flex justify-center bg-purple-100">
          <img
            src={producto.imagenUrl}
            alt={producto.nombre}
            className="w-full h-80 object-cover"
          />
        </div>
        <div className="p-6">
          <div className="mb-4">
            <h1 className="text-2xl font-bold text-center">
              {producto.nombre}
            </h1>
            <p className="text-gray-700 text-center mb-2">
              {producto.descripcion}
            </p>
            <p className="text-xl font-semibold text-center">
              ${producto.precio.toFixed(2)}
            </p>
          </div>

          {renderOptions(
            "Selecciona la talla",
            tallas,
            selectedTalla,
            setSelectedTalla
          )}
          {renderOptions(
            "Selecciona el color",
            colores,
            selectedColor,
            setSelectedColor
          )}
          {renderOptions(
            "Selecciona el material",
            materiales,
            selectedMaterial,
            setSelectedMaterial
          )}
          {renderOptions(
            "Selecciona la categoría",
            categorias,
            selectedCategoria,
            setSelectedCategoria
          )}
          {selectedCategoria &&
            renderOptions(
              "Selecciona la prenda",
              prendas,
              selectedPrenda,
              setSelectedPrenda
            )}
          {renderSimpleOptions(
            "Selecciona el género",
            ["Hombre", "Mujer", "Unisex"],
            selectedGenero,
            setSelectedGenero
          )}

          <h2 className="text-lg font-semibold mb-2">Selecciona la cantidad</h2>
          <div className="flex items-center justify-center mb-4">
            <button
              onClick={handleDecrement}
              className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-lg"
            >
              -
            </button>
            <span className="mx-4 text-lg">{cantidad}</span>
            <button
              onClick={handleIncrement}
              className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-lg"
            >
              +
            </button>
          </div>

          <button
            onClick={handleAddToCart}
            className={`w-full py-3 text-lg font-semibold text-white rounded-md ${
              addToCartDisabled || isAddingToCart
                ? "bg-gray-400"
                : "bg-purple-600"
            }`}
            disabled={addToCartDisabled || isAddingToCart}
          >
            {isAddingToCart ? "Agregando..." : "Agregar al Carrito"}
          </button>
        </div>
      </div>
    </div>
  );
};
