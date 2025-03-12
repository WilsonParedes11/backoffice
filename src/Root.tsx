import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import AdminAuth from './components/AdminAuth';
import Dashboard from './components/Dashboard';
import Forms from './components/Forms';
import CreateForm from './components/CreateForm';
import FormQuestions from './components/FormQuestions';

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
        path="/forms/:formId"
        element={
          <ProtectedRoute>
            <FormQuestions />
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