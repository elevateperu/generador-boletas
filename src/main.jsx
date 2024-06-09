import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import LoginPage from './Login.jsx'
import './index.css'
import Buscar from './buscar.jsx'
import {
  createHashRouter,
  RouterProvider,
} from "react-router-dom";

const router = createHashRouter([

  {
    path: "/",
    element: <LoginPage/>,
  },
  {
    path:"/buscar",
    element: <Buscar/>
  },
  {
    path: "/home",
    element: <App />,
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
    <RouterProvider router={router} />
)
