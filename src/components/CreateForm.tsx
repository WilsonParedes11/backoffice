// src/components/CreateForm.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import { supabase } from '../lib/supabase';
import { Form, Question, QuestionType } from '../types';

const CreateForm = () => {
  const [form, setForm] = useState<Partial<Form>>({
    title: '',
    description: '',
  });
  const [questions, setQuestions] = useState<Question[]>([]);
  const [newQuestion, setNewQuestion] = useState<Partial<Question>>({
    type: 'short_answer',
    title: '',
    options: [],
  });
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleQuestionChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setNewQuestion((prev) => ({ ...prev, [name]: value }));
  };

  const handleOptionChange = (index: number, value: string) => {
    setNewQuestion((prev) => {
      const options = prev.options ? [...prev.options] : [];
      options[index] = value;
      return { ...prev, options };
    });
  };

  const addOption = () => {
    setNewQuestion((prev) => ({
      ...prev,
      options: prev.options ? [...prev.options, ''] : [''],
    }));
  };

  const addQuestion = () => {
    if (!newQuestion.title) {
      setError('El título de la pregunta es obligatorio');
      return;
    }
    setQuestions((prev) => [
      ...prev,
      { ...newQuestion, type: newQuestion.type as QuestionType } as Question,
    ]);
    setNewQuestion({ type: 'short_answer', title: '', options: [] });
    setError(null);
  };

  const handleSubmit = async () => {
    if (!form.title) {
      setError('El título del formulario es obligatorio');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Obtener el usuario autenticado
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) throw new Error('No se pudo obtener el usuario autenticado');

      // Verificar si el usuario existe en la tabla admins
      const { data: adminData, error: adminError } = await supabase
        .from('admins')
        .select('id')
        .eq('id', user.id)
        .single();
      if (adminError || !adminData) {
        throw new Error('El usuario no está registrado como administrador');
      }

      // Crear el formulario
      const formData: Form = {
        admin_id: user.id,
        title: form.title,
        description: form.description || undefined,
      };
      const { data: formResponse, error: formError } = await supabase
        .from('forms')
        .insert(formData)
        .select()
        .single();
      if (formError) throw formError;

      // Crear las preguntas asociadas
      if (questions.length > 0) {
        const questionsData: Question[] = questions.map((q) => ({
          form_id: formResponse.id,
          type: q.type,
          title: q.title,
          options: q.options && q.options.length > 0 ? q.options : undefined,
        }));
        const { error: questionsError } = await supabase.from('questions').insert(questionsData);
        if (questionsError) throw questionsError;
      }

      // Redirigir a la lista de formularios
      navigate('/forms');
    } catch (err) {
      console.error('Error al guardar formulario:', err);
      setError((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col md:ml-64">
        <Navbar />
        <main className="flex-1 p-6 mt-16 bg-gray-100">
          <h2 className="text-2xl font-semibold text-[#1F2937] mb-6">Crear Formulario</h2>
          <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 mb-6">
            <div className="space-y-4">
              <div>
                <label htmlFor="title" className="text-sm font-medium text-[#1F2937]">
                  Título
                </label>
                <input
                  id="title"
                  name="title"
                  type="text"
                  value={form.title}
                  onChange={handleInputChange}
                  className="w-full mt-1 px-3 py-2 bg-white border border-gray-300 rounded-md text-[#1F2937] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent transition-all"
                  placeholder="Título del formulario"
                />
              </div>
              <div>
                <label htmlFor="description" className="text-sm font-medium text-[#1F2937]">
                  Descripción (opcional)
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={form.description || ''}
                  onChange={handleInputChange}
                  className="w-full mt-1 px-3 py-2 bg-white border border-gray-300 rounded-md text-[#1F2937] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent transition-all"
                  placeholder="Descripción del formulario"
                  rows={3}
                />
              </div>
            </div>
          </div>

          {/* Sección de preguntas */}
          <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
            <h3 className="text-lg font-semibold text-[#1F2937] mb-4">Preguntas</h3>
            {questions.map((q, index) => (
              <div key={index} className="p-4 border-b border-gray-200">
                <p className="text-sm font-medium text-[#1F2937]">{q.title}</p>
                <p className="text-xs text-gray-500">Tipo: {q.type}</p>
                {q.options && (
                  <ul className="text-xs text-gray-500 mt-1">
                    {q.options.map((opt, i) => (
                      <li key={i}>- {opt}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}

            {/* Formulario para nueva pregunta */}
            <div className="space-y-4 mt-4">
              <div>
                <label htmlFor="questionTitle" className="text-sm font-medium text-[#1F2937]">
                  Título de la Pregunta
                </label>
                <input
                  id="questionTitle"
                  name="title"
                  type="text"
                  value={newQuestion.title}
                  onChange={handleQuestionChange}
                  className="w-full mt-1 px-3 py-2 bg-white border border-gray-300 rounded-md text-[#1F2937] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent transition-all"
                  placeholder="Escribe la pregunta"
                />
              </div>
              <div>
                <label htmlFor="questionType" className="text-sm font-medium text-[#1F2937]">
                  Tipo de Pregunta
                </label>
                <select
                  id="questionType"
                  name="type"
                  value={newQuestion.type}
                  onChange={handleQuestionChange}
                  className="w-full mt-1 px-3 py-2 bg-white border border-gray-300 rounded-md text-[#1F2937] focus:outline-none focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent transition-all"
                >
                  <option value="short_answer">Respuesta Corta</option>
                  <option value="multiple_choice">Opción Múltiple</option>
                  <option value="multi_select">Selección Múltiple</option>
                  <option value="true_false">Verdadero/Falso</option>
                </select>
              </div>
              {(newQuestion.type === 'multiple_choice' || newQuestion.type === 'multi_select') && (
                <div>
                  <label className="text-sm font-medium text-[#1F2937]">Opciones</label>
                  {newQuestion.options?.map((opt, index) => (
                    <input
                      key={index}
                      type="text"
                      value={opt}
                      onChange={(e) => handleOptionChange(index, e.target.value)}
                      className="w-full mt-2 px-3 py-2 bg-white border border-gray-300 rounded-md text-[#1F2937] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent transition-all"
                      placeholder={`Opción ${index + 1}`}
                    />
                  ))}
                  <button
                    onClick={addOption}
                    className="mt-2 px-3 py-1 bg-[#3B82F6] hover:bg-[#2563EB] text-white rounded-md text-sm transition-all"
                  >
                    + Agregar Opción
                  </button>
                </div>
              )}
              <button
                onClick={addQuestion}
                className="mt-4 px-4 py-2 bg-[#3B82F6] hover:bg-[#2563EB] text-white rounded-md transition-all"
              >
                Agregar Pregunta
              </button>
            </div>
          </div>

          {/* Botón de guardar */}
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