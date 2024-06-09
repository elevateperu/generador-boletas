import { useState, useEffect } from "react";
import axios from "axios";
import { Navigate } from "react-router-dom";


import html2canvas from "html2canvas";
import jsPDF from "jspdf";



import './buscar.css';
import Entrada from "./components/Entrada";
import QRCode from "react-qr-code";

const Buscar = () => {

  
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

  const [showTickets, setShowTickets] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const [dataModal, setDataModal] = useState({});
    const [inputValue, setInputValue] = useState('');
    const [inputValueDNI, setInputValueDNI] = useState('');
    const [user, setUser] = useState(localStorage.getItem("isLoggedIn"));
    const handleInputChange = (event) => {
      setInputValue(event.target.value);
    };
  
    const handleSubmit = async (e) => {
        e.preventDefault();

        var data = '';

var config = {
  method: 'get',
  url:  `https://www.conciertoelevate.com//getTicketByIdMercadoPago?id=${inputValue}`,
  headers: { },
  data : data
};

axios(config)
.then(function (response) {

  setDataModal(response.data);
  alert("Se registró correctamente");
  setOpenModal(true);
  setShowTickets(true);
  console.log(JSON.stringify(response.data));
})
.catch(function (error) {
  console.log(error);
});

      };



      const handleInputChangeDNI = (event) => {
        setInputValueDNI(event.target.value);
      };
    
      const handleSubmitDNI = async (e) => {
          e.preventDefault();
  
          var data = '';
  
  var config = {
    method: 'get',
    url:  `https://www.conciertoelevate.com//getDni?dni=${inputValueDNI}`,
    headers: { },
    data : data
  };
  
  axios(config)
  .then(function (response) {
  
    setDataModal(response.data);
    alert("Se registró correctamente");
    setOpenModal(true);
    setShowTickets(true);
    console.log(JSON.stringify(response.data));
  })
  .catch(function (error) {
    console.log(error);
  });
  
        };
  
      const descargarEntradas = (cantidad) => {
        const input = document.getElementById("entradas");
     //   setLoading(true);
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
        //    setLoading(false);
          })
          .catch((error) => {
            console.error("Error al generar PDF:", error);
       //     setLoading(false);
          });
      };
      const descargarPDF = () => {
        //console.log(loading);
        const input = document.getElementById("comprobante-pago");
       // setLoading(true);
        html2canvas(input, { scale: 3 }) // Ajusta la escala para una mejor resolución
          .then((canvas) => {
            const imgData = canvas.toDataURL("image/png", 1.0); // Ajusta la calidad de la imagen
            const pdf = new jsPDF("p", "mm", "a4", true);
            const imgWidth = 190; // mm
            const imgHeight = (canvas.height * imgWidth) / canvas.width;
            pdf.addImage(imgData, "PNG", 10, 10, imgWidth, imgHeight);
            pdf.save("comprobante_pago.pdf");
         //   setLoading(false);
          })
          .catch((error) => {
            console.error("Error al generar PDF:", error);
         //   setLoading(false);
          });
      };
    return (
        <>     {localStorage.getItem('isLoggedIn') && (
            <Navigate to="/buscar" replace={true} />
          )}
        <div className="App">
          <header className="App-header">
            <h1>Búsqueda TicketId</h1>
            <input 
              type="text" 
              value={inputValue} 
              onChange={handleInputChange} 
              placeholder="ticketID" 
            />
            <button onClick={handleSubmit}>Buscar</button>
          </header>

          <div>
          <div className="">
          <header className="App-header">
            <h1>Búsqueda DNI</h1>
            <input 
              type="text" 
              value={inputValueDNI} 
              onChange={handleInputChangeDNI} 
              placeholder="DNI" 
            />
            <button onClick={handleSubmitDNI}>Buscar DNI</button>
          </header>
      
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
                    type={dataModal?.price == 70 && "platinium" || dataModal?.price == 90 && "MeetAndGreet"}
                    key={index}
                  >
                    <QRCode value={item?.ticketId} size={300} />
                  </Entrada>
                ))}
            </div>

            <div className="flex justify-end mt-4 space-x-2">
        
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

          </div>
        </div>
        
        <div id="entradas">
        {showTickets &&
          dataModal?.tickets.map((item, index) => (
            <Entrada type={dataModal?.price == 70 && "platinium" || dataModal?.price == 90 && "MeetAndGreet"} key={index}>
              <QRCode value={item?.ticketId} size={300} />
            </Entrada>
          ))}
      </div>
        
        </>
       
      

      );

}
export default Buscar;