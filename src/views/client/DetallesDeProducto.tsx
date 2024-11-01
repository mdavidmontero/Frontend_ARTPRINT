import React, { useState, useEffect } from "react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useParams, useNavigate } from "react-router-dom";
// import { obtenerTodasLasTallas } from "../../api/TallaAPI";
import { obtenerTodosLosColores } from "../../api/ColoresAPI";
import { obtenerTodosLosMateriales } from "../../api/MaterialAPI";
import { obtenerTodasLasCategorias } from "../../api/CategoriasAPI";
import { Colors, Estampado, Producto } from "../../types";
import CarritoController from "../../api/CarritoAPI";
// import { obtenerPrendasPorCategoria } from "../../api/PrendaAPI";
import { obtenerProductoPorId } from "../../api/ProductosAPI";
import { toast } from "react-toastify";
import useAuth from "../../hooks/useAuth";
import Spinner from "../../components/spinner/Spinner";
import DecoracionScreen from "../print/EstampadoView";
import { obtenerTodosLosEstampados } from "../../api/AccesoriosAPI";
import CarruselEstampados from "../../components/shared/CarrouselEstampado";
import { useImageUpload } from "../../api/UploadImages";

const carritoController = new CarritoController();

export const DetallesDeProducto = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const usuarioId = user?.uid;
  const navigate = useNavigate();
  const [tallas, setTallas] = useState<string[]>([]);
  const [colores, setColores] = useState<Colors[]>([]);
  const [ocultarDecoracion, setOcultarDecoracion] = useState<boolean>(false);
  const [estampados, setEstampados] = useState<Estampado[]>([]);
  const [showPersonalizacion, setShowPersonalizacion] =
    useState<boolean>(false);

  // const [materiales, setMateriales] = useState<Material[]>([]);
  // const [categorias, setCategorias] = useState<Categoria[]>([]);
  // const [prendas, setPrendas] = useState<Prenda[]>([]);
  const [selectedTalla, setSelectedTalla] = useState("");
  const [selectedColor, setSelectedColor] = useState<string>("");
  // const [selectedMaterial, setSelectedMaterial] = useState<string>("");
  // const [selectedCategoria, setSelectedCategoria] = useState<string>("");
  // const [selectedPrenda, setSelectedPrenda] = useState<string>("");
  // const [selectedGenero, setSelectedGenero] = useState<string>("");

  const [selectedEstampado, setSelectedEstampado] = useState<string>("");

  const [cantidad, setCantidad] = useState<number>(1);
  // const [imageUrl, setImageUrl] = useState<string>("");
  const [loadingUpload, setLoadingUpload] = useState(true);
  const [addToCartDisabled, setAddToCartDisabled] = useState(true);
  const [loading, setLoading] = useState(true);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [producto, setProducto] = useState<Producto | null>(null);
  useEffect(() => {
    if (id) {
      const fetchProduct = async () => {
        try {
          const fetchedProduct = await obtenerProductoPorId(id);
          if (fetchedProduct) {
            setProducto(fetchedProduct);
            setTallas(fetchedProduct.tallas.map((talla) => talla));
            // setMateriales(
            //   fetchedProduct.materiales.map((material) => material)
            // );
          }
        } catch (error) {
          console.error("Error fetching product:", error);
        }
      };
      fetchProduct();
    }
    // obtenerTallasDisponibles();
  }, [id]);
  // tallas
  const togglePersonalizacion = () => {
    setShowPersonalizacion(!showPersonalizacion);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [coloresData] = await Promise.all([
          obtenerTodosLosColores(),
          obtenerTodosLosMateriales(),
          obtenerTodasLasCategorias(),
        ]);

        setColores(coloresData);
        // setMateriales(materialesData);
        // setCategorias(categoriasData);
      } catch (error) {
        console.error("Error al cargar datos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  // useEffect(() => {
  //   const fetchPrendas = async () => {
  //     if (selectedCategoria) {
  //       try {
  //         const prendasData = await obtenerPrendasPorCategoria(
  //           selectedCategoria
  //         );
  //         setPrendas(prendasData);
  //         setSelectedPrenda(prendasData.length > 0 ? prendasData[0].id : "");
  //       } catch (error) {
  //         console.error("Error al cargar prendas:", error);
  //       }
  //     }
  //   };

  //   fetchPrendas();
  // }, [selectedCategoria]);

  useEffect(() => {
    cargarProductos();
  }, []);
  const cargarProductos = async () => {
    try {
      const estampadoosDisponibles = await obtenerTodosLosEstampados();
      if (estampadoosDisponibles && estampadoosDisponibles.length > 0) {
        setEstampados(estampadoosDisponibles);
      } else {
        console.log("No se encontraron productos.");
      }
    } catch (error) {
      console.error("Error al cargar productos:", error);
    } finally {
      setLoading(false);
    }
  };
  const handleSelectEstampado = (estampado: Estampado) => {
    setSelectedEstampado(estampado.image);
  };
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setLoadingUpload(true);
      const file = e.target.files?.[0];
      if (file) {
        const imageUrl = await useImageUpload(file);
        // setImageUrl(imageUrl);
        setOcultarDecoracion(!ocultarDecoracion);
        setSelectedEstampado(imageUrl);
      }
    } catch (error) {
      console.error("Error uploading image:", error);
    } finally {
      setLoadingUpload(false);
    }
  };

  useEffect(() => {
    const allSelectionsMade = [
      selectedTalla,
      selectedColor,
      // selectedMaterial,
      // selectedCategoria,
      // selectedPrenda,
      // selectedGenero,
    ].every(Boolean);
    setAddToCartDisabled(!allSelectionsMade);
  }, [
    selectedTalla,
    selectedColor,
    // selectedMaterial,
    // selectedCategoria,
    // selectedPrenda,
    // selectedGenero,
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
        productoId: producto!.id,
        imagen:
          producto!.colores.find((color) => color.id === selectedColor)
            ?.imagenUrl || producto!.colores[0].imagenUrl,
        nombre: producto!.nombre,
        // idPrenda: selectedPrenda,
        // idMaterial: selectedMaterial,
        idColor: selectedColor,
        talla: selectedTalla,
        estampado: selectedEstampado ? selectedEstampado : "",
        // genero: selectedGenero,
        cantidad: cantidad,
        precio: producto!.precio,
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
  const coloresProducto = producto?.colores.map((color) => color.id) || [];

  const coloresDisponibles = colores.filter((color) =>
    coloresProducto.includes(color.id)
  );

  // const sacarColores = producto?.colores.map((product) => product.id);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spinner />
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
      <h2 className="mb-2 text-lg font-bold">{title}</h2>
      <div className="flex flex-wrap mb-4">
        {items.map((item) => (
          <div
            key={item.id}
            className={`p-2 border rounded-md mr-2 mb-2 cursor-pointer ${
              selected === item.id ? "bg-customYellow text-white" : "bg-white"
            }`}
            onClick={() => setSelected(item.id)}
          >
            {item.nombre}
          </div>
        ))}
      </div>
    </div>
  );

  // const renderSimpleOptions = (
  //   title: string,
  //   items: string[],
  //   selected: string,
  //   setSelected: React.Dispatch<React.SetStateAction<string>>
  // ) => (
  //   <div>
  //     <h2 className="mb-2 text-lg font-semibold">{title}</h2>
  //     <div className="flex flex-wrap mb-4">
  //       {items.map((item) => (
  //         <div
  //           key={item}
  //           className={`p-2 border rounded-md mr-2 mb-2 cursor-pointer ${
  //             selected === item ? "bg-purple-600 text-white" : "bg-white"
  //           }`}
  //           onClick={() => setSelected(item)}
  //         >
  //           {item}
  //         </div>
  //       ))}
  //     </div>
  //   </div>
  // );

  return (
    <>
      <div className="flex flex-col items-center min-h-screen p-4 bg-gray-100">
        <div className="w-full max-w-3xl overflow-hidden bg-white rounded-lg shadow-md">
          <div className="flex flex-col md:flex-row">
            {/* Imagen */}
            <div className="flex justify-center p-2 bg-customBlueVerde md:w-1/2">
              <img
                src={
                  producto!.colores.find((color) => color.id === selectedColor)
                    ?.imagenUrl || producto!.colores[0].imagenUrl
                }
                alt={producto!.nombre}
                className="object-contain w-full h-auto max-w-xs rounded"
              />
            </div>

            {/* Información */}
            <div className="p-6 md:w-1/2">
              <h1 className="text-xl font-bold text-justify uppercase">
                {producto!.nombre}
              </h1>
              <p className="font-semibold text-justify text-black">
                {producto?.descripcion}
                <span className="font-normal text-justify"></span>
                <hr className="my-2 border-t border-gray-400" />
              </p>
              <p className="text-xl font-semibold text-red-600">
                ${producto!.precio.toFixed(2)}
              </p>
              <p className="font-bold text-justify text-gray-700">
                Material:{" "}
                <span className="font-normal text-justify">
                  {producto?.materiales
                    .map((material) => material.nombre.split(", "))
                    .join("/")}
                </span>
              </p>
              <p className="font-bold text-justify text-gray-700">
                Genero:{" "}
                <span className="font-normal text-justify">
                  {producto?.genero}
                </span>
              </p>

              <div>
                <h2 className="mb-2 text-lg font-bold">Selecciona una Talla</h2>
                <div className="flex flex-wrap mb-4">
                  {tallas.map((item) => (
                    <div
                      key={item}
                      className={`p-2 border rounded-md mr-2 mb-2 cursor-pointer ${
                        selectedTalla === item
                          ? "bg-customYellow text-white"
                          : "bg-white"
                      }`}
                      onClick={() => setSelectedTalla(item)}
                    >
                      {item}
                    </div>
                  ))}
                </div>
              </div>

              {renderOptions(
                "Selecciona el color",
                coloresDisponibles,
                selectedColor,
                setSelectedColor
              )}

              <div>
                <button
                  onClick={togglePersonalizacion}
                  className="font-bold text-customYellow hover:text-[#a97b30]"
                >
                  {showPersonalizacion
                    ? "Ocultar Estampados"
                    : "Seleccionar el Estampado"}
                </button>
              </div>

              {showPersonalizacion && (
                <>
                  <div className="">
                    <CarruselEstampados
                      estampados={estampados}
                      onSelect={handleSelectEstampado}
                    />
                  </div>
                </>
              )}
              <br />

              {selectedEstampado && (
                <div className="flex flex-col items-center mb-4 md:items-start">
                  <label className="block mb-2 text-xl font-bold text-gray-700">
                    Imagen Estampado:
                  </label>
                  <div className="py-2">
                    <img
                      src={selectedEstampado}
                      alt={`Imagen del producto ${producto?.nombre}`}
                      className="object-contain max-w-xs mt-2 rounded"
                      style={{ maxHeight: "200px" }}
                    />
                  </div>
                </div>
              )}

              <h2 className="mb-2 text-lg font-bold">Selecciona la cantidad</h2>
              <div className="flex items-center justify-center mb-4">
                <button
                  onClick={handleDecrement}
                  className="flex items-center justify-center w-8 h-8 text-xl bg-gray-200 rounded-full"
                >
                  -
                </button>
                <span className="mx-4 text-xl">{cantidad}</span>
                <button
                  onClick={handleIncrement}
                  className="flex items-center justify-center w-8 h-8 text-xl bg-gray-200 rounded-full"
                >
                  +
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                className={`w-full py-3 text-xl font-semibold text-white rounded-full ${
                  addToCartDisabled || isAddingToCart
                    ? "bg-gray-400"
                    : "bg-customYellow"
                }`}
                disabled={addToCartDisabled || isAddingToCart}
              >
                {isAddingToCart ? "Agregando..." : "Agregar al Carrito"}
              </button>
            </div>
          </div>
          <div className="m-3">
            <button
              className="p-2 my-2 text-white rounded-md bg-customYellow hover:bg-[#a0742e]"
              onClick={() => setOcultarDecoracion(!ocultarDecoracion)}
            >
              {!ocultarDecoracion ? "Agregar Estampado" : "Ocultar Estampado"}
            </button>
            {ocultarDecoracion && (
              <>
                <div>
                  <DecoracionScreen />
                  <br />
                  <div className="mb-4">
                    <label className="block mb-2 text-lg font-bold">
                      Seleccione una Imagen:
                    </label>
                    <div className="flex items-center">
                      <label className="px-4 py-2 text-white transition duration-300 bg-indigo-600 rounded cursor-pointer hover:bg-indigo-700">
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
                      {loadingUpload && (
                        <span className="ml-4 text-gray-500">
                          Cargando imagen...
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
