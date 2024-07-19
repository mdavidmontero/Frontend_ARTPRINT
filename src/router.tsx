import { Routes, Route, Navigate, BrowserRouter } from "react-router-dom";
import AppLayout from "./layouts/AppLayout";
import AuthLayout from "./layouts/AuthLayout";
import LoginView from "./views/auth/LoginView";
import RegisterView from "./views/auth/RegisterView";
import NotFoundView from "./views/404/NotFoundView";
import useAuth from "./hooks/useAuth";
import Dashboard from "./views/DashboardView";
import GestionProducto from "./views/admin/gestionProductos/GestionProducto";
import ProductoForm from "./views/admin/gestionProductos/ProductForm";
import GestionCategoria from "./views/admin/gestionCategorias/GestionCategoria";
import CategoriaForm from "./views/admin/gestionCategorias/CategoriaForm";
import GestionPrenda from "./views/admin/gestionPrendas/GestionPrenda";
import PrendaForm from "./views/admin/gestionPrendas/PrendaForm";
import GestionTalla from "./views/admin/gestionTallas/GestionTalla";
import TallaForm from "./views/admin/gestionTallas/TallaForm";
import { GestionUsuarios } from "./views/admin/gestionUsuarios/GestionUsuario";
import UsuarioForm from "./views/admin/gestionUsuarios/UsuarioForm";
import ColorForm from "./views/admin/gestionColores/ColorForm";
import GestionColor from "./views/admin/gestionColores/GestionColor";
import GestionMaterial from "./views/admin/gestionMateriales/GestionMaterial";
import MaterialForm from "./views/admin/gestionMateriales/MaterialForm";
import { GestionWhatsApp } from "./views/admin/gestionWatsapp/GestionWatsapp";
import Home from "./views/client/Home";
import { DetallesDeProducto } from "./views/client/DetallesDeProducto";
import CarritoDeCompras from "./views/client/CarritoDeCompras";
import RutaProtegida from "./layouts/RutaProtegida";
import { useState } from "react";
import HomeLayout from "./layouts/HomeLayout";
import ProfileForm from "./views/admin/gestionUsuarios/ProfileForm";

const Router = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={<HomeLayout setSearchQuery={setSearchQuery} />}
        >
          <Route
            path="/"
            element={
              <Home setSearchQuery={setSearchQuery} searchQuery={searchQuery} />
            }
          />
        </Route>

        <Route path="/detallesProducto/:id" element={<DetallesDeProducto />} />

        <Route element={<RutaProtegida />}>
          <Route element={<AppLayout setSearchQuery={setSearchQuery} />}>
            <Route path="/admin">
              <Route index element={<Dashboard />} />
              <Route path="productos" element={<GestionProducto />} />
              <Route path="nuevoProducto" element={<ProductoForm />} />
              <Route path="editarProducto/:id" element={<ProductoForm />} />
              <Route path="categorias" element={<GestionCategoria />} />
              <Route path="nuevaCategoria" element={<CategoriaForm />} />
              <Route path="editarCategoria/:id" element={<CategoriaForm />} />
              <Route path="prendas" element={<GestionPrenda />} />
              <Route path="nuevaPrenda" element={<PrendaForm />} />
              <Route path="editarPrenda/:id" element={<PrendaForm />} />
              <Route path="tallas" element={<GestionTalla />} />
              <Route path="nuevaTalla" element={<TallaForm />} />
              <Route path="editarTalla/:id" element={<TallaForm />} />
              <Route path="usuarios" element={<GestionUsuarios />} />
              <Route path="perfil" element={<ProfileForm />} />
              <Route path="nuevoUsuario" element={<UsuarioForm />} />
              <Route path="editarUsuario/:id" element={<UsuarioForm />} />
              <Route path="color" element={<GestionColor />} />
              <Route path="nuevoColor" element={<ColorForm />} />
              <Route path="editarColor/:id" element={<ColorForm />} />
              <Route path="material" element={<GestionMaterial />} />
              <Route path="nuevoMaterial" element={<MaterialForm />} />
              <Route path="editarMaterial/:id" element={<MaterialForm />} />
              <Route path="config" element={<GestionWhatsApp />} />
            </Route>
            <Route path="/cliente">
              <Route
                index
                element={
                  <Home
                    setSearchQuery={setSearchQuery}
                    searchQuery={searchQuery}
                  />
                }
              />
              <Route path="perfil" element={<ProfileForm />} />
              <Route path="productos" element={<GestionProducto />} />
              <Route
                path="detallesProducto/:id"
                element={<DetallesDeProducto />}
              />
              <Route path="carritoCompras" element={<CarritoDeCompras />} />
            </Route>
          </Route>
        </Route>

        <Route element={<AuthLayout />}>
          <Route
            path="/auth/login"
            element={
              user ? (
                user.role === "ADMIN" ? (
                  <Navigate to="/admin" />
                ) : (
                  <Navigate to="/cliente" />
                )
              ) : (
                <LoginView />
              )
            }
          />
          {/* Ruta de registro */}
          <Route path="/auth/register" element={<RegisterView />} />
          <Route path="*" element={<NotFoundView />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
