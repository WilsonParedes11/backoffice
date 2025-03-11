import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import AdminAuth from './components/AdminAuth'; // Componente de autenticación
import App from './App';

const Root = () => {
  return (
    <Routes>
      <Route path="/login" element={<AdminAuth />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <App />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default Root;