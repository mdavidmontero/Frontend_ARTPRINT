import { useEffect } from "react";
import { useForm } from "react-hook-form";
import ErrorMessage from "../../../components/ErrorMessage";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import useAuth from "../../../hooks/useAuth";
import { Usuario } from "../../../types";
import {
  actualizarUsuario,
  obtenerUsuarioPorId,
} from "../../../api/UsuarioAPI";

export default function ProfileForm() {
  const { user } = useAuth();

  const { data, isLoading } = useQuery({
    queryKey: ["user"],
    queryFn: () => obtenerUsuarioPorId(user?.uid!),
  });
  const id = data?.id;

  const initialValues: Usuario = {
    id: data?.id || "",
    nombre: data?.nombre || "",
    cedula: data?.cedula || "",
    telefono: data?.telefono || "",
    direccion: data?.direccion || "",
    correo: data?.correo || "",
    fotoPerfil: data?.fotoPerfil || "",
    rol: data?.rol!,
    updatedAt: new Date(),
    createdAt: data?.createdAt || new Date(),
  };

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: initialValues,
  });

  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: (formData: Usuario) => actualizarUsuario(user?.uid!, formData),
    onError: (error: any) => {
      toast.error(error.message);
    },
    onSuccess: () => {
      toast.success("Perfil actualizado exitosamente");
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });

  const handleEditProfile = (formData: Usuario) => {
    mutate(formData);
  };

  useEffect(() => {
    if (data) {
      reset(initialValues);
    }
  }, [data, reset]);

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="text-3xl font-black">Perfil</h1>
      <p className="text-1xl font-light text-gray-500 mt-5">
        Aquí puedes actualizar tu información
      </p>

      <form
        onSubmit={handleSubmit(handleEditProfile)}
        className="mt-8 space-y-5 bg-white shadow-lg p-10 rounded-lg"
        noValidate
      >
        <div className="mb-5 space-y-3">
          <label className="text-sm uppercase font-bold" htmlFor="nombre">
            Nombre
          </label>
          <input
            id="nombre"
            type="text"
            placeholder="Tu Nombre"
            className="w-full p-3 border border-gray-200"
            {...register("nombre", {
              required: "Nombre de usuario es obligatorio",
            })}
          />
          {errors.nombre && (
            <ErrorMessage>{errors.nombre.message}</ErrorMessage>
          )}
        </div>
        <div className="mb-5 space-y-3">
          <label className="text-sm uppercase font-bold" htmlFor="cedula">
            Identificación
          </label>
          <input
            id="cedula"
            type="text"
            placeholder="Tu Identificación"
            className="w-full p-3 border border-gray-200"
            {...register("cedula", {
              required: "Identificación es obligatoria",
            })}
          />
          {errors.cedula && (
            <ErrorMessage>{errors.cedula.message}</ErrorMessage>
          )}
        </div>
        <div className="mb-5 space-y-3">
          <label className="text-sm uppercase font-bold" htmlFor="telefono">
            Telefono
          </label>
          <input
            id="telefono"
            type="number"
            placeholder="Tu Telefono"
            className="w-full p-3 border border-gray-200"
            {...register("telefono", {
              required: "Telefono es obligatorio",
            })}
          />
          {errors.telefono && (
            <ErrorMessage>{errors.telefono.message}</ErrorMessage>
          )}
        </div>
        <div className="mb-5 space-y-3">
          <label className="text-sm uppercase font-bold" htmlFor="direccion">
            Dirección
          </label>
          <input
            id="direccion"
            type="text"
            placeholder="Tu Dirección"
            className="w-full p-3 border border-gray-200"
            {...register("direccion", {
              required: "Dirección es obligatoria",
            })}
          />
          {errors.direccion && (
            <ErrorMessage>{errors.direccion.message}</ErrorMessage>
          )}
        </div>
        <div className="mb-5 space-y-3">
          <label className="text-sm uppercase font-bold" htmlFor="correo">
            Email
          </label>
          <input
            id="correo"
            type="email"
            placeholder="Tu Email"
            disabled={id ? true : false}
            className={`w-full p-3 border border-gray-200 ${
              id ? "disabled:bg-gray-200" : " "
            }`}
            {...register("correo", {
              required: "El e-mail es obligatorio",
              pattern: {
                value: /\S+@\S+\.\S+/,
                message: "E-mail no válido",
              },
            })}
          />
          {errors.correo && (
            <ErrorMessage>{errors.correo.message}</ErrorMessage>
          )}
        </div>
        <input
          type="submit"
          value="Guardar Cambios"
          className="bg-blue-700 w-full p-3 text-white uppercase font-bold hover:bg-blue-800 cursor-pointer transition-colors"
        />
      </form>
    </div>
  );
}
