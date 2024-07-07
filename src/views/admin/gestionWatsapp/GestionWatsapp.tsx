import React, { useState, useEffect } from "react";
import { WhatsApp } from "../../../types";
import {
  actualizarNumeroWhatsApp,
  guardarNumeroWhatsApp,
  obtenerNumeroWhatsApp,
} from "../../../api/WhatsAppAPI";

export const GestionWhatsApp: React.FC = () => {
  const [numeroWhatsApp, setNumeroWhatsApp] = useState("");
  const [countryCode, setCountryCode] = useState("");
  const [whatsappData, setWhatsAppData] = useState<WhatsApp | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [modalVisible, setModalVisible] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const data = await obtenerNumeroWhatsApp();

        if (data) {
          setWhatsAppData(data);
          setNumeroWhatsApp(data.phoneNumber);
          setCountryCode(data.countryCode);
        } else {
          window.alert(
            "No se encontró ningún número de WhatsApp. ¿Deseas agregar uno nuevo?"
          );
          setNumeroWhatsApp("");
        }
      } catch (error) {
        console.error("Error fetching WhatsApp data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleGuardarNumero = async () => {
    try {
      setLoading(true);

      if (whatsappData) {
        await actualizarNumeroWhatsApp(numeroWhatsApp, countryCode);
        setWhatsAppData({
          ...whatsappData,
          phoneNumber: numeroWhatsApp,
          countryCode,
        });
        window.alert("Número de WhatsApp actualizado correctamente.");
      } else {
        await guardarNumeroWhatsApp(numeroWhatsApp, countryCode);
        const newWhatsAppData = await obtenerNumeroWhatsApp();

        if (newWhatsAppData) {
          setWhatsAppData(newWhatsAppData);
          setNumeroWhatsApp(newWhatsAppData.phoneNumber);
          setCountryCode(newWhatsAppData.countryCode);
          window.alert("Número de WhatsApp agregado correctamente.");
        }
      }
    } catch (error) {
      console.error("Error al actualizar/guardar número de WhatsApp:", error);
      window.alert("Error al guardar/actualizar número de WhatsApp.");
    } finally {
      setLoading(false);
    }
  };

  const countries = [
    { label: "Colombia (+57)", value: "57" },
    { label: "Estados Unidos (+1)", value: "1" },
    { label: "Perú (+51)", value: "51" },
    { label: "Ecuador (+593)", value: "593" },
  ];

  const handleCountrySelect = (value: string) => {
    setCountryCode(value);
    setModalVisible(false);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="mb-4">
          <svg
            className="animate-spin h-10 w-10 text-purple-800"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V2.5a.5.5 0 00-1 0V4a8 8 0 01-8 8z"
            ></path>
          </svg>
        </div>
        <p className="text-lg font-semibold">Cargando...</p>
      </div>
    );
  }

  return (
    <div className="p-8 bg-white">
      <h2 className="text-2xl font-bold mb-4">Número de WhatsApp:</h2>
      <input
        type="text"
        className="border border-gray-300 rounded px-3 py-2 mb-4"
        placeholder="Ingrese el número de WhatsApp"
        value={numeroWhatsApp}
        onChange={(e) => setNumeroWhatsApp(e.target.value)}
      />
      <h2 className="text-2xl font-bold mb-4">Código de País:</h2>
      <button
        className={`border border-gray-300 rounded px-3 py-2 mb-4 ${
          !countryCode && "border-red-500"
        }`}
        onClick={() => setModalVisible(true)}
      >
        {countryCode
          ? countries.find((c) => c.value === countryCode)?.label
          : "Seleccionar país"}
      </button>
      <button
        className="bg-purple-600 text-white font-bold py-2 px-4 rounded mb-4"
        onClick={handleGuardarNumero}
      >
        Guardar
      </button>

      {modalVisible && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-4 rounded">
            <ul>
              {countries.map((country) => (
                <li
                  key={country.value}
                  className="py-2 border-b border-gray-300"
                >
                  <button
                    className="focus:outline-none"
                    onClick={() => handleCountrySelect(country.value)}
                  >
                    {country.label}
                  </button>
                </li>
              ))}
            </ul>
            <button
              className="bg-purple-600 text-white font-bold py-2 px-4 rounded mt-2"
              onClick={() => setModalVisible(false)}
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
