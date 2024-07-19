import Logo from "../components/Logo";
import NavMenu from "../components/NavMenu";
import {
  Link,
  Navigate,
  Outlet,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useAuth from "../hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { obtenerUsuarioPorId } from "../api/UsuarioAPI";
import { IoExitOutline } from "react-icons/io5";
import { CgProfile } from "react-icons/cg";
import { RiShoppingBag4Fill } from "react-icons/ri";
interface Props {
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
}
export default function AppLayout({ setSearchQuery }: Props) {
  const params = useLocation();
  const navigate = useNavigate();
  const { user, cargando, logOutUser } = useAuth();

  if (cargando) return "Cargando";

  const { data } = useQuery({
    queryKey: ["user"],
    queryFn: () => obtenerUsuarioPorId(user?.uid!),
  });
  const handleLogout = async () => {
    try {
      await logOutUser();
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  if (data)
    return (
      <>
        {user ? (
          <>
            <div className="bg-customYellow h-6"></div>

            <header className="bg-white py-1">
              <div className="max-w-screen-2xl mx-auto px-4">
                <div className="flex flex-col lg:flex-row justify-between items-center">
                  <div className="flex items-center lg:mb-0">
                    <Link to={"/"}>
                      <Logo />
                    </Link>
                  </div>
                  {/* Linea grande de separacion */}

                  <div className="flex flex-col lg:flex-row  items-center space-y-4 lg:space-y-0 lg:space-x-6">
                    <div className="items-center space-x-2 font-anto">
                      {user.role === "CLIENTE" && (
                        <input
                          type="text"
                          placeholder="¿Que deseas Buscar?"
                          className="rounded"
                          onChange={(e) => setSearchQuery(e.target.value)}
                        />
                      )}
                    </div>
                    <Link to={"/admin/perfil"}>
                      <div className="text-black font-bold hidden lg:flex items-center space-x-2 font-anto">
                        <CgProfile size={24} className="m-1" />
                        Perfil
                      </div>
                    </Link>
                    {user.role === "CLIENTE" && (
                      <Link to={"cliente/carritoCompras"}>
                        <div className="text-black font-bold hidden lg:flex items-center space-x-2">
                          <RiShoppingBag4Fill size={24} className="m-1" />
                          <p className="font-anto">Carrito Compras</p>
                        </div>
                      </Link>
                    )}

                    {user.role === "CLIENTE" && (
                      <Link to={"/cliente"}>
                        <div className="text-black font-bold hidden lg:flex items-center space-x-2">
                          <RiShoppingBag4Fill size={24} className="m-1" />
                          <p className="font-anto">Productos</p>
                        </div>
                      </Link>
                    )}
                    {user.role === "ADMIN" && (
                      <Link to={"/admin"}>
                        <div className="text-black font-bold hidden lg:flex items-center space-x-2">
                          <RiShoppingBag4Fill size={24} className="m-1" />
                          <p className="font-anto">Gestión Tienda</p>
                        </div>
                      </Link>
                    )}

                    <button
                      onClick={handleLogout}
                      className="px-2 py-2 rounded text-black font-bold hidden gap-1 lg:flex items-center space-x-2 font-anto"
                    >
                      <IoExitOutline size={24} />
                      Cerrar Sesión
                    </button>
                    <div className="lg:hidden ">
                      <NavMenu name={data?.nombre!} />
                    </div>
                  </div>
                </div>
              </div>
            </header>

            <div
              className={`${
                params.pathname === "/admin/productos"
                  ? "bg-customBlue h-10"
                  : "bg-customYellow h-10"
              }`}
            ></div>

            <section className="max-w-screen-2xl mx-auto mt-10 ">
              <Outlet />
            </section>
            <div className="bg-customYellow h-10"></div>

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
