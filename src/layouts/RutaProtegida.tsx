import { Outlet, Navigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const RutaProtegida = () => {
  const { user, cargando } = useAuth();
  if (cargando) return "Cargando...";
  return <>{user?.uid ? <Outlet /> : <Navigate to="/" />}</>;
};

export default RutaProtegida;
