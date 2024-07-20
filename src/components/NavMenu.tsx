import { Fragment } from "react";
import { Popover, Transition } from "@headlessui/react";
import { Bars3Icon } from "@heroicons/react/20/solid";
import { Link } from "react-router-dom";
import { User } from "../types";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

type NavMenuProps = {
  name: User["name"];
};

export default function NavMenu({ name }: NavMenuProps) {
  const { user, logOutUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logOutUser();
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Popover className="relative -mt-8">
      <Popover.Button className="inline-flex items-center gap-x-1 text-sm font-semibold leading-6 p-1 rounded-lg bg-blue-500">
        <Bars3Icon className="w-8 h-8 text-white " />
      </Popover.Button>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-200"
        enterFrom="opacity-0 translate-y-1"
        enterTo="opacity-100 translate-y-0"
        leave="transition ease-in duration-150"
        leaveFrom="opacity-100 translate-y-0"
        leaveTo="opacity-0 translate-y-1"
      >
        <Popover.Panel className="absolute left-1/2 z-10 mt-5 flex w-screen lg:max-w-min -translate-x-1/2 lg:-translate-x-48">
          <div className="w-full lg:w-56 shrink rounded-xl bg-white p-4 text-sm font-semibold leading-6 text-gray-900 shadow-lg ring-1 ring-gray-900/5">
            <p className="text-center">Bienvenido: {name}</p>
            <Link
              to="/cliente/perfil"
              className="block p-2 hover:text-blue-950"
            >
              Mi Perfil
            </Link>
            {user?.role === "ADMIN" && (
              <Link className="block p-2 hover:text-blue-950" to={"/admin"}>
                Gestión Tienda
              </Link>
            )}
            {user?.role === "CLIENTE" && (
              <Link className="block p-2 hover:text-blue-950" to={"/cliente"}>
                Productos
              </Link>
            )}
            {user?.role === "CLIENTE" && (
              <Link
                className="block p-2 hover:text-blue-950"
                to={"/cliente/carritoCompras"}
              >
                Carrito Compras
              </Link>
            )}

            <button
              className="block p-2 hover:text-blue-950"
              type="button"
              onClick={handleLogout}
            >
              Cerrar Sesión
            </button>
          </div>
        </Popover.Panel>
      </Transition>
    </Popover>
  );
}
