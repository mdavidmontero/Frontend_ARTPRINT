import Logo from "../components/Logo";
import { Link, Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { IoIosLogIn } from "react-icons/io";

interface Props {
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
}

export default function HomeLayout({ setSearchQuery }: Props) {
  return (
    <>
      <div className="h-5 bg-customVerde"></div>
      <header className="py-1 bg-customPantone">
        <div className="px-4 mx-auto max-w-screen-2xl">
          <div className="flex flex-col items-center justify-between lg:flex-row">
            <div className="flex items-center lg:mb-0">
              <Link to={"/"}>
                <Logo />
              </Link>
            </div>
            <div className="flex flex-col items-center space-y-4 lg:flex-row lg:space-y-0 lg:space-x-6">
              <div className="flex items-center space-x-2 font-anto">
                <input
                  type="text"
                  placeholder="¿Qué deseas Buscar?"
                  className="rounded"
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Link to={"/auth/login"}>
                <div className="flex items-center space-x-2 text-black font-anto">
                  <IoIosLogIn size={24} className="m-1" />
                  <span>Iniciar Sesión</span>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-screen-2xl">
        <Outlet />
      </section>

      <footer className="py-5">
        <p className="text-center">
          Todos los derechos reservados {new Date().getFullYear()}
        </p>
      </footer>

      <ToastContainer pauseOnHover={false} pauseOnFocusLoss={false} />
    </>
  );
}
