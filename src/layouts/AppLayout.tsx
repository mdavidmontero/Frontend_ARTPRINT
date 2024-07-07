import Logo from "../components/Logo";
import NavMenu from "../components/NavMenu";
import { Link, Navigate, Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useAuth from "../hooks/useAuth";
export default function AppLayout() {
  // Ruta Protegida

  const { user, cargando } = useAuth();
  if (cargando) return "Cargando";

  return (
    <>
      {user ? (
        <>
          <header className="bg-gray-800 py-5">
            <div className=" max-w-screen-2xl mx-auto flex flex-col lg:flex-row justify-between items-center">
              <div className="w-64">
                <Link to={"/"}>
                  <Logo />
                </Link>
              </div>

              <NavMenu name={"data nombre"} />
            </div>
          </header>

          <section className="max-w-screen-2xl mx-auto mt-10 p-5">
            <Outlet />
          </section>

          <footer className="py-5">
            <p className="text-center">
              Todos los derechos reservados {new Date().getFullYear()}
            </p>
          </footer>

          <ToastContainer pauseOnHover={false} pauseOnFocusLoss={false} />
        </>
      ) : (
        <Navigate to="/auth/login" replace={true} />
      )}
    </>
  );
}
