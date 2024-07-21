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
      <div className="flex justify-center items-center h-screen">
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

  // const renderSimpleOptions = (
  //   title: string,
  //   items: string[],
  //   selected: string,
  //   setSelected: React.Dispatch<React.SetStateAction<string>>
  // ) => (
  //   <div>
  //     <h2 className="text-lg font-semibold mb-2">{title}</h2>
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
    <div className="flex flex-col items-center bg-gray-100 p-4 min-h-screen">
      <div className="w-full max-w-3xl bg-white shadow-md rounded-lg overflow-hidden">
        <div className="flex justify-center bg-purple-100 py-2">
          <img
            src={
              producto!.colores.find((color) => color.id === selectedColor)
                ?.imagenUrl || producto!.colores[0].imagenUrl
            }
            alt={producto!.nombre}
            className="w-auto h-auto object-cover rounded"
          />
        </div>
        <div className="p-6">
          <h1 className="text-2xl font-bold text-justify">
            {producto!.nombre}
          </h1>
          <p className="text-gray-700 font-bold text-justify ">
            {" "}
            Descripción:{" "}
            <span className="font-normal text-justify">
              {producto?.descripcion}
            </span>
          </p>
          <p className="text-xl font-semibold">
            ${producto!.precio.toFixed(2)}
          </p>
          <p className="text-gray-700 font-bold text-justify ">
            {" "}
            Material:{" "}
            <span className="font-normal text-justify">
              {producto?.materiales
                .map((material) => material.nombre.split(", "))
                .join("/")}
            </span>
          </p>
          <p className="text-gray-700 font-bold text-justify ">
            {" "}
            Genero:{" "}
            <span className="font-normal text-justify">{producto?.genero}</span>
          </p>

          <div>
            <h2 className="text-lg font-semibold mb-2">Tallas</h2>
            <div className="flex flex-wrap mb-4">
              {tallas.map((item) => (
                <div
                  key={item}
                  className={`p-2 border rounded-md mr-2 mb-2 cursor-pointer ${
                    selectedTalla === item
                      ? "bg-purple-600 text-white"
                      : "bg-white"
                  }`}
                  onClick={() => setSelectedTalla(item)}
                >
                  {item}
                </div>
              ))}
            </div>
          </div>

          {/* {renderOptions(
            "Selecciona la talla",
            tallas,
            selectedTalla,
            setSelectedTalla
          )} */}
          {renderOptions(
            "Selecciona el color",
            coloresDisponibles,
            selectedColor,
            setSelectedColor
          )}
          {/* <div>
            <h2 className="text-lg font-semibold mb-2">
              Selecione el Material
            </h2>
            <div className="flex flex-wrap mb-4">
              {materiales.map((item) => (
                <div
                  key={item.id}
                  className={`p-2 border rounded-md mr-2 mb-2 cursor-pointer ${
                    selectedMaterial === item.nombre
                      ? "bg-purple-600 text-white"
                      : "bg-white"
                  }`}
                  onClick={() => setSelectedMaterial(item.nombre)}
                >
                  {item.nombre}
                </div>
              ))}
            </div>
          </div> */}
          {/* {renderOptions(
            "Selecciona el material",
            materiales,
            selectedMaterial,
            setSelectedMaterial
          )} */}
          {/* {renderOptions(
            "Selecciona la categoría",
            categorias,
            selectedCategoria,
            setSelectedCategoria
          )} */}
          {/* {selectedMaterial &&
            renderOptions(
              "Selecciona la prenda",
              prendas,
              selectedPrenda,
              setSelectedPrenda
            )} */}
          {/* {renderSimpleOptions(
            "Selecciona el género",
            ["Hombre", "Mujer", "Unisex"],
            selectedGenero,
            setSelectedGenero
          )} */}

          <div>
            <button
              onClick={togglePersonalizacion}
              className="text-purple-600 hover:text-purple-700 font-semibold"
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

          <h2 className="text-lg font-semibold mb-2">
            Estampado Personalizado
          </h2>
          <button
            className="p-2 bg-blue-700 hover:bg-blue-800 rounded text-white my-2"
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

          {selectedEstampado && (
            <div className="mb-4 flex flex-col  md:items-start items-center">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Imagen Estampado:
              </label>
              <div className="py-2">
                <img
                  src={selectedEstampado}
                  alt={`Imagen del producto ${producto?.nombre}`}
                  className="mt-2 rounded"
                  style={{ maxWidth: "100%", maxHeight: "200px" }}
                />
              </div>
            </div>
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
