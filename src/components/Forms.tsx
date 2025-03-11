// src/components/Forms.tsx
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import { useForms } from '../hooks/useForms';
import { FormCard } from './FormCard';
import { QuestionList } from './QuestionList';
import { ErrorBoundary } from './ErrorBoundary';

const Forms = () => {
  const {
    forms,
    loading,
    error,
    selectedFormId,
    setSelectedFormId,
    selectedFormQuestions,
    updateQuestion,
    deleteQuestion,
    addQuestion,
  } = useForms();

  const handleFormClick = (formId: string) => {
    setSelectedFormId(formId === selectedFormId ? null : formId);
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
              <div className="space-y-6">
                {forms.map((form) => (
                  <div key={form.id}>
                    <FormCard
                      form={form}
                      isSelected={selectedFormId === form.id}
                      onClick={handleFormClick}
                    />
                    {selectedFormId === form.id && (
                      <div className="mt-6">
                        <QuestionList
                          questions={selectedFormQuestions}
                          onUpdate={updateQuestion}
                          onDelete={deleteQuestion}
                          onAdd={(question) => addQuestion(form.id!, question)}
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </ErrorBoundary>
        </main>
      </div>
    </div>
  );
};

export default Forms;