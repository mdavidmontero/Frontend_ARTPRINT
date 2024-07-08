import { useEffect, useState } from "react";
import TarjetaDeProductoEnCarrito from "../../components/shared/TajerdaDeProductoEnCarrito";
import CarritoController from "../../api/CarritoAPI";
import { ItemCarrito } from "../../types";
import { obtenerNumeroWhatsAppPorIdDefault } from "../../api/WhatsAppAPI";
import useAuth from "../../hooks/useAuth";
import { toast } from "react-toastify";

const CarritoDeCompras = () => {
  const [carrito, setCarrito] = useState<ItemCarrito[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const [vendedorWhatsApp, setVendedorWhatsApp] = useState<string>("");
  const userInfo = user?.uid;
  useEffect(() => {
    const fetchWhatsAppData = async () => {
      try {
        const vendedorData = await obtenerNumeroWhatsAppPorIdDefault();
        if (vendedorData) {
          setVendedorWhatsApp(
            vendedorData.countryCode + "" + vendedorData.phoneNumber
          );
        }
      } catch (error) {
        console.error("Error fetching WhatsApp data:", error);
      }
    };
    fetchWhatsAppData();
  }, []);

  useEffect(() => {
    cargarCarrito();
  }, [user]);

  const cargarCarrito = async () => {
    setLoading(true);
    setError(null);

    try {
      if (!user) {
        return;
      }

      const carritoController = new CarritoController();
      const usuarioId = userInfo;
      if (!usuarioId) {
        throw new Error("No se encontró el ID del usuario");
      }
      const carritoUsuario = await carritoController.obtenerCarritoPorUsuarioId(
        usuarioId
      );
      if (carritoUsuario) {
        setCarrito(carritoUsuario.items || []);
      }
    } catch (error: any) {
      setError("Error al cargar el carrito: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const actualizarCantidad = async (
    productoId: string,
    nuevaCantidad: number
  ) => {
    if (nuevaCantidad < 1) return;
    try {
      const carritoController = new CarritoController();
      const usuarioId = userInfo;
      if (!usuarioId) {
        throw new Error("No se encontró el ID del usuario");
      }
      const carritoUsuario = await carritoController.obtenerCarritoPorUsuarioId(
        usuarioId
      );
      if (carritoUsuario) {
        await carritoController.actualizarCantidadProducto(
          carritoUsuario.id,
          productoId,
          nuevaCantidad
        );
        cargarCarrito();
      }
    } catch (error) {
      console.error("Error al actualizar la cantidad del producto:", error);
    }
  };

  const eliminarProducto = async (productoId: string) => {
    try {
      const carritoController = new CarritoController();
      const usuarioId = userInfo;
      if (!usuarioId) {
        throw new Error("No se encontró el ID del usuario");
      }
      const carritoUsuario = await carritoController.obtenerCarritoPorUsuarioId(
        usuarioId
      );
      if (carritoUsuario) {
        await carritoController.eliminarProductoDelCarrito(
          carritoUsuario.id,
          productoId
        );
        cargarCarrito();
      }
    } catch (error) {
      console.error("Error al eliminar el producto del carrito:", error);
    }
  };

  const totalCarrito = carrito
    .reduce(
      (total, compra) =>
        total + parseFloat(compra.precio.toString()) * compra.cantidad,
      0
    )
    .toFixed(2);

  const comprarCarrito = async () => {
    if (!userInfo || carrito.length === 0) {
      return;
    }

    try {
      const carritoController = new CarritoController();
      const usuarioId = userInfo;
      if (!usuarioId) {
        throw new Error("No se encontró el ID del usuario");
      }

      const carritoUsuario = await carritoController.obtenerCarritoPorUsuarioId(
        usuarioId
      );
      if (!carritoUsuario) {
        throw new Error("No se encontró ningún carrito para este usuario");
      }

      const vendedorWhatsapp = vendedorWhatsApp;

      // Simulación de Alerta para propósitos educativos, reemplazar con tu propia lógica
      toast.success(
        "Compra realizada. Se abrirá WhatsApp para que puedas contactar al vendedor."
      );

      // Aquí deberías implementar la lógica para abrir WhatsApp en el navegador

      await carritoController.comprarCarrito(
        carritoUsuario.id,
        vendedorWhatsapp
      );
      setCarrito([]);
    } catch (error) {
      console.error("Error al comprar el carrito:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-red-500 text-lg">{error}</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen pt-4">
      <div className="p-4 bg-gray-100">
        <div className="flex justify-between items-center m-4">
          <h1 className="text-2xl font-bold text-gray-700">Carrito</h1>
        </div>
      </div>
      <div className="flex-1">
        <div className="overflow-y-auto bg-white">
          <div className="p-4">
            {carrito.map((compra, index) => (
              <TarjetaDeProductoEnCarrito
                key={index}
                imagen={compra.imagen}
                titulo={compra.nombre}
                precio={compra.precio.toString()}
                cantidad={compra.cantidad}
                onEliminar={() => eliminarProducto(compra.productoId)}
                onIncrementar={() =>
                  actualizarCantidad(compra.productoId, compra.cantidad + 1)
                }
                onDecrementar={() =>
                  actualizarCantidad(compra.productoId, compra.cantidad - 1)
                }
              />
            ))}
          </div>
        </div>
        <div className="p-4 bg-gray-100 border-t border-gray-300 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-800">
            Total: ${totalCarrito}
          </h2>
          <button
            className="bg-purple-600 py-3 px-6 rounded-lg text-white font-bold"
            onClick={comprarCarrito}
          >
            Comprar
          </button>
        </div>
      </div>
    </div>
  );
};

export default CarritoDeCompras;
