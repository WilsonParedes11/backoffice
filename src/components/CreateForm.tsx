import Sidebar from './Sidebar';
import Navbar from './Navbar';
import { useCreateForm } from '../hooks/useCreateForm';
import { FormDetails } from './FormDetails';
import { QuestionEditor } from './QuestionEditor';
import { QuestionPreviewList } from './QuestionPreviewList';

const CreateForm = () => {
  const {
    form,
    questions,
    newQuestion,
    error,
    isLoading,
    handleInputChange,
    handleQuestionChange,
    handleOptionChange,
    addOption,
    addQuestion,
    handleSubmit,
  } = useCreateForm();

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col md:ml-64">
        <Navbar />
        <main className="flex-1 p-6 mt-16 bg-gray-100">
          <h2 className="text-2xl font-semibold text-[#1F2937] mb-6">Crear Formulario</h2>
          <FormDetails form={form} onChange={handleInputChange} />

          <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 mt-6">
            <h3 className="text-lg font-semibold text-[#1F2937] mb-4">Preguntas</h3>
            <QuestionPreviewList questions={questions} />
            <QuestionEditor
              newQuestion={newQuestion}
              onQuestionChange={handleQuestionChange}
              onOptionChange={handleOptionChange}
              onAddOption={addOption}
              onAddQuestion={addQuestion}
            />
          </div>

          {error && (
            <div className="mt-4 py-2 px-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="mt-6 w-full py-2 px-4 bg-[#1E3A8A] hover:bg-[#2563EB] text-white font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#3B82F6] focus:ring-offset-2 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Guardando...' : 'Guardar Formulario'}
          </button>
        </main>
      </div>
    </div>
  );
};

export default CreateForm;