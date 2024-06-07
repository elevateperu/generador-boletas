import logo from "./assets/Logo.png";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { useState, useEffect } from "react";
import "./App.css";
import axios from "axios";
import Loading from "./components/Loading";
import Entrada from "./components/Entrada";
import QRCode from "react-qr-code";
import { Navigate } from "react-router-dom";
import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";

function App() {
  const [openModal, setOpenModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [dataModal, setDataModal] = useState({});
  const [showTickets, setShowTickets] = useState(false);
  const [user, setUser] = useState(localStorage.getItem("isLoggedIn"));
  const [dataToExcel, setDataToExcel] = useState({});
  const [formData, setFormData] = useState({
    nombreApellido: "",
    apellido: "",
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

  const exportToExcel = () => {
    const fileName = 'reporte.xlsx';
    const ws = XLSX.utils.json_to_sheet(dataToExcel);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "REPORTE");
    const file = XLSX.writeFile(wb, fileName);
    FileSaver.saveAs(file, fileName)
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const newFormData = { ...formData };

    newFormData[name] = value;

    setFormData(newFormData);
  };
  const descargarPDF = () => {
    console.log(loading);
    const input = document.getElementById("comprobante-pago");
    setLoading(true);
    html2canvas(input, { scale: 3 }) // Ajusta la escala para una mejor resolución
      .then((canvas) => {
        const imgData = canvas.toDataURL("image/png", 1.0); // Ajusta la calidad de la imagen
        const pdf = new jsPDF("p", "mm", "a4", true);
        const imgWidth = 190; // mm
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        pdf.addImage(imgData, "PNG", 10, 10, imgWidth, imgHeight);
        pdf.save("comprobante_pago.pdf");
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error al generar PDF:", error);
        setLoading(false);
      });
  };
  const descargarEntradas = (cantidad) => {
    const input = document.getElementById("entradas");
    setLoading(true);
    html2canvas(input, { scale: 3 }) // Ajusta la escala para una mejor resolución
      .then((canvas) => {
        const imgData = canvas.toDataURL("image/png", 1.0); // Ajusta la calidad de la imagen
        const customWidth = 210; // Por ejemplo, A4 tiene 210mm de ancho
        const customHeight = 297; // Por ejemplo, A4 tiene 297mm de alto
        const pdf = new jsPDF({
          orientation: "portrait",
          unit: "mm",
          format: [customWidth, customHeight * (cantidad / 1.5)],
          compress: true, // Habilitar compresión
          compression: "MEDIUM", // Niveles de compresión: NONE, FAST, MEDIUM, SLOW
        });
        const imgWidth = 190; // mm
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        pdf.addImage(imgData, "PNG", 10, 10, imgWidth, imgHeight);
        pdf.save("entradas.pdf");
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error al generar PDF:", error);
        setLoading(false);
      });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const response = await axios.post(
      "https://www.conciertoelevate.com/ticket",
      {
        quantity: formData.cantidad,
        price: (formData.tipoEntrada == "General" && 35) || 60,
        nameUser: formData.nombreApellido,
        lastName: formData.apellido,
        dni: formData.dni,
        email: formData.correo,
        phone: formData.telefono,
        codeTransaction: formData.codigoPago,
      }
    );
    setLoading(false);
    if (response.status == 200) {
      setDataModal(response.data);
      alert("Se registró correctamente");
      setOpenModal(true);
      setShowTickets(true);
    } else {
      alert("Hubo un error al generar las entradas");
    }
    console.log(response);
    console.log(dataModal);
  };
  const getAllTickets = async () => {
    const response = await axios.get("https://www.conciertoelevate.com");
    console.log(response)
    const auxData = response.data.filter((item) => item.status == "PAGADO" || item.status == "approved").map((item) => {
      return{
        "Nombre": item.nameUser,
        "Apellido": item.lastName,
        "Monto": item.price * item.quantity,
        "Cantidad": item.quantity,
        "Tipo": item.price == 35 && "General" || "Platinium",
        "Medio Pago": item.codeTransaction && "YAPE/PLIN/TRANSFERENCIA" || "Mercado Pago",
        "Numero Operacion": item.codeTransaction || item.idMercadoPago,
        "DNI": item.dni
      }

    })
    setDataToExcel(auxData)
  };
  useEffect(() => {
    getAllTickets();
  }, []);

  return (
    <>
      {!user && <Navigate to="/" replace={true} />}
      <button className="bg-green-600 text-white p-2 rounded-lg m-4" onClick={exportToExcel}>Descargar reporte</button>
      <section
        id="formulario"
        className="p-8 bg-white border border-gray-300 max-w-4xl mx-auto my-8"
      >
        <h2 className="text-2xl font-bold mb-4">Datos del Cliente</h2>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <label
                htmlFor="nombreApellido"
                className="block mb-1 font-semibold"
              >
                Nombre:
              </label>
              <input
                type="text"
                id="nombreApellido"
                name="nombreApellido"
                value={formData.nombreApellido}
                onChange={(e) => handleInputChange(e)}
                className="w-full border border-gray-900 rounded-md px-3 py-2"
                required
              />
            </div>
            <div>
              <label htmlFor="apellido" className="block mb-1 font-semibold">
                Apellido:
              </label>
              <input
                type="text"
                id="apellido"
                name="apellido"
                value={formData.apellido}
                onChange={(e) => handleInputChange(e)}
                className="w-full border border-gray-900 rounded-md px-3 py-2"
                required
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
                required
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
                required
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
                required
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
                required
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
                required
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
                required
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
                required
              />
            </div>
          </div>
          <div>
            <button
              type="submit"
              className="bg-green-700 text-white p-2 rounded-xl"
            >
              Registrar entradas
            </button>
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
                <p>
                  {formData.nombreApellido} {formData.apellido}
                </p>
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
                  <td className="py-2 px-4 border-b border-gray-300">
                    {(formData.tipoEntrada == "General" &&
                      35 * formData.cantidad) ||
                      formData.cantidad * 60}{" "}
                    s/
                  </td>
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
      {openModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-30">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6 relative">
            <button
              className="absolute top-2 right-2 text-2xl rounded-lg text-gray-500 hover:text-gray-700"
              onClick={() => setOpenModal(false)}
            >
              x
            </button>
            <h2 className="text-xl font-bold mb-4 text-center">
              Se registró correctamente las entradas
            </h2>
            <div className="h-[400px] overflow-y-scroll">
              {dataModal &&
                dataModal?.tickets.map((item, index) => (
                  <Entrada
                    type={dataModal?.price == 60 && "platinium"}
                    key={index}
                  >
                    <QRCode value={item?.ticketId} size={300} />
                  </Entrada>
                ))}
            </div>

            <div className="flex justify-end mt-4 space-x-2">
              <button
                onClick={descargarPDF}
                className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
              >
                Descargar Comprobante
              </button>
              <button
                onClick={() => descargarEntradas(dataModal.quantity)}
                className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
              >
                Descargar Entradas
              </button>
              <button
                className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
                onClick={() => setOpenModal(false)}
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
      {loading && <Loading />}
      <div id="entradas">
        {showTickets &&
          dataModal?.tickets.map((item, index) => (
            <Entrada type={dataModal?.price == 60 && "platinium"} key={index}>
              <QRCode value={item?.ticketId} size={300} />
            </Entrada>
          ))}
      </div>
    </>
  );
}

export default App;
