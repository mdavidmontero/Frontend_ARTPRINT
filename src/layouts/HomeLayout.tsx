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
      <>
        <header className="bg-blue-900 py-2">
          <div className="max-w-screen-2xl mx-auto px-4">
            <div className="flex flex-col lg:flex-row justify-between items-center">
              <div className="flex items-center lg:mb-0">
                <Link to={"/"}>
                  <Logo />
                </Link>
              </div>
              <div className="flex flex-col lg:flex-row items-center space-y-4 lg:space-y-0 lg:space-x-6">
                <div className="items-center space-x-2 font-anto">
                  <input
                    type="text"
                    placeholder="¿Que deseas Buscar?"
                    className="rounded"
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Link to={"/auth/login"}>
                  <div className="text-black  hidden lg:flex items-center space-x-2 font-anto">
                    <IoIosLogIn size={24} className="m-1" />
                    Iniciar Sesión
                  </div>
                </Link>
              </div>
            </div>
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
    </>
  );
}