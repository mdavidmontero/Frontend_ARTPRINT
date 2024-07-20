import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Producto } from "../../../types";
import { useNavigate } from "react-router-dom";

interface Props {
  productos: Producto[];
}

export const CarrouselHome = ({ productos }: Props) => {
  const navigate = useNavigate();
  const settings = {
    dots: true,
    infinite: true,
    slidesToShow: 3,
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
      {productos.map((producto) => (
        <div
          key={producto.id}
          className="slider-container"
          onClick={() => navigate("/detallesProducto/" + producto.id)}
        >
          <h1>Hola</h1>
        </div>
      ))}
    </Slider>
  );
};
