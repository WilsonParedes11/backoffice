import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import Root from './Root';

// Obtener el elemento raíz de forma segura
const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('No se encontró el elemento raíz con ID "root". Verifica tu HTML.');
}

// Crear y renderizar la aplicación
createRoot(rootElement).render(
  <StrictMode>
    <BrowserRouter>
      <Root />
    </BrowserRouter>
  </StrictMode>,
);