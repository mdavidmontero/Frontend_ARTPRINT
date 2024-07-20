import React, { useState } from "react";
import Slider from "react-slick";
import { Estampado } from "../../types";

interface CarruselEstampadosProps {
  estampados: Estampado[];
  onSelect?: (estampado: Estampado) => void;
}

const CarruselEstampados = ({
  estampados,
  onSelect,
}: CarruselEstampadosProps) => {
  const [estampadosDispo, setEstampadoDis] = useState<Estampado[]>(estampados);
  const [selectedEstampado, setSelectedEstampado] = useState<Estampado | null>(
    null
  );

  const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 3,
  };
  const handleSelect = (estampado: Estampado) => {
    setSelectedEstampado(estampado);
    if (onSelect) {
      onSelect(estampado);
    }
  };

  return (
    <div>
      <Slider {...settings}>
        {estampadosDispo?.map((estampado) => (
          <div
            key={estampado.id}
            className={`p-2 cursor-pointer ${
              selectedEstampado?.id === estampado.id
                ? "border-4 border-indigo-500"
                : "border"
            }`}
            onClick={() => handleSelect(estampado)}
          >
            <img
              src={estampado.image}
              alt={estampado.nombre}
              className="w-full h-40 object-cover"
            />
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default CarruselEstampados;
