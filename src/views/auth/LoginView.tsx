import { useForm } from "react-hook-form";
import { UserLoginForm } from "../../types";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import ErrorMessage from "../../components/ErrorMessage";
import useAuth from "../../hooks/useAuth";
import { obtenerUsuarioPorId } from "../../api/UsuarioAPI";
export default function LoginView() {
  const { loginUser, setUser } = useAuth();

  const initialValues: UserLoginForm = {
    email: "",
    password: "",
  };
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues: initialValues });

  const navigate = useNavigate();

  const handleLogin = async (formData: UserLoginForm) => {
    try {
      const data = await loginUser(formData.email, formData.password);
      const obtenerUserId = await obtenerUsuarioPorId(data.user.uid);
      const user = {
        uid: obtenerUserId!.id,
        email: obtenerUserId!.correo,
        role: obtenerUserId?.rol,
      };
      setUser(user);
      console.log(obtenerUserId);

      if (user!.role === "ADMIN") {
        navigate("/admin");
      } else if (user!.role === "CLIENTE") {
        navigate("/cliente");
      } else {
        navigate("/auth/login");
      }
    } catch (error) {
      toast.error("Credenciales Incorrectas, Intente Nuevamente");
    }
  };
  return (
    <>
      <h1 className="text-5xl font-black text-white text-center">
        Iniciar Sesión
      </h1>
      <p className="text-2xl font-light text-white mt-5">
        Inicia Sesión con tu correo {""}
        <span className=" text-fuchsia-500 font-bold">
          {" "}
          para realizar compras
        </span>
      </p>
      <form
        onSubmit={handleSubmit(handleLogin)}
        className="space-y-8 p-10 mt-10 bg-white"
        noValidate
      >
        <div className="flex flex-col gap-5">
          <label className="font-normal text-2xl">Email</label>

          <input
            id="email"
            type="email"
            placeholder="Email de Registro"
            className="w-full p-3  border-gray-300 border"
            {...register("email", {
              required: "El Email es obligatorio",
              pattern: {
                value: /\S+@\S+\.\S+/,
                message: "E-mail no válido",
              },
            })}
          />
          {errors.email && <ErrorMessage>{errors.email.message}</ErrorMessage>}
        </div>

        <div className="flex flex-col gap-5">
          <label className="font-normal text-2xl">Password</label>

          <input
            type="password"
            placeholder="Password de Registro"
            className="w-full p-3  border-gray-300 border"
            {...register("password", {
              required: "El Password es obligatorio",
            })}
          />
          {errors.password && (
            <ErrorMessage>{errors.password.message}</ErrorMessage>
          )}
        </div>

        <input
          type="submit"
          value="Iniciar Sesión"
          className="bg-fuchsia-600 hover:bg-fuchsia-700 w-full p-3  text-white font-black  text-xl cursor-pointer"
        />
      </form>
      <nav className="mt-10 flex flex-col space-y-4">
        <Link
          to={"/auth/register"}
          className="text-center text-gray-300 font-normal"
        >
          ¿No tienes Cuenta? Crear una{" "}
        </Link>
      </nav>
    </>
  );
}
