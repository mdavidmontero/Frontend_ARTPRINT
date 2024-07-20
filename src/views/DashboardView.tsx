import { useNavigate } from "react-router-dom";
const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col h-full bg-gray-100">
      <div className="flex flex-wrap justify-center p-4">
        <div className="w-full md:w-1/3 lg:w-1/4 px-4 mb-4 lg:border-r lg:border-gray-700">
          <button
            onClick={() => navigate("/admin/usuarios")}
            className="flex items-center bg-blue-600 hover:bg-blue-800 w-full py-4  text-white font-bold rounded-lg shadow-md mb-2 gap-2 justify-center cursor-pointer"
          >
            Gestión Usuarios
          </button>
          <button
            onClick={() => navigate("/admin/categorias")}
            className="flex items-center bg-blue-600 hover:bg-blue-800 w-full py-4  text-white font-bold rounded-lg shadow-md mb-2 gap-2 justify-center cursor-pointer"
          >
            Gestión Categorias
          </button>
          <button
            onClick={() => navigate("/admin/color")}
            className="flex items-center bg-blue-600 hover:bg-blue-800 w-full py-4  text-white font-bold rounded-lg shadow-md mb-2 gap-2 justify-center cursor-pointer"
          >
            Gestión Colores
          </button>
          <button
            onClick={() => navigate("/admin/config")}
            className="flex items-center bg-blue-600 hover:bg-blue-800 w-full py-4  text-white font-bold rounded-lg shadow-md mb-2 gap-2 justify-center cursor-pointer"
          >
            Gestión Watsapp
          </button>
        </div>

        <div className="w-full md:w-1/3 lg:w-1/4 px-4 mb-4">
          <button
            onClick={() => navigate("/admin/productos")}
            className="flex items-center bg-blue-600 hover:bg-blue-800 w-full py-4  text-white font-bold rounded-lg shadow-md mb-2 gap-2 justify-center cursor-pointer"
          >
            Gestión Prendas
          </button>
          <button
            onClick={() => navigate("/admin/tallas")}
            className="flex items-center bg-blue-600 hover:bg-blue-800 w-full py-4  text-white font-bold rounded-lg shadow-md mb-2 gap-2 justify-center cursor-pointer"
          >
            Gestión Tallas
          </button>
          <button
            onClick={() => navigate("/admin/material")}
            className="flex items-center bg-blue-600 hover:bg-blue-800 w-full py-4  text-white font-bold rounded-lg shadow-md mb-2 gap-2 justify-center cursor-pointer"
          >
            Gestión Materiales
          </button>
          <button
            onClick={() => navigate("/admin/estampado")}
            className="flex items-center bg-blue-600 hover:bg-blue-800 w-full py-4  text-white font-bold rounded-lg shadow-md mb-2 gap-2 justify-center cursor-pointer"
          >
            Gestión Estampado
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
