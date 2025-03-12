// src/components/Forms.tsx
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import { useForms } from '../hooks/useForms';
import { FormCard } from './FormCard';
import { ErrorBoundary } from './ErrorBoundary';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Form } from '../types';

const Forms = () => {
  const { forms, loading, error, deleteForm, updateForm } = useForms();
  const navigate = useNavigate();

  const handleFormClick = (formId: string) => {
    navigate(`/forms/${formId}`);
  };

  const handleDeleteForm = (formId: string) => {
    deleteForm(formId)
      .then(() => toast.success('Formulario eliminado con éxito'))
      .catch(() => toast.error('Error al eliminar el formulario'));
  };

  const handleUpdateForm = (formId: string, updatedData: Partial<Form>) => {
    updateForm(formId, updatedData)
      .then(() => toast.success('Formulario actualizado con éxito'))
      .catch(() => toast.error('Error al actualizar el formulario'));
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col md:ml-64">
        <Navbar />
        <main className="flex-1 p-8 mt-16 bg-gray-100">
          <h2 className="text-3xl font-bold text-[#1F2937] mb-8">Lista de Formularios</h2>
          <ErrorBoundary fallback={<p className="text-red-600">Algo salió mal. Por favor, intenta de nuevo.</p>}>
            {loading && (
              <p className="text-gray-500 text-lg">Cargando formularios...</p>
            )}
            {error && (
              <div className="py-3 px-5 bg-red-50 border border-red-200 rounded-lg mb-6">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}
            {!loading && !error && forms.length === 0 && (
              <p className="text-gray-500 text-lg">No hay formularios creados aún.</p>
            )}
            {!loading && forms.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {forms.map((form) => (
                  <FormCard
                    key={form.id}
                    form={form}
                    onClick={handleFormClick}
                    onDelete={handleDeleteForm}
                    onUpdate={handleUpdateForm}
                  />
                ))}
              </div>
            )}
          </ErrorBoundary>
        </main>
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default Forms;