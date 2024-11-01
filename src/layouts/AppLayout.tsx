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
  const navigate = useNavigate();
  const { user, cargando, logOutUser } = useAuth();
  const location = useLocation();

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
            <div className="bg-[#718359] h-5"></div>
            <header className="py-1 bg-customPantone">
              <div className="px-4 mx-auto max-w-screen-2xl">
                <div className="flex flex-col items-center justify-between lg:flex-row">
                  <div className="flex items-center lg:mb-0">
                    <Link to={"/"}>
                      <Logo />
                    </Link>
                  </div>

                  <div className="flex flex-col items-center space-y-4 lg:flex-row lg:space-y-0 lg:space-x-6">
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
                      <div className="items-center hidden space-x-2 text-black lg:flex font-anto">
                        <CgProfile size={24} className="m-1" />
                        Perfil
                      </div>
                    </Link>
                    {user.role === "CLIENTE" && (
                      <Link to={"cliente/carritoCompras"}>
                        <div className="items-center hidden space-x-2 text-black lg:flex">
                          <RiShoppingBag4Fill size={24} className="m-1" />
                          <p className="font-anto">Carrito Compras</p>
                        </div>
                      </Link>
                    )}

                    {user.role === "CLIENTE" && (
                      <Link to={"/cliente"}>
                        <div className="items-center hidden space-x-2 text-black lg:flex">
                          <RiShoppingBag4Fill size={24} className="m-1" />
                          <p className="font-anto">Productos</p>
                        </div>
                      </Link>
                    )}
                    {user.role === "ADMIN" && (
                      <Link to={"/admin"}>
                        <div className="items-center hidden space-x-2 text-black lg:flex">
                          <RiShoppingBag4Fill size={24} className="m-1" />
                          <p className="font-anto">Gestión Tienda</p>
                        </div>
                      </Link>
                    )}

                    <button
                      onClick={handleLogout}
                      className="items-center hidden gap-1 px-2 py-2 space-x-2 text-black rounded lg:flex font-anto"
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
            {location.pathname !== "/cliente" && (
              <div className={"bg-[#AFC7AD] h-10 flex justify-evenly"}></div>
            )}

            <section className="mx-auto max-w-screen-2xl ">
              <Outlet />
            </section>
            <div className="h-6 bg-[#718359]"></div>

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
