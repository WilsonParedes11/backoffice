import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import AdminAuth from './components/AdminAuth';
import Dashboard from './components/Dashboard';
import Forms from './components/Forms'; // Placeholder para la ruta /forms
import CreateForm from './components/CreateForm'; // Placeholder para la ruta /create-form

const Root = () => {
  return (
    <Routes>
      <Route path="/login" element={<AdminAuth />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/forms"
        element={
          <ProtectedRoute>
            <Forms />
          </ProtectedRoute>
        }
      />
      <Route
        path="/create-form"
        element={
          <ProtectedRoute>
            <CreateForm />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default Root;