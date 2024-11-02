import Logo from "../components/Logo";
import { Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";

export default function AuthLayout() {
  return (
    <>
      <div className="flex items-center justify-center w-full min-h-screen bg-customVerde">
        <div className="py-10 lg:py-20 w-full max-w-[450px] mx-auto ">
          <Logo />
          <div className="mt-10">
            <Outlet />
          </div>
        </div>
      </div>
      <ToastContainer pauseOnHover={false} pauseOnFocusLoss={false} />
    </>
  );
}
