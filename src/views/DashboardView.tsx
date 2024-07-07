import { useNavigate } from "react-router-dom";
import { useAuthStores } from "../store/userAuthStore";
const Dashboard = () => {
  const logOutUser = useAuthStores((state) => state.logOutUser);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logOutUser();
      navigate("/auth/login");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-100">
      <div className="flex flex-wrap justify-center p-4">
        {/* Columna 1 */}
        <div className="w-full md:w-1/2 lg:w-1/4 px-4 mb-4">
          <button
            onClick={() => navigate("/admin/usuarios")}
            className="w-full py-4 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-lg shadow-md mb-2"
          >
            Gestión Usuarios
          </button>
          <button
            onClick={() => navigate("/admin/categorias")}
            className="w-full py-4 bg-green-500 hover:bg-green-600 text-white font-bold rounded-lg shadow-md mb-2"
          >
            Gestión Categorias
          </button>
          <button
            onClick={() => navigate("/admin/color")}
            className="w-full py-4 bg-yellow-500 hover:bg-yellow-600 text-white font-bold rounded-lg shadow-md mb-2"
          >
            Gestión Colores
          </button>
          <button
            onClick={() => navigate("/admin/prendas")}
            className="w-full py-4 bg-red-500 hover:bg-red-600 text-white font-bold rounded-lg shadow-md"
          >
            Gestión Prendas
          </button>
        </div>

        {/* Columna 2 */}
        <div className="w-full md:w-1/2 lg:w-1/4 px-4 mb-4">
          <button
            onClick={() => navigate("/admin/productos")}
            className="w-full py-4 bg-purple-500 hover:bg-purple-600 text-white font-bold rounded-lg shadow-md mb-2"
          >
            Gestión de Productos
          </button>
          <button
            onClick={() => navigate("/admin/tallas")}
            className="w-full py-4 bg-indigo-500 hover:bg-indigo-600 text-white font-bold rounded-lg shadow-md mb-2"
          >
            Gestión Tallas
          </button>
          <button
            onClick={() => navigate("/admin/material")}
            className="w-full py-4 bg-pink-500 hover:bg-pink-600 text-white font-bold rounded-lg shadow-md mb-2"
          >
            Gestión Materiales
          </button>
          <button className="w-full py-4 bg-gray-800 hover:bg-gray-900 text-white font-bold rounded-lg shadow-md">
            Gestión Watsapp
          </button>
        </div>
      </div>

      {/* Botón de Cerrar Sesión */}
      <div className="flex justify-center mt-auto">
        <button
          className="py-4 px-6 bg-gray-500 hover:bg-gray-600 text-white font-bold rounded-lg shadow-md mb-4"
          onClick={handleLogout}
        >
          Cerrar Sesión
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
