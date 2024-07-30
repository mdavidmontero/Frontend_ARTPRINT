import Logo from "../components/Logo";
import { Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";

export default function AuthLayout() {
  return (
    <>
      <div className="bg-customYellow min-h-screen w-full flex justify-center items-center">
        <div className="py-10 lg:py-20 w-full max-w-[450px] mx-auto text-center">
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
