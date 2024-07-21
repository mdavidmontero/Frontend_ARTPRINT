import create from "zustand";
import { Producto } from "../types";

import {
  crearProducto as crearProductoAPI,
  obtenerProductoPorId as obtenerProductoPorIdAPI,
  actualizarProducto as actualizarProductoAPI,
  eliminarProducto as eliminarProductoAPI,
  obtenerProductos as obtenerProductosAPI,
} from "../api/ProductosAPI";

interface ProductState {
  productos: Producto[];
  loading: boolean;
  error: string | null;
  fetchProductos: () => Promise<void>;
  addProducto: (producto: Producto) => Promise<void>;
  getProducto: (productId: string) => Promise<Producto | null>;
  updateProducto: (
    productId: string,
    newData: Partial<Producto>
  ) => Promise<void>;
  deleteProducto: (productId: string) => Promise<void>;
}

const isError = (error: unknown): error is Error => {
  return (error as Error).message !== undefined;
};

export const useProductStore = create<ProductState>((set) => ({
  productos: [],
  loading: false,
  error: null,

  fetchProductos: async () => {
    set({ loading: true, error: null });
    try {
      const productos = await obtenerProductosAPI();
      set({ productos: productos || [], loading: false });
    } catch (error) {
      if (isError(error)) {
        set({ error: error.message, loading: false });
      } else {
        set({ error: "Unknown error", loading: false });
      }
    }
  },

  addProducto: async (producto: Producto) => {
    set({ loading: true, error: null });
    try {
      await crearProductoAPI(producto);
      const productos = await obtenerProductosAPI();
      set({ productos: productos || [], loading: false });
    } catch (error) {
      if (isError(error)) {
        set({ error: error.message, loading: false });
      } else {
        set({ error: "Unknown error", loading: false });
      }
    }
  },

  getProducto: async (productId: string) => {
    set({ loading: true, error: null });
    try {
      const producto = await obtenerProductoPorIdAPI(productId);
      set({ loading: false });
      return producto;
    } catch (error) {
      if (isError(error)) {
        set({ error: error.message, loading: false });
      } else {
        set({ error: "Unknown error", loading: false });
      }
      return null;
    }
  },

  updateProducto: async (productId: string, newData: Partial<Producto>) => {
    set({ loading: true, error: null });
    try {
      await actualizarProductoAPI(productId, newData);
      const productos = await obtenerProductosAPI();
      set({ productos: productos || [], loading: false });
    } catch (error) {
      if (isError(error)) {
        set({ error: error.message, loading: false });
      } else {
        set({ error: "Unknown error", loading: false });
      }
    }
  },

  deleteProducto: async (productId: string) => {
    set({ loading: true, error: null });
    try {
      await eliminarProductoAPI(productId);
      const productos = await obtenerProductosAPI();
      set({ productos: productos || [], loading: false });
    } catch (error) {
      if (isError(error)) {
        set({ error: error.message, loading: false });
      } else {
        set({ error: "Unknown error", loading: false });
      }
    }
  },
}));
