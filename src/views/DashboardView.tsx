import { useNavigate } from "react-router-dom";
const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col h-full bg-gray-100">
      <div className="flex flex-wrap justify-center p-4">
        <div className="w-full px-4 mb-4 md:w-1/3 lg:w-1/4 lg:border-r lg:border-gray-700">
          <button
            onClick={() => navigate("/admin/usuarios")}
            className="flex items-center justify-center w-full gap-2 py-4 mb-2 font-bold text-white rounded-lg shadow-md cursor-pointer bg-customYellow hover:bg-[#ddad61]"
          >
            Gestión Usuarios
          </button>
          <button
            onClick={() => navigate("/admin/categorias")}
            className="flex items-center justify-center w-full gap-2 py-4 mb-2 font-bold text-white rounded-lg shadow-md cursor-pointer bg-customYellow hover:bg-[#ddad61]"
          >
            Gestión Categorias
          </button>
          <button
            onClick={() => navigate("/admin/color")}
            className="flex items-center justify-center w-full gap-2 py-4 mb-2 font-bold text-white rounded-lg shadow-md cursor-pointer bg-customYellow hover:bg-[#ddad61]"
          >
            Gestión Colores
          </button>
          <button
            onClick={() => navigate("/admin/config")}
            className="flex items-center justify-center w-full gap-2 py-4 mb-2 font-bold text-white rounded-lg shadow-md cursor-pointer bg-customYellow hover:bg-[#ddad61]"
          >
            Gestión Watsapp
          </button>
        </div>

        <div className="w-full px-4 mb-4 md:w-1/3 lg:w-1/4">
          <button
            onClick={() => navigate("/admin/productos")}
            className="flex items-center justify-center w-full gap-2 py-4 mb-2 font-bold text-white rounded-lg shadow-md cursor-pointer bg-customYellow hover:bg-[#ddad61]"
          >
            Gestión Prendas
          </button>
          <button
            onClick={() => navigate("/admin/tallas")}
            className="flex items-center justify-center w-full gap-2 py-4 mb-2 font-bold text-white rounded-lg shadow-md cursor-pointer bg-customYellow hover:bg-[#ddad61]"
          >
            Gestión Tallas
          </button>
          <button
            onClick={() => navigate("/admin/material")}
            className="flex items-center justify-center w-full gap-2 py-4 mb-2 font-bold text-white rounded-lg shadow-md cursor-pointer bg-customYellow hover:bg-[#ddad61]"
          >
            Gestión Materiales
          </button>
          <button
            onClick={() => navigate("/admin/estampado")}
            className="flex items-center justify-center w-full gap-2 py-4 mb-2 font-bold text-white bg-customYellow rounded-lg shadow-md cursor-pointer hover:bg-[#ddad61]"
          >
            Gestión Estampado
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
