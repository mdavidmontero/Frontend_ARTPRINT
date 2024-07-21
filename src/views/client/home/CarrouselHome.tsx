import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { obtenerProductosLimit } from "../../../api/ProductosAPI";
import useAuth from "../../../hooks/useAuth";
import { useValidationUserRoutes } from "../../../utils";

export const CarrouselHome = () => {
  const { user } = useAuth();
  const { data: dataProductos } = useQuery({
    queryKey: ["productoslimit"],
    queryFn: () => obtenerProductosLimit(),
  });
  const navigate = useNavigate();
  const route = useValidationUserRoutes(user);
  const settings = {
    dots: true,
    infinite: false,
    slidesToShow: 5,
    slidesToScroll: 1,
    autoplay: true,
    speed: 2000,
    autoplaySpeed: 2000,
    cssEase: "linear",
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  return (
    <Slider {...settings}>
      {dataProductos?.map((producto) => (
        <div
          key={producto.id}
          className="slider-container"
          onClick={() => navigate(`${route}` + producto.id)}
        >
          <img
            className="w-44 h-44 object-cover rounded hover:scale-125 transition-transform hover:rotate-2 "
            src={producto.colores[0].imagenUrl || ""}
            alt={producto.nombre}
          />
        </div>
      ))}
    </Slider>
  );
};
