import React, { useState, useEffect } from "react";
import { WhatsApp } from "../../../types";
import {
  actualizarNumeroWhatsApp,
  guardarNumeroWhatsApp,
  obtenerNumeroWhatsApp,
} from "../../../api/WhatsAppAPI";
import Spinner from "../../../components/spinner/Spinner";
import { toast } from "react-toastify";

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
        toast.success("Número de WhatsApp actualizado correctamente.");
      } else {
        await guardarNumeroWhatsApp(numeroWhatsApp, countryCode);
        const newWhatsAppData = await obtenerNumeroWhatsApp();

        if (newWhatsAppData) {
          setWhatsAppData(newWhatsAppData);
          setNumeroWhatsApp(newWhatsAppData.phoneNumber);
          setCountryCode(newWhatsAppData.countryCode);
          toast.success("Número de WhatsApp agregado correctamente.");
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
    return <Spinner />;
  }

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-black">WhatsApp</h1>
      <p className="mt-5 font-light text-gray-500 capitalize text-1xl">
        Aquí puedes Agregar el número donde recibiras los Pedidos
      </p>
      <div className="p-10 mt-8 space-y-5 bg-white rounded-lg shadow-lg">
        <div className="mb-5 space-y-3">
          <label className="text-sm font-bold uppercase" htmlFor="numero">
            Número WhatsApp
          </label>
          <input
            type="text"
            id="numero"
            className="w-full p-3 border border-gray-200"
            placeholder="Ingrese el número de WhatsApp"
            value={numeroWhatsApp}
            onChange={(e) => setNumeroWhatsApp(e.target.value)}
          />
        </div>
        <h2 className="mb-4 text-lg font-bold ">Código de País:</h2>
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
          className="px-4 py-2 mb-4 font-bold text-white bg-green-600 rounded hover:bg-green-700"
          onClick={handleGuardarNumero}
        >
          Guardar
        </button>
      </div>

      {modalVisible && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="p-4 bg-white rounded">
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
              className="px-4 py-2 mt-2 font-bold text-white bg-purple-600 rounded"
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
