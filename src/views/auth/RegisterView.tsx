import { useForm } from "react-hook-form";
import { RolUsuario, UserRegistrationForm } from "../../types";
import { Link } from "react-router-dom";
import ErrorMessage from "../../components/ErrorMessage";
import { toast } from "react-toastify";
import useAuth from "../../hooks/useAuth";

export default function RegisterView() {
  const { registerUser } = useAuth();
  const initialValues: UserRegistrationForm = {
    name: "",
    identificacion: "",
    telefono: 0,
    direccion: "",
    email: "",
    password: "",
    password_confirmation: "",
  };

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<UserRegistrationForm>({ defaultValues: initialValues });

  const password = watch("password");

  const handleRegister = async (formData: UserRegistrationForm) => {
    try {
      await registerUser(formData.email, formData.password, {
        cedula: formData.identificacion,
        nombre: formData.name,
        correo: formData.email,
        rol: RolUsuario.CLIENTE,
        telefono: formData.telefono.toString(),
        direccion: formData.direccion,
        fotoPerfil: "",
      });
      toast.success("Usuario registrado con éxito");
      reset();
    } catch (error: any) {
      if (error.code === "auth/email-already-in-use") {
        toast.error(`El correo electrónico ya está en uso.`);
        throw error;
      }
    }
  };

  return (
    <>
      <h1 className="text-5xl font-black text-white text-center">
        Crear Cuenta
      </h1>
      <p className="text-2xl font-light text-white mt-5">
        Llena el formulario para {""}
        <span className=" text-fuchsia-500 font-bold"> crear tu cuenta</span>
      </p>

      <form
        onSubmit={handleSubmit(handleRegister)}
        className="space-y-8 p-10 bg-white mt-10"
        noValidate
      >
        <div className="flex flex-col gap-5">
          <label className="font-normal text-2xl">Nombre</label>
          <input
            type="text"
            placeholder="Nombre de Registro"
            className="w-full p-3 border-gray-300 border"
            {...register("name", {
              required: "El Nombre de usuario es obligatorio",
            })}
          />
          {errors.name && <ErrorMessage>{errors.name.message}</ErrorMessage>}
        </div>

        <div className="flex flex-col gap-5">
          <label className="font-normal text-2xl">Nro Identificación</label>
          <input
            type="number"
            id="identificacion"
            placeholder="Número de Identificación"
            className="w-full p-3 border-gray-300 border"
            {...register("identificacion", {
              required: "La identificación es obligatoria",
            })}
          />
          {errors.identificacion && (
            <ErrorMessage>{errors.identificacion.message}</ErrorMessage>
          )}
        </div>

        <div className="flex flex-col gap-5">
          <label className="font-normal text-2xl">Teléfono</label>
          <input
            type="number"
            id="telefono"
            placeholder="Número de Teléfono"
            className="w-full p-3 border-gray-300 border"
            {...register("telefono", {
              required: "El teléfono es obligatorio",
            })}
          />
          {errors.telefono && (
            <ErrorMessage>{errors.telefono.message}</ErrorMessage>
          )}
        </div>

        <div className="flex flex-col gap-5">
          <label className="font-normal text-2xl">Dirección</label>
          <input
            type="text"
            id="direccion"
            placeholder="Ingrese su dirección"
            className="w-full p-3 border-gray-300 border"
            {...register("direccion", {
              required: "La dirección es obligatoria",
            })}
          />
          {errors.direccion && (
            <ErrorMessage>{errors.direccion.message}</ErrorMessage>
          )}
        </div>

        <div className="flex flex-col gap-5">
          <label className="font-normal text-2xl" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            type="email"
            placeholder="Email de Registro"
            className="w-full p-3 border-gray-300 border"
            {...register("email", {
              required: "El Email de registro es obligatorio",
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
            className="w-full p-3 border-gray-300 border"
            {...register("password", {
              required: "El Password es obligatorio",
              minLength: {
                value: 8,
                message: "El Password debe ser mínimo de 8 caracteres",
              },
            })}
          />
          {errors.password && (
            <ErrorMessage>{errors.password.message}</ErrorMessage>
          )}
        </div>

        <div className="flex flex-col gap-5">
          <label className="font-normal text-2xl">Repetir Password</label>
          <input
            id="password_confirmation"
            type="password"
            placeholder="Repite Password de Registro"
            className="w-full p-3 border-gray-300 border"
            {...register("password_confirmation", {
              required: "Repetir Password es obligatorio",
              validate: (value) =>
                value === password || "Los Passwords no son iguales",
            })}
          />
          {errors.password_confirmation && (
            <ErrorMessage>{errors.password_confirmation.message}</ErrorMessage>
          )}
        </div>

        <input
          type="submit"
          value="Registrarme"
          className="bg-fuchsia-600 hover:bg-fuchsia-700 w-full p-3 text-white font-black text-xl cursor-pointer"
        />
      </form>
      <nav className="mt-10 flex flex-col space-y-4">
        <Link
          to={"/auth/login"}
          className="text-center text-gray-300 font-normal"
        >
          ¿Ya tienes Cuenta? Iniciar Sesión{" "}
        </Link>
      </nav>
    </>
  );
}
