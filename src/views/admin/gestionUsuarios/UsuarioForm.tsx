import { useState, useEffect } from "react";
import { RolUsuario, Usuario } from "../../../types";
import {
  actualizarUsuario,
  crearUsuarioYAutenticacion,
  obtenerUsuarioPorId,
} from "../../../api/UsuarioAPI";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

const UsuarioForm = () => {
  const [nombre, setNombre] = useState<string>("");
  const [cedula, setCedula] = useState<string>("");
  const [correo, setCorreo] = useState<string>("");
  const [telefono, setTelefono] = useState<string>("");
  const [direccion, setDireccion] = useState<string>("");
  const [rol, setRol] = useState<RolUsuario>(RolUsuario.CLIENTE); // Cambia el valor inicial aquí
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      const cargarDatosUsuario = async () => {
        try {
          setLoading(true);
          const usuario = await obtenerUsuarioPorId(id);
          if (usuario) {
            setNombre(usuario.nombre);
            setCedula(usuario.cedula);
            setCorreo(usuario.correo);
            setTelefono(usuario.telefono);
            setDireccion(usuario.direccion);
            setRol(usuario.rol);
          }
        } catch (error) {
          console.error("Error al cargar datos del usuario:", error);
        } finally {
          setLoading(false);
        }
      };
      cargarDatosUsuario();
    }
  }, [id]);

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};
    if (!validateNombre(nombre)) {
      newErrors.nombre = "Por favor ingrese un nombre válido.";
    }
    if (!validateCedula(cedula)) {
      newErrors.cedula = "Por favor ingrese un N° de Identificación válido.";
    }
    if (!validateTelefono(telefono)) {
      newErrors.telefono = "Por favor ingrese un número de teléfono válido.";
    }
    if (!validateDireccion(direccion)) {
      newErrors.direccion = "Por favor ingrese una dirección válida.";
    }
    if (!validateEmail(correo)) {
      newErrors.correo = "Por favor ingrese un correo electrónico válido.";
    }
    if (!id && !validatePassword(password)) {
      newErrors.password = "La contraseña debe tener al menos 6 caracteres.";
    }
    if (!rol) {
      newErrors.rol = "Por favor seleccione un rol.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateEmail = (email: Usuario["correo"]) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string) => {
    return password.length >= 6;
  };

  const validateNombre = (nombre: string) => {
    return nombre.trim().length > 0;
  };

  const validateCedula = (cedula: string) => {
    const cedulaRegex = /^\d{7,10}$/;
    return cedulaRegex.test(cedula);
  };

  const validateTelefono = (telefono: string) => {
    const telefonoRegex = /^\d{9,10}$/;
    return telefonoRegex.test(telefono);
  };

  const validateDireccion = (direccion: string) => {
    return direccion.trim().length > 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const usuario = {
        id: id || "",
        nombre,
        cedula,
        correo,
        telefono,
        direccion,
        rol,
        fotoPerfil: "",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      if (id) {
        await actualizarUsuario(id, usuario);
        toast.success("Usuario actualizado correctamente.");
      } else {
        await crearUsuarioYAutenticacion(usuario, password);
        toast.success("Usuario registrado correctamente.");
        navigate("/");
      }
      navigate("/admin/usuarios");
    } catch (error) {
      console.error("Error al guardar usuario:", error);
      alert(
        "Hubo un problema al guardar el usuario. Por favor, inténtalo nuevamente más tarde."
      );
    } finally {
      setLoading(false);
    }
  };

  const roles = [
    { label: "Cliente", value: RolUsuario.CLIENTE },
    { label: "Administrador", value: RolUsuario.ADMIN },
    // { label: 'Empleado', value: RolUsuario.EMPLEADO },
  ];

  const handleRolSelect = (value: RolUsuario) => {
    setRol(value);
    setModalVisible(false);
  };

  return (
    <div className="container p-4 mx-auto md:p-6">
      <h1 className="mb-6 text-3xl font-bold text-center">
        {id ? "Editar Usuario" : "Añadir Usuario"}
      </h1>
      <div className="w-full max-w-md mx-auto">
        <input
          className={`w-full h-10 px-3 mb-4 border rounded-lg" ${
            errors.nombre && "border-red-500"
          }`}
          placeholder="Nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />
        {errors.nombre && <p className="text-red-500">{errors.nombre}</p>}
        <input
          className={`w-full h-10 px-3 mb-4 border rounded-lg" ${
            errors.cedula && "border-red-500"
          }`}
          placeholder="N° de Identificación"
          value={cedula}
          onChange={(e) => setCedula(e.target.value)}
        />
        {errors.cedula && <p className="text-red-500">{errors.cedula}</p>}
        <input
          className={`${
            id !== undefined ? "disabled:bg-gray-300" : ""
          }  w-full h-10 px-3 mb-4 border rounded-lg" ${
            errors.correo && "border-red-500"
          }`}
          placeholder="Correo"
          disabled={id === undefined ? false : true}
          value={correo}
          onChange={(e) => setCorreo(e.target.value)}
        />
        {errors.correo && <p className="text-red-500">{errors.correo}</p>}
        <input
          className={`w-full h-10 px-3 mb-4 border rounded-lg" ${
            errors.telefono && "border-red-500"
          }`}
          placeholder="Teléfono"
          value={telefono}
          onChange={(e) => setTelefono(e.target.value)}
        />
        {errors.telefono && <p className="text-red-500">{errors.telefono}</p>}
        <input
          className={`w-full h-10 px-3 mb-4 border rounded-lg" ${
            errors.direccion && "border-red-500"
          }`}
          placeholder="Dirección"
          value={direccion}
          onChange={(e) => setDireccion(e.target.value)}
        />
        {errors.direccion && <p className="text-red-500">{errors.direccion}</p>}
        {!id && (
          <input
            className={`w-full h-10 px-3 mb-4 border rounded-lg" ${
              errors.password && "border-red-500"
            }`}
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
          />
        )}
        {errors.password && <p className="text-red-500">{errors.password}</p>}
        <div className="relative">
          <button
            className={`border border-gray-300 bg-green-500 hover:bg-green-600 rounded px-3 py-2 w-full mb-4 focus:outline-none ${
              errors.rol && "border-red-500"
            }`}
            onClick={() => setModalVisible(true)}
          >
            {rol
              ? roles.find((r) => r.value === rol)?.label
              : "-- Seleccione un rol --"}
          </button>
          {errors.rol && <p className="text-red-500">{errors.rol}</p>}
          {modalVisible && (
            <div className="absolute w-full mt-1 bg-white border border-green-300 rounded shadow-lg">
              <ul>
                {roles.map((item) => (
                  <li
                    key={item.value}
                    className="px-3 py-2 cursor-pointer hover:bg-gray-100"
                    onClick={() => handleRolSelect(item.value)}
                  >
                    {item.label}
                  </li>
                ))}
              </ul>
              <button
                className="w-full px-3 py-2 text-white bg-green-600 border-t border-gray-300 rounded-b focus:outline-none"
                onClick={() => setModalVisible(false)}
              >
                Cerrar
              </button>
            </div>
          )}
        </div>
        <button
          className={`w-full px-4 py-2 text-white bg-green-600 rounded shadow hover:bg-green-700   ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
          onClick={handleSave}
          disabled={loading}
        >
          {loading ? "Guardando..." : "Guardar"}
        </button>
      </div>
    </div>
  );
};

export default UsuarioForm;
