// src/pages/LoginPage.js
import  { useState } from "react";
import axios from "axios";
import { Navigate } from "react-router-dom";
import Loading from "./components/Loading";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e) => {
    setLoading(true)
    e.preventDefault();
    console.log("user", username);
    // Validación básica del formulario
    if (!username || !password) {
      setErrorMessage("Por favor, ingrese usuario y contraseña.");
      return;
    }

    var data = JSON.stringify({
      username: username,
      email: "priscillabuenotourperu@gmail.com",
      password: password,
    });

    var config = {
      method: "post",
      url: "https://www.conciertoelevate.com/auth/signin",
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };

    axios(config)
      .then(function (response) {
        console.log(JSON.stringify(response.data));
        localStorage.setItem("username", username);
        localStorage.setItem("isLoggedIn", "true");
        setLoading(false)
      })
      .catch(function (error) {
        setLoading(false)
        alert("ERROR AL INICIAR SESION", error);
      });
  };

  return (
    <>
    {loading && (
        <Loading/>
    )}

      <div className="flex items-center justify-center min-h-screen bg-gray-200">
        <div className="bg-white p-8 rounded shadow-md w-full sm:w-96">
          <h2 className="text-2xl font-bold mb-4 text-center">
            Inicio de Sesión
          </h2>
          {errorMessage && <p className="text-red-500 mb-4">{errorMessage}</p>}
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-700"
              >
                Usuario
              </label>
              <input
                type="text"
                id="username"
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Ingrese su usuario"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Contraseña
              </label>
              <input
                type="password"
                id="password"
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Ingrese su contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-indigo-500 text-white py-2 px-4 rounded hover:bg-indigo-600"
            >
              Iniciar Sesión
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
