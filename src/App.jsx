import logo from "./assets/Logo.png";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { useState } from "react";
import "./App.css";

function App() {
  const [formData, setFormData] = useState({
    nombreApellido: "",
    dni: "",
    telefono: "",
    correo: "",
    productos: [
      { descripcion: "", cantidad: "", precio: "" },
      { descripcion: "", cantidad: "", precio: "" },
    ],
    cantidad: 0,
    total: "",
    codigoPago: "",
    medioPago: "",
    tipoEntrada: "",
  });

  const handleInputChange = (e, index) => {
    const { name, value } = e.target;
    const newFormData = { ...formData };

    newFormData[name] = value;

    setFormData(newFormData);
  };
  const descargarPDF = () => {
    const input = document.getElementById("comprobante-pago");

    html2canvas(input, { scale: 3 }) // Ajusta la escala para una mejor resolución
      .then((canvas) => {
        const imgData = canvas.toDataURL("image/png", 1.0); // Ajusta la calidad de la imagen
        const pdf = new jsPDF("p", "mm", "a4");
        const imgWidth = 190; // mm
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        pdf.addImage(imgData, "PNG", 10, 10, imgWidth, imgHeight);
        pdf.save("comprobante_pago.pdf");
      })
      .catch((error) => {
        console.error("Error al generar PDF:", error);
      });
  };

  return (
    <>
      <section
        id="formulario"
        className="p-8 bg-white border border-gray-300 max-w-4xl mx-auto my-8"
      >
        <h2 className="text-2xl font-bold mb-4">Datos del Cliente</h2>
        <form>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <label
                htmlFor="nombreApellido"
                className="block mb-1 font-semibold"
              >
                Nombre y Apellido:
              </label>
              <input
                type="text"
                id="nombreApellido"
                name="nombreApellido"
                value={formData.nombreApellido}
                onChange={(e) => handleInputChange(e)}
                className="w-full border border-gray-900 rounded-md px-3 py-2"
              />
            </div>
            <div>
              <label htmlFor="dni" className="block mb-1 font-semibold">
                DNI:
              </label>
              <input
                type="text"
                id="dni"
                name="dni"
                value={formData.dni}
                onChange={(e) => handleInputChange(e)}
                className="w-full border border-gray-900 rounded-md px-3 py-2"
              />
            </div>
            <div>
              <label htmlFor="telefono" className="block mb-1 font-semibold">
                Teléfono:
              </label>
              <input
                type="text"
                id="telefono"
                name="telefono"
                value={formData.telefono}
                onChange={(e) => handleInputChange(e)}
                className="w-full border border-gray-900 rounded-md px-3 py-2"
              />
            </div>
            <div>
              <label htmlFor="correo" className="block mb-1 font-semibold">
                Correo:
              </label>
              <input
                type="email"
                id="correo"
                name="correo"
                value={formData.correo}
                onChange={(e) => handleInputChange(e)}
                className="w-full border border-gray-900 rounded-md px-3 py-2"
              />
            </div>
            <div>
              <label htmlFor="codigoPago" className="block mb-1 font-semibold">
                Codigo:
              </label>
              <input
                type="text"
                id="codigoPago"
                name="codigoPago"
                value={formData.codigoPago}
                onChange={(e) => handleInputChange(e)}
                className="w-full border border-gray-900 rounded-md px-3 py-2"
              />
            </div>
            <div>
              <label htmlFor="medioPago" className="block mb-1 font-semibold">
                Medio de pago:
              </label>
              <select
                name="medioPago"
                id="medioPago"
                value={formData.medioPago}
                onChange={(e) => handleInputChange(e)}
                className="w-full border border-gray-900 rounded-md px-3 py-2"
              >
                <option value="">Seleccione</option>
                <option value="YAPE">YAPE</option>
                <option value="PLIN">PLIN</option>
                <option value="TRANSFERENCIA">TRANSFERENCIA</option>
              </select>
            </div>
            <div>
              <label htmlFor="tipoEntrada" className="block mb-1 font-semibold">
                Tipo de entrada:
              </label>
              <select
                name="tipoEntrada"
                id="tipoEntrada"
                value={formData.tipoEntrada}
                onChange={(e) => handleInputChange(e)}
                className="w-full border border-gray-900 rounded-md px-3 py-2"
              >
                <option value="">Seleccione</option>
                <option value="General">General</option>
                <option value="Platinium">Platinium</option>
              </select>
            </div>
            <div>
              <label htmlFor="cantidad" className="block mb-1 font-semibold">
                Cantidad:
              </label>
              <input
                type="number"
                id="cantidad"
                name="cantidad"
                value={formData.cantidad}
                onChange={(e) => handleInputChange(e)}
                className="w-full border border-gray-900 rounded-md px-3 py-2"
              />
            </div>
          </div>
          <div>
            <button type="button" className="bg-green-700 text-white p-2 rounded-xl" onClick={descargarPDF}>Descargar PDF</button>
          </div>
        </form>
      </section>

      <div className="">
        <div
          id="comprobante-pago"
          className="p-8 bg-white border border-gray-300 max-w-4xl mx-auto my-12"
        >
          {/* Header */}
          <header className="flex justify-between items-center mb-8">
            <img src={logo} alt="Logo" className="h-16" />
            <div className="text-right">
              <h1 className="text-2xl font-bold">Comprobante de Pago</h1>
              <p className="text-sm text-gray-600">
                Número de comprobante: ({formData.medioPago}){" "}
                {formData.codigoPago}
              </p>
            </div>
          </header>

          {/* Información de Contacto */}
          <section className="mb-8 border p-4">
            <h2 className="text-xl font-semibold mb-4 ">
              Información de Contacto
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="font-semibold">Nombre y Apellido:</p>
                <p>{formData.nombreApellido}</p>
              </div>
              <div>
                <p className="font-semibold">DNI:</p>
                <p>{formData.dni}</p>
              </div>
              <div>
                <p className="font-semibold">Teléfono:</p>
                <p>{formData.telefono}</p>
              </div>
              <div>
                <p className="font-semibold">Correo:</p>
                <p>{formData.correo}</p>
              </div>
            </div>
          </section>

          {/* Descripción de Productos */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">
              Descripción de Productos
            </h2>
            <table className="min-w-full bg-white">
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b-2 border-gray-300 text-left">
                    Descripción
                  </th>
                  <th className="py-2 px-4 border-b-2 border-gray-300 text-left">
                    Cantidad
                  </th>
                  <th className="py-2 px-4 border-b-2 border-gray-300 text-left">
                    Precio
                  </th>
                  <th className="py-2 px-4 border-b-2 border-gray-300 text-left">
                    Total
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="py-2 px-4 border-b border-gray-300">
                    {formData.tipoEntrada}
                  </td>
                  <td className="py-2 px-4 border-b border-gray-300">
                    {formData.cantidad}
                  </td>
                  <td className="py-2 px-4 border-b border-gray-300">
                    {(formData.tipoEntrada == "General" && "35") || "60"} s/
                  </td>
                  <td className="py-2 px-4 border-b border-gray-300">
                    {(formData.tipoEntrada == "General" &&
                      35 * formData.cantidad) ||
                      formData.cantidad * 60}{" "}
                    s/
                  </td>
                </tr>
                {/* Add more products as needed */}
                <tr>
                  <td
                    colSpan="3"
                    className="py-2 px-4 border-b border-gray-300 text-right font-semibold"
                  >
                    Total
                  </td>
                  <td className="py-2 px-4 border-b border-gray-300">{(formData.tipoEntrada == "General" &&
                      35 * formData.cantidad) ||
                      formData.cantidad * 60}{" "}
                    s/</td>
                </tr>
              </tbody>
            </table>
          </section>

          {/* Footer */}
          <footer className="mt-8 text-center">
            <p className="text-sm">Número de contacto: +51 981 257 046</p>
            <p className="text-sm">Página web: www.priscillabuenotour.pe</p>
            <p className="text-sm">Priscilla Bueno</p>
          </footer>
        </div>
      </div>
    </>
  );
}

export default App;
