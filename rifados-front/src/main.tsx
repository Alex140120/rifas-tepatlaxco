import { createRoot } from 'react-dom/client';
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as BrowserRouter } from 'react-router-dom';
import Router from './router'; // Importa el componente Router

import "react-toastify/dist/ReactToastify.css"; // alerta

const root = createRoot(document.getElementById('root')!);

root.render(
  <BrowserRouter>
    <Router />
  </BrowserRouter>
);