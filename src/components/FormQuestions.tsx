import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import { useForms } from '../hooks/useForms';
import { QuestionList } from './QuestionList';
import { ErrorBoundary } from './ErrorBoundary';
import { toast, ToastContainer } from 'react-toastify';

const FormQuestions = () => {
  const { formId } = useParams<{ formId: string }>();
  const navigate = useNavigate();
  const { forms, fetchQuestions, updateQuestion, deleteQuestion, addQuestion, loading, error } = useForms();
  const [questions, setQuestions] = useState<Question[]>([]);

  const form = forms.find((f) => f.id === formId);

  // Cargar preguntas al montar el componente
  useEffect(() => {
    if (formId) {
      fetchQuestions(formId).then((data) => setQuestions(data));
    }
  }, [formId, forms]); // Dependemos de forms para reflejar cambios

  const handleUpdate = (question: Question) => {
    updateQuestion(question)
      .then(() => {
        setQuestions((prev) => prev.map((q) => (q.id === question.id ? question : q)));
        toast.success('Pregunta actualizada con éxito');
      })
      .catch(() => toast.error('Error al actualizar la pregunta'));
  };

  const handleDelete = (questionId: string) => {
    deleteQuestion(questionId, formId!)
      .then(() => {
        setQuestions((prev) => prev.filter((q) => q.id !== questionId));
        toast.success('Pregunta eliminada con éxito');
      })
      .catch(() => toast.error('Error al eliminar la pregunta'));
  };

  const handleAdd = (question: Partial<Question>) => {
    addQuestion(formId!, question)
      .then((newQuestion) => {
        setQuestions((prev) => [...prev, newQuestion]);
        toast.success('Pregunta agregada con éxito');
      })
      .catch(() => toast.error('Error al agregar la pregunta'));
  };

  if (!form) return <p className="text-red-600">Formulario no encontrado</p>;

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col md:ml-64">
        <Navbar />
        <main className="flex-1 p-8 mt-16 bg-gray-100">
          <button
            onClick={() => navigate('/forms')}
            className="mb-4 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg"
          >
            Volver a Formularios
          </button>
          <h2 className="text-3xl font-bold text-[#1F2937] mb-8">{form.title}</h2>
          <ErrorBoundary fallback={<p className="text-red-600">Algo salió mal.</p>}>
            {loading && <p className="text-gray-500 text-lg">Cargando preguntas...</p>}
            {error && (
              <div className="py-3 px-5 bg-red-50 border border-red-200 rounded-lg mb-6">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}
            {!loading && !error && (
              <QuestionList
                questions={questions}
                onUpdate={handleUpdate}
                onDelete={handleDelete}
                onAdd={handleAdd}
              />
            )}
          </ErrorBoundary>
        </main>
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default FormQuestions;